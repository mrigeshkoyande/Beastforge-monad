const express = require("express");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOSTNAME || "0.0.0.0";

const dir = __dirname;
const app = next({ dev, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Health check endpoint
  server.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "alive",
      app: "MONAD HUNT: CITY LEAGUE",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Redirect /app back to / so users only ever see the cinematic landing page
  server.get("/app", (req, res) => {
    res.redirect(307, "/");
  });

  // Next.js request handler for all routes
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, host, (err) => {
    if (err) throw err;
    console.log(`> Monad Hunt Express server running on http://${host}:${port}`);
  });
});
