#!/usr/bin/env node

/**
 * ui-shot: Production-grade, zero-leak visual verification tool using chrome-headless-shell & CDP.
 * Features:
 *   - Automatic full-page load waiting (loadEventFired + networkidle + fonts.ready)
 *   - Multi-pass smart scrolling (handles window scroll, smooth-scroll overrides, & inner overflow containers)
 *   - Instant multi-viewport captures (Mobile, Tablet, Desktop)
 *   - CDP Full-Page captures (captureBeyondViewport: true)
 *   - Custom CDP command execution (--cdp Method[:paramsJson])
 *   - Custom JavaScript evaluation (--eval "code") with exception recovery
 *   - Dark/Light mode emulation (--dark / --light)
 *   - Auto URL normalization (handles localhost:3000 & local html file paths)
 *   - Output format detection (.png, .webp, .jpg/.jpeg)
 *   - Ephemeral port allocation (zero port collisions)
 *   - Guaranteed SIGKILL cleanup in try/finally & signal traps (zero zombie processes)
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function printHelp() {
  console.log(`
ui-shot - Zero-leak UI screenshot & verification utility

Usage:
  ui-shot <url> [output_dir]                     Capture standard multi-viewport suite (mobile, tablet, desktop)
  ui-shot --full-page <url> [output_file]        Capture full scrollable page height
  ui-shot --scroll <bottom|top|sel|N> <url> [f]  Scroll before capture (handles window + overflow containers)
  ui-shot --scroll-y <pixels> <url> [file]       Scroll to specific Y offset in pixels
  ui-shot --viewport <WxH> <url> [output_file]   Capture custom viewport (e.g. 1920x1080)
  ui-shot --eval "<code>" <url> [output_file]    Execute JS in page before capture (can be repeated)
  ui-shot --cdp <Method[:params]> <url> [file]   Send raw CDP command before capture (can be repeated)

Options:
  --full-page              Capture full document height beyond the viewport
  --scroll <target>        Scroll target: "bottom", "top", CSS selector (e.g. "#footer"), or pixels
  --scroll-y <pixels>      Scroll to specific Y offset in pixels
  --viewport <WxH>         Custom viewport dimensions (e.g. 1280x800)
  --dark, --light          Emulate prefers-color-scheme: dark or light
  --wait-until <event>     Wait condition: "networkidle" (default), "load", "domcontentloaded"
  --timeout <ms>           Navigation/readiness timeout in ms (default: 12000)
  --delay <ms>             Extra wait time in ms before capture (default: 300)
  --eval <code>            Evaluate JavaScript expression in page context (can specify multiple)
  --cdp <Method[:json]>    Execute raw CDP method (e.g. Emulation.setEmulatedMedia:{"media":"print"})
  --verbose, -v            Show detailed CDP debug logs
  --help, -h               Show this help message

Supported Formats:
  Determined by output extension: .png (default), .webp, .jpg / .jpeg

Examples:
  ui-shot localhost:3000 ./screenshots
  ui-shot --full-page http://localhost:3000 ./screenshots/fullpage.webp
  ui-shot --scroll bottom http://localhost:3000 ./screenshots/footer.png
  ui-shot --scroll "#pricing" http://localhost:3000 ./screenshots/pricing.png
  ui-shot --dark http://localhost:3000 ./screenshots/dark_mode.png
  ui-shot --eval 'document.querySelector("#theme-btn").click()' http://localhost:3000 ./dark.png
  ui-shot --cdp Emulation.setEmulatedMedia:'{"media":"print"}' http://localhost:3000 ./print.png
`);
}

// Parse arguments
const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

function loadHyperpowersConfig() {
  const candidatePaths = [
    path.resolve("hyperpowers.json"),
    path.resolve(".hyperpowers/config.json"),
    path.resolve("../hyperpowers.json")
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch (e) {
        // Ignore parse error
      }
    }
  }
  return null;
}

const hpConfig = loadHyperpowersConfig();

let fullPage = false;
let scrollTarget = null;
let customViewport = null;
let colorScheme = null;
let waitUntil = "networkidle";
let timeoutMs = (hpConfig && hpConfig.visual && hpConfig.visual.timeoutMs) ? hpConfig.visual.timeoutMs : 12000;
let delayMs = 300;
let verbose = false;
const evalScripts = [];
const cdpCommands = [];
let rawUrl = null;
let outputPath = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--full-page") {
    fullPage = true;
  } else if (arg === "--scroll") {
    scrollTarget = args[++i];
  } else if (arg === "--scroll-y") {
    scrollTarget = args[++i];
  } else if (arg === "--viewport") {
    customViewport = args[++i];
  } else if (arg === "--dark") {
    colorScheme = "dark";
  } else if (arg === "--light") {
    colorScheme = "light";
  } else if (arg === "--wait-until") {
    waitUntil = args[++i];
  } else if (arg === "--timeout") {
    timeoutMs = parseInt(args[++i], 10) || 12000;
  } else if (arg === "--delay") {
    delayMs = parseInt(args[++i], 10) || 300;
  } else if (arg === "--eval" || arg === "--evaluate") {
    evalScripts.push(args[++i]);
  } else if (arg === "--cdp") {
    cdpCommands.push(args[++i]);
  } else if (arg === "--verbose" || arg === "-v") {
    verbose = true;
  } else if (!rawUrl) {
    rawUrl = arg;
  } else if (!outputPath) {
    outputPath = arg;
  }
}

if (!rawUrl) {
  console.error("Error: URL or file path is required.");
  printHelp();
  process.exit(1);
}

// Normalize URL (Edge Case 1: handles localhost:3000, ./index.html, file paths)
let url = rawUrl;
if (!/^[a-zA-Z]+:\/\//.test(url) && !url.startsWith("data:")) {
  const resolvedPath = path.resolve(url);
  if (fs.existsSync(resolvedPath)) {
    url = "file://" + resolvedPath;
  } else {
    url = "http://" + url;
  }
}

function findChromeBinary() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  if (process.env.CHROME_HEADLESS_SHELL && fs.existsSync(process.env.CHROME_HEADLESS_SHELL)) {
    return process.env.CHROME_HEADLESS_SHELL;
  }

  const homedir = require("os").homedir();
  const platform = process.platform;
  const candidates = [];

  if (platform === "win32") {
    const progFiles = process.env["PROGRAMFILES"] || "C:\\Program Files";
    const progFilesX86 = process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)";
    const localAppData = process.env["LOCALAPPDATA"] || path.join(homedir, "AppData", "Local");
    candidates.push(
      path.join(progFiles, "Google", "Chrome", "Application", "chrome.exe"),
      path.join(progFilesX86, "Google", "Chrome", "Application", "chrome.exe"),
      path.join(localAppData, "Google", "Chrome", "Application", "chrome.exe"),
      path.join(progFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
      path.join(progFilesX86, "Microsoft", "Edge", "Application", "msedge.exe"),
      path.join(progFiles, "BraveSoftware", "Brave-Browser", "Application", "brave.exe")
    );
  } else if (platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      path.join(homedir, "Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
    );
  } else {
    candidates.push(
      path.join(homedir, ".local/bin/chrome-headless-shell"),
      "/usr/bin/chrome-headless-shell",
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/usr/bin/brave-browser",
      "/snap/bin/chromium"
    );
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  try {
    const cmd = platform === "win32" ? "where" : "which";
    const binaries = platform === "win32" ? ["chrome.exe", "msedge.exe"] : ["chrome-headless-shell", "google-chrome", "chromium", "google-chrome-stable", "brave-browser"];
    for (const bin of binaries) {
      try {
        const out = require("child_process").execSync(`${cmd} ${bin}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim().split("\n")[0].trim();
        if (out && fs.existsSync(out)) return out;
      } catch (e) {}
    }
  } catch (e) {}

  return "chrome-headless-shell";
}

const CHROME_PATH = findChromeBinary();

function resolveOutputTarget(targetPath, defaultName = "screenshot.png") {
  if (!targetPath) return path.resolve(defaultName);
  let resolved = path.resolve(targetPath);
  if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    return path.join(resolved, defaultName);
  }
  if (targetPath.endsWith("/") || targetPath.endsWith("\\")) {
    return path.join(resolved, defaultName);
  }
  return resolved;
}

function getFormatOptions(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".webp") {
    return { format: "webp", quality: 92 };
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    return { format: "jpeg", quality: 90 };
  }
  return { format: "png" };
}

class CdpSession {
  constructor(port) {
    this.port = port;
    this.ws = null;
    this.msgId = 1;
    this.handlers = new Map();
    this.loadFired = false;
    this.domContentFired = false;
    this.inflightRequests = 0;
    this.lastNetworkActivity = Date.now();
  }

  async connect() {
    const res = await fetch(`http://127.0.0.1:${this.port}/json/new?about:blank`, {
      method: "PUT",
      signal: AbortSignal.timeout(10000)
    });
    const target = await res.json();
    this.wsUrl = target.webSocketDebuggerUrl;

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl);
      this.ws = ws;

      ws.addEventListener("open", () => resolve());
      ws.addEventListener("error", (err) => reject(err));
      ws.addEventListener("message", (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data.id && this.handlers.has(data.id)) {
            const { resolve, reject } = this.handlers.get(data.id);
            this.handlers.delete(data.id);
            if (data.error) reject(new Error(data.error.message || JSON.stringify(data.error)));
            else resolve(data.result);
          } else if (data.method) {
            this.handleEvent(data.method, data.params);
          }
        } catch (e) {
          if (verbose) console.error("CDP parse error:", e);
        }
      });
    });
  }

  handleEvent(method, params) {
    if (method === "Page.loadEventFired") {
      this.loadFired = true;
      if (verbose) console.log("  [CDP event] Page.loadEventFired");
    } else if (method === "Page.domContentEventFired") {
      this.domContentFired = true;
      if (verbose) console.log("  [CDP event] Page.domContentEventFired");
    } else if (method === "Network.requestWillBeSent") {
      this.inflightRequests++;
      this.lastNetworkActivity = Date.now();
    } else if (method === "Network.loadingFinished" || method === "Network.loadingFailed") {
      this.inflightRequests = Math.max(0, this.inflightRequests - 1);
      this.lastNetworkActivity = Date.now();
    }
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.handlers.set(id, { resolve, reject });
      if (verbose) console.log(`  [CDP ->] ${method}`, JSON.stringify(params));
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async navigateAndWait(targetUrl, waitCondition = "networkidle", maxWaitMs = 12000) {
    await this.send("Page.enable");
    await this.send("Network.enable");
    await this.send("Runtime.enable");

    if (colorScheme) {
      await this.send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-color-scheme", value: colorScheme }]
      });
    }

    this.loadFired = false;
    this.domContentFired = false;
    this.inflightRequests = 0;
    this.lastNetworkActivity = Date.now();

    await this.send("Page.navigate", { url: targetUrl });

    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      if (waitCondition === "domcontentloaded" && this.domContentFired) break;
      if (waitCondition === "load" && this.loadFired) break;
      if (waitCondition === "networkidle") {
        const quietFor = Date.now() - this.lastNetworkActivity;
        // Break once load fired and network is quiet, or if DOM is ready and network quiet for 1s
        if (this.loadFired && (this.inflightRequests <= 0 || quietFor >= 500)) {
          break;
        }
        if (this.domContentFired && Date.now() - startTime >= 4000 && quietFor >= 1000) {
          break;
        }
      }
      await new Promise((r) => setTimeout(r, 50));
    }

    // Wait for web fonts if supported
    try {
      await this.send("Runtime.evaluate", {
        expression: "document.fonts ? document.fonts.ready.then(() => true) : true",
        awaitPromise: true,
        returnByValue: true
      });
    } catch {}

    // Extra settling delay for CSS animations/render
    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  async setViewport(width, height, isMobile = false) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: isMobile ? 2 : 1,
      mobile: isMobile
    });
  }

  async executeSmartScroll(target) {
    if (!target) return;

    if (target === "bottom") {
      // Smart multi-pass bottom scroll: handles window, inner overflow containers, and disables smooth scrolling
      const expr = `(async () => {
        const style = document.createElement("style");
        style.textContent = "* { scroll-behavior: auto !important; }";
        document.head.appendChild(style);

        let lastHeight = -1;
        for (let pass = 0; pass < 5; pass++) {
          const maxScroll = Math.max(
            document.body ? document.body.scrollHeight : 0,
            document.documentElement ? document.documentElement.scrollHeight : 0,
            1000000
          );
          window.scrollTo({ top: maxScroll, behavior: "instant" });

          // Also check all potentially scrollable inner containers (e.g. SPAs with #root/main overflow-y)
          const all = document.querySelectorAll("*");
          for (const el of all) {
            if (el.scrollHeight > el.clientHeight + 10) {
              const overflow = window.getComputedStyle(el).overflowY;
              if (overflow === "auto" || overflow === "scroll") {
                el.scrollTo({ top: el.scrollHeight, behavior: "instant" });
              }
            }
          }

          await new Promise(r => setTimeout(r, 120));
          const currentHeight = Math.max(
            document.body ? document.body.scrollHeight : 0,
            document.documentElement ? document.documentElement.scrollHeight : 0
          );
          if (currentHeight === lastHeight) break;
          lastHeight = currentHeight;
        }
      })()`;
      await this.send("Runtime.evaluate", { expression: expr, awaitPromise: true });
    } else if (target === "top") {
      const expr = `(async () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.querySelectorAll("*").forEach(el => {
          if (el.scrollTop > 0) el.scrollTo({ top: 0, behavior: "instant" });
        });
      })()`;
      await this.send("Runtime.evaluate", { expression: expr, awaitPromise: true });
    } else {
      const num = parseInt(target, 10);
      if (!isNaN(num)) {
        await this.send("Runtime.evaluate", {
          expression: `window.scrollTo({ top: ${num}, behavior: "instant" })`
        });
      } else {
        // Target is a CSS selector (Edge Case 6: safe query)
        const expr = `(async () => {
          const el = document.querySelector(${JSON.stringify(target)});
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "center" });
            return true;
          }
          return false;
        })()`;
        const res = await this.send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
        if (res.result?.value === false) {
          console.warn(`[ui-shot] Notice: Target selector '${target}' not found on page, keeping current scroll.`);
        }
      }
    }

    // Settling delay after scroll
    await new Promise((r) => setTimeout(r, 200));
  }

  async evaluateCode(code) {
    if (verbose) console.log(`  [eval] ${code}`);
    const res = await this.send("Runtime.evaluate", {
      expression: code,
      awaitPromise: true,
      returnByValue: true
    });
    // Edge Case 7: Graceful exception logging
    if (res.exceptionDetails) {
      const desc = res.exceptionDetails.exception?.description || res.exceptionDetails.text;
      console.warn(`[ui-shot] Evaluation warning in '${code.slice(0, 40)}...': ${desc}`);
    }
    return res;
  }

  async runCustomCdp(cdpArg) {
    const colonIdx = cdpArg.indexOf(":");
    let method = cdpArg;
    let params = {};
    if (colonIdx !== -1) {
      method = cdpArg.slice(0, colonIdx);
      const rawParams = cdpArg.slice(colonIdx + 1);
      try {
        params = JSON.parse(rawParams);
      } catch (e) {
        throw new Error(`Invalid JSON parameters for CDP method '${method}': ${rawParams}`);
      }
    }
    if (verbose) console.log(`  [custom cdp] ${method}`, params);
    return await this.send(method, params);
  }

  async screenshot(captureBeyondViewport = false, formatOpts = { format: "png" }) {
    const params = {
      format: formatOpts.format || "png",
      captureBeyondViewport: Boolean(captureBeyondViewport)
    };
    if (formatOpts.quality !== undefined) {
      params.quality = formatOpts.quality;
    }
    const result = await this.send("Page.captureScreenshot", params);
    return Buffer.from(result.data, "base64");
  }

  async close() {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        await this.send("Browser.close").catch(() => {});
        this.ws.close();
      }
    } catch {}
  }
}

async function runSession(viewportConfig, actionFn) {
  let chromeProc = null;

  const killChrome = () => {
    if (chromeProc && !chromeProc.killed) {
      try { chromeProc.kill("SIGKILL"); } catch {}
    }
  };

  process.on("exit", killChrome);
  process.on("SIGINT", () => { killChrome(); process.exit(130); });
  process.on("SIGTERM", () => { killChrome(); process.exit(143); });
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception in ui-shot:", err);
    killChrome();
    process.exit(1);
  });
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection in ui-shot:", err);
    killChrome();
    process.exit(1);
  });

  try {
    chromeProc = spawn(CHROME_PATH, [
      "--remote-debugging-port=0",
      "--remote-allow-origins=*",
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--ignore-certificate-errors",
      "--allow-insecure-localhost",
      "--disable-features=Translate,OptimizationHints,MediaRouter"
    ], { stdio: ["ignore", "pipe", "pipe"] });

    let port = null;
    for await (const chunk of chromeProc.stderr) {
      const match = chunk.toString().match(/listening on ws:\/\/[^:]+:(\d+)/);
      if (match) {
        port = match[1];
        break;
      }
    }

    if (!port) {
      throw new Error("Failed to extract ephemeral debugging port from chrome-headless-shell.");
    }

    const session = new CdpSession(port);
    await session.connect();

    // Set viewport BEFORE navigation if specified (critical for correct mobile/desktop rendering)
    if (viewportConfig) {
      await session.setViewport(viewportConfig.width, viewportConfig.height, viewportConfig.isMobile);
    }

    console.log(`[ui-shot] Navigating to ${url} (waiting for ${waitUntil})...`);
    await session.navigateAndWait(url, waitUntil, timeoutMs);

    // Apply custom CDP commands if requested
    for (const cdpArg of cdpCommands) {
      await session.runCustomCdp(cdpArg);
    }

    // Apply scroll if requested
    if (scrollTarget) {
      console.log(`[ui-shot] Smart-scrolling to: ${scrollTarget}...`);
      await session.executeSmartScroll(scrollTarget);
    }

    // Apply custom JavaScript evaluations if requested
    if (evalScripts.length > 0) {
      for (const code of evalScripts) {
        await session.evaluateCode(code);
      }
      // Allow dynamic UI transitions (e.g. modals, drawers, menus) to settle
      await new Promise((r) => setTimeout(r, Math.max(delayMs, 350)));
    }

    await actionFn(session);

    await session.close();
  } finally {
    killChrome();
  }
}

async function main() {
  const isMultiViewport = !fullPage && !scrollTarget && !customViewport && evalScripts.length === 0 && cdpCommands.length === 0;

  if (isMultiViewport) {
    const outDir = outputPath ? resolveOutputTarget(outputPath, "") : path.resolve("./screenshots");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const vCfg = (hpConfig && hpConfig.visual && hpConfig.visual.viewports) ? hpConfig.visual.viewports : {};
    const viewports = [
      { name: "mobile", width: (vCfg.mobile && vCfg.mobile.width) || 375, height: (vCfg.mobile && vCfg.mobile.height) || 812, isMobile: true, file: "preview-mobile.png" },
      { name: "tablet", width: (vCfg.tablet && vCfg.tablet.width) || 768, height: (vCfg.tablet && vCfg.tablet.height) || 1024, isMobile: true, file: "preview-tablet.png" },
      { name: "desktop", width: (vCfg.desktop && vCfg.desktop.width) || 1440, height: (vCfg.desktop && vCfg.desktop.height) || 900, isMobile: false, file: "preview-desktop.png" }
    ];

    console.log(`[ui-shot] Capturing multi-viewport suite...`);

    await runSession(null, async (session) => {
      for (const vp of viewports) {
        await session.setViewport(vp.width, vp.height, vp.isMobile);
        await new Promise((r) => setTimeout(r, 200));
        const dest = path.join(outDir, vp.file);
        const formatOpts = getFormatOptions(dest);
        const buf = await session.screenshot(false, formatOpts);
        fs.writeFileSync(dest, buf);
        console.log(`  ✓ ${vp.name.toUpperCase()} (${vp.width}x${vp.height}): ${dest} (${(buf.length / 1024).toFixed(1)} KB)`);
      }
    });

    console.log(`[ui-shot] Complete! 3 viewports saved to ${outDir}. All processes cleanly closed.`);
  } else {
    // Single targeted capture (full-page, custom viewport, scrolled, or custom eval/cdp)
    const defaultFilename = fullPage ? "screenshot-full.png" :
      scrollTarget ? `screenshot-scrolled-${scrollTarget.replace(/[^a-zA-Z0-9_-]/g, "_")}.png` :
      "screenshot.png";

    const targetFile = resolveOutputTarget(outputPath, defaultFilename);
    const outDir = path.dirname(targetFile);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    let targetW = 1440;
    let targetH = 900;
    let isMobile = false;

    if (customViewport) {
      const [w, h] = customViewport.split("x").map((n) => parseInt(n, 10));
      if (w && h) {
        targetW = w;
        targetH = h;
        isMobile = targetW <= 500;
      }
    }

    const vpConfig = { width: targetW, height: targetH, isMobile };
    const formatOpts = getFormatOptions(targetFile);

    await runSession(vpConfig, async (session) => {
      console.log(`[ui-shot] Capturing screenshot (format=${formatOpts.format}, fullPage=${fullPage})...`);
      const buf = await session.screenshot(fullPage, formatOpts);
      fs.writeFileSync(targetFile, buf);
      console.log(`  ✓ Saved: ${targetFile} (${(buf.length / 1024).toFixed(1)} KB)`);
    });

    console.log("[ui-shot] Done. Process terminated cleanly.");
  }
}

main().catch((err) => {
  console.error("[ui-shot] Error:", err.message);
  process.exit(1);
});
