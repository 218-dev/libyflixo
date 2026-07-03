import express from "express";
import path from "path";
import { Readable } from "stream";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Movie proxy endpoints
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

  // Video stream proxy to bypass CORS and mixed content (HTTP inside HTTPS site)
  app.get("/api/stream", async (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) {
      return res.status(400).send("Missing stream URL");
    }

    try {
      const headers: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      };

      if (req.headers.range) {
        headers["Range"] = req.headers.range;
      }

      const response = await fetch(streamUrl, { headers });

      // Set response status
      res.status(response.status);

      // Copy key streaming headers from upstream to client
      const headersToForward = [
        "content-type",
        "content-length",
        "content-range",
        "accept-ranges",
        "cache-control",
      ];

      for (const h of headersToForward) {
        const val = response.headers.get(h);
        if (val) {
          res.setHeader(h, val);
        }
      }

      if (response.body) {
        const nodeStream = Readable.fromWeb(response.body as any);
        nodeStream.pipe(res);
        res.on("close", () => {
          nodeStream.destroy();
        });
      } else {
        res.end();
      }
    } catch (error) {
      console.error("Stream proxy error:", error);
      if (!res.headersSent) {
        res.status(500).send("Error streaming content");
      }
    }
  });

  // Vite middleware for development vs static asset serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
