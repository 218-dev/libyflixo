import express from "express";
import path from "path";
import axios from "axios";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const GOLIVE_API = "https://admin.golive-pro.online/api";

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const s1MoviesPromise = axios.get("https://admin.golive-pro.online/api/content/movies?page=999", { timeout: 10000 });
      const s1SeriesPromise = axios.get("https://admin.golive-pro.online/api/content/series?page=999", { timeout: 10000 });

      // Helper to probe a specific page for Server 2
      const checkS2Page = async (contentType: string, page: number) => {
        try {
          const response = await axios.get("https://aljabalitv.w4c.net/api/mobile/catalog", {
            params: { page, limit: 50, contentType },
            headers: {
              "host": "aljabalitv.w4c.net",
              "x-app-locale": "ar-EG",
              "user-agent": "okhttp/4.12.0"
            },
            timeout: 8000
          });
          return {
            page,
            itemsCount: response.data.items?.length || 0,
            hasMore: !!response.data.hasMore
          };
        } catch (err: any) {
          console.error(`Error page ${page} for ${contentType}:`, err.message);
          return { page, error: true, itemsCount: 0, hasMore: false };
        }
      };

      // Helper to find actual total content count for Server 2
      const findS2Total = async (contentType: string) => {
        const steps = contentType === "movie" ? [1, 25, 50, 75, 100, 125, 150] : [1, 5, 10, 15, 20];
        const probes = await Promise.all(steps.map(p => checkS2Page(contentType, p)));

        let lowerBound = 1;
        let upperBound = contentType === "movie" ? 200 : 30;

        for (const p of probes) {
          if (p.error) continue;
          if (p.itemsCount > 0 && p.hasMore) {
            lowerBound = Math.max(lowerBound, p.page);
          }
          if (p.itemsCount === 0 || !p.hasMore) {
            upperBound = Math.min(upperBound, p.page);
          }
        }

        let low = lowerBound;
        let high = upperBound;
        let lastValidPage: any = null;

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const probed = probes.find(p => p.page === mid && !p.error);
          const info = probed || await checkS2Page(contentType, mid);

          if (info.itemsCount > 0) {
            lastValidPage = info;
            if (info.hasMore) {
              low = mid + 1;
            } else {
              break;
            }
          } else {
            high = mid - 1;
          }
        }

        if (lastValidPage) {
          return (lastValidPage.page - 1) * 50 + lastValidPage.itemsCount;
        }
        return contentType === "movie" ? 5471 : 267; // Fallback
      };

      const [s1MoviesRes, s1SeriesRes, s2Movies, s2Series] = await Promise.all([
        s1MoviesPromise.catch(err => {
          console.error("Failed to fetch S1 Movies stats:", err.message);
          return { data: { meta: { total: 1168 } } };
        }),
        s1SeriesPromise.catch(err => {
          console.error("Failed to fetch S1 Series stats:", err.message);
          return { data: { meta: { total: 363 } } };
        }),
        findS2Total("movie").catch(err => {
          console.error("Failed S2 movies search:", err.message);
          return 5471;
        }),
        findS2Total("series").catch(err => {
          console.error("Failed S2 series search:", err.message);
          return 267;
        })
      ]);

      const s1Movies = s1MoviesRes.data?.meta?.total || 1168;
      const s1Series = s1SeriesRes.data?.meta?.total || 363;

      const totalMovies = s1Movies + s2Movies;
      const totalSeries = s1Series + s2Series;

      res.json({
        movies: totalMovies,
        series: totalSeries,
        details: {
          server1: { movies: s1Movies, series: s1Series },
          server2: { movies: s2Movies, series: s2Series }
        }
      });
    } catch (error: any) {
      console.error("Stats API overall error:", error.message);
      res.json({
        movies: 1168 + 5471,
        series: 363 + 267,
        error: error.message
      });
    }
  });

  app.get("/api/movies/most-viewed", async (req, res) => {
    try {
      const response = await axios.get(`${GOLIVE_API}/content/movies`, {
        params: { ...req.query, sort: "trending" },
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("API proxy error for most-viewed movies:", error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch from upstream",
        details: error.message 
      });
    }
  });

  app.get("/api/series/most-viewed", async (req, res) => {
    try {
      const response = await axios.get(`${GOLIVE_API}/content/series`, {
        params: { ...req.query, sort: "trending" },
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("API proxy error for most-viewed series:", error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch from upstream",
        details: error.message 
      });
    }
  });

  app.get("/api/movies", async (req, res) => {
    try {
      const response = await axios.get(`${GOLIVE_API}/content/movies`, {
        params: req.query,
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("API proxy error for movies list:", error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch from upstream",
        details: error.message 
      });
    }
  });

  app.get("/api/series", async (req, res) => {
    try {
      const response = await axios.get(`${GOLIVE_API}/content/series`, {
        params: req.query,
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("API proxy error for series list:", error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch from upstream",
        details: error.message 
      });
    }
  });

  app.get("/api/movies/category/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id.startsWith("all-") || id === "most-viewed" || id === "recently-added") {
        return res.redirect(`/api/movies?${new URLSearchParams(req.query as any).toString()}`);
      }
      const response = await axios.get(`${GOLIVE_API}/content/movies`, {
        params: { ...req.query, category: id },
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error(`API proxy error for movies category ${req.params.id}:`, error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch from upstream",
        details: error.message 
      });
    }
  });

  app.get("/api/series/category/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id.startsWith("all-") || id === "most-viewed" || id === "recently-added") {
        return res.redirect(`/api/series?${new URLSearchParams(req.query as any).toString()}`);
      }
      const response = await axios.get(`${GOLIVE_API}/content/series`, {
        params: { ...req.query, category: id },
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error(`API proxy error for series category ${req.params.id}:`, error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch from upstream",
        details: error.message 
      });
    }
  });

  app.get("/api/series/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`${GOLIVE_API}/content/series/${id}`, {
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("API proxy error for series details:", error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch from upstream",
        details: error.message 
      });
    }
  });

  app.get("/api/stream", async (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) {
      return res.status(400).send("Missing stream URL");
    }

    try {
      const headers: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      };

      try {
        const urlObj = new URL(streamUrl);
        headers["Referer"] = urlObj.origin + "/";
        headers["Origin"] = urlObj.origin;
      } catch (e) {
        // ignore
      }

      if (req.headers.range) {
        headers["Range"] = req.headers.range;
      }

      const response = await axios({
        method: "GET",
        url: streamUrl,
        responseType: "stream",
        headers,
        validateStatus: () => true,
        timeout: 15000
      });

      res.status(response.status);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Range, Content-Type");

      [
        "content-type",
        "content-length",
        "content-range",
        "accept-ranges",
        "cache-control",
      ].forEach((h) => {
        if (response.headers[h]) {
          res.setHeader(h, response.headers[h]);
        }
      });

      response.data.pipe(res);
    } catch (error: any) {
      console.error("Stream proxy error:", error.message);
      if (!res.headersSent) {
        res.status(500).send("Error streaming content");
      }
    }
  });

  app.get("/api/live/categories", async (req, res) => {
    try {
      const response = await axios.get("https://admin.golive-pro.online/api/public/categories", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Dart/3.10 (dart:io)"
        },
        timeout: 15000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("Live categories proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch live categories", details: error.message });
    }
  });

  app.get("/api/live/channels", async (req, res) => {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).json({ error: "Missing categoryId" });
    }
    try {
      const response = await axios.get(`https://admin.golive-pro.online/api/public/channels?categoryId=${categoryId}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Dart/3.10 (dart:io)"
        },
        timeout: 15000
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("Live channels proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch live channels", details: error.message });
    }
  });

  app.get("/api/stream/status", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "Missing or invalid URL" });
    }
    try {
      // Use HEAD request to check if stream is reachable
      const response = await axios.head(url, {
        timeout: 5000,
        headers: { "User-Agent": "Dart/3.10 (dart:io)" }
      });
      res.json({ status: response.status >= 200 && response.status < 400 });
    } catch (error) {
      res.json({ status: false });
    }
  });

  app.get("/api/license/activate", async (req, res) => {

    try {
      const { code, user_id, device_id, key } = req.query;
      const response = await axios.get("https://abdo218.alwaysdata.net/license.php", {
        params: { action: "activate", code, user_id, device_id, key },
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: "Server connection failed via proxy" });
    }
  });

  app.get("/api/license/check", async (req, res) => {
    try {
      const { code, key } = req.query;
      const response = await axios.get("https://abdo218.alwaysdata.net/license.php", {
        params: { action: "check", code, key },
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: "License check failed via proxy" });
    }
  });

  app.get("/api/pwa/ios-config", async (req, res) => {
    try {
      const host = req.get("host");
      const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
      const appUrl = `${protocol}://${host}/`;
      
      let iconBase64 = "";
      try {
        const logoPath = path.join(process.cwd(), "public", "logo.png");
        const distLogoPath = path.join(process.cwd(), "dist", "logo.png");
        
        if (fs.existsSync(logoPath)) {
          const fileBuffer = fs.readFileSync(logoPath);
          iconBase64 = fileBuffer.toString("base64");
        } else if (fs.existsSync(distLogoPath)) {
          const fileBuffer = fs.readFileSync(distLogoPath);
          iconBase64 = fileBuffer.toString("base64");
        } else {
          const iconUrl = "https://img.icons8.com/flat-round/192/play--v1.png";
          const iconResponse = await axios.get(iconUrl, { responseType: "arraybuffer", timeout: 5000 });
          iconBase64 = Buffer.from(iconResponse.data, "binary").toString("base64");
        }
      } catch (err: any) {
        console.error("Failed to read logo.png or fetch fallback icon for mobileconfig:", err.message);
      }

      const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>ConsentText</key>
	<dict>
		<key>default</key>
		<string>قم بتثبيت تطبيق ليبيفليكس على شاشتك الرئيسية للوصول السريع وبملء الشاشة.</string>
	</dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>FullScreen</key>
			<true/>
			${iconBase64 ? `<key>Icon</key>\n\t\t\t<data>${iconBase64}</data>` : ""}
			<key>IsRemovable</key>
			<true/>
			<key>Label</key>
			<string>ليبيفليكس</string>
			<key>PayloadDescription</key>
			<string>بوابة الأفلام والمسلسلات التفاعلية - ليبيفليكس</string>
			<key>PayloadDisplayName</key>
			<string>ليبيفليكس - Libyflix</string>
			<key>PayloadIdentifier</key>
			<string>com.libyflix.webclip</string>
			<key>PayloadType</key>
			<string>com.apple.webclip.managed</string>
			<key>PayloadUUID</key>
			<string>9C6120D2-E407-4C41-86EF-BC9FAAA66A4E</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>Precomposed</key>
			<true/>
			<key>URL</key>
			<string>${appUrl}</string>
		</dict>
	</array>
	<key>PayloadDescription</key>
	<string>تثبيت تطبيق ليبيفليكس التفاعلي للأفلام والمسلسلات</string>
	<key>PayloadDisplayName</key>
	<string>ليبيفليكس - Libyflix</string>
	<key>PayloadIdentifier</key>
	<string>com.libyflix.profile</string>
	<key>PayloadOrganization</key>
	<string>Libyflix</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>2D7C8A4D-8451-4E11-9A8E-CD0A77189F82</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>`;

      res.setHeader("Content-Type", "application/x-apple-aspen-config");
      res.setHeader("Content-Disposition", 'attachment; filename="libyflix.mobileconfig"');
      res.send(mobileConfig);
    } catch (error: any) {
      console.error("Error generating mobileconfig:", error.message);
      res.status(500).send("Error generating iOS configuration profile");
    }
  });

  app.get("/api/content/series/most-viewed", async (req, res) => {
    try {
      const { limit } = req.query;
      const response = await axios.get("https://admin.golive-pro.online/api/content/series/most-viewed", {
        params: { limit: limit || 12 },
        timeout: 10000
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ status: "error", message: "Failed to fetch series via proxy" });
    }
  });

  // Server 2 Proxy Endpoints (AlJabali TV)
  app.get("/api/server2/home", async (req, res) => {
    try {
      const response = await axios.get("https://aljabalitv.w4c.net/api/mobile/home", {
        timeout: 15000,
        headers: {
          "host": "aljabalitv.w4c.net",
          "x-app-locale": "ar-EG",
          "user-agent": "okhttp/4.12.0"
        }
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("AlJabali TV home proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch AlJabali TV home data", details: error.message });
    }
  });

  app.get("/api/server2/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Missing search query" });
      }
      const cleanQ = q.trim();
      if (!cleanQ) {
        return res.json({ result: [], items: [], data: [] });
      }

      const headers = {
        "host": "aljabalitv.w4c.net",
        "x-app-locale": "ar-EG",
        "user-agent": "okhttp/4.12.0"
      };

      // Search movies and series in parallel
      const [moviesRes, seriesRes] = await Promise.all([
        axios.get(`https://aljabalitv.w4c.net/api/mobile/catalog`, {
          params: { page: 1, limit: 30, contentType: "movie", search: cleanQ },
          headers,
          timeout: 12000
        }).catch(() => ({ data: { items: [] } })),
        axios.get(`https://aljabalitv.w4c.net/api/mobile/catalog`, {
          params: { page: 1, limit: 30, contentType: "series", search: cleanQ },
          headers,
          timeout: 12000
        }).catch(() => ({ data: { items: [] } }))
      ]);

      const movieItems = moviesRes.data?.items || [];
      const seriesItems = seriesRes.data?.items || [];
      const allItems = [...movieItems, ...seriesItems];
      console.log(`[Server2] Search for "${cleanQ}" found ${allItems.length} items`);

      const mapped = allItems.map((item: any) => {
        const itemSlug = item.slug || item.id || item.subject_id;
        if (!itemSlug) {
          console.warn(`[Server2] Item missing slug: ${item.title || item.name}`, item);
        }
        let poster = item.posterUrl || "";
        if (poster && poster.startsWith("/")) {
          poster = `https://aljabalitv.w4c.net${poster}`;
        }
        return {
          name: item.title,
          slug: itemSlug,
          subject_id: itemSlug,
          poster_url: poster,
          year: item.productionYear ? item.productionYear.toString() : "",
          rating: "8.0",
          badge: item.section?.name || (item.type === "movie" ? "أفلام" : "مسلسلات"),
          type: item.type || "movie"
        };
      });

      res.json({ result: mapped, items: mapped, data: mapped });
    } catch (error: any) {
      console.error("AlJabali TV search proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch AlJabali TV search results", details: error.message });
    }
  });

  app.get("/api/server2/search/suggest", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.json([]);
      }
      const cleanQ = q.trim();
      if (!cleanQ) {
         return res.json([]);
      }

      const response = await axios.get(`https://aljabalitv.w4c.net/api/mobile/catalog`, {
        params: { page: 1, limit: 10, contentType: "movie", search: cleanQ },
        headers: {
          "host": "aljabalitv.w4c.net",
          "x-app-locale": "ar-EG",
          "user-agent": "okhttp/4.12.0"
        },
        timeout: 10000
      });

      const items = response.data?.items || [];
      const suggestions = items.map((item: any) => item.title);
      res.json(suggestions);
    } catch (error: any) {
      console.error("AlJabali TV suggest proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch AlJabali TV suggest", details: error.message });
    }
  });

  app.get("/api/server2/movies", async (req, res) => {
    try {
      const { page, section, sort, order, search, year, genre, tag, limit } = req.query;
      const pageNum = page || 1;
      const limitNum = limit || 40;
      const params: any = { page: pageNum, limit: limitNum, contentType: "movie" };
      
      if (section && !["all-movies", "most-viewed", "recently-added"].includes(section as string)) params.section = section;
      if (sort) params.sort = sort;
      if (order) params.order = order;
      if (search) params.search = search;
      if (year) params.year = year;
      if (genre) params.genre = genre;
      if (tag) params.tag = tag;

      const response = await axios.get(`https://aljabalitv.w4c.net/api/mobile/catalog`, {
        params,
        headers: {
          "host": "aljabalitv.w4c.net",
          "x-app-locale": "ar-EG",
          "user-agent": "okhttp/4.12.0"
        },
        timeout: 15000
      });

      const items = (response.data?.items || []).map((item: any) => {
        const itemSlug = item.slug || item.id || item.subject_id;
        let poster = item.posterUrl || "";
        if (poster && poster.startsWith("/")) {
          poster = `https://aljabalitv.w4c.net${poster}`;
        }
        return {
          name: item.title,
          slug: itemSlug,
          subject_id: itemSlug,
          poster_url: poster,
          year: item.productionYear ? item.productionYear.toString() : "",
          rating: "8.0",
          badge: item.section?.name || "أفلام",
          type: "movie"
        };
      });

      res.json({
        data: items,
        items: items,
        result: items,
        total: response.data?.total || 1500,
        per_page: 30
      });
    } catch (error: any) {
      console.error("AlJabali TV movies proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch AlJabali TV movies", details: error.message });
    }
  });

  app.get("/api/server2/tv-series", async (req, res) => {
    try {
      const { page, section, sort, order, search, year, genre, tag, limit } = req.query;
      const pageNum = page || 1;
      const limitNum = limit || 40;
      const params: any = { page: pageNum, limit: limitNum, contentType: "series" };

      if (section && !["all-series", "most-viewed", "recently-added"].includes(section as string)) params.section = section;
      if (sort) params.sort = sort;
      if (order) params.order = order;
      if (search) params.search = search;
      if (year) params.year = year;
      if (genre) params.genre = genre;
      if (tag) params.tag = tag;

      const response = await axios.get(`https://aljabalitv.w4c.net/api/mobile/catalog`, {
        params,
        headers: {
          "host": "aljabalitv.w4c.net",
          "x-app-locale": "ar-EG",
          "user-agent": "okhttp/4.12.0"
        },
        timeout: 15000
      });

      const items = (response.data?.items || []).map((item: any) => {
        const itemSlug = item.slug || item.id || item.subject_id;
        let poster = item.posterUrl || "";
        if (poster && poster.startsWith("/")) {
          poster = `https://aljabalitv.w4c.net${poster}`;
        }
        return {
          name: item.title,
          slug: itemSlug,
          subject_id: itemSlug,
          poster_url: poster,
          year: item.productionYear ? item.productionYear.toString() : "",
          rating: "8.0",
          badge: item.section?.name || "مسلسل",
          type: "series"
        };
      });

      res.json({
        data: items,
        items: items,
        result: items,
        total: response.data?.total || 1500,
        per_page: 30
      });
    } catch (error: any) {
      console.error("AlJabali TV tv-series proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch AlJabali TV tv-series", details: error.message });
    }
  });

  app.get("/api/server2/animation", async (req, res) => {
    try {
      const { page } = req.query;
      const pageNum = page || 1;
      const response = await axios.get(`https://aljabalitv.w4c.net/api/mobile/catalog`, {
        params: { page: pageNum, limit: 30, contentType: "series", section: "series-cartoon" },
        headers: {
          "host": "aljabalitv.w4c.net",
          "x-app-locale": "ar-EG",
          "user-agent": "okhttp/4.12.0"
        },
        timeout: 15000
      });

      const items = (response.data?.items || []).map((item: any) => {
        const itemSlug = item.slug || item.id || item.subject_id;
        let poster = item.posterUrl || "";
        if (poster && poster.startsWith("/")) {
          poster = `https://aljabalitv.w4c.net${poster}`;
        }
        return {
          name: item.title,
          slug: itemSlug,
          subject_id: itemSlug,
          poster_url: poster,
          year: item.productionYear ? item.productionYear.toString() : "",
          rating: "8.0",
          badge: "أنيميشن",
          type: "series"
        };
      });

      res.json({
        data: items,
        items: items,
        result: items,
        total: 1000,
        per_page: 30
      });
    } catch (error: any) {
      console.error("AlJabali TV animation proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch AlJabali TV animation", details: error.message });
    }
  });

  app.get("/api/server2/detail", async (req, res) => {
    try {
      const { slug } = req.query;
      if (!slug || typeof slug !== "string") {
        return res.status(400).json({ error: "Missing slug parameter" });
      }

      console.log(`[Server2] Requesting detail for slug: ${slug}`);

      const response = await axios.get(`https://aljabalitv.w4c.net/api/mobile/content/${encodeURIComponent(slug)}`, {
        params: { installationId: "88504786-2b30-4600-a2d6-40af5496ff40" },
        headers: {
          "host": "aljabalitv.w4c.net",
          "x-app-locale": "ar-EG",
          "user-agent": "okhttp/4.12.0"
        },
        timeout: 15000
      });

      const content = response.data?.content;
      if (!content) {
        console.warn(`[Server2] Content not found for slug: ${slug}`);
        return res.status(404).json({ error: "Content not found on AlJabali TV" });
      }

      let poster = content.posterUrl || "";
      if (poster && poster.startsWith("/")) {
        poster = `https://aljabalitv.w4c.net${poster}`;
      }
      let banner = content.bannerUrl || "";
      if (banner && banner.startsWith("/")) {
        banner = `https://aljabalitv.w4c.net${banner}`;
      }

      const formattedSeasons: any[] = [];
      if (content.type === "series" && content.seasons) {
        content.seasons.forEach((s: any) => {
          const maxEp = s.episodes ? Math.max(...s.episodes.map((ep: any) => ep.episodeNumber), 0) : 1;
          formattedSeasons.push({
            se: s.seasonNumber,
            maxEp: maxEp
          });
        });
      }

      const qualities = content.watchAction?.availableQualities || [];
      const availableQualities = qualities.map((q: any) => ({
        id: q.id,
        label: q.label,
        mediaUrl: q.mediaUrl
      }));

      res.json({
        data: {
          subject: {
            subjectId: content.slug,
            detailPath: content.slug,
            title: content.title,
            description: content.description || "",
            cover: { url: poster },
            stills: { url: banner || poster },
            releaseDate: content.productionYear ? content.productionYear.toString() : "",
            imdbRatingValue: "8.0",
            duration: "120",
            genre: (content.genres || []).map((g: any) => g.name).join(", "),
            staffList: [],
            availableQualities: availableQualities
          },
          resource: {
            seasons: formattedSeasons
          }
        }
      });
    } catch (error: any) {
      console.error("AlJabali TV detail proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch AlJabali TV details", details: error.message });
    }
  });

  app.get("/api/server2/stream", async (req, res) => {
    const renderErrorHTML = (message: string) => `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>عذراً - السيرفر غير متاح</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: 'Tajawal', sans-serif; background-color: #09090b; margin: 0; overflow: hidden; }
        </style>
      </head>
      <body class="flex items-center justify-center h-screen w-screen text-white bg-zinc-950 p-4">
        <div class="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center flex flex-col items-center justify-center gap-3 md:gap-4 shadow-2xl backdrop-blur-sm">
          <div class="bg-red-500/10 p-3 md:p-4 rounded-full border border-red-500/20 mb-1 md:mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 md:w-10 md:h-10 text-red-500"><line x1="2" x2="22" y1="2" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 13a10 10 0 0 1 5.24-2.76"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
          </div>
          <h1 class="text-lg md:text-xl font-black text-zinc-100 m-0">السيرفر غير متاح حالياً</h1>
          <p class="text-xs md:text-sm font-medium text-zinc-400 leading-relaxed m-0">${message}</p>
          <button onclick="window.location.reload()" class="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 border border-red-500/50 shadow-lg shadow-red-900/20 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            إعادة المحاولة
          </button>
        </div>
      </body>
      </html>
    `;

    try {
      const { subject_id, se, ep, source_index } = req.query;
      if (!subject_id || typeof subject_id !== "string") {
        return res.status(400).send(renderErrorHTML("معرف المحتوى مفقود."));
      }

      const seasonNum = parseInt(se as string) || 0;
      const epNum = parseInt(ep as string) || 1;
      const sourceIdx = parseInt(source_index as string) || 0;

      const headers = {
        "host": "aljabalitv.w4c.net",
        "x-app-locale": "ar-EG",
        "user-agent": "okhttp/4.12.0"
      };

      let mediaUrl = "";

      if (seasonNum > 0) {
        // Fetch series details to find the active episode's slug
        const seriesRes = await axios.get(`https://aljabalitv.w4c.net/api/mobile/content/${encodeURIComponent(subject_id)}`, {
          params: { installationId: "88504786-2b30-4600-a2d6-40af5496ff40" },
          headers,
          timeout: 10000
        });

        const seriesContent = seriesRes.data?.content;
        let epSlug = "";
        if (seriesContent && seriesContent.seasons) {
          const season = seriesContent.seasons.find((s: any) => s.seasonNumber === seasonNum);
          if (season && season.episodes) {
            const episode = season.episodes.find((e: any) => e.episodeNumber === epNum);
            if (episode) {
              epSlug = episode.slug;
            }
          }
        }

        if (!epSlug) {
          return res.status(404).send(renderErrorHTML("عذراً، الحلقة المطلوبة غير متوفرة."));
        }

        // Fetch episode detail to get the actual watchAction qualities
        const epRes = await axios.get(`https://aljabalitv.w4c.net/api/mobile/content/${encodeURIComponent(epSlug)}`, {
          params: { installationId: "88504786-2b30-4600-a2d6-40af5496ff40" },
          headers,
          timeout: 10000
        });

        const epContent = epRes.data?.content;
        if (epContent) {
          const qualities = epContent.watchAction?.availableQualities || [];
          if (qualities[sourceIdx]) {
            mediaUrl = qualities[sourceIdx].mediaUrl;
          } else if (qualities.length > 0) {
            mediaUrl = qualities[0].mediaUrl;
          }

          // Fallback: Watch handoff POST (disabled)
          /*
          if (!mediaUrl) {
            try {
              // ...
            } catch (e: any) {
              console.warn("Handoff fallback failed:", e.message);
            }
          }
          */
        }
      } else {
        // Fetch movie details to get the actual watchAction qualities
        const movieRes = await axios.get(`https://aljabalitv.w4c.net/api/mobile/content/${encodeURIComponent(subject_id)}`, {
          params: { installationId: "88504786-2b30-4600-a2d6-40af5496ff40" },
          headers,
          timeout: 10000
        });

        const content = movieRes.data?.content;
        if (content) {
          const qualities = content.watchAction?.availableQualities || [];
          if (qualities[sourceIdx]) {
            mediaUrl = qualities[sourceIdx].mediaUrl;
          } else if (qualities.length > 0) {
            mediaUrl = qualities[0].mediaUrl;
          }

          // Fallback: Watch handoff POST (disabled)
          /*
          if (!mediaUrl) {
            try {
              // ...
            } catch (e: any) {
              console.warn("Handoff fallback failed:", e.message);
            }
          }
          */
        }
      }

      if (mediaUrl) {
        return res.redirect(mediaUrl);
      } else {
        return res.status(404).send(renderErrorHTML("عذراً، لم يتم العثور على رابط المشاهدة."));
      }
    } catch (error: any) {
      console.error("AlJabali TV stream redirect error:", error.message);
      res.status(500).send(renderErrorHTML("حدث خطأ أثناء محاولة الاتصال بالسيرفر. يرجى المحاولة لاحقاً."));
    }
  });

  app.get("/api/server2/captions", async (req, res) => {
    res.json([]);
  });

  // Production static assets or Vite development middleware
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  // Start server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});

