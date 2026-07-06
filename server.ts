import express from "express";
import path from "path";
import axios from "axios";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const GOLIVE_API = "https://abdo218.alwaysdata.net/libyflix/api.php?path=";
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/movies/most-viewed", async (req, res) => {
    try {
      const response = await axios.get(`${GOLIVE_API}/content/movies/most-viewed`, {
        params: req.query,
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
      const response = await axios.get(`${GOLIVE_API}/content/series/most-viewed`, {
        params: req.query,
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

