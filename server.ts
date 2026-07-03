import express from "express";
import path from "path";
import axios from "axios";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/movies/most-viewed", async (req, res) => {
  try {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const url = `https://admin.golive-pro.online/api/content/movies/most-viewed?${query}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch most-viewed movies");
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("API proxy error for most-viewed:", error);
    res.status(500).json({ error: "Failed to fetch from upstream" });
  }
});

app.get("/api/movies", async (req, res) => {
  try {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const url = `https://admin.golive-pro.online/api/content/movies?${query}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch movies");
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("API proxy error for movies list:", error);
    res.status(500).json({ error: "Failed to fetch from upstream" });
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
  } catch (error) {
    console.error("Stream proxy error:", error);
    if (!res.headersSent) {
      res.status(500).send("Error streaming content");
    }
  }
});

// Production static assets
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // Vite middleware for development
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then(vite => {
    app.use(vite.middlewares);
  });
}

// Start server if not running as a Vercel function
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
