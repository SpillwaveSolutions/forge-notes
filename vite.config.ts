import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

/**
 * Finish PGLite bootstrap during dev-server setup (before traffic). Vite awaits
 * async `configureServer` hooks. Production: `src/lib/db` kicks `ensureDbReady`
 * on import.
 */
function pgliteBootstrapPlugin(): Plugin {
  return {
    name: "app-builder:pglite-bootstrap",
    apply: "serve",
    async configureServer(server) {
      try {
        const mod = (await server.ssrLoadModule("/src/lib/db.ts")) as {
          ensureDbReady?: () => Promise<void>;
        };
        if (typeof mod.ensureDbReady === "function") {
          await mod.ensureDbReady();
        }
      } catch (err) {
        console.error("[app-builder] DB bootstrap failed:", err);
        throw err;
      }
    },
  };
}

/**
 * Live-preview OAuth popup — handled HERE so the agent never has to create a
 * `/auth/popup` route (and cannot break it by scaffolding a React page that
 * paints the full app shell in the popup).
 *
 * `signIn` (client.ts) opens `/auth/popup?providerId=…` in a top-level window.
 * This middleware runs before TanStack Start, calls `handleAuthPopupRequest`,
 * and returns the 302 / completion HTML. Deployed apps do not use the popup
 * (full-page OAuth redirect), so `apply: "serve"` is enough.
 */
function authPopupPlugin(): Plugin {
  return {
    name: "app-builder:auth-popup",
    apply: "serve",
    configureServer(server) {
      // Register immediately (not in a returned post-hook) so we run BEFORE
      // TanStack Start / the SPA HTML fallback. A model-authored
      // `src/routes/auth/popup.tsx` React page must never win this path.
      server.middlewares.use(async (req, res, next) => {
        try {
          const rawUrl = req.url ?? "";
          const pathOnly = rawUrl.split("?", 1)[0] ?? "";
          if (pathOnly !== "/auth/popup") {
            next();
            return;
          }
          if ((req.method ?? "GET").toUpperCase() !== "GET") {
            res.statusCode = 405;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("Method Not Allowed");
            return;
          }

          const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:8080");
          const proto = String(
            req.headers["x-forwarded-proto"] ??
              ((req.socket as { encrypted?: boolean } | undefined)?.encrypted ? "https" : "http"),
          );
          const requestHeaders = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value === undefined) continue;
            if (Array.isArray(value)) {
              for (const v of value) requestHeaders.append(key, v);
            } else {
              requestHeaders.set(key, value);
            }
          }
          // Ensure Host is the public preview host so Better Auth's dynamic
          // baseURL / redirect_uri match the popup origin.
          if (!requestHeaders.has("host")) requestHeaders.set("host", host);

          const request = new Request(`${proto}://${host}${rawUrl}`, {
            method: "GET",
            headers: requestHeaders,
          });

          const mod = (await server.ssrLoadModule("/src/lib/auth/popup.server.ts")) as {
            handleAuthPopupRequest: (req: Request) => Promise<Response>;
          };
          const response = await mod.handleAuthPopupRequest(request);

          res.statusCode = response.status;
          // Preserve multiple Set-Cookie headers (OAuth state + session).
          const setCookies =
            typeof response.headers.getSetCookie === "function"
              ? response.headers.getSetCookie()
              : [];
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === "set-cookie") return;
            res.setHeader(key, value);
          });
          for (const cookie of setCookies) {
            res.appendHeader("set-cookie", cookie);
          }
          const body = Buffer.from(await response.arrayBuffer());
          res.end(body);
        } catch (err) {
          console.error("[app-builder] /auth/popup handler failed:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("auth popup failed");
          }
        }
      });
    },
  };
}

// `0.0.0.0:8080` is the live-preview contract — don't change host/port.
// Keep `nitro` gated to `build` (the Vercel deploy target): enabled in dev it
// opens a second dev-server port, which breaks the single-port preview.
// The dev server starts once `src/router.tsx` and `src/routes/` exist — see
// AGENTS.md § "First scaffold".
/** Set by `scripts/build-desktop.mjs`. Switches the build from SSR to a static SPA shell. */
const isDesktopBuild = process.env.DESKTOP_BUILD === "1";

export default defineConfig(({ command }) => ({
  server: {
    host: "0.0.0.0",
    // 8080 stays the default — the Grok live preview and tauri.conf.json's
    // devUrl both assume it. VITE_PORT only overrides it locally, so several
    // agents can each run a Tauri app on one laptop without colliding. It is
    // set by scripts/dev-ports.mjs; see `npm run ports`.
    //
    // This is why `npm run dev` carries NO `--port` flag: a CLI flag outranks
    // the config, so `--port 8080` would silently defeat VITE_PORT and take
    // `playwright.config.ts` (which threads the brokered port through the env)
    // with it. Do not add it back.
    port: Number(process.env.VITE_PORT) || 8080,
    strictPort: true,
    // Harness runs write plans/artifacts under /workspace — do not full-reload the app.
    watch: {
      ignored: [
        "**/harness/artifacts/**",
        "**/harness/plans/**",
        "**/screenshots/**",
        "**/.pglite/**",
      ],
    },
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    pgliteBootstrapPlugin(),
    // Before tanstackStart so /auth/popup never falls through to the SPA.
    authPopupPlugin(),
    tailwindcss(),
    // Desktop needs a STATIC entry point. The default build targets Vercel and
    // is server-rendered, so it emits `.vercel/output/static/assets/**` and no
    // index.html at all — there is nothing for a Tauri webview to open. SPA
    // mode prerenders a shell that boots the client router, which is exactly
    // what a webview loading from disk needs.
    //
    // Set by scripts/build-desktop.mjs; unset for web, so the Vercel build is
    // byte-for-byte what it was.
    tanstackStart(
      isDesktopBuild
        ? {
            spa: {
              enabled: true,
              // Default is `/_shell`, i.e. `_shell.html`. A Tauri webview opens
              // the directory and expects `index.html`, so name it that here
              // rather than renaming the file afterwards — one less step that
              // can be skipped.
              prerender: { outputPath: "/index" },
            },
          }
        : {},
    ),
    // Nitro is the Vercel server target. A desktop build has no server to
    // deploy to, and leaving it on makes the SPA shell fight the SSR output.
    ...(command === "build" && !isDesktopBuild ? [nitro({ preset: "vercel" })] : []),
    viteReact(),
  ],
}));
