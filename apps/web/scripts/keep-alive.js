#!/usr/bin/env node
/**
 * MONAD HUNT — Keep-Alive Pinger
 * ─────────────────────────────────────────────────────────────────────────────
 * Pings the website every 15 seconds to prevent free-tier hosting sleep.
 * Supports LOCAL dev server and DEPLOYED Vercel/Render/Railway URLs.
 *
 * Usage:
 *   node scripts/keep-alive.js                         # pings localhost:3000
 *   node scripts/keep-alive.js https://your-app.vercel.app
 *
 * Auto-starts with: npm run keep-alive
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TARGET_URL = process.argv[2] || process.env.KEEP_ALIVE_URL || "http://localhost:3000";
const PING_INTERVAL_MS = 15_000; // 15 seconds
const HEALTH_ENDPOINT = `${TARGET_URL}/api/health`;

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

const log = (color, symbol, msg) =>
  console.log(`${color}${symbol}${COLORS.reset} ${COLORS.dim}[${new Date().toLocaleTimeString()}]${COLORS.reset} ${msg}`);

let pingCount = 0;
let successCount = 0;
let failCount = 0;
let isRunning = true;

async function ping() {
  if (!isRunning) return;
  pingCount++;

  try {
    const start = Date.now();
    const res = await fetch(HEALTH_ENDPOINT, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "MonadHunt-KeepAlive/1.0" },
    });
    const latency = Date.now() - start;

    if (res.ok) {
      successCount++;
      log(
        COLORS.green,
        "●",
        `${COLORS.green}ALIVE${COLORS.reset} — ${COLORS.cyan}${HEALTH_ENDPOINT}${COLORS.reset} ${COLORS.dim}(${latency}ms | ping #${pingCount} | ${successCount} OK, ${failCount} ERR)${COLORS.reset}`
      );
    } else {
      failCount++;
      log(
        COLORS.yellow,
        "▲",
        `${COLORS.yellow}HTTP ${res.status}${COLORS.reset} — ${HEALTH_ENDPOINT} ${COLORS.dim}(${latency}ms)${COLORS.reset}`
      );
    }
  } catch (err) {
    failCount++;
    const reason = err.name === "TimeoutError" ? "TIMEOUT (8s)" : err.message;
    log(
      COLORS.red,
      "✕",
      `${COLORS.red}FAILED${COLORS.reset} — ${HEALTH_ENDPOINT} ${COLORS.dim}(${reason} | ping #${pingCount})${COLORS.reset}`
    );
  }
}

function printBanner() {
  console.log(`
${COLORS.bold}${COLORS.cyan}  ╔═══════════════════════════════════════════════════╗
  ║       MONAD HUNT — KEEP-ALIVE PINGER v1.0         ║
  ╚═══════════════════════════════════════════════════╝${COLORS.reset}
  ${COLORS.yellow}● Target  :${COLORS.reset} ${HEALTH_ENDPOINT}
  ${COLORS.yellow}● Interval:${COLORS.reset} every ${PING_INTERVAL_MS / 1000}s
  ${COLORS.dim}Press Ctrl+C to stop${COLORS.reset}
`);
}

async function main() {
  printBanner();

  // First ping immediately on start
  await ping();

  // Then ping every 15 seconds
  const interval = setInterval(ping, PING_INTERVAL_MS);

  // Graceful shutdown on Ctrl+C
  process.on("SIGINT", () => {
    isRunning = false;
    clearInterval(interval);
    console.log(`\n${COLORS.dim}─────────────────────────────────────────────────────${COLORS.reset}`);
    console.log(`${COLORS.bold}Keep-alive stopped.${COLORS.reset}`);
    console.log(`${COLORS.dim}Total pings: ${pingCount} | Success: ${COLORS.green}${successCount}${COLORS.reset}${COLORS.dim} | Failed: ${COLORS.red}${failCount}${COLORS.reset}`);
    process.exit(0);
  });
}

main();
