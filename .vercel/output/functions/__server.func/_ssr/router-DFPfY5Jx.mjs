import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, m as createRootRoute, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as resolveChatModel, r as hasLiveCredentials } from "./resolve-model-CV2sMs92.mjs";
import { a as buildUserPrompt, i as buildSystemPrompt, n as isCliBackend, o as parseModelPayload, r as streamCliAgent } from "./cli-backends-BkZaX-Hk.mjs";
import { n as auth } from "./server-A0BVD3fT.mjs";
import { t as useWorkspace } from "./store-DoRtk2cu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DFPfY5Jx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Applies the persisted theme to <html>.
*
* Lives at the root, not inside AppShell. It used to be an effect in AppShell,
* which meant `/login` never got the `.dark` class on a cold load — the login
* page uses theme-aware tokens, so its dark rendering was simply unreachable
* unless you navigated there from `/` in the same document.
*/
function useTheme() {
	const theme = useWorkspace((s) => s.theme);
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
	}, [theme]);
}
/**
* App-level zoom: ⌘+ / ⌘- scale every rem in the app, remembered per device.
*
* Implemented as a root font size rather than a CSS `zoom` or `transform`,
* because Tailwind v4 sizes everything here in rem — so one property scales
* type, padding, gaps and radii together, and nothing needs to know it happened.
* `transform: scale()` would blur text and break `position: fixed` children
* (the command palette, every dialog); `zoom` is still inconsistent across
* engines, and this app ships on WebKit.
*
* Deliberately NOT in the workspace store. `workspace-v1` is partialized into
* the remote workspace and comes back through `loadFromRemote`, so a zoom level
* set on a 4K desktop would follow you to a laptop and overwrite what that
* screen needs. Zoom is a property of the display you are sitting at, so it
* gets its own machine-local key.
*/
var KEY = "forgenotes-zoom";
/**
* A fixed ladder rather than repeated multiplication. `scale *= 1.1` accumulates
* float error and lands on values like 1.3310000000000004, which then round-trip
* through localStorage and never compare equal to anything.
*/
var ZOOM_STEPS = [
	.75,
	.85,
	1,
	1.15,
	1.3,
	1.5,
	1.75,
	2
];
/** Index of the ladder entry closest to `scale`. Never returns -1. */
function nearestStep(scale) {
	let best = 0;
	for (let i = 1; i < ZOOM_STEPS.length; i++) if (Math.abs(ZOOM_STEPS[i] - scale) < Math.abs(ZOOM_STEPS[best] - scale)) best = i;
	return best;
}
/**
* The next zoom level in `direction` (+1 in, -1 out, 0 reset).
*
* Snapping to the nearest step first means a value hand-edited in localStorage,
* or left behind by an older ladder, still steps sensibly instead of jumping.
*/
function stepZoom(current, direction) {
	if (direction === 0) return 1;
	const i = nearestStep(current) + direction;
	return ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, Math.max(0, i))];
}
function readZoom() {
	if (typeof window === "undefined") return 1;
	const raw = Number.parseFloat(window.localStorage.getItem(KEY) ?? "");
	if (!Number.isFinite(raw) || raw <= 0) return 1;
	return Math.min(ZOOM_STEPS.at(-1), Math.max(ZOOM_STEPS[0], raw));
}
function applyZoom(scale) {
	document.documentElement.style.fontSize = scale === 1 ? "" : `${scale * 100}%`;
}
/**
* Binds the zoom shortcuts and applies the remembered level. Root-level, like
* `useTheme` — `/login` needs it too, and it renders outside `AppShell`.
*/
function useZoom() {
	(0, import_react.useEffect)(() => {
		let scale = readZoom();
		applyZoom(scale);
		const onKey = (e) => {
			if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
			const direction = e.key === "=" || e.key === "+" ? 1 : e.key === "-" || e.key === "_" ? -1 : e.key === "0" ? 0 : null;
			if (direction === null) return;
			const next = stepZoom(scale, direction);
			e.preventDefault();
			if (next === scale) return;
			scale = next;
			applyZoom(scale);
			window.localStorage.setItem(KEY, String(scale));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
}
function useCaptureMode() {
	(0, import_react.useEffect)(() => {}, []);
}
var styles_default = "/assets/styles-Peq6Rcdg.css";
var Route$4 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ForgeNotes — notes, AI & harness" },
			{
				name: "description",
				content: "ForgeNotes is a Notion-style workspace for notes, AI (Deep Agents & coding CLIs), markdown, and agent workflows."
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	component: RootDocument
});
function RootDocument() {
	useTheme();
	useZoom();
	useCaptureMode();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var $$splitComponentImporter$1 = () => import("./routes-B0km-ETS.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./login-DaJJyGy-.mjs");
var Route$2 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
/** True on loopback / desktop-local origins where the Grok preview OAuth client rejects callbacks. */
function sse(event) {
	return `data: ${JSON.stringify(event)}\n\n`;
}
function validateBody(raw) {
	const data = raw;
	if (!data?.action || ![
		"edit_block",
		"summarize",
		"action_items",
		"table",
		"outline",
		"mermaid",
		"custom"
	].includes(data.action)) throw new Error("Invalid action");
	return {
		req: {
			action: data.action,
			instruction: typeof data.instruction === "string" ? data.instruction.slice(0, 4e3) : "",
			blockText: typeof data.blockText === "string" ? data.blockText.slice(0, 8e3) : "",
			blockType: data.blockType,
			pageTitle: typeof data.pageTitle === "string" ? data.pageTitle.slice(0, 500) : "",
			pageText: typeof data.pageText === "string" ? data.pageText.slice(0, 2e4) : ""
		},
		clientSettings: data.clientSettings ?? null,
		backendOverride: typeof data.backend === "string" ? data.backend : void 0
	};
}
function resolveBackend(settings, override) {
	if (override) return override;
	if (!settings) return "local";
	if (!settings.enabled) return "local";
	return settings.backend;
}
async function* streamDirect(settings, req) {
	if (!hasLiveCredentials(settings) && settings?.provider !== "ollama") {
		if (!process.env.XAI_API_KEY && !process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
			yield {
				type: "error",
				message: "No API credentials for direct streaming"
			};
			return;
		}
	}
	yield {
		type: "status",
		message: "Streaming from model…"
	};
	const { model, provider, modelName } = await resolveChatModel(settings);
	const system = buildSystemPrompt(req.action);
	const user = buildUserPrompt(req);
	const m = model;
	let full = "";
	if (typeof m.stream === "function") {
		const stream = await m.stream([{
			role: "system",
			content: system
		}, {
			role: "user",
			content: user
		}]);
		for await (const chunk of stream) {
			const content = chunk?.content;
			let piece = "";
			if (typeof content === "string") piece = content;
			else if (Array.isArray(content)) piece = content.map((c) => typeof c === "string" ? c : c.text ?? "").join("");
			if (piece) {
				full += piece;
				yield {
					type: "token",
					text: piece
				};
			}
		}
	} else {
		const res = await model.invoke([{
			role: "system",
			content: system
		}, {
			role: "user",
			content: user
		}]);
		full = typeof res.content === "string" ? res.content : Array.isArray(res.content) ? res.content.map((c) => typeof c === "string" ? c : c.text ?? "").join("") : String(res.content ?? "");
		yield {
			type: "token",
			text: full
		};
	}
	const result = {
		...parseModelPayload(full, req.action, "direct"),
		model: `${provider}:${modelName}`,
		provider: "direct"
	};
	yield {
		type: "done",
		text: full,
		result
	};
}
var Route$1 = createFileRoute("/api/ai/stream")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
	}
	let parsed;
	try {
		parsed = validateBody(body);
	} catch (e) {
		return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Bad request" }), { status: 400 });
	}
	const backend = resolveBackend(parsed.clientSettings, parsed.backendOverride);
	const encoder = new TextEncoder();
	const stream = new ReadableStream({ async start(controller) {
		const send = (ev) => {
			controller.enqueue(encoder.encode(sse(ev)));
		};
		try {
			if (isCliBackend(backend)) {
				let full = "";
				for await (const chunk of streamCliAgent(backend, parsed.req)) if (chunk.type === "token" && chunk.text) {
					full += chunk.text;
					send({
						type: "token",
						text: chunk.text
					});
				} else if (chunk.type === "status") send({
					type: "status",
					message: chunk.message
				});
				else if (chunk.type === "done") {
					full = chunk.text || full;
					const result = {
						...parseModelPayload(full, parsed.req.action, backend),
						model: backend,
						provider: backend
					};
					send({
						type: "done",
						text: full,
						result
					});
				} else if (chunk.type === "error") send({
					type: "error",
					message: chunk.message
				});
			} else if (backend === "direct" || backend === "deepagents") try {
				for await (const ev of streamDirect(parsed.clientSettings, parsed.req)) send(ev);
			} catch (err) {
				send({
					type: "error",
					message: err instanceof Error ? err.message : String(err)
				});
			}
			else {
				send({
					type: "status",
					message: "Local demo (no live stream)"
				});
				const demo = "Local demo mode. Choose Claude Code, Codex, Grok CLI, or configure an API key for live generation.";
				send({
					type: "token",
					text: demo
				});
				send({
					type: "done",
					text: demo,
					result: {
						text: demo,
						provider: "local",
						blocks: [{
							type: "paragraph",
							content: demo
						}]
					}
				});
			}
		} catch (err) {
			send({
				type: "error",
				message: err instanceof Error ? err.message : String(err)
			});
		} finally {
			controller.close();
		}
	} });
	return new Response(stream, { headers: {
		"Content-Type": "text/event-stream; charset=utf-8",
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive",
		"X-Accel-Buffering": "no"
	} });
} } } });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	LoginRoute: Route$2.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$4
	}),
	ApiAiStreamRoute: Route$1.update({
		id: "/api/ai/stream",
		path: "/api/ai/stream",
		getParentRoute: () => Route$4
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({ routeTree });
}
//#endregion
export { getRouter };
