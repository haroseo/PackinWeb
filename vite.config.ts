import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { publicPlatformScript } from "./server/_core/publicConfig";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map(entry => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to collect browser debug logs
 * - POST /__manus__/logs: Browser sends logs, written directly to files
 * - Files: browserConsole.log, networkRequests.log, sessionReplay.log
 * - Auto-trimmed when exceeding 1MB (keeps newest entries)
 */
function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      // POST /__manus__/logs: Browser sends logs (written directly to files)
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = (payload: any) => {
          // Write logs directly to files
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };

        const reqBody = (req as { body?: unknown }).body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }

        let body = "";
        req.on("data", chunk => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    },
  };
}

// Static development and static publishing use the same public-value whitelist
// as Express. Runtime-only secrets never enter the browser bundle. Express keeps
// serving this path dynamically when the application server is selected.
function vitePluginPublicPlatformConfig(): Plugin {
  return {
    name: "manus-public-platform-config",
    configureServer(server) {
      server.middlewares.use("/api/platform/config.js", (_req, res) => {
        res.setHeader("Content-Type", "application/javascript");
        res.setHeader("Cache-Control", "no-store");
        res.end(publicPlatformScript());
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "api/platform/config.js",
        source: publicPlatformScript(),
      });
    },
  };
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    character =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character
  );
}

function vitePluginSeoPages(): Plugin {
  return {
    name: "packinweb-seo-pages",
    generateBundle(_options, bundle) {
      const javascript = Object.keys(bundle).find(
        fileName =>
          fileName.startsWith("assets/index-") && fileName.endsWith(".js")
      );
      const stylesheet = Object.keys(bundle).find(
        fileName =>
          fileName.startsWith("assets/index-") && fileName.endsWith(".css")
      );
      if (!javascript) return;

      const dataDirectory = path.join(PROJECT_ROOT, "client/src/data");
      const features = fs
        .readdirSync(dataDirectory)
        .filter(fileName => fileName.endsWith(".json"))
        .flatMap(fileName => {
          try {
            return JSON.parse(
              fs.readFileSync(path.join(dataDirectory, fileName), "utf8")
            ) as Array<{
              id: string;
              title: string;
              description: string;
              overview: string;
            }>;
          } catch {
            return [];
          }
        });

      const htmlPage = (options: {
        title: string;
        description: string;
        pathName: string;
        heading: string;
        body: string;
        type?: "website" | "article";
      }) => {
        const url = `https://packinweb.pages.dev${options.pathName}`;
        const body = escapeHtml(options.body);
        return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index,follow" />
    <meta name="description" content="${escapeHtml(options.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${options.type ?? "website"}" />
    <meta property="og:site_name" content="PackinWeb" />
    <meta property="og:title" content="${escapeHtml(options.title)}" />
    <meta property="og:description" content="${escapeHtml(options.description)}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(options.title)}" />
    <meta name="twitter:description" content="${escapeHtml(options.description)}" />
    ${stylesheet ? `<link rel="stylesheet" href="/${stylesheet}" />` : ""}
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body>
    <div id="root"><main><p>PackinWeb · 패킨웹</p><h1>${escapeHtml(options.heading)}</h1><p>${body}</p><nav><a href="/">기능 라이브러리</a> <a href="/checklist">서비스 체크리스트</a> <a href="/about">소개</a></nav></main></div>
    <script type="module" src="/${javascript}"></script>
  </body>
</html>`;
      };

      this.emitFile({
        type: "asset",
        fileName: "checklist/index.html",
        source: htmlPage({
          title: "서비스 기능 체크리스트 — 패킨웹",
          description:
            "SaaS, 커머스, 콘텐츠, 커뮤니티 서비스에 필요한 웹 기능을 유형별 체크리스트로 확인하세요.",
          pathName: "/checklist",
          heading: "서비스에 필요한 기능 체크리스트",
          body: "서비스 유형에 맞춰 인증, 결제, 콘텐츠, 검색, 운영 기능을 빠짐없이 점검할 수 있습니다.",
        }),
      });
      this.emitFile({
        type: "asset",
        fileName: "about/index.html",
        source: htmlPage({
          title: "패킨웹 소개 — 웹 기능을 이해하는 레퍼런스",
          description:
            "패킨웹은 기획자, 디자이너, 개발자가 웹 기능을 같은 언어로 이해하도록 돕는 한국어 레퍼런스입니다.",
          pathName: "/about",
          heading: "웹을 이루는 기능을 누구나 이해할 수 있게",
          body: "패킨웹은 웹서비스의 기능을 목적, 흐름, 보안, 접근성, 구현 예시와 함께 정리합니다.",
        }),
      });

      for (const feature of features) {
        const title = `${feature.title} 가이드 — 패킨웹`;
        this.emitFile({
          type: "asset",
          fileName: `features/${feature.id}/index.html`,
          source: htmlPage({
            title,
            description: `${feature.description} 목적, 사용자 흐름, 보안·접근성 기준과 구현 코드 예시를 확인하세요.`,
            pathName: `/features/${feature.id}`,
            heading: `${feature.title} 기능 가이드`,
            body: feature.overview,
            type: "article",
          }),
        });
      }
    },
  };
}

const plugins = [
  vitePluginPublicPlatformConfig(),
  vitePluginSeoPages(),
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusDebugCollector(),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
