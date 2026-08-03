import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as WORKSPACE_SKILLS } from "./resolve-model-CV2sMs92.mjs";
import { i as defaultUserAiSettings, n as DEFAULT_MODELS, r as PROVIDER_META, t as BACKEND_META } from "./settings-types-CI9vU3Ws.mjs";
import { i as signOut } from "./client-Bm2YFrbd.mjs";
import { i as createEmptyPage, n as PAGE_ICONS, o as uid, r as cn, t as COVER_PRESETS } from "./seed-CQXoc2iK.mjs";
import { i as useCurrentUserState, n as Input, r as useCurrentUser, t as Button } from "./input-CLjwzknR.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as useWorkspace } from "./store-DoRtk2cu.mjs";
import { t as authMiddleware } from "./middleware-DoQ2eaJS.mjs";
import { c as titleFromMarkdown, i as pageToMarkdownFile, n as localSearchPages, o as searchPages, r as markdownToBlocks, s as slugifyFilename, t as createSsrRpc } from "./search-server-B-Vicnmt.mjs";
import { $ as Download, A as MessageSquare, B as Heading3, C as Plus, D as Moon, E as PanelLeftClose, F as ListTree, G as FolderPlus, H as Heading1, I as ListTodo, J as FolderInput, K as FolderOutput, L as ListOrdered, M as LogIn, N as LoaderCircle, O as Monitor, P as List, Q as Ellipsis, R as Link2, S as Plug, T as PanelLeft, U as HardDrive, V as Heading2, W as GripVertical, X as FileDown, Y as FileText, Z as Eye, _ as Settings, a as WandSparkles, at as ChevronDown, b as RotateCcw, c as Type, ct as ArrowUp, d as Table2, dt as ArrowDown, et as Copy, f as Sun, g as Sparkles, h as SquareCheckBig, i as Wifi, it as ChevronRight, j as Menu, k as Minus, l as Trash2, lt as ArrowRight, m as Square, n as X, nt as Cloud, o as Upload, ot as Check, p as Star, q as FolderOpen, r as Workflow, rt as CloudOff, s as Unlink, st as Bot, t as Zap, tt as CodeXml, u as Terminal, ut as ArrowLeft, v as Search, w as Play, x as Quote, y as Save, z as Image } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as DropdownMenuPortal, c as DropdownMenuSubContent$1, i as DropdownMenuLabel$1, l as DropdownMenuSubTrigger$1, n as DropdownMenuContent$1, o as DropdownMenuSeparator$1, r as DropdownMenuItem$1, s as DropdownMenuSub$1, t as DropdownMenu$1, u as DropdownMenuTrigger$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as TooltipProvider$1 } from "../_libs/radix-ui__react-tooltip.mjs";
import { a as ScrollAreaViewport, i as ScrollAreaThumb, n as ScrollAreaCorner, r as ScrollAreaScrollbar, t as ScrollArea$1 } from "../_libs/radix-ui__react-scroll-area.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
import { i as PopoverTrigger$1, n as PopoverContent$1, r as PopoverPortal, t as Popover$1 } from "../_libs/radix-ui__react-popover.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B0km-ETS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var TooltipProvider = TooltipProvider$1;
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea$1, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaViewport, {
				className: "h-full w-full rounded-[inherit]",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaCorner, {})
		]
	});
}
function ScrollBar({ className, orientation = "vertical", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
		orientation,
		className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2 border-l border-l-transparent p-px", orientation === "horizontal" && "h-2 flex-col border-t border-t-transparent p-px", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
	});
}
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSub = DropdownMenuSub$1;
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
		className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-muted data-[state=open]:bg-muted", inset && "pl-8", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto size-4 opacity-60" })]
	});
}
function DropdownMenuSubContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
		className: cn("z-50 min-w-40 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg", className),
		...props
	});
}
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
		sideOffset,
		className: cn("z-50 min-w-44 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	}) });
}
function DropdownMenuItem({ className, inset, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
		className: cn("relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className),
		...props
	});
}
function DropdownMenuLabel({ className, inset, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
		className: cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", inset && "pl-8", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
		className: cn("-mx-1 my-1 h-px bg-border", className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-background p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground opacity-70 transition-opacity hover:bg-muted hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 text-left", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-semibold leading-none tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
function validateMcpServer(m) {
	return {
		id: String(m.id || "mcp").slice(0, 64),
		name: String(m.name || "mcp").slice(0, 80),
		enabled: m.enabled !== false,
		transport: m.transport === "sse" || m.transport === "stdio" || m.transport === "http" ? m.transport : "http",
		url: typeof m.url === "string" ? m.url.slice(0, 500) : "",
		authToken: typeof m.authToken === "string" ? m.authToken.slice(0, 500) : "",
		headersText: typeof m.headersText === "string" ? m.headersText.slice(0, 2e3) : "",
		command: typeof m.command === "string" ? m.command.slice(0, 200) : "",
		argsText: typeof m.argsText === "string" ? m.argsText.slice(0, 1e3) : "",
		envText: typeof m.envText === "string" ? m.envText.slice(0, 2e3) : ""
	};
}
function validateSettings(input) {
	if (!input || typeof input !== "object") return null;
	const s = input;
	return {
		setupComplete: Boolean(s.setupComplete),
		enabled: s.enabled !== false,
		backend: s.backend === "direct" || s.backend === "local" || s.backend === "deepagents" || s.backend === "claude-cli" || s.backend === "codex-cli" || s.backend === "grok-cli" ? s.backend : "deepagents",
		preferStreaming: s.preferStreaming !== false,
		provider: s.provider === "anthropic" || s.provider === "openai" || s.provider === "ollama" || s.provider === "openai_compatible" || s.provider === "xai" ? s.provider : "xai",
		model: typeof s.model === "string" ? s.model.slice(0, 120) : "grok-4.5",
		apiKey: typeof s.apiKey === "string" ? s.apiKey.slice(0, 500) : "",
		baseUrl: typeof s.baseUrl === "string" ? s.baseUrl.slice(0, 500) : "",
		temperature: Math.min(1.5, Math.max(0, Number(s.temperature) || .35)),
		recursionLimit: Math.min(80, Math.max(8, Number(s.recursionLimit) || 40)),
		mcpServers: Array.isArray(s.mcpServers) ? s.mcpServers.slice(0, 20).map((m) => validateMcpServer(m)) : [],
		enabledSkills: Array.isArray(s.enabledSkills) ? s.enabledSkills.map(String).slice(0, 50) : [...WORKSPACE_SKILLS]
	};
}
function validateRequest(input) {
	const data = input;
	if (!data || typeof data !== "object") throw new Error("Invalid AI request");
	const action = data.action;
	if (![
		"edit_block",
		"summarize",
		"action_items",
		"table",
		"outline",
		"mermaid",
		"custom"
	].includes(action)) throw new Error("Invalid AI action");
	return {
		action,
		instruction: typeof data.instruction === "string" ? data.instruction.slice(0, 4e3) : "",
		blockText: typeof data.blockText === "string" ? data.blockText.slice(0, 8e3) : "",
		blockType: data.blockType,
		pageTitle: typeof data.pageTitle === "string" ? data.pageTitle.slice(0, 500) : "",
		pageText: typeof data.pageText === "string" ? data.pageText.slice(0, 2e4) : "",
		clientSettings: validateSettings(data.clientSettings)
	};
}
var runAi = createServerFn({ method: "POST" }).validator((input) => validateRequest(input)).handler(createSsrRpc("76d08ea8f0b0103fcaf7055c8b138a9579e4124d0d2f62a0686a1011273cd47a"));
var testAiConnection = createServerFn({ method: "POST" }).validator((input) => ({ clientSettings: validateSettings(input?.clientSettings) })).handler(createSsrRpc("5e6a13ce7e871cac8b1efc1cf5ccb213d79a60710661cd7012f69f2c7ccb6982"));
var testMcpConnection = createServerFn({ method: "POST" }).validator((input) => {
	const server = input?.server;
	if (!server || typeof server !== "object") throw new Error("Missing server");
	return { server: validateMcpServer(server) };
}).handler(createSsrRpc("1e62b13d94b613cf423e7774bb51046a7dfc3005d0164d46cbd5f39fd41e65ae"));
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("5252add61246cf72a4fa382b4734734c4e8ea74302302ba378f1ecb54d53868d"));
var listAiCliBackends = createServerFn({ method: "GET" }).handler(createSsrRpc("9bf431d4df4d57d04f011720753080a98c88face5f4f24058da2b17f8da151b8"));
createServerFn({ method: "POST" }).validator((input) => ({ clientSettings: validateSettings(input?.clientSettings) })).handler(createSsrRpc("12c220cad66e7d4a3abab6da0b2bab6053a48aee4b6a0cde9d321705b501bd69"));
var useAiSettings = create()(persist((set, get) => ({
	...defaultUserAiSettings(),
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	patch: (partial) => set((s) => ({
		...s,
		...partial
	})),
	reset: () => set({
		...defaultUserAiSettings(),
		hydrated: true
	}),
	setProviderDefaults: (provider) => set((s) => {
		const models = {
			xai: "grok-4.5",
			anthropic: "claude-sonnet-4-6",
			openai: "gpt-4.1",
			ollama: "llama3.2",
			openai_compatible: "gpt-4o"
		};
		const base = provider === "ollama" ? s.baseUrl || "http://127.0.0.1:11434" : provider === "openai_compatible" ? s.baseUrl || "https://api.example.com/v1" : "";
		return {
			provider,
			model: models[provider],
			baseUrl: base
		};
	}),
	addMcpServer: (partial) => {
		const id = uid("mcp");
		const server = {
			id,
			name: partial?.name ?? "New MCP server",
			enabled: partial?.enabled ?? true,
			transport: partial?.transport ?? "http",
			url: partial?.url ?? "https://",
			authToken: partial?.authToken ?? "",
			headersText: partial?.headersText ?? "",
			command: partial?.command ?? "npx",
			argsText: partial?.argsText ?? "-y @modelcontextprotocol/server-everything",
			envText: partial?.envText ?? ""
		};
		set((s) => ({ mcpServers: [...s.mcpServers, server] }));
		return id;
	},
	updateMcpServer: (id, patch) => set((s) => ({ mcpServers: s.mcpServers.map((m) => m.id === id ? {
		...m,
		...patch
	} : m) })),
	removeMcpServer: (id) => set((s) => ({ mcpServers: s.mcpServers.filter((m) => m.id !== id) })),
	getSettings: () => {
		const s = get();
		return {
			setupComplete: s.setupComplete,
			enabled: s.enabled,
			backend: s.backend,
			provider: s.provider,
			model: s.model,
			apiKey: s.apiKey,
			baseUrl: s.baseUrl,
			temperature: s.temperature,
			recursionLimit: s.recursionLimit,
			mcpServers: s.mcpServers,
			enabledSkills: s.enabledSkills,
			preferStreaming: s.preferStreaming !== false
		};
	}
}), {
	name: "workspace-ai-settings-v1",
	partialize: (s) => ({
		setupComplete: s.setupComplete,
		enabled: s.enabled,
		backend: s.backend,
		provider: s.provider,
		model: s.model,
		apiKey: s.apiKey,
		baseUrl: s.baseUrl,
		temperature: s.temperature,
		recursionLimit: s.recursionLimit,
		mcpServers: s.mcpServers,
		enabledSkills: s.enabledSkills,
		preferStreaming: s.preferStreaming !== false
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated(true);
	}
}));
function snapshotAiSettings() {
	return useAiSettings.getState().getSettings();
}
var STEPS = [
	{
		id: "welcome",
		title: "Welcome"
	},
	{
		id: "provider",
		title: "Provider"
	},
	{
		id: "credentials",
		title: "Credentials"
	},
	{
		id: "mcp",
		title: "MCP tools"
	},
	{
		id: "skills",
		title: "Skills"
	},
	{
		id: "review",
		title: "Test & finish"
	}
];
function AiSetupWizard({ open, onOpenChange, initialStep = "welcome" }) {
	const settings = useAiSettings();
	const [stepIndex, setStepIndex] = (0, import_react.useState)(0);
	const [testing, setTesting] = (0, import_react.useState)(false);
	const [testResult, setTestResult] = (0, import_react.useState)(null);
	const [mcpTestingId, setMcpTestingId] = (0, import_react.useState)(null);
	const [cliStatus, setCliStatus] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const idx = STEPS.findIndex((s) => s.id === initialStep);
		setStepIndex(idx >= 0 ? idx : 0);
		setTestResult(null);
		listAiCliBackends().then((list) => setCliStatus(list.map((c) => ({
			id: c.id,
			label: c.label,
			available: c.available
		})))).catch(() => setCliStatus([]));
	}, [open, initialStep]);
	const step = STEPS[stepIndex];
	const isCliBackend = settings.backend === "claude-cli" || settings.backend === "codex-cli" || settings.backend === "grok-cli";
	const snapshot = () => settings.getSettings();
	const canNext = (0, import_react.useMemo)(() => {
		if (step.id === "provider") return Boolean(settings.backend);
		if (step.id === "credentials") {
			if (isCliBackend) return true;
			if (settings.provider === "openai_compatible" && !settings.baseUrl.trim()) return false;
			return Boolean(settings.model.trim());
		}
		return true;
	}, [
		step.id,
		settings.backend,
		settings.provider,
		settings.baseUrl,
		settings.model,
		isCliBackend
	]);
	const go = (delta) => {
		setTestResult(null);
		setStepIndex((i) => Math.min(STEPS.length - 1, Math.max(0, i + delta)));
	};
	const finish = () => {
		settings.patch({
			setupComplete: true,
			enabled: true
		});
		onOpenChange(false);
	};
	const runConnectionTest = async () => {
		setTesting(true);
		setTestResult(null);
		try {
			const res = await testAiConnection({ data: { clientSettings: snapshot() } });
			setTestResult({
				ok: res.ok,
				message: res.message
			});
		} catch (e) {
			setTestResult({
				ok: false,
				message: e instanceof Error ? e.message : "Test failed"
			});
		} finally {
			setTesting(false);
		}
	};
	const runMcpTest = async (server) => {
		setMcpTestingId(server.id);
		try {
			const res = await testMcpConnection({ data: { server } });
			settings.updateMcpServer(server.id, {
				lastTestOk: res.ok,
				lastTestMessage: res.message,
				lastToolCount: res.toolNames?.length ?? 0
			});
		} catch (e) {
			settings.updateMcpServer(server.id, {
				lastTestOk: false,
				lastTestMessage: e instanceof Error ? e.message : "Test failed"
			});
		} finally {
			setMcpTestingId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "AI setup · Deep Agents & coding CLIs"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Connect an API model, or shell out to Claude Code / Codex / Grok CLIs with streaming." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 flex flex-wrap gap-1.5",
						children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": `wizard-step-${s.id}`,
							"aria-current": i === stepIndex ? "step" : void 0,
							onClick: () => setStepIndex(i),
							className: cn("rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors", i === stepIndex ? "bg-foreground text-background" : i < stepIndex ? "bg-muted text-foreground" : "bg-muted/50 text-muted-foreground"),
							children: [
								i + 1,
								". ",
								s.title
							]
						}) }, s.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-wizard-step": step.id,
					className: "min-h-0 flex-1 overflow-y-auto px-6 py-5",
					children: [
						step.id === "welcome" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeStep, {}),
						step.id === "provider" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderStep, {
							provider: settings.provider,
							backend: settings.backend,
							preferStreaming: settings.preferStreaming !== false,
							cliStatus,
							onProvider: (p) => settings.setProviderDefaults(p),
							onBackend: (backend) => settings.patch({ backend }),
							onPreferStreaming: (preferStreaming) => settings.patch({ preferStreaming })
						}),
						step.id === "credentials" && (isCliBackend ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CliCredentialsStep, {
							backend: settings.backend,
							cliStatus
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredentialsStep, {
							provider: settings.provider,
							model: settings.model,
							apiKey: settings.apiKey,
							baseUrl: settings.baseUrl,
							temperature: settings.temperature,
							recursionLimit: settings.recursionLimit,
							onChange: (p) => settings.patch(p)
						})),
						step.id === "mcp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(McpStep, {
							servers: settings.mcpServers,
							testingId: mcpTestingId,
							onAdd: () => settings.addMcpServer(),
							onUpdate: (id, patch) => settings.updateMcpServer(id, patch),
							onRemove: (id) => settings.removeMcpServer(id),
							onTest: (s) => void runMcpTest(s)
						}),
						step.id === "skills" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillsStep, {
							enabled: settings.enabledSkills,
							onToggle: (name) => {
								const set = new Set(settings.enabledSkills);
								if (set.has(name)) set.delete(name);
								else set.add(name);
								settings.patch({ enabledSkills: [...set] });
							},
							onAll: () => settings.patch({ enabledSkills: [...WORKSPACE_SKILLS] })
						}),
						step.id === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStep, {
							settings: snapshot(),
							testing,
							testResult,
							onTest: () => void runConnectionTest()
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 border-t border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "ghost",
						disabled: stepIndex === 0,
						onClick: () => go(-1),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: step.id !== "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							disabled: !canNext,
							onClick: () => go(1),
							children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							onClick: finish,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), " Save & finish"]
						})
					})]
				})
			]
		})
	});
}
function WelcomeStep() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm leading-relaxed text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-base text-foreground",
			children: [
				"Generate and edit content with ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Deep Agents" }),
				", provider APIs, or",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "coding CLIs" }),
				" (Claude Code, Codex, Grok) — with streaming when available."
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "list-inside list-disc space-y-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "API path: Grok / Claude / OpenAI / Ollama keys (browser-stored)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"CLI path: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-xs",
						children: "claude"
					}),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-xs",
						children: "codex"
					}),
					",",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-xs",
						children: "grok"
					}),
					" already logged in on the host"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Streaming tokens over SSE for live previews in AI blocks and edit dialogs" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Optional MCP servers + workspace skills for Deep Agents mode" })
			]
		})]
	});
}
function ProviderStep({ provider, backend, preferStreaming, cliStatus, onProvider, onBackend, onPreferStreaming }) {
	const providers = Object.keys(PROVIDER_META);
	const backends = Object.keys(BACKEND_META);
	const isCli = BACKEND_META[backend]?.isCli;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 flex items-center gap-2 text-sm font-medium text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-4" }), " Generation backend"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: backends.map((id) => {
					const meta = BACKEND_META[id];
					const cli = cliStatus.find((c) => c.id === id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onBackend(id),
						className: cn("rounded-xl border px-3 py-3 text-left transition-colors", backend === id ? "border-foreground bg-muted/60" : "border-border hover:bg-muted/40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold text-foreground",
							children: [meta.label, meta.isCli && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", cli?.available ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"),
								children: cli ? cli.available ? "on PATH" : "not found" : "CLI"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: meta.description
						})]
					}, id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: preferStreaming,
					onChange: (e) => onPreferStreaming(e.target.checked)
				}), "Prefer streaming output (SSE) when the backend supports it"]
			}),
			!isCli && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-sm font-medium text-foreground",
				children: "Model provider (API)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: providers.map((id) => {
					const meta = PROVIDER_META[id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onProvider(id),
						className: cn("rounded-xl border px-3 py-3 text-left transition-colors", provider === id ? "border-foreground bg-muted/60" : "border-border hover:bg-muted/40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold text-foreground",
							children: meta.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: meta.description
						})]
					}, id);
				})
			})] })
		]
	});
}
function CliCredentialsStep({ backend, cliStatus }) {
	const hit = cliStatus.find((c) => c.id === backend);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("rounded-lg border px-3 py-2 text-xs", hit?.available ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200" : "border-border bg-muted/40 text-muted-foreground"),
				children: hit?.available ? `${BACKEND_META[backend]?.label ?? backend} is available on PATH.` : `${BACKEND_META[backend]?.label ?? backend} was not found on PATH in this environment. Install it on the machine running the app server.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-inside list-disc space-y-1.5 text-muted-foreground",
				children: ({
					"claude-cli": [
						"Install Claude Code CLI and run `claude login`",
						"Streaming uses `claude -p … --output-format stream-json`",
						"Falls back to plain `-p` if stream-json is unavailable"
					],
					"codex-cli": [
						"Install Codex CLI and authenticate",
						"Streaming uses `codex exec` stdout",
						"Workspace AI never stores your Codex credentials"
					],
					"grok-cli": [
						"Install Grok CLI / Grok Build (`grok login` or XAI_API_KEY)",
						"Streaming prefers `grok chat --stream`",
						"Falls back to `grok -p` / chat without stream flags"
					]
				}[backend] ?? ["Authenticate the CLI on the host machine."]).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t }, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "No API key is stored in the workspace for CLI backends — auth is handled by the CLI itself."
			})
		]
	});
}
function CredentialsStep({ provider, model, apiKey, baseUrl, temperature, recursionLimit, onChange }) {
	const meta = PROVIDER_META[provider];
	const models = DEFAULT_MODELS[provider];
	const showBase = provider === "ollama" || provider === "openai_compatible";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground",
				children: ["Provider: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: meta.label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: meta.keyLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						autoComplete: "off",
						placeholder: meta.keyPlaceholder,
						value: apiKey,
						onChange: (e) => onChange({ apiKey: e.target.value })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: "Stored in this browser’s local storage. Not written to the project repo."
					})
				]
			}),
			showBase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Base URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: meta.baseUrlDefault,
						value: baseUrl,
						onChange: (e) => onChange({ baseUrl: e.target.value })
					}),
					meta.baseUrlHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: meta.baseUrlHint
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Model"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-9 w-full rounded-md border border-border bg-background px-2 text-sm",
						value: model,
						onChange: (e) => onChange({ model: e.target.value }),
						children: models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m,
							children: m
						}, m))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						placeholder: "Or type a custom model id",
						value: model,
						onChange: (e) => onChange({ model: e.target.value })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-medium",
						children: [
							"Temperature (",
							temperature.toFixed(2),
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 1.2,
						step: .05,
						value: temperature,
						onChange: (e) => onChange({ temperature: Number(e.target.value) }),
						className: "w-full"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Agent recursion limit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 8,
						max: 80,
						value: recursionLimit,
						onChange: (e) => onChange({ recursionLimit: Number(e.target.value) || 40 })
					})]
				})]
			})
		]
	});
}
function McpStep({ servers, testingId, onAdd, onUpdate, onRemove, onTest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"MCP tools are used when backend is ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Deep Agents" }),
						"."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					onClick: onAdd,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add server"]
				})]
			}),
			servers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "No MCP servers yet."
			}),
			servers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded-xl border border-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plug, { className: "size-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.name,
								onChange: (e) => onUpdate(s.id, { name: e.target.value }),
								className: "h-8"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: s.enabled,
									onChange: (e) => onUpdate(s.id, { enabled: e.target.checked })
								}), "On"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon-sm",
								variant: "ghost",
								onClick: () => onRemove(s.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-8 w-full rounded-md border border-border bg-background px-2 text-xs",
						value: s.transport,
						onChange: (e) => onUpdate(s.id, { transport: e.target.value }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "http",
								children: "HTTP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sse",
								children: "SSE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "stdio",
								children: "stdio"
							})
						]
					}),
					s.transport === "stdio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "command",
						value: s.command ?? "",
						onChange: (e) => onUpdate(s.id, { command: e.target.value })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "args (space-separated)",
						value: s.argsText ?? "",
						onChange: (e) => onUpdate(s.id, { argsText: e.target.value })
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "https://…",
						value: s.url ?? "",
						onChange: (e) => onUpdate(s.id, { url: e.target.value })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "secondary",
							disabled: testingId === s.id,
							onClick: () => onTest(s),
							children: [testingId === s.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-3.5" }), "Test"]
						}), s.lastTestMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-[11px]", s.lastTestOk ? "text-emerald-600" : "text-destructive"),
							children: s.lastTestMessage
						})]
					})
				]
			}, s.id))
		]
	});
}
function SkillsStep({ enabled, onToggle, onAll }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Skills for Deep Agents mode."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "ghost",
				onClick: onAll,
				children: "Enable all"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2 sm:grid-cols-2",
			children: WORKSPACE_SKILLS.map((name) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onToggle(name),
					className: cn("rounded-lg border px-3 py-2 text-left text-sm", enabled.includes(name) ? "border-foreground bg-muted/50" : "border-border text-muted-foreground"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: name
					})
				}, name);
			})
		})]
	});
}
function ReviewStep({ settings, testing, testResult, onTest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Backend"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium",
						children: BACKEND_META[settings.backend]?.label ?? settings.backend
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Streaming"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: settings.preferStreaming !== false ? "Preferred" : "Off" }),
					!BACKEND_META[settings.backend]?.isCli && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Provider"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
							PROVIDER_META[settings.provider]?.label,
							" · ",
							settings.model
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "API key"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: settings.apiKey ? "Set" : "Not set" })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "MCP servers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [settings.mcpServers.filter((m) => m.enabled).length, " enabled"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Skills"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: settings.enabledSkills.length })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "secondary",
				disabled: testing,
				onClick: onTest,
				children: [testing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-4" }), "Test connection"]
			}),
			testResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-xs", testResult.ok ? "text-emerald-600" : "text-destructive"),
				children: testResult.message
			})
		]
	});
}
function AiSetupBanner({ onOpen }) {
	const setupComplete = useAiSettings((s) => s.setupComplete);
	const backend = useAiSettings((s) => s.backend);
	if (setupComplete) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onOpen,
		className: "flex w-full items-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			"Set up AI — Grok, Claude, Codex CLI, MCP…",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-foreground",
				children: [
					"(",
					BACKEND_META[backend]?.label ?? backend,
					")"
				]
			})
		] })]
	});
}
var SAMPLE_MOUNT = {
	id: "mount_sample",
	name: "Sample notes (linked)",
	kind: "server",
	serverPath: "/workspace/markdown-samples",
	createdAt: Date.now()
};
var useMarkdownMounts = create()(persist((set, get) => ({
	mounts: [SAMPLE_MOUNT],
	selection: null,
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	setSelection: (sel) => set({ selection: sel }),
	addServerMount: (name, serverPath) => {
		const id = uid("mount");
		set((s) => ({ mounts: [...s.mounts, {
			id,
			name: name || "Linked folder",
			kind: "server",
			serverPath,
			createdAt: Date.now()
		}] }));
		return id;
	},
	addBrowserMount: (name) => {
		const id = uid("mount");
		set((s) => ({ mounts: [...s.mounts, {
			id,
			name: name || "Local folder",
			kind: "browser",
			createdAt: Date.now()
		}] }));
		return id;
	},
	removeMount: (id) => set((s) => ({
		mounts: s.mounts.filter((m) => m.id !== id),
		selection: s.selection?.mountId === id ? null : s.selection
	})),
	renameMount: (id, name) => set((s) => ({ mounts: s.mounts.map((m) => m.id === id ? {
		...m,
		name
	} : m) })),
	...(function ensure() {
		return {};
	})()
}), {
	name: "workspace-md-mounts-v1",
	partialize: (s) => ({ mounts: s.mounts }),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated(true);
		if (state && !state.mounts.some((m) => m.id === "mount_sample")) state.mounts = [SAMPLE_MOUNT, ...state.mounts];
	}
}));
var IDB_NAME = "workspace-md-handles";
var IDB_STORE = "handles";
function openIdb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(IDB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function saveDirectoryHandle(mountId, handle) {
	const db = await openIdb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(IDB_STORE, "readwrite");
		tx.objectStore(IDB_STORE).put(handle, mountId);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}
async function loadDirectoryHandle(mountId) {
	const db = await openIdb();
	const handle = await new Promise((resolve, reject) => {
		const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(mountId);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error);
	});
	db.close();
	return handle;
}
async function listBrowserDir(handle, relPath = "") {
	const entries = [];
	for await (const [name, entry] of handle.entries()) {
		if (name.startsWith(".")) continue;
		const path = relPath ? `${relPath}/${name}` : name;
		if (entry.kind === "directory") entries.push({
			name,
			relPath: path,
			kind: "dir"
		});
		else if (name.toLowerCase().endsWith(".md")) entries.push({
			name,
			relPath: path,
			kind: "file"
		});
	}
	return entries.sort((a, b) => {
		if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}
async function readBrowserFile(root, relPath) {
	const parts = relPath.split("/").filter(Boolean);
	let dir = root;
	for (let i = 0; i < parts.length - 1; i++) dir = await dir.getDirectoryHandle(parts[i]);
	return (await (await dir.getFileHandle(parts[parts.length - 1])).getFile()).text();
}
async function writeBrowserFile(root, relPath, content) {
	const parts = relPath.split("/").filter(Boolean);
	let dir = root;
	for (let i = 0; i < parts.length - 1; i++) dir = await dir.getDirectoryHandle(parts[i], { create: true });
	const writable = await (await dir.getFileHandle(parts[parts.length - 1], { create: true })).createWritable();
	await writable.write(content);
	await writable.close();
}
/** Only allow reading/writing under these roots (safety). */
var listServerMount = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.root || typeof d.root !== "string") throw new Error("root required");
	return {
		root: d.root.slice(0, 500),
		relPath: typeof d.relPath === "string" ? d.relPath.slice(0, 500) : ""
	};
}).handler(createSsrRpc("e157ab9abea20eda7cb1dfe0993f10e014c05e1948b91dad507e96d5387ed401"));
var readServerMountFile = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.root || !d?.relPath) throw new Error("root and relPath required");
	return {
		root: d.root.slice(0, 500),
		relPath: d.relPath.slice(0, 500)
	};
}).handler(createSsrRpc("c3a114c6a1c5b50dbdfd57a20fe11e1478b2807ee716176eb560a65a27d27cdc"));
var writeServerMountFile = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.root || !d?.relPath || typeof d.content !== "string") throw new Error("root, relPath, content required");
	return {
		root: d.root.slice(0, 500),
		relPath: d.relPath.slice(0, 500),
		content: d.content.slice(0, 2e6)
	};
}).handler(createSsrRpc("0cc4b6b2ef3fcd2c2324866a03056ffdffdb4bfdfdb4862fc42fd41f6339f896"));
var exportPagesToServerDir = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.targetDir || !Array.isArray(d.files)) throw new Error("Invalid export");
	return {
		targetDir: d.targetDir.slice(0, 500),
		files: d.files.slice(0, 500).map((f) => ({
			relPath: String(f.relPath).slice(0, 400),
			content: String(f.content).slice(0, 2e6)
		}))
	};
}).handler(createSsrRpc("b62660f341ad0ae3ab4593f5ba2b4559082a2961290a3f1c4443f4cff98a92c1"));
function LinkFolderDialog({ open, onOpenChange }) {
	const addServerMount = useMarkdownMounts((s) => s.addServerMount);
	const addBrowserMount = useMarkdownMounts((s) => s.addBrowserMount);
	const setSelection = useMarkdownMounts((s) => s.setSelection);
	const [name, setName] = (0, import_react.useState)("Linked notes");
	const [serverPath, setServerPath] = (0, import_react.useState)("/workspace/markdown-samples");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const linkServer = async () => {
		setBusy(true);
		try {
			await listServerMount({ data: {
				root: serverPath,
				relPath: ""
			} });
			const id = addServerMount(name || "Linked folder", serverPath);
			setSelection({
				mountId: id,
				relPath: ""
			});
			toast.success("Folder linked (view only until you open a file)");
			onOpenChange(false);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not open path");
		} finally {
			setBusy(false);
		}
	};
	const linkBrowser = async () => {
		const w = window;
		if (typeof w.showDirectoryPicker !== "function") {
			toast.error("Your browser doesn’t support folder access. Use a server path instead.");
			return;
		}
		setBusy(true);
		try {
			const handle = await w.showDirectoryPicker({ mode: "readwrite" });
			const id = addBrowserMount(name || handle.name || "Local folder");
			await saveDirectoryHandle(id, handle);
			setSelection({
				mountId: id,
				relPath: ""
			});
			toast.success("Local folder linked without importing");
			onOpenChange(false);
		} catch (e) {
			if (e instanceof Error && e.name === "AbortError") return;
			toast.error(e instanceof Error ? e.message : "Could not link folder");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), "Link markdown folder"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Browse ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-xs",
						children: ".md"
					}),
					" files in the same UI",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "without importing" }),
					" them into the workspace."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "Display name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-xl border border-border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "size-4" }), " This computer"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Uses the browser’s folder picker. Files stay on disk; we only read/write when you open or save."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							disabled: busy,
							onClick: () => void linkBrowser(),
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "size-4" }), "Choose local folder"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-xl border border-border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Server path (sandbox / deploy host)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: serverPath,
							onChange: (e) => setServerPath(e.target.value),
							placeholder: "/workspace/markdown-samples"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [
								"Allowed under ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/workspace" }),
								". Sample:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/workspace/markdown-samples" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							disabled: busy,
							onClick: () => void linkServer(),
							children: "Link server folder"
						})
					]
				})
			]
		})
	});
}
function collectSubtree(pages, rootId) {
	const byParent = /* @__PURE__ */ new Map();
	for (const p of pages) {
		if (p.archived) continue;
		const list = byParent.get(p.parentId) ?? [];
		list.push(p);
		byParent.set(p.parentId, list);
	}
	const out = [];
	const walk = (id) => {
		const page = pages.find((p) => p.id === id);
		if (!page || page.archived) return;
		out.push(page);
		for (const child of byParent.get(id) ?? []) walk(child.id);
	};
	walk(rootId);
	return out;
}
function uniquePath(used, base) {
	if (!used.has(base)) {
		used.add(base);
		return base;
	}
	let i = 2;
	while (used.has(`${base}-${i}`)) i += 1;
	const p = `${base}-${i}`;
	used.add(p);
	return p;
}
/**
* Build a zip of markdown files for one page or a full hierarchy.
* Folders mirror the page tree; each page is `slug.md` and children live in `slug/`.
*/
async function exportPagesToZip(pages, opts) {
	const zip = new import_lib.default();
	const roots = opts.hierarchy ? collectSubtree(pages, opts.rootId) : pages.filter((p) => p.id === opts.rootId);
	if (roots.length === 0) throw new Error("Page not found");
	const root = pages.find((p) => p.id === opts.rootId);
	const used = /* @__PURE__ */ new Set();
	const dirOf = /* @__PURE__ */ new Map();
	const rootSlug = uniquePath(used, slugifyFilename(root.title || "page"));
	zip.file(`${rootSlug}.md`, pageToMarkdownFile(root));
	dirOf.set(root.id, rootSlug);
	if (opts.hierarchy) for (const page of roots) {
		if (page.id === root.id) continue;
		const parentDir = page.parentId ? dirOf.get(page.parentId) : rootSlug;
		if (!parentDir) continue;
		const slug = uniquePath(used, `${parentDir}/${slugifyFilename(page.title || "page")}`);
		zip.file(`${slug}.md`, pageToMarkdownFile(page));
		dirOf.set(page.id, slug);
	}
	return {
		blob: await zip.generateAsync({ type: "blob" }),
		filename: `${slugifyFilename(root.title || "export")}${opts.hierarchy ? "-tree" : ""}.zip`
	};
}
/** Import a single .md file into a page draft. */
function importMarkdownFile(filename, content, parentTempId = null) {
	const title = titleFromMarkdown(content, filename.split(/[/\\]/).pop() || "page.md");
	let body = content;
	body = body.replace(new RegExp(`^#\\s+${escapeReg(title)}\\s*\\n+`), "");
	return {
		tempId: uid("imp"),
		title,
		icon: "📝",
		parentTempId,
		blocks: markdownToBlocks(body),
		relPath: filename
	};
}
function escapeReg(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
* Import a tree of relative paths → content (e.g. from zip or directory picker).
* Nested folders become parent pages.
*/
function importMarkdownTree(files) {
	const mdFiles = files.map((f) => ({
		path: f.path.replace(/\\/g, "/").replace(/^\.\//, ""),
		content: f.content
	})).filter((f) => f.path.toLowerCase().endsWith(".md"));
	const folderIds = /* @__PURE__ */ new Map();
	const drafts = [];
	const ensureFolder = (folderPath) => {
		if (!folderPath || folderPath === ".") return null;
		if (folderIds.has(folderPath)) return folderIds.get(folderPath);
		const parts = folderPath.split("/");
		const name = parts[parts.length - 1];
		const parentPath = parts.slice(0, -1).join("/");
		const parentTempId = parentPath ? ensureFolder(parentPath) : null;
		const tempId = uid("imp");
		folderIds.set(folderPath, tempId);
		drafts.push({
			tempId,
			title: name,
			icon: "📁",
			parentTempId,
			blocks: [{
				id: uid("b"),
				type: "paragraph",
				content: `Folder: ${name}`,
				indent: 0
			}],
			relPath: folderPath + "/"
		});
		return tempId;
	};
	mdFiles.sort((a, b) => a.path.localeCompare(b.path));
	for (const f of mdFiles) {
		const parts = f.path.split("/");
		const fileName = parts.pop();
		const folder = parts.join("/");
		const parentTempId = folder ? ensureFolder(folder) : null;
		drafts.push(importMarkdownFile(fileName, f.content, parentTempId));
		drafts[drafts.length - 1].relPath = f.path;
	}
	return drafts;
}
/** Materialize drafts into real Page objects and return pages + root ids. */
function materializeImports(drafts, parentPageId) {
	const idMap = /* @__PURE__ */ new Map();
	const pages = [];
	const rootIds = [];
	for (const d of drafts) idMap.set(d.tempId, uid("page"));
	for (const d of drafts) {
		const realId = idMap.get(d.tempId);
		const realParent = d.parentTempId ? idMap.get(d.parentTempId) ?? parentPageId : parentPageId;
		const page = createEmptyPage({
			id: realId,
			title: d.title,
			icon: d.icon,
			parentId: realParent,
			blocks: d.blocks
		});
		pages.push(page);
		if (!d.parentTempId) rootIds.push(realId);
	}
	return {
		pages,
		rootIds
	};
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function MarkdownIODialog({ open, onOpenChange, initialTab = "export", pageId }) {
	const pages = useWorkspace((s) => s.pages);
	const activePageId = useWorkspace((s) => s.activePageId);
	const importPages = useWorkspace((s) => s.importPages);
	const setActivePage = useWorkspace((s) => s.setActivePage);
	const targetId = pageId ?? activePageId;
	const page = pages.find((p) => p.id === targetId);
	const [tab, setTab] = (0, import_react.useState)(initialTab);
	const [hierarchy, setHierarchy] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [serverDir, setServerDir] = (0, import_react.useState)("/workspace/markdown-mounts/export");
	const [importParent, setImportParent] = (0, import_react.useState)(true);
	const fileRef = (0, import_react.useRef)(null);
	const dirRef = (0, import_react.useRef)(null);
	const doExportZip = async () => {
		if (!targetId) return;
		setBusy(true);
		try {
			const { blob, filename } = await exportPagesToZip(pages, {
				rootId: targetId,
				hierarchy
			});
			downloadBlob(blob, filename);
			toast.success("Markdown zip downloaded");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Export failed");
		} finally {
			setBusy(false);
		}
	};
	const doExportSingleMd = () => {
		if (!page) return;
		const md = pageToMarkdownFile(page);
		downloadBlob(new Blob([md], { type: "text/markdown" }), `${slugifyFilename(page.title || "page")}.md`);
		toast.success("Markdown file downloaded");
	};
	const doExportServer = async () => {
		if (!targetId) return;
		setBusy(true);
		try {
			const { blob } = await exportPagesToZip(pages, {
				rootId: targetId,
				hierarchy
			});
			const zip = await import_lib.default.loadAsync(blob);
			const files = [];
			const names = Object.keys(zip.files);
			for (const name of names) {
				const f = zip.files[name];
				if (f.dir) continue;
				files.push({
					relPath: name,
					content: await f.async("string")
				});
			}
			const res = await exportPagesToServerDir({ data: {
				targetDir: serverDir,
				files
			} });
			toast.success(`Wrote ${res.count} files to ${res.dir}`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Server export failed");
		} finally {
			setBusy(false);
		}
	};
	const applyImports = (files) => {
		const { pages: created, rootIds } = materializeImports(files.length === 1 ? [importMarkdownFile(files[0].path, files[0].content)] : importMarkdownTree(files), importParent ? targetId ?? null : null);
		importPages(created, rootIds[0] ?? created[0]?.id ?? null);
		if (rootIds[0]) setActivePage(rootIds[0]);
		toast.success(`Imported ${created.length} page${created.length === 1 ? "" : "s"}`);
		onOpenChange(false);
	};
	const onPickFiles = async (fileList) => {
		if (!fileList?.length) return;
		setBusy(true);
		try {
			const files = [];
			for (const file of Array.from(fileList)) {
				if (!file.name.toLowerCase().endsWith(".md") && !file.name.toLowerCase().endsWith(".zip")) continue;
				if (file.name.toLowerCase().endsWith(".zip")) {
					const zip = await import_lib.default.loadAsync(await file.arrayBuffer());
					for (const name of Object.keys(zip.files)) {
						const entry = zip.files[name];
						if (entry.dir || !name.toLowerCase().endsWith(".md")) continue;
						files.push({
							path: name,
							content: await entry.async("string")
						});
					}
				} else {
					const path = file.webkitRelativePath || file.name;
					files.push({
						path,
						content: await file.text()
					});
				}
			}
			if (!files.length) {
				toast.error("No markdown files found");
				return;
			}
			applyImports(files);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Import failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOutput, { className: "size-4" }), "Markdown import / export"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Move pages as folders of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-xs",
						children: ".md"
					}),
					" files — or export a hierarchy."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-lg border border-border p-1",
					children: ["export", "import"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(t),
						className: tab === t ? "flex-1 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background" : "flex-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted",
						children: t === "export" ? "Export" : "Import"
					}, t))
				}),
				tab === "export" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								"Current page:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground",
									children: [
										page?.icon,
										" ",
										page?.title || "Untitled"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: hierarchy,
								onChange: (e) => setHierarchy(e.target.checked)
							}), "Include child pages (folder hierarchy)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								disabled: busy || !page,
								onClick: () => void doExportZip(),
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download as .zip"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								disabled: !page || hierarchy,
								onClick: doExportSingleMd,
								children: "Download single .md"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-lg border border-border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-foreground",
									children: "Write to server folder"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: serverDir,
									onChange: (e) => setServerDir(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"Allowed under ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/workspace" }),
										" (e.g.",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/workspace/markdown-mounts/export" }),
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: "secondary",
									disabled: busy || !page,
									onClick: () => void doExportServer(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOutput, { className: "size-3.5" }), " Write markdown dir"]
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: importParent,
								onChange: (e) => setImportParent(e.target.checked)
							}), "Nest under current page"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: ".md,.zip,text/markdown,application/zip",
							multiple: true,
							className: "hidden",
							onChange: (e) => void onPickFiles(e.target.files)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: dirRef,
							type: "file",
							webkitdirectory: "",
							directory: "",
							multiple: true,
							className: "hidden",
							onChange: (e) => void onPickFiles(e.target.files)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								disabled: busy,
								onClick: () => fileRef.current?.click(),
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Import .md or .zip"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								disabled: busy,
								onClick: () => dirRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderInput, { className: "size-4" }), " Import folder of markdown"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Folders become parent pages; each ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: ".md" }),
								" becomes a page. Content is copied into the workspace (unlike linked mounts)."
							]
						})
					]
				})
			]
		})
	});
}
/** Flatten to plain JSON-safe DTO for TanStack server fns */
var harnessStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("19e00543f0313fe7905c045b33772265c61fa51d18574d69244c3f084698fddb"));
createServerFn({ method: "GET" }).handler(createSsrRpc("9869410eeb67daab81f5d2ed574198eae379b3efb7eb41fe5a887f5ee51051d9"));
var harnessRunAgent = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.agent) throw new Error("agent required");
	return {
		agent: String(d.agent).slice(0, 120),
		message: String(d.message || "Hello").slice(0, 8e3),
		backend: d.backend ? String(d.backend).slice(0, 64) : ""
	};
}).handler(createSsrRpc("3a3b06354c92fa523d323b08f8cb2c04194a6d325c5629dfe4c092272682e98a"));
var harnessRunWorkflow = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.workflow) throw new Error("workflow required");
	return {
		workflow: String(d.workflow).slice(0, 120),
		feature: String(d.feature || "feature").slice(0, 200),
		backend: d.backend ? String(d.backend).slice(0, 64) : ""
	};
}).handler(createSsrRpc("64ebef571e60681eaece2b296de9be5f6f33209c413aad1e4ff65d57e56c9c83"));
function HarnessPanel({ open, onOpenChange }) {
	const [backends, setBackends] = (0, import_react.useState)([]);
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [workflows, setWorkflows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [backend, setBackend] = (0, import_react.useState)("mock");
	const [feature, setFeature] = (0, import_react.useState)("JWT authentication");
	const [agentName, setAgentName] = (0, import_react.useState)("hello");
	const [message, setMessage] = (0, import_react.useState)("What is a meta-harness?");
	const [workflow, setWorkflow] = (0, import_react.useState)("jwt-auth.yaml");
	const [result, setResult] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("workflow");
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setLoading(true);
		setError(null);
		harnessStatus().then((s) => {
			setBackends(s.backends);
			setAgents(s.agents);
			setWorkflows(s.workflows);
			if (s.agents[0]) setAgentName(s.agents[0].replace(/\.ya?ml$/, ""));
			const jwt = s.workflows.find((w) => w.includes("jwt"));
			if (jwt) setWorkflow(jwt);
			else if (s.workflows[0]) setWorkflow(s.workflows[0]);
		}).catch((e) => setError(e instanceof Error ? e.message : "Failed to load harness")).finally(() => setLoading(false));
	}, [open]);
	if (!open) return null;
	const runWf = async () => {
		setRunning(true);
		setResult(null);
		setError(null);
		try {
			const res = await harnessRunWorkflow({ data: {
				workflow,
				feature: feature || "feature",
				backend: backend || "mock"
			} });
			setResult(res);
			toast.success(`Workflow done · ${res.runId}`);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Run failed";
			setError(msg);
			toast.error(msg);
		} finally {
			setRunning(false);
		}
	};
	const runAg = async () => {
		setRunning(true);
		setResult(null);
		setError(null);
		try {
			const res = await harnessRunAgent({ data: {
				agent: agentName,
				message,
				backend: backend || "mock"
			} });
			setResult(res);
			toast.success(`Agent done · ${res.runId}`);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Run failed";
			setError(msg);
			toast.error(msg);
		} finally {
			setRunning(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[120] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 z-0 bg-black/40",
			"aria-label": "Dismiss",
			onClick: () => {
				if (!running) onOpenChange(false);
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "harness-title",
			className: "relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			onMouseDown: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						id: "harness-title",
						className: "flex items-center gap-2 text-lg font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-4" }), "Meta-harness · CLI agents"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Plan → Implement → Review → Validate. Swap backends without rewriting the workflow."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-md p-1.5 text-muted-foreground hover:bg-muted",
						onClick: () => onOpenChange(false),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: [
						[
							"workflow",
							"Workflow",
							Workflow
						],
						[
							"agent",
							"Single agent",
							Bot
						],
						[
							"backends",
							"Backends",
							Zap
						]
					].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab(id),
						className: cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", tab === id ? "bg-foreground text-background" : "bg-muted text-muted-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }), label]
					}, id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5 text-sm",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Loading harness…"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Backend slot (executor.harness)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-9 w-full rounded-md border border-border bg-background px-2 text-sm",
							value: backend,
							onChange: (e) => setBackend(e.target.value),
							children: backends.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: b.id,
								children: [
									b.available ? "●" : "○",
									" ",
									b.label,
									" (",
									b.id,
									")"
								]
							}, b.id))
						})]
					}),
					tab === "workflow" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Workflow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "h-9 w-full rounded-md border border-border bg-background px-2 text-sm",
									value: workflow,
									onChange: (e) => setWorkflow(e.target.value),
									children: workflows.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: w,
										children: w
									}, w))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Feature"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: feature,
									onChange: (e) => setFeature(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								disabled: running || !workflow,
								onClick: () => void runWf(),
								children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Run workflow"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground",
								children: `wks harness workflow ${workflow.replace(/\.ya?ml$/, "")} \\\n  --feature "${feature}" --backend ${backend}`
							})
						]
					}),
					tab === "agent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Agent YAML"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "h-9 w-full rounded-md border border-border bg-background px-2 text-sm",
									value: agentName,
									onChange: (e) => setAgentName(e.target.value),
									children: agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: a.replace(/\.ya?ml$/, ""),
										children: a
									}, a))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Message"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: message,
									onChange: (e) => setMessage(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								disabled: running,
								onClick: () => void runAg(),
								children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Run agent"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground",
								children: `wks harness run ${agentName} --message "${message}" --backend ${backend}`
							})
						]
					}),
					tab === "backends" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Install CLIs locally for live runs; ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "mock" }),
								" always works in preview. Grok Build via ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "grok agent stdio" }),
								" (ACP)."
							]
						}), backends.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 rounded-lg border border-border px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-2 shrink-0 rounded-full", b.available ? "bg-emerald-500" : "bg-muted-foreground/40") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: b.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: b.id }), b.command ? ` · ${b.command}` : ""]
										}),
										b.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-[11px] text-muted-foreground",
											children: b.notes
										})
									]
								}),
								b.available && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-600" })
							]
						}, b.id))]
					}),
					result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded-xl border border-border p-3",
						"data-testid": "harness-result",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-full px-2 py-0.5 font-medium", result.ok ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300" : "bg-destructive/10 text-destructive"),
									children: result.ok ? "ok" : "failed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									"data-volatile": true,
									className: "text-muted-foreground",
									children: [
										result.runId,
										" · ",
										result.backend,
										" · ",
										result.durationMs,
										"ms"
									]
								}),
								result.planPath && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["plan: ", result.planPath]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-2 text-[11px] leading-relaxed",
							children: result.summary
						})]
					})
				] })
			})]
		})]
	});
}
/**
* Desktop (Tauri) helpers — safe to import from web; no-ops when not in Tauri.
*/
function isTauri() {
	if (typeof window === "undefined") return false;
	const w = window;
	return Boolean(w.__TAURI_INTERNALS__ || w.__TAURI__ || w.__WORKSPACE_DESKTOP__);
}
async function getDesktopInfo() {
	if (!isTauri()) return null;
	try {
		const { invoke } = await import("../_libs/tauri-apps__api.mjs").then((n) => n.t);
		return await invoke("desktop_info");
	} catch {
		return { isDesktop: true };
	}
}
function SidebarAction({ icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-sidebar-fg transition-colors hover:bg-sidebar-hover",
		children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: label
		})]
	});
}
function Sidebar({ onOpenSearch, mobile, onNavigate }) {
	const name = useWorkspace((s) => s.name);
	const pages = useWorkspace((s) => s.pages);
	const activePageId = useWorkspace((s) => s.activePageId);
	const theme = useWorkspace((s) => s.theme);
	const storageMode = useWorkspace((s) => s.storageMode);
	const syncStatus = useWorkspace((s) => s.syncStatus);
	const setActivePage = useWorkspace((s) => s.setActivePage);
	const createPage = useWorkspace((s) => s.createPage);
	const deletePage = useWorkspace((s) => s.deletePage);
	const restorePage = useWorkspace((s) => s.restorePage);
	const permanentlyDeletePage = useWorkspace((s) => s.permanentlyDeletePage);
	const duplicatePage = useWorkspace((s) => s.duplicatePage);
	const updatePage = useWorkspace((s) => s.updatePage);
	const toggleSidebar = useWorkspace((s) => s.toggleSidebar);
	const setTheme = useWorkspace((s) => s.setTheme);
	const setName = useWorkspace((s) => s.setName);
	const resetWorkspace = useWorkspace((s) => s.resetWorkspace);
	const { user } = useCurrentUserState();
	const [expanded, setExpanded] = (0, import_react.useState)({});
	const [trashOpen, setTrashOpen] = (0, import_react.useState)(false);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [aiWizardOpen, setAiWizardOpen] = (0, import_react.useState)(false);
	const [aiWizardStep, setAiWizardStep] = (0, import_react.useState)("welcome");
	const aiSetup = useAiSettings();
	const [linkFolderOpen, setLinkFolderOpen] = (0, import_react.useState)(false);
	const [ioOpen, setIoOpen] = (0, import_react.useState)(false);
	const [harnessOpen, setHarnessOpen] = (0, import_react.useState)(false);
	const mounts = useMarkdownMounts((s) => s.mounts);
	const mountSelection = useMarkdownMounts((s) => s.selection);
	const setMountSelection = useMarkdownMounts((s) => s.setSelection);
	const removeMount = useMarkdownMounts((s) => s.removeMount);
	const [mountExpanded, setMountExpanded] = (0, import_react.useState)({ mount_sample: true });
	const [mountChildren, setMountChildren] = (0, import_react.useState)({});
	const [desktopLabel, setDesktopLabel] = (0, import_react.useState)(null);
	const [cliSummary, setCliSummary] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!isTauri()) return;
		getDesktopInfo().then((info) => {
			if (info?.isDesktop) setDesktopLabel(info.platform ? `Desktop · ${info.platform}` : "Desktop app");
		});
	}, []);
	(0, import_react.useEffect)(() => {
		getAiStatus().then((s) => {
			const clis = s.clis;
			if (clis?.length) setCliSummary(clis.map((c) => `${c.label.split(" ")[0]} ${c.available ? "✓" : "·"}`).join(" · "));
		}).catch(() => setCliSummary(null));
	}, []);
	const goPage = (0, import_react.useCallback)((id) => {
		setActivePage(id);
		setMountSelection(null);
		onNavigate?.();
	}, [
		setActivePage,
		setMountSelection,
		onNavigate
	]);
	const favorites = (0, import_react.useMemo)(() => pages.filter((p) => !p.archived && p.favorite), [pages]);
	const trash = (0, import_react.useMemo)(() => pages.filter((p) => p.archived), [pages]);
	const roots = (0, import_react.useMemo)(() => pages.filter((p) => !p.archived && !p.parentId).sort((a, b) => a.createdAt - b.createdAt), [pages]);
	const childrenOf = (0, import_react.useCallback)((parentId) => pages.filter((p) => !p.archived && p.parentId === parentId).sort((a, b) => a.createdAt - b.createdAt), [pages]);
	const loadMountKids = async (mountId) => {
		const m = mounts.find((x) => x.id === mountId);
		if (!m) return;
		try {
			if (m.kind === "server" && m.serverPath) {
				const res = await listServerMount({ data: {
					root: m.serverPath,
					relPath: ""
				} });
				const entries = Array.isArray(res) ? res : [];
				setMountChildren((c) => ({
					...c,
					[mountId]: entries.map((e) => ({
						name: e.name,
						relPath: e.relPath,
						kind: e.kind
					}))
				}));
			} else if (m.kind === "browser") {
				const handle = await loadDirectoryHandle(mountId);
				if (!handle) {
					setMountChildren((c) => ({
						...c,
						[mountId]: []
					}));
					return;
				}
				const entries = await listBrowserDir(handle, "");
				setMountChildren((c) => ({
					...c,
					[mountId]: entries
				}));
			}
		} catch {
			setMountChildren((c) => ({
				...c,
				[mountId]: []
			}));
		}
	};
	const openMount = (mountId, relPath) => {
		setMountSelection({
			mountId,
			relPath
		});
		setActivePage(null);
		onNavigate?.();
	};
	const renderTree = (parentId, depth) => {
		return (parentId === null ? roots : childrenOf(parentId)).map((page) => {
			const hasKids = childrenOf(page.id).length > 0;
			const isOpen = expanded[page.id] ?? depth < 1;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("group flex items-center gap-0.5 rounded-md pr-1", activePageId === page.id && !mountSelection ? "bg-sidebar-active text-foreground" : "hover:bg-sidebar-hover"),
				style: { paddingLeft: 8 + depth * 12 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground",
						onClick: () => setExpanded((e) => ({
							...e,
							[page.id]: !isOpen
						})),
						"aria-label": isOpen ? "Collapse" : "Expand",
						children: hasKids ? isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-sm",
						onClick: () => goPage(page.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-sm",
							children: page.icon || "📄"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: page.title || "Untitled"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-hover-reveal": true,
						className: "flex items-center opacity-0 group-hover:opacity-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-6 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10",
								"aria-label": "Page menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-3.5 text-muted-foreground" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "start",
							className: "w-48",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => updatePage(page.id, { favorite: !page.favorite }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4" }), page.favorite ? "Unfavorite" : "Favorite"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => {
										createPage({ parentId: page.id });
										setExpanded((e) => ({
											...e,
											[page.id]: true
										}));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add sub-page"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => duplicatePage(page.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Duplicate"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									className: "text-destructive focus:text-destructive",
									onClick: () => deletePage(page.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Delete"]
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-6 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10",
							"aria-label": "New sub-page",
							onClick: () => {
								createPage({ parentId: page.id });
								setExpanded((e) => ({
									...e,
									[page.id]: true
								}));
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5 text-muted-foreground" })
						})]
					})
				]
			}), hasKids && isOpen && renderTree(page.id, depth + 1)] }, page.id);
		});
	};
	const syncIcon = storageMode === "database" ? syncStatus === "saving" || syncStatus === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-3.5 animate-pulse text-muted-foreground" }) : syncStatus === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "size-3.5 text-destructive" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "size-3.5 text-muted-foreground" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-fg", mobile ? "w-full" : "w-[260px] min-w-[260px]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-3 pb-1 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sidebar-hover",
					onClick: () => setSettingsOpen(true),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background",
							children: name.slice(0, 1).toUpperCase() || "W"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-sm font-semibold text-foreground",
							children: name
						}),
						syncIcon
					]
				}), !mobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-hover",
					onClick: () => toggleSidebar(),
					"aria-label": "Collapse sidebar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "size-4" })
				})]
			}),
			desktopLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-3 mb-1 flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-3" }), desktopLabel]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5 px-2 py-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
						label: "Search",
						onClick: onOpenSearch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
						label: "New page",
						onClick: () => {
							const id = createPage();
							goPage(id);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }),
						label: "Import / export",
						onClick: () => setIoOpen(true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }),
						label: "Link markdown",
						onClick: () => setLinkFolderOpen(true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-4" }),
						label: "Agent harness",
						onClick: () => setHarnessOpen(true)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea, {
				className: "min-h-0 flex-1 px-2",
				children: [
					favorites.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Favorites"
						}), favorites.map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm", activePageId === page.id && !mountSelection ? "bg-sidebar-active text-foreground" : "hover:bg-sidebar-hover"),
							onClick: () => goPage(page.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: page.icon || "📄" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: page.title || "Untitled"
							})]
						}, page.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Private"
							}),
							renderTree(null, 0),
							roots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-2 text-xs text-muted-foreground",
								children: "No pages yet"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Linked markdown"
							}),
							mounts.map((m) => {
								const open = mountExpanded[m.id] ?? false;
								const kids = mountChildren[m.id] ?? [];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group flex items-center gap-0.5 rounded-md pr-1 hover:bg-sidebar-hover",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground",
												onClick: () => {
													setMountExpanded((e) => ({
														...e,
														[m.id]: !open
													}));
													if (!open) loadMountKids(m.id);
												},
												children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-sm",
												onClick: () => {
													setMountExpanded((e) => ({
														...e,
														[m.id]: true
													}));
													loadMountKids(m.id);
													openMount(m.id, "");
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate font-medium",
													children: m.name
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"data-hover-reveal": true,
												className: "flex size-6 items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-black/5",
												title: "Unlink",
												onClick: () => removeMount(m.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unlink, { className: "size-3 text-muted-foreground" })
											})
										]
									}), open && kids.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: cn("flex w-full items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-left text-sm", mountSelection?.mountId === m.id && mountSelection.relPath === k.relPath ? "bg-sidebar-active text-foreground" : "text-sidebar-fg hover:bg-sidebar-hover"),
										onClick: () => void openMount(m.id, k.relPath),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs",
											children: k.kind === "dir" ? "📁" : "📝"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: k.name
										})]
									}, k.relPath))]
								}, m.id);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-1 text-[11px] text-muted-foreground",
								children: "Link folder (no import)"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5 border-t border-sidebar-border px-2 py-2",
				children: [
					!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/login",
						className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-hover",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in to sync"]
					}),
					user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-1 py-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					}),
					!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-0.5 text-[11px] text-muted-foreground",
						children: "Local only · Sign in to sync"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }),
						label: "Trash",
						onClick: () => setTrashOpen(true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }),
						label: "Settings",
						onClick: () => setSettingsOpen(true)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: trashOpen,
				onOpenChange: setTrashOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Trash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Restored pages return to the top level of your workspace." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-72 space-y-1 overflow-y-auto",
						children: [trash.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Trash is empty"
						}), trash.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-md border border-border px-2 py-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.icon || "📄" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate text-sm",
									children: p.title || "Untitled"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => restorePage(p.id),
									children: "Restore"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "text-destructive",
									onClick: () => permanentlyDeletePage(p.id),
									children: "Delete"
								})
							]
						}, p.id))]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: settingsOpen,
				onOpenChange: setSettingsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Settings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Workspace preferences and AI" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-sm",
						children: [
							desktopLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-3.5" }),
									"Running as ",
									desktopLabel,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "· Tauri standalone"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Workspace name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "h-9 w-full rounded-md border border-border bg-background px-3 text-sm",
									value: name,
									onChange: (e) => setName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Theme"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: theme === "light" ? "default" : "outline",
										onClick: () => setTheme("light"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5" }), " Light"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: theme === "dark" ? "default" : "outline",
										onClick: () => setTheme("dark"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-3.5" }), " Dark"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " AI"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											"Backend: ",
											BACKEND_META[aiSetup.backend]?.label ?? aiSetup.backend,
											!BACKEND_META[aiSetup.backend]?.isCli && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												" ",
												"· ",
												PROVIDER_META[aiSetup.provider]?.label,
												" · ",
												aiSetup.model
											] })
										]
									}),
									cliSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: ["CLIs: ", cliSummary]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										className: "mt-2",
										variant: "secondary",
										onClick: () => {
											setAiWizardStep("provider");
											setAiWizardOpen(true);
										},
										children: "Configure AI"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-3 text-xs text-muted-foreground",
								children: [
									"Storage: ",
									storageMode === "database" ? "Database (synced)" : "Local only",
									storageMode === "database" && ` · ${syncStatus}`
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								className: "w-full text-destructive",
								onClick: () => {
									if (confirm("Reset workspace to seed pages? This cannot be undone.")) {
										resetWorkspace();
										setSettingsOpen(false);
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Reset workspace"]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownIODialog, {
				open: ioOpen,
				onOpenChange: setIoOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkFolderDialog, {
				open: linkFolderOpen,
				onOpenChange: setLinkFolderOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HarnessPanel, {
				open: harnessOpen,
				onOpenChange: setHarnessOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiSetupWizard, {
				open: aiWizardOpen,
				onOpenChange: setAiWizardOpen,
				initialStep: aiWizardStep
			})
		]
	});
}
var Popover = Popover$1;
var PopoverTrigger = PopoverTrigger$1;
function PopoverContent({ className, align = "center", sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent$1, {
		align,
		sideOffset,
		className: cn("z-50 w-72 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	}) });
}
var BLOCK_TYPES = [
	{
		type: "paragraph",
		label: "Text",
		description: "Just start writing with plain text.",
		icon: Type,
		keywords: [
			"text",
			"paragraph",
			"plain"
		],
		placeholder: "Type '/' for commands"
	},
	{
		type: "heading1",
		label: "Heading 1",
		description: "Big section heading.",
		icon: Heading1,
		keywords: [
			"h1",
			"title",
			"heading"
		],
		placeholder: "Heading 1"
	},
	{
		type: "heading2",
		label: "Heading 2",
		description: "Medium section heading.",
		icon: Heading2,
		keywords: [
			"h2",
			"heading",
			"subtitle"
		],
		placeholder: "Heading 2"
	},
	{
		type: "heading3",
		label: "Heading 3",
		description: "Small section heading.",
		icon: Heading3,
		keywords: ["h3", "heading"],
		placeholder: "Heading 3"
	},
	{
		type: "bullet",
		label: "Bulleted list",
		description: "Create a simple bulleted list.",
		icon: List,
		keywords: [
			"ul",
			"list",
			"bullet",
			"unordered"
		],
		placeholder: "List item"
	},
	{
		type: "numbered",
		label: "Numbered list",
		description: "Create a list with numbering.",
		icon: ListOrdered,
		keywords: [
			"ol",
			"list",
			"number",
			"ordered"
		],
		placeholder: "List item"
	},
	{
		type: "todo",
		label: "To-do list",
		description: "Track tasks with a to-do checkbox.",
		icon: SquareCheckBig,
		keywords: [
			"todo",
			"task",
			"checkbox",
			"check"
		],
		placeholder: "To-do"
	},
	{
		type: "toggle",
		label: "Toggle",
		description: "Hide and show content inside.",
		icon: ChevronRight,
		keywords: [
			"toggle",
			"collapse",
			"details"
		],
		placeholder: "Toggle heading"
	},
	{
		type: "quote",
		label: "Quote",
		description: "Capture a quote.",
		icon: Quote,
		keywords: [
			"quote",
			"blockquote",
			"cite"
		],
		placeholder: "Empty quote"
	},
	{
		type: "callout",
		label: "Callout",
		description: "Make writing stand out.",
		icon: MessageSquare,
		keywords: [
			"callout",
			"note",
			"info",
			"tip"
		],
		placeholder: "Callout"
	},
	{
		type: "code",
		label: "Code",
		description: "Capture a code snippet.",
		icon: CodeXml,
		keywords: [
			"code",
			"snippet",
			"pre"
		],
		placeholder: "Code"
	},
	{
		type: "mermaid",
		label: "Mermaid",
		description: "Diagram with Mermaid syntax.",
		icon: Workflow,
		keywords: [
			"mermaid",
			"diagram",
			"flowchart",
			"sequence",
			"graph"
		],
		placeholder: "flowchart TD\n  A[Start] --> B[End]"
	},
	{
		type: "ai",
		label: "AI",
		description: "Generate from the rest of this page.",
		icon: Sparkles,
		keywords: [
			"ai",
			"gpt",
			"grok",
			"summary",
			"assistant",
			"llm"
		],
		placeholder: "Summarize this page as a launch checklist…"
	},
	{
		type: "divider",
		label: "Divider",
		description: "Visually divide blocks.",
		icon: Minus,
		keywords: [
			"divider",
			"line",
			"hr",
			"separator"
		],
		placeholder: ""
	}
];
function getBlockMeta(type) {
	return BLOCK_TYPES.find((b) => b.type === type) ?? BLOCK_TYPES[0];
}
function filterBlockTypes(query) {
	const q = query.trim().toLowerCase();
	if (!q) return BLOCK_TYPES;
	return BLOCK_TYPES.filter((b) => b.label.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.keywords.some((k) => k.includes(q)));
}
function SlashMenu({ query, selectedIndex, onSelect, onHover, position }) {
	const items = (0, import_react.useMemo)(() => filterBlockTypes(query), [query]);
	const listRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		(listRef.current?.querySelector(`[data-index="${selectedIndex}"]`))?.scrollIntoView({ block: "nearest" });
	}, [selectedIndex]);
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed z-50 w-72 overflow-hidden rounded-xl border border-border bg-popover p-3 text-sm text-muted-foreground shadow-xl",
		style: {
			top: position.top,
			left: position.left
		},
		children: "No matching blocks"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: listRef,
		className: "fixed z-50 max-h-72 w-72 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-xl",
		style: {
			top: position.top,
			left: Math.min(position.left, window.innerWidth - 300)
		},
		role: "listbox",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
			children: "Basic blocks"
		}), items.map((item, index) => {
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"data-index": index,
				role: "option",
				"aria-selected": index === selectedIndex,
				className: cn("flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors", index === selectedIndex ? "bg-muted" : "hover:bg-muted/70"),
				onMouseEnter: () => onHover(index),
				onMouseDown: (e) => {
					e.preventDefault();
					onSelect(item.type);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium text-foreground",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-xs text-muted-foreground",
						children: item.description
					})]
				})]
			}, item.type);
		})]
	});
}
var mermaidReady = null;
function loadMermaid() {
	if (!mermaidReady) mermaidReady = import("../_libs/mermaid+[...].mjs").then((n) => n.t).then((mod) => {
		const mermaid = mod.default;
		mermaid.initialize({
			startOnLoad: false,
			securityLevel: "strict",
			theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral",
			fontFamily: "inherit"
		});
		return mermaid;
	});
	return mermaidReady;
}
function MermaidDiagram({ source, className }) {
	const reactId = (0, import_react.useId)().replace(/:/g, "");
	const containerRef = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [svg, setSvg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const code = source.trim();
		if (!code) {
			setSvg("");
			setError(null);
			return;
		}
		(async () => {
			try {
				const mermaid = await loadMermaid();
				mermaid.initialize({
					startOnLoad: false,
					securityLevel: "strict",
					theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral",
					fontFamily: "inherit"
				});
				const id = `mmd_${reactId}_${Math.random().toString(36).slice(2, 8)}`;
				const { svg: rendered } = await mermaid.render(id, code);
				if (!cancelled) {
					setSvg(rendered);
					setError(null);
				}
			} catch (e) {
				if (!cancelled) {
					setSvg("");
					setError(e instanceof Error ? e.message : "Invalid Mermaid diagram");
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [source, reactId]);
	if (!source.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Write Mermaid syntax (e.g. flowchart TD) — diagram previews here."
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive",
		children: error
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: cn("overflow-x-auto rounded-md border border-border bg-background px-3 py-4 [&_svg]:mx-auto [&_svg]:max-w-full", className),
		dangerouslySetInnerHTML: svg ? { __html: svg } : void 0
	});
}
/**
* Stream AI generation via SSE (`POST /api/ai/stream`).
* Prefers coding-agent CLIs when selected in settings (claude / codex / grok).
*/
async function streamAi(opts) {
	const res = await fetch("/api/ai/stream", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "text/event-stream"
		},
		body: JSON.stringify({
			...opts.request,
			clientSettings: opts.clientSettings,
			backend: opts.backend
		}),
		signal: opts.signal
	});
	if (!res.ok) {
		const msg = await res.text().catch(() => res.statusText);
		throw new Error(msg || `Stream failed (${res.status})`);
	}
	if (!res.body) throw new Error("No response body for stream");
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let full = "";
	let final = null;
	let streamError = null;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const parts = buffer.split("\n\n");
		buffer = parts.pop() ?? "";
		for (const part of parts) {
			const line = part.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).join("");
			if (!line) continue;
			let ev;
			try {
				ev = JSON.parse(line);
			} catch {
				continue;
			}
			if (ev.type === "token" && ev.text) {
				full += ev.text;
				opts.onToken?.(ev.text, full);
			} else if (ev.type === "status" && ev.message) opts.onStatus?.(ev.message);
			else if (ev.type === "done") {
				if (ev.text) full = ev.text;
				if (ev.result) final = ev.result;
				else final = {
					text: full,
					provider: "local"
				};
				opts.onDone?.(final, full);
			} else if (ev.type === "error") {
				streamError = ev.message || "Stream error";
				opts.onError?.(streamError);
			}
		}
	}
	if (streamError && !final && !full.trim()) throw new Error(streamError);
	return final ?? {
		text: full,
		provider: "local"
	};
}
var PRESETS$1 = [
	{
		action: "summarize",
		label: "Summary",
		icon: FileText,
		hint: "Condense the page"
	},
	{
		action: "action_items",
		label: "Todos",
		icon: ListTodo,
		hint: "Extract action items"
	},
	{
		action: "table",
		label: "Table",
		icon: Table2,
		hint: "Markdown table"
	},
	{
		action: "outline",
		label: "Outline",
		icon: ListTree,
		hint: "Hierarchical outline"
	},
	{
		action: "mermaid",
		label: "Diagram",
		icon: Workflow,
		hint: "Mermaid flowchart"
	}
];
function providerLabel$1(provider, model) {
	if (provider === "claude-cli") return "Claude Code CLI";
	if (provider === "codex-cli") return "Codex CLI";
	if (provider === "grok-cli") return "Grok CLI";
	if (provider === "deepagents") return `Deep Agents · ${model ?? "model"}`;
	if (provider === "direct") return model ?? "Direct API";
	if (provider === "xai") return model ?? "Grok";
	return "Local demo AI";
}
function AiBlockPanel({ content, aiOutput, aiError, pageTitle, pageText, onChangePrompt, onResult }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [provider, setProvider] = (0, import_react.useState)(null);
	const [wizardOpen, setWizardOpen] = (0, import_react.useState)(false);
	const [streamPreview, setStreamPreview] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)(null);
	const abortRef = (0, import_react.useRef)(null);
	const stop = () => {
		abortRef.current?.abort();
		abortRef.current = null;
		setLoading(false);
		setStatus("Stopped");
	};
	const execute = async (action, instruction) => {
		setLoading(true);
		setStreamPreview("");
		setStatus(null);
		const settings = snapshotAiSettings();
		const preferStream = settings.preferStreaming !== false;
		const isCli = settings.backend === "claude-cli" || settings.backend === "codex-cli" || settings.backend === "grok-cli";
		const useStream = preferStream && (isCli || settings.backend === "direct" || settings.backend === "deepagents");
		try {
			if (useStream) {
				const ac = new AbortController();
				abortRef.current = ac;
				const res = await streamAi({
					request: {
						action,
						instruction: instruction ?? content,
						pageTitle,
						pageText
					},
					clientSettings: settings,
					backend: settings.backend,
					signal: ac.signal,
					onToken: (_t, full) => setStreamPreview(full),
					onStatus: (m) => setStatus(m)
				});
				setProvider(providerLabel$1(res.provider, res.model));
				onResult({
					output: res.text || (res.blocks ? res.blocks.map((b) => `${b.type}: ${b.content}`).join("\n") : ""),
					blocks: res.blocks
				});
				setStreamPreview("");
			} else {
				const res = await runAi({ data: {
					action,
					instruction: instruction ?? content,
					pageTitle,
					pageText,
					clientSettings: settings
				} });
				setProvider(providerLabel$1(res.provider, res.model));
				onResult({
					output: res.text || (res.blocks ? res.blocks.map((b) => `${b.type}: ${b.content}`).join("\n") : ""),
					blocks: res.blocks
				});
			}
		} catch (e) {
			if (e?.name === "AbortError") onResult({
				output: streamPreview,
				error: "Generation stopped"
			});
			else onResult({
				output: "",
				error: e instanceof Error ? e.message : "AI request failed"
			});
		} finally {
			abortRef.current = null;
			setLoading(false);
			setStatus(null);
		}
	};
	const settingsSnap = snapshotAiSettings();
	const backendHint = BACKEND_META[settingsSnap.backend]?.label ?? settingsSnap.backend;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full space-y-3 rounded-xl border border-border bg-muted/30 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm font-medium text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-7 items-center justify-center rounded-md bg-foreground text-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" })
					}),
					"AI block",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] font-normal text-muted-foreground",
						children: provider ?? backendHint
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiSetupBanner, { onOpen: () => setWizardOpen(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Uses page context. Backends: Deep Agents, API keys, or coding CLIs (Claude Code / Codex / Grok) with live streaming when available."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: PRESETS$1.map((p) => {
					const Icon = p.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						className: "bg-background",
						disabled: loading,
						title: p.hint,
						onClick: () => void execute(p.action),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), p.label]
					}, p.action);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "min-h-[64px] flex-1 resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30",
					placeholder: "Custom instruction…",
					value: content,
					onChange: (e) => onChangePrompt(e.target.value),
					disabled: loading
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "destructive",
					onClick: stop,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), "Stop"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					disabled: !content.trim(),
					onClick: () => void execute("custom", content),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Run"]
				})]
			}),
			(loading || streamPreview) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-background p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center gap-2 text-[11px] text-muted-foreground",
					children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), status ?? (loading ? "Streaming…" : "Preview")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-relaxed",
					children: streamPreview || "…"
				})]
			}),
			aiError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: aiError
			}),
			aiOutput && !streamPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "max-h-48 overflow-auto rounded-lg border border-border bg-background p-3 text-xs",
				children: aiOutput
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiSetupWizard, {
				open: wizardOpen,
				onOpenChange: setWizardOpen
			})
		]
	});
}
var PRESETS = [
	{
		id: "improve",
		label: "Improve",
		instruction: "Improve clarity and flow while preserving meaning."
	},
	{
		id: "shorter",
		label: "Shorter",
		instruction: "Make this shorter and more concise."
	},
	{
		id: "longer",
		label: "Expand",
		instruction: "Expand this with one more sentence of useful detail."
	},
	{
		id: "fix",
		label: "Fix grammar",
		instruction: "Fix grammar and spelling only."
	},
	{
		id: "pro",
		label: "Professional",
		instruction: "Rewrite in a clear, professional tone."
	}
];
function providerLabel(provider, model) {
	if (provider === "claude-cli") return "Claude Code CLI";
	if (provider === "codex-cli") return "Codex CLI";
	if (provider === "grok-cli") return "Grok CLI";
	if (provider === "deepagents") return `Deep Agents · ${model ?? "model"}`;
	if (provider === "direct") return model ?? "Direct API";
	if (provider === "xai") return model ?? "Grok";
	return "Local demo AI";
}
function AiEditDialog({ open, onOpenChange, blockText, blockType, pageTitle, pageText, onApply }) {
	const [instruction, setInstruction] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [provider, setProvider] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)(null);
	const [wizardOpen, setWizardOpen] = (0, import_react.useState)(false);
	const abortRef = (0, import_react.useRef)(null);
	const stop = () => {
		abortRef.current?.abort();
		abortRef.current = null;
		setLoading(false);
	};
	const run = async (instr) => {
		setLoading(true);
		setError(null);
		setPreview("");
		setStatus(null);
		const settings = snapshotAiSettings();
		const preferStream = settings.preferStreaming !== false;
		const isCli = settings.backend === "claude-cli" || settings.backend === "codex-cli" || settings.backend === "grok-cli";
		const useStream = preferStream && (isCli || settings.backend === "direct" || settings.backend === "deepagents");
		try {
			if (useStream) {
				const ac = new AbortController();
				abortRef.current = ac;
				const res = await streamAi({
					request: {
						action: "edit_block",
						instruction: instr,
						blockText,
						blockType,
						pageTitle,
						pageText
					},
					clientSettings: settings,
					backend: settings.backend,
					signal: ac.signal,
					onToken: (_t, full) => setPreview(full),
					onStatus: (m) => setStatus(m)
				});
				setPreview(res.text);
				setProvider(providerLabel(res.provider, res.model));
			} else {
				const res = await runAi({ data: {
					action: "edit_block",
					instruction: instr,
					blockText,
					blockType,
					pageTitle,
					pageText,
					clientSettings: settings
				} });
				setPreview(res.text);
				setProvider(providerLabel(res.provider, res.model));
			}
		} catch (e) {
			if (e?.name !== "AbortError") setError(e instanceof Error ? e.message : "AI request failed");
		} finally {
			abortRef.current = null;
			setLoading(false);
			setStatus(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) {
				stop();
				setPreview(null);
				setError(null);
				setInstruction("");
			}
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Edit block with AI"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Rewrite this block. Uses your configured backend (API or Claude / Codex / Grok CLI) with streaming when available.", provider && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-xs text-muted-foreground",
					children: provider
				})] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiSetupBanner, { onOpen: () => setWizardOpen(true) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-muted/40 p-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: "Original"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-4 whitespace-pre-wrap",
						children: blockText || "(empty)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						disabled: loading,
						onClick: () => void run(p.instruction),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5" }), p.label]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30",
						placeholder: "Custom instruction…",
						value: instruction,
						onChange: (e) => setInstruction(e.target.value),
						disabled: loading,
						onKeyDown: (e) => {
							if (e.key === "Enter" && instruction.trim()) run(instruction.trim());
						}
					}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "destructive",
						onClick: stop,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), "Stop"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						disabled: !instruction.trim(),
						onClick: () => void run(instruction.trim()),
						children: "Run"
					})]
				}),
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), status ?? "Generating…"]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-destructive",
					children: error
				}),
				preview != null && preview !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: cn("max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-background p-3 text-sm", loading && "opacity-80"),
							children: preview
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							className: "w-full",
							disabled: loading,
							onClick: () => {
								onApply(preview);
								onOpenChange(false);
							},
							children: "Apply to block"
						})
					]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiSetupWizard, {
		open: wizardOpen,
		onOpenChange: setWizardOpen
	})] });
}
function BlockRow({ block, index, isFocused, listNumber, pageTitle, pageText, onFocus, onChange, onTypeChange, onToggleCheck, onToggleCollapse, onEnter, onBackspaceEmpty, onMove, onDelete, onIndent, onPatch, onAiInsert, focusRequest, onFocusHandled, inputRefs }) {
	const meta = getBlockMeta(block.type);
	const areaRef = (0, import_react.useRef)(null);
	const rowRef = (0, import_react.useRef)(null);
	const [slashOpen, setSlashOpen] = (0, import_react.useState)(false);
	const [slashQuery, setSlashQuery] = (0, import_react.useState)("");
	const [slashIndex, setSlashIndex] = (0, import_react.useState)(0);
	const [slashPos, setSlashPos] = (0, import_react.useState)({
		top: 0,
		left: 0
	});
	const [hovered, setHovered] = (0, import_react.useState)(false);
	const [aiOpen, setAiOpen] = (0, import_react.useState)(false);
	const setRef = (0, import_react.useCallback)((el) => {
		areaRef.current = el;
		if (el) inputRefs.current.set(block.id, el);
		else inputRefs.current.delete(block.id);
	}, [block.id, inputRefs]);
	const autosize = (0, import_react.useCallback)(() => {
		const el = areaRef.current;
		if (!el) return;
		el.style.height = "0px";
		el.style.height = `${Math.max(el.scrollHeight, 28)}px`;
	}, []);
	(0, import_react.useEffect)(() => {
		autosize();
	}, [
		block.content,
		block.type,
		autosize
	]);
	(0, import_react.useEffect)(() => {
		if (focusRequest !== block.id) return;
		const el = areaRef.current;
		if (el) {
			el.focus();
			const len = el.value.length;
			el.setSelectionRange(len, len);
		}
		onFocusHandled();
	}, [
		focusRequest,
		block.id,
		onFocusHandled
	]);
	const openSlash = (query) => {
		const el = rowRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const left = Math.min(rect.left + 48, window.innerWidth - 300);
		const top = rect.bottom + 280 > window.innerHeight ? Math.max(8, rect.top - 280) : rect.bottom + 4;
		setSlashPos({
			top,
			left
		});
		setSlashQuery(query);
		setSlashIndex(0);
		setSlashOpen(true);
	};
	const closeSlash = () => {
		setSlashOpen(false);
		setSlashQuery("");
		setSlashIndex(0);
	};
	const applySlash = (type) => {
		const content = block.content;
		const slashIdx = content.lastIndexOf("/");
		const cleaned = slashIdx >= 0 ? content.slice(0, slashIdx) : content;
		onChange(block.id, cleaned);
		onTypeChange(block.id, type);
		closeSlash();
		requestAnimationFrame(() => {
			inputRefs.current.get(block.id)?.focus();
		});
	};
	const handleChange = (value) => {
		onChange(block.id, value);
		requestAnimationFrame(autosize);
		const slashIdx = value.lastIndexOf("/");
		if (slashIdx >= 0) {
			const after = value.slice(slashIdx + 1);
			const before = value[slashIdx - 1];
			if ((slashIdx === 0 || before === " " || before === "\n") && !after.includes("\n")) {
				openSlash(after);
				return;
			}
		}
		if (slashOpen) closeSlash();
	};
	const handleKeyDown = (e) => {
		if (slashOpen) {
			const items = filterBlockTypes(slashQuery);
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSlashIndex((i) => (i + 1) % Math.max(items.length, 1));
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setSlashIndex((i) => (i - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
				return;
			}
			if (e.key === "Enter" || e.key === "Tab") {
				e.preventDefault();
				const pick = items[slashIndex];
				if (pick) applySlash(pick.type);
				return;
			}
			if (e.key === "Escape") {
				e.preventDefault();
				closeSlash();
				return;
			}
		}
		if (e.key === "Enter" && !e.shiftKey && block.type !== "code" && block.type !== "mermaid") {
			e.preventDefault();
			onEnter(block.id);
			return;
		}
		if (e.key === "Backspace") {
			const el = e.currentTarget;
			if (!el.value && el.selectionStart === 0) {
				e.preventDefault();
				onBackspaceEmpty(block.id);
				return;
			}
		}
		if (e.key === "Tab") {
			e.preventDefault();
			onIndent(block.id, e.shiftKey ? -1 : 1);
		}
		if (e.key === "ArrowUp" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			onMove(block.id, "up");
		}
		if (e.key === "ArrowDown" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			onMove(block.id, "down");
		}
	};
	const indentStyle = { paddingLeft: `${(block.indent ?? 0) * 1.5}rem` };
	const canAiEdit = block.type !== "divider" && block.type !== "ai" && block.type !== "mermaid";
	if (block.type === "divider") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rowRef,
		"data-block-id": block.id,
		"data-block-type": block.type,
		className: "group relative flex items-center gap-1 py-2",
		style: indentStyle,
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockHandles, {
			visible: hovered || isFocused,
			canAiEdit: false,
			onAdd: () => onEnter(block.id),
			onMoveUp: () => onMove(block.id, "up"),
			onMoveDown: () => onMove(block.id, "down"),
			onDelete: () => onDelete(block.id),
			onTypeChange: (t) => onTypeChange(block.id, t),
			onAiEdit: () => setAiOpen(true)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "w-full border-0 border-t border-border" })]
	});
	if (block.type === "ai") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rowRef,
		"data-block-id": block.id,
		"data-block-type": block.type,
		className: "group relative py-1",
		style: indentStyle,
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockHandles, {
			visible: hovered || isFocused,
			canAiEdit: false,
			onAdd: () => onEnter(block.id),
			onMoveUp: () => onMove(block.id, "up"),
			onMoveDown: () => onMove(block.id, "down"),
			onDelete: () => onDelete(block.id),
			onTypeChange: (t) => onTypeChange(block.id, t),
			onAiEdit: () => void 0
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pl-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiBlockPanel, {
				content: block.content,
				aiOutput: block.aiOutput,
				aiError: block.aiError,
				pageTitle,
				pageText,
				onChangePrompt: (v) => onChange(block.id, v),
				onResult: ({ output, blocks, error }) => {
					onPatch(block.id, {
						aiOutput: output,
						aiError: error
					});
					if (blocks?.length) onAiInsert(block.id, blocks);
				}
			})
		})]
	});
	if (block.type === "mermaid") {
		const showSource = block.showSource ?? !block.content.trim();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: rowRef,
			"data-block-id": block.id,
			"data-block-type": block.type,
			className: "group relative py-1",
			style: indentStyle,
			onMouseEnter: () => setHovered(true),
			onMouseLeave: () => setHovered(false),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockHandles, {
					visible: hovered || isFocused,
					canAiEdit: false,
					onAdd: () => onEnter(block.id),
					onMoveUp: () => onMove(block.id, "up"),
					onMoveDown: () => onMove(block.id, "down"),
					onDelete: () => onDelete(block.id),
					onTypeChange: (t) => onTypeChange(block.id, t),
					onAiEdit: () => void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-xl border border-border bg-muted/20 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: "Mermaid"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							className: "h-7 text-muted-foreground",
							onClick: () => onPatch(block.id, { showSource: !showSource }),
							children: showSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " Preview"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "size-3.5" }), " Edit source"] })
						})]
					}), showSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						ref: setRef,
						value: block.content,
						onChange: (e) => handleChange(e.target.value),
						onFocus: () => onFocus(block.id),
						onKeyDown: handleKeyDown,
						placeholder: meta.placeholder,
						rows: Math.max(4, block.content.split("\n").length),
						spellCheck: false,
						className: "w-full resize-y rounded-md border border-border bg-background px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MermaidDiagram, { source: block.content })]
				}),
				slashOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlashMenu, {
					query: slashQuery,
					selectedIndex: slashIndex,
					onSelect: applySlash,
					onHover: setSlashIndex,
					position: slashPos
				})
			]
		});
	}
	const fieldClass = cn("block w-full resize-none overflow-hidden border-0 bg-background p-0 text-foreground shadow-none outline-none ring-0 focus:outline-none focus:ring-0", "placeholder:text-muted-foreground/60", block.type === "paragraph" && "text-base leading-relaxed", block.type === "heading1" && "text-3xl font-semibold leading-tight tracking-tight", block.type === "heading2" && "text-2xl font-semibold leading-tight tracking-tight", block.type === "heading3" && "text-xl font-semibold leading-snug tracking-tight", (block.type === "bullet" || block.type === "numbered") && "text-base leading-relaxed", block.type === "todo" && cn("text-base leading-relaxed", block.checked && "text-muted-foreground line-through"), block.type === "toggle" && "text-base font-medium leading-relaxed", block.type === "quote" && "text-base leading-relaxed text-muted-foreground", block.type === "callout" && "text-base leading-relaxed", block.type === "code" && "min-h-16 font-mono text-sm leading-relaxed");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rowRef,
		"data-block-id": block.id,
		"data-block-type": block.type,
		className: cn("group relative flex items-start gap-1 rounded-md py-0.5", isFocused && "bg-muted/40"),
		style: indentStyle,
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockHandles, {
				visible: hovered || isFocused,
				canAiEdit,
				onAdd: () => onEnter(block.id),
				onMoveUp: () => onMove(block.id, "up"),
				onMoveDown: () => onMove(block.id, "down"),
				onDelete: () => onDelete(block.id),
				onTypeChange: (t) => onTypeChange(block.id, t),
				onAiEdit: () => setAiOpen(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex min-w-0 flex-1 items-start gap-2 rounded-md px-1 py-1", block.type === "callout" && "border border-border bg-muted/50 px-3 py-2.5", block.type === "quote" && "border-l-2 border-foreground/25 pl-3", block.type === "code" && "border border-border bg-muted/60 px-3 py-2.5"),
				children: [
					block.type === "bullet" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/80" }),
					block.type === "numbered" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 w-5 shrink-0 text-right text-sm tabular-nums text-muted-foreground",
						children: [listNumber ?? index + 1, "."]
					}),
					block.type === "todo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("mt-1.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors", block.checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-foreground/40"),
						onClick: () => onToggleCheck(block.id),
						"aria-label": block.checked ? "Mark incomplete" : "Mark complete",
						children: block.checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-3",
							strokeWidth: 3
						})
					}),
					block.type === "toggle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-1 flex size-5 shrink-0 items-center justify-center rounded hover:bg-muted",
						onClick: () => onToggleCollapse(block.id),
						"aria-label": block.collapsed ? "Expand" : "Collapse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("size-4 text-muted-foreground transition-transform duration-150", !block.collapsed && "rotate-90") })
					}),
					block.type === "callout" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 shrink-0 text-base leading-none",
						"aria-hidden": true,
						children: "💡"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						ref: setRef,
						value: block.content,
						onChange: (e) => handleChange(e.target.value),
						onFocus: () => onFocus(block.id),
						onKeyDown: handleKeyDown,
						placeholder: meta.placeholder,
						rows: 1,
						spellCheck: block.type !== "code",
						className: fieldClass
					})
				]
			}),
			slashOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlashMenu, {
				query: slashQuery,
				selectedIndex: slashIndex,
				onSelect: applySlash,
				onHover: setSlashIndex,
				position: slashPos
			}),
			canAiEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiEditDialog, {
				open: aiOpen,
				onOpenChange: setAiOpen,
				blockText: block.content,
				blockType: block.type,
				pageTitle,
				pageText,
				onApply: (text) => onChange(block.id, text)
			})
		]
	});
}
function BlockHandles({ visible, canAiEdit, onAdd, onMoveUp, onMoveDown, onDelete, onTypeChange, onAiEdit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-hover-reveal": true,
		className: cn("absolute -left-12 top-1 flex items-center gap-0.5 opacity-0 transition-opacity max-sm:-left-10", visible && "opacity-100"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			size: "icon-sm",
			className: "text-muted-foreground",
			onClick: onAdd,
			"aria-label": "Add block below",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				size: "icon-sm",
				className: "text-muted-foreground",
				"aria-label": "Block menu",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-3.5" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "start",
			className: "w-48",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Block" }),
				canAiEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: onAiEdit,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Edit with AI"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: onMoveUp,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" }), " Move up"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: onMoveDown,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" }), " Move down"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" }), " Turn into"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent, {
					className: "max-h-64 overflow-y-auto",
					children: BLOCK_TYPES.map((t) => {
						const Icon = t.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onTypeChange(t.type),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
								" ",
								t.label
							]
						}, t.type);
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "text-destructive focus:text-destructive",
					onClick: onDelete,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Delete"]
				})
			]
		})] })]
	});
}
function blocksToPlainText(page) {
	return page.blocks.filter((b) => b.type !== "ai" && b.type !== "divider").map((b) => {
		return `${b.type === "heading1" ? "# " : b.type === "heading2" ? "## " : b.type === "heading3" ? "### " : b.type === "bullet" ? "- " : b.type === "numbered" ? "1. " : b.type === "todo" ? b.checked ? "[x] " : "[ ] " : b.type === "quote" ? "> " : b.type === "code" || b.type === "mermaid" ? "" : ""}${b.content}`.trim();
	}).filter(Boolean).join("\n");
}
function PageEditor({ page }) {
	const updatePage = useWorkspace((s) => s.updatePage);
	const updateBlock = useWorkspace((s) => s.updateBlock);
	const insertBlock = useWorkspace((s) => s.insertBlock);
	const deleteBlock = useWorkspace((s) => s.deleteBlock);
	const changeBlockType = useWorkspace((s) => s.changeBlockType);
	const moveBlock = useWorkspace((s) => s.moveBlock);
	const deletePage = useWorkspace((s) => s.deletePage);
	const duplicatePage = useWorkspace((s) => s.duplicatePage);
	const createPage = useWorkspace((s) => s.createPage);
	const setBlocks = useWorkspace((s) => s.setBlocks);
	const [focusedId, setFocusedId] = (0, import_react.useState)(null);
	const [focusRequest, setFocusRequest] = (0, import_react.useState)(null);
	const inputRefs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const titleRef = (0, import_react.useRef)(null);
	const pageText = (0, import_react.useMemo)(() => blocksToPlainText(page), [page]);
	const listNumbers = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		let n = 0;
		for (const b of page.blocks) if (b.type === "numbered") {
			n += 1;
			map.set(b.id, n);
		} else n = 0;
		return map;
	}, [page.blocks]);
	(0, import_react.useEffect)(() => {
		const el = titleRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, [page.title]);
	const handleEnter = (0, import_react.useCallback)((blockId) => {
		const newId = insertBlock(page.id, blockId, "paragraph", "");
		setFocusRequest(newId);
		setFocusedId(newId);
	}, [insertBlock, page.id]);
	const handleBackspaceEmpty = (0, import_react.useCallback)((blockId) => {
		const idx = page.blocks.findIndex((b) => b.id === blockId);
		if (idx < 0) return;
		const prev = page.blocks[idx - 1];
		deleteBlock(page.id, blockId);
		if (prev) {
			setFocusRequest(prev.id);
			setFocusedId(prev.id);
		}
	}, [
		deleteBlock,
		page.blocks,
		page.id
	]);
	const handleIndent = (0, import_react.useCallback)((blockId, delta) => {
		const block = page.blocks.find((b) => b.id === blockId);
		if (!block) return;
		const next = Math.max(0, Math.min(4, (block.indent ?? 0) + delta));
		updateBlock(page.id, blockId, { indent: next });
	}, [
		page.blocks,
		page.id,
		updateBlock
	]);
	const handleAiInsert = (0, import_react.useCallback)((afterId, generated) => {
		const idx = page.blocks.findIndex((b) => b.id === afterId);
		if (idx < 0 || generated.length === 0) return;
		const newBlocks = generated.map((g) => ({
			id: uid("b"),
			type: g.type,
			content: g.content,
			indent: 0,
			checked: g.type === "todo" ? false : void 0,
			showSource: g.type === "mermaid" ? false : void 0
		}));
		const next = [...page.blocks];
		next.splice(idx + 1, 0, ...newBlocks);
		setBlocks(page.id, next);
		setFocusRequest(newBlocks[0].id);
	}, [
		page.blocks,
		page.id,
		setBlocks
	]);
	const cover = page.cover ? COVER_PRESETS[page.cover] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl px-4 pb-32 pt-4 sm:px-12 sm:pt-8",
		children: [
			cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group/cover relative -mx-4 mb-2 h-36 overflow-hidden rounded-xl sm:-mx-6 sm:h-44",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute inset-0", cover.className) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-hover-reveal": true,
					className: "absolute bottom-3 right-3 opacity-0 transition-opacity group-hover/cover:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "secondary",
						className: "bg-background/90 shadow-sm backdrop-blur-sm",
						onClick: () => updatePage(page.id, { cover: null }),
						children: "Remove cover"
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex flex-wrap items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-16 items-center justify-center rounded-xl text-4xl transition-colors hover:bg-muted",
						"aria-label": "Change page icon",
						children: page.icon
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					align: "start",
					className: "w-72",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-xs font-medium text-muted-foreground",
						children: "Page icon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-8 gap-1",
						children: PAGE_ICONS.map((icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-muted", page.icon === icon && "bg-muted ring-1 ring-border"),
							onClick: () => updatePage(page.id, { icon }),
							children: icon
						}, icon))
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-1 flex-wrap items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							className: "text-muted-foreground",
							onClick: () => updatePage(page.id, { favorite: !page.favorite }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-3.5", page.favorite && "fill-amber-400 text-amber-500") }), page.favorite ? "Unfavorite" : "Favorite"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							className: "text-muted-foreground",
							onClick: () => {
								const last = page.blocks[page.blocks.length - 1];
								const id = insertBlock(page.id, last?.id ?? null, "ai", "");
								setFocusRequest(id);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), "AI block"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								className: "text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-3.5" }), "Cover"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "start",
							children: [Object.entries(COVER_PRESETS).map(([key, preset]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => updatePage(page.id, { cover: key }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mr-2 size-4 rounded", preset.className) }), preset.label]
							}, key)), page.cover && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: () => updatePage(page.id, { cover: null }),
								children: "Remove cover"
							})] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								"aria-label": "Page actions",
								className: "text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-3.5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => createPage({ parentId: page.id }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add sub-page"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => duplicatePage(page.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Duplicate"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									className: "text-destructive focus:text-destructive",
									onClick: () => deletePage(page.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Move to trash"]
								})
							]
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				ref: titleRef,
				value: page.title,
				onChange: (e) => updatePage(page.id, { title: e.target.value }),
				placeholder: "Untitled",
				rows: 1,
				className: "mb-4 w-full resize-none overflow-hidden bg-transparent text-4xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50",
				onKeyDown: (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						const first = page.blocks[0];
						if (first) {
							setFocusRequest(first.id);
							setFocusedId(first.id);
						}
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative space-y-0.5 pl-10 sm:pl-12",
				children: page.blocks.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockRow, {
					pageId: page.id,
					block,
					index,
					isFocused: focusedId === block.id,
					listNumber: listNumbers.get(block.id),
					pageTitle: page.title,
					pageText,
					onFocus: setFocusedId,
					onChange: (id, content) => updateBlock(page.id, id, { content }),
					onTypeChange: (id, type) => changeBlockType(page.id, id, type),
					onToggleCheck: (id) => {
						const b = page.blocks.find((x) => x.id === id);
						if (b) updateBlock(page.id, id, { checked: !b.checked });
					},
					onToggleCollapse: (id) => {
						const b = page.blocks.find((x) => x.id === id);
						if (b) updateBlock(page.id, id, { collapsed: !b.collapsed });
					},
					onEnter: handleEnter,
					onBackspaceEmpty: handleBackspaceEmpty,
					onMove: (id, dir) => moveBlock(page.id, id, dir),
					onDelete: (id) => deleteBlock(page.id, id),
					onIndent: handleIndent,
					onPatch: (id, patch) => updateBlock(page.id, id, patch),
					onAiInsert: handleAiInsert,
					focusRequest,
					onFocusHandled: () => setFocusRequest(null),
					inputRefs
				}, block.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-2 ml-10 min-h-16 w-[calc(100%-2.5rem)] cursor-text rounded-md sm:ml-12 sm:w-[calc(100%-3rem)]",
				"aria-label": "Add block at end",
				onClick: () => {
					const last = page.blocks[page.blocks.length - 1];
					if (last && last.type === "paragraph" && !last.content) {
						setFocusRequest(last.id);
						setFocusedId(last.id);
					} else {
						const id = insertBlock(page.id, last?.id ?? null, "paragraph", "");
						setFocusRequest(id);
						setFocusedId(id);
					}
				}
			})
		]
	});
}
function CommandPalette({ open, onOpenChange }) {
	const pages = useWorkspace((s) => s.pages);
	const storageMode = useWorkspace((s) => s.storageMode);
	const setActivePage = useWorkspace((s) => s.setActivePage);
	const createPage = useWorkspace((s) => s.createPage);
	const [query, setQuery] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [trgm, setTrgm] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("local");
	(0, import_react.useEffect)(() => {
		if (!open) {
			setQuery("");
			setHits([]);
		}
	}, [open]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				onOpenChange(!open);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onOpenChange]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const q = query.trim();
		if (!q) {
			setHits([]);
			setSearching(false);
			return;
		}
		let cancelled = false;
		setSearching(true);
		const t = setTimeout(() => {
			(async () => {
				try {
					if (storageMode === "database") {
						const res = await searchPages({ data: {
							query: q,
							limit: 24
						} });
						if (cancelled) return;
						setHits(res.hits);
						setTrgm(res.trgm);
						setMode("postgres");
					} else {
						const res = localSearchPages(pages, q, 24);
						if (cancelled) return;
						setHits(res);
						setTrgm(false);
						setMode("local");
					}
				} catch {
					if (cancelled) return;
					setHits(localSearchPages(pages, q, 24));
					setMode("local");
				} finally {
					if (!cancelled) setSearching(false);
				}
			})();
		}, 180);
		return () => {
			cancelled = true;
			clearTimeout(t);
		};
	}, [
		query,
		open,
		storageMode,
		pages
	]);
	const fallbackPages = (0, import_react.useMemo)(() => pages.filter((p) => !p.archived).slice(0, 30), [pages]);
	if (!open) return null;
	const showHits = query.trim().length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/40",
			onClick: () => onOpenChange(false),
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Command palette",
			"data-testid": "command-palette",
			className: "absolute left-1/2 top-[18%] w-[min(560px,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e, {
				className: "flex flex-col",
				label: "Search pages",
				shouldFilter: false,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b border-border px-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
								value: query,
								onValueChange: setQuery,
								placeholder: storageMode === "database" ? "Search pages (Postgres keyword + similarity)…" : "Search pages…",
								className: "h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
								autoFocus: true
							}),
							searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline",
								children: "ESC"
							})
						]
					}),
					showHits && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-3 py-1.5 text-[11px] text-muted-foreground",
						children: mode === "postgres" ? `Postgres full-text${trgm ? " + pg_trgm similarity" : " + ILIKE fallback"}` : "Local search (sign in to sync for Postgres search)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
						className: "max-h-80 overflow-y-auto p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
								heading: "Actions",
								className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									value: "new page create",
									onSelect: () => {
										createPage();
										onOpenChange(false);
									},
									className: cn("flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 text-muted-foreground" }), "New page"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
								heading: showHits ? "Results" : "Pages",
								className: "mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground",
								children: (showHits ? hits : fallbackPages.map(pageToHit)).map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									value: `${hit.title} ${hit.pageId}`,
									onSelect: () => {
										setActivePage(hit.pageId);
										window.dispatchEvent(new CustomEvent("workspace:clear-mount"));
										onOpenChange(false);
									},
									className: "flex cursor-pointer flex-col gap-0.5 rounded-md px-2 py-2 text-sm aria-selected:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-base leading-none",
												children: hit.icon
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 flex-1 truncate font-medium",
												children: hit.title || "Untitled"
											}),
											hit.favorite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-amber-400 text-amber-500" }),
											showHits && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase text-muted-foreground",
												children: hit.mode
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 text-muted-foreground" })
										]
									}), showHits && hit.snippet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "line-clamp-2 pl-7 text-xs text-muted-foreground",
										children: hit.snippet
									})]
								}, hit.pageId))
							}),
							showHits && hits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: searching ? "Searching…" : "No pages found"
							})
						]
					})
				]
			})
		})]
	});
}
function pageToHit(page) {
	return {
		pageId: page.id,
		title: page.title,
		icon: page.icon,
		parentId: page.parentId,
		favorite: page.favorite,
		snippet: "",
		score: 0,
		mode: "keyword"
	};
}
/**
* Browse + view/edit a linked markdown file without importing into the workspace.
*/
function MountedMarkdownView() {
	const mounts = useMarkdownMounts((s) => s.mounts);
	const selection = useMarkdownMounts((s) => s.selection);
	const setSelection = useMarkdownMounts((s) => s.setSelection);
	const mount = mounts.find((m) => m.id === selection?.mountId);
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [dirPath, setDirPath] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [blocks, setBlocks] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [mode, setMode] = (0, import_react.useState)("browse");
	const loadDir = (0, import_react.useCallback)(async (rel = "") => {
		if (!mount) return;
		setLoading(true);
		setError(null);
		try {
			if (mount.kind === "server" && mount.serverPath) {
				const list = await listServerMount({ data: {
					root: mount.serverPath,
					relPath: rel
				} });
				setEntries(list);
			} else {
				const handle = await loadDirectoryHandle(mount.id);
				if (!handle) throw new Error("Local folder permission lost — re-link the folder.");
				let dir = handle;
				if (rel) for (const part of rel.split("/").filter(Boolean)) dir = await dir.getDirectoryHandle(part);
				const list = await listBrowserDir(dir, rel);
				setEntries(list.map((e) => ({
					...e,
					relPath: rel ? `${rel}/${e.name}` : e.name
				})));
			}
			setDirPath(rel);
			setMode("browse");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to list folder");
		} finally {
			setLoading(false);
		}
	}, [mount]);
	const loadFile = (0, import_react.useCallback)(async (relPath) => {
		if (!mount) return;
		setLoading(true);
		setError(null);
		try {
			let text = "";
			if (mount.kind === "server" && mount.serverPath) text = (await readServerMountFile({ data: {
				root: mount.serverPath,
				relPath
			} })).content;
			else {
				const handle = await loadDirectoryHandle(mount.id);
				if (!handle) throw new Error("Local folder permission lost — re-link the folder.");
				text = await readBrowserFile(handle, relPath);
			}
			setContent(text);
			const t = titleFromMarkdown(text, relPath.split("/").pop() || "note");
			setTitle(t);
			setBlocks(markdownToBlocks(text.replace(new RegExp(`^#\\s+${t}\\s*\\n+`), "")));
			setDirty(false);
			setMode("file");
			setSelection({
				mountId: mount.id,
				relPath
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to read file");
		} finally {
			setLoading(false);
		}
	}, [mount, setSelection]);
	(0, import_react.useEffect)(() => {
		if (!mount) return;
		if (selection?.relPath && selection.relPath.toLowerCase().endsWith(".md")) loadFile(selection.relPath);
		else loadDir(selection?.relPath && !selection.relPath.endsWith(".md") ? selection.relPath : "");
	}, [mount?.id]);
	const save = async () => {
		if (!mount || !selection?.relPath) return;
		setSaving(true);
		setError(null);
		try {
			const md = pageToMarkdownFile({
				id: "x",
				title,
				icon: "📝",
				cover: null,
				parentId: null,
				favorite: false,
				createdAt: 0,
				updatedAt: 0,
				blocks
			});
			if (mount.kind === "server" && mount.serverPath) await writeServerMountFile({ data: {
				root: mount.serverPath,
				relPath: selection.relPath,
				content: md
			} });
			else {
				const handle = await loadDirectoryHandle(mount.id);
				if (!handle) throw new Error("Local folder permission lost");
				await writeBrowserFile(handle, selection.relPath, md);
			}
			setContent(md);
			setDirty(false);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Save failed");
		} finally {
			setSaving(false);
		}
	};
	if (!mount || !selection) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-8 opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: "Select a linked markdown file from the sidebar."
		})]
	});
	const crumbs = (mode === "file" ? selection.relPath : dirPath).split("/").filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl px-4 pb-32 pt-6 sm:px-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 font-medium text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3" }), " Linked · not imported"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "hover:text-foreground",
						onClick: () => void loadDir(""),
						children: mount.name
					}),
					crumbs.map((c, i) => {
						const path = crumbs.slice(0, i + 1).join("/");
						const isLast = i === crumbs.length - 1 && mode === "file";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }), isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: c
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "hover:text-foreground",
								onClick: () => {
									if (c.toLowerCase().endsWith(".md")) loadFile(path);
									else loadDir(path);
								},
								children: c
							})]
						}, path);
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive",
				children: error
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 py-12 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Loading…"]
			}) : mode === "browse" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [
					dirPath && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted",
						onClick: () => {
							const parent = dirPath.split("/").slice(0, -1).join("/");
							loadDir(parent);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-4 text-muted-foreground" }), ".."]
					}),
					entries.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "No markdown files here"
					}),
					entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted",
						onClick: () => {
							if (e.kind === "dir") loadDir(e.relPath);
							else loadFile(e.relPath);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.kind === "dir" ? "📁" : "📝" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: e.name
						})]
					}, e.relPath))
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight outline-none",
						value: title,
						onChange: (e) => {
							setTitle(e.target.value);
							setDirty(true);
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						disabled: !dirty || saving,
						onClick: () => void save(),
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-3.5" }), "Save to disk"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative space-y-0.5 pl-2",
					children: [blocks.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "w-full resize-y rounded-md border border-transparent bg-transparent px-1 py-1 text-base leading-relaxed outline-none hover:border-border focus:border-border focus:bg-background",
							rows: Math.max(1, block.content.split("\n").length),
							value: block.content,
							onChange: (e) => {
								const next = blocks.map((b) => b.id === block.id ? {
									...b,
									content: e.target.value
								} : b);
								setBlocks(next);
								setDirty(true);
							},
							placeholder: block.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-1 text-[10px] uppercase tracking-wide text-muted-foreground",
							children: block.type
						})]
					}, block.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "ghost",
						className: "mt-2",
						onClick: () => {
							setBlocks([...blocks, {
								id: uid("b"),
								type: "paragraph",
								content: "",
								indent: 0
							}]);
							setDirty(true);
						},
						children: "Add block"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-8 text-xs text-muted-foreground",
					children: [
						"Edits write back to the linked file. This page is ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "not" }),
						" stored in your workspace until you Import."
					]
				})
			] })
		]
	});
}
function validateSnapshot(input) {
	const data = input;
	if (!data || typeof data !== "object") throw new Error("Invalid workspace snapshot");
	if (typeof data.name !== "string") throw new Error("Invalid name");
	if (data.theme !== "light" && data.theme !== "dark") throw new Error("Invalid theme");
	if (!Array.isArray(data.pages)) throw new Error("Invalid pages");
	return {
		name: data.name.slice(0, 120),
		theme: data.theme,
		activePageId: data.activePageId ?? null,
		sidebarOpen: Boolean(data.sidebarOpen),
		pages: data.pages.map((p) => ({
			id: String(p.id),
			title: String(p.title ?? "").slice(0, 500),
			icon: String(p.icon ?? "📄").slice(0, 16),
			cover: p.cover ?? null,
			parentId: p.parentId ?? null,
			favorite: Boolean(p.favorite),
			archived: Boolean(p.archived),
			createdAt: Number(p.createdAt) || Date.now(),
			updatedAt: Number(p.updatedAt) || Date.now(),
			blocks: Array.isArray(p.blocks) ? p.blocks : []
		}))
	};
}
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e3fb77d67dfdadad5d019581d79338a7f7cf2e42797c44110574e289b39fd293"));
var saveWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => validateSnapshot(input)).handler(createSsrRpc("7bd9976b9723bbefb2399d41723684e8ed7d3bfcf4f814066bb422e47b4bb658"));
var saveTimer = null;
var saving = false;
var pending = false;
var remoteMode = false;
var bootstrapped = false;
var unsub = null;
function snapshotFromStore() {
	const s = useWorkspace.getState();
	return {
		name: s.name,
		theme: s.theme,
		activePageId: s.activePageId,
		sidebarOpen: s.sidebarOpen,
		pages: s.pages
	};
}
function attachAutosave() {
	unsub?.();
	unsub = useWorkspace.subscribe((state, prev) => {
		if (!remoteMode || !bootstrapped) return;
		if (state.name === prev.name && state.theme === prev.theme && state.activePageId === prev.activePageId && state.sidebarOpen === prev.sidebarOpen && state.pages === prev.pages) return;
		scheduleRemoteSave();
	});
}
/** Load workspace from Postgres for the signed-in user (or seed on first visit). */
async function bootstrapRemoteWorkspace() {
	try {
		const data = await loadWorkspace();
		bootstrapped = false;
		useWorkspace.setState({
			name: data.name,
			theme: data.theme,
			activePageId: data.activePageId,
			sidebarOpen: data.sidebarOpen,
			pages: data.pages,
			hydrated: true,
			syncStatus: "saved",
			storageMode: "database"
		});
		remoteMode = true;
		bootstrapped = true;
		attachAutosave();
		return data.source;
	} catch {
		remoteMode = false;
		bootstrapped = false;
		unsub?.();
		unsub = null;
		useWorkspace.setState({
			storageMode: "local",
			syncStatus: "local",
			hydrated: true
		});
		return "error";
	}
}
function scheduleRemoteSave() {
	if (!remoteMode || !bootstrapped) return;
	useWorkspace.setState({ syncStatus: "pending" });
	if (saveTimer) clearTimeout(saveTimer);
	saveTimer = setTimeout(() => {
		flushRemoteSave();
	}, 600);
}
async function flushRemoteSave() {
	if (!remoteMode) return;
	if (saving) {
		pending = true;
		return;
	}
	saving = true;
	useWorkspace.setState({ syncStatus: "saving" });
	try {
		await saveWorkspace({ data: snapshotFromStore() });
		useWorkspace.setState({ syncStatus: "saved" });
	} catch {
		useWorkspace.setState({ syncStatus: "error" });
	} finally {
		saving = false;
		if (pending) {
			pending = false;
			scheduleRemoteSave();
		}
	}
}
/** Immediate save (e.g. before unload). */
async function flushRemoteSaveNow() {
	if (saveTimer) {
		clearTimeout(saveTimer);
		saveTimer = null;
	}
	if (!remoteMode) return;
	try {
		await saveWorkspace({ data: snapshotFromStore() });
		useWorkspace.setState({ syncStatus: "saved" });
	} catch {
		useWorkspace.setState({ syncStatus: "error" });
	}
}
function useLocalOnlyMode() {
	remoteMode = false;
	bootstrapped = false;
	unsub?.();
	unsub = null;
	useWorkspace.setState({
		storageMode: "local",
		syncStatus: "local",
		hydrated: true
	});
}
function AppShell() {
	const pages = useWorkspace((s) => s.pages);
	const activePageId = useWorkspace((s) => s.activePageId);
	const sidebarOpen = useWorkspace((s) => s.sidebarOpen);
	const theme = useWorkspace((s) => s.theme);
	const hydrated = useWorkspace((s) => s.hydrated);
	const storageMode = useWorkspace((s) => s.storageMode);
	const syncStatus = useWorkspace((s) => s.syncStatus);
	const setSidebarOpen = useWorkspace((s) => s.setSidebarOpen);
	const toggleSidebar = useWorkspace((s) => s.toggleSidebar);
	const setActivePage = useWorkspace((s) => s.setActivePage);
	const setTheme = useWorkspace((s) => s.setTheme);
	const updatePage = useWorkspace((s) => s.updatePage);
	const createPage = useWorkspace((s) => s.createPage);
	const setHydrated = useWorkspace((s) => s.setHydrated);
	const mountSelection = useMarkdownMounts((s) => s.selection);
	const mounts = useMarkdownMounts((s) => s.mounts);
	const setMountSelection = useMarkdownMounts((s) => s.setSelection);
	const mount = mounts.find((m) => m.id === mountSelection?.mountId);
	const { user, isPending: authPending } = useCurrentUserState();
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [mobileSidebar, setMobileSidebar] = (0, import_react.useState)(false);
	const [remoteLoading, setRemoteLoading] = (0, import_react.useState)(false);
	const [ioOpen, setIoOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const unsub = useWorkspace.persist.onFinishHydration(() => {
			if (!user) setHydrated(true);
		});
		if (useWorkspace.persist.hasHydrated() && !user) setHydrated(true);
		return unsub;
	}, [setHydrated, user]);
	(0, import_react.useEffect)(() => {
		if (authPending) return;
		let cancelled = false;
		async function run() {
			if (user) {
				setRemoteLoading(true);
				await bootstrapRemoteWorkspace();
				if (!cancelled) setRemoteLoading(false);
			} else {
				useLocalOnlyMode();
				if (useWorkspace.persist.hasHydrated()) setHydrated(true);
			}
		}
		run();
		return () => {
			cancelled = true;
		};
	}, [
		user,
		authPending,
		setHydrated
	]);
	(0, import_react.useEffect)(() => {
		const onHide = () => {
			if (storageMode === "database") flushRemoteSaveNow();
		};
		window.addEventListener("pagehide", onHide);
		return () => window.removeEventListener("pagehide", onHide);
	}, [storageMode]);
	(0, import_react.useEffect)(() => {
		const clear = () => setMountSelection(null);
		window.addEventListener("workspace:clear-mount", clear);
		return () => window.removeEventListener("workspace:clear-mount", clear);
	}, [setMountSelection]);
	const showMount = Boolean(mountSelection && mount);
	const page = !showMount ? pages.find((p) => p.id === activePageId && !p.archived) : void 0;
	const breadcrumbs = (() => {
		if (!page) return [];
		const chain = [];
		let cur = page;
		const byId = new Map(pages.map((p) => [p.id, p]));
		while (cur) {
			chain.unshift(cur);
			cur = cur.parentId ? byId.get(cur.parentId) : void 0;
		}
		return chain;
	})();
	if (!hydrated || authPending || remoteLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh items-center justify-center bg-background text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-pulse rounded-lg bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: remoteLoading ? "Loading workspace from database…" : "Loading workspace…"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 300,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-dvh overflow-hidden bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("hidden h-full shrink-0 transition-[width,opacity] duration-200 md:block", sidebarOpen ? "w-[260px] opacity-100" : "w-0 overflow-hidden opacity-0"),
					children: sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { onOpenSearch: () => setSearchOpen(true) })
				}),
				mobileSidebar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-0 z-50 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-black/40",
						onClick: () => setMobileSidebar(false),
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 left-0 w-[min(280px,88vw)] shadow-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
							mobile: true,
							onOpenSearch: () => {
								setMobileSidebar(false);
								setSearchOpen(true);
							},
							onNavigate: () => setMobileSidebar(false)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex h-11 shrink-0 items-center gap-1 border-b border-border px-2 sm:px-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon-sm",
								className: "md:hidden",
								onClick: () => setMobileSidebar(true),
								"aria-label": "Open sidebar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}),
							!sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon-sm",
								className: "hidden md:inline-flex",
								onClick: toggleSidebar,
								"aria-label": "Open sidebar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden text-sm",
								children: [showMount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 px-1.5 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate font-medium text-foreground",
										children: [mount?.name, mountSelection?.relPath ? ` / ${mountSelection.relPath}` : ""]
									})]
								}) : breadcrumbs.map((crumb, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex min-w-0 items-center gap-0.5",
									children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: cn("max-w-[140px] truncate rounded px-1.5 py-0.5 transition-colors hover:bg-muted sm:max-w-[200px]", i === breadcrumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"),
										onClick: () => setActivePage(crumb.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mr-1",
											children: crumb.icon
										}), crumb.title || "Untitled"]
									})]
								}, crumb.id)), !page && !showMount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1.5 text-muted-foreground",
									children: "No page selected"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyncChip, {
								mode: storageMode,
								status: syncStatus
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon-sm",
								onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
								"aria-label": theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4 text-muted-foreground" })
							}),
							(page || showMount) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon-sm",
								title: "Import / export markdown",
								onClick: () => setIoOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4 text-muted-foreground" })
							}),
							page && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon-sm",
								onClick: () => updatePage(page.id, { favorite: !page.favorite }),
								"aria-label": page.favorite ? "Unfavorite" : "Favorite",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", page.favorite ? "fill-amber-400 text-amber-500" : "text-muted-foreground") })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-1 hidden items-center gap-2 sm:flex",
								children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										children: "Sign in to sync"
									})
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-h-0 flex-1 overflow-y-auto",
						children: showMount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MountedMarkdownView, {}, `${mountSelection.mountId}:${mountSelection.relPath}`) : page ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageEditor, { page }, page.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyWorkspace, {
							onCreate: () => createPage(),
							onOpenSidebar: () => {
								setSidebarOpen(true);
								setMobileSidebar(true);
							}
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {
					open: searchOpen,
					onOpenChange: setSearchOpen
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownIODialog, {
					open: ioOpen,
					onOpenChange: setIoOpen
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "bottom-right",
					theme,
					toastOptions: { className: "border border-border bg-background text-foreground" }
				})
			]
		})
	});
}
function SyncChip({ mode, status }) {
	if (mode === "local") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "hidden items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground sm:inline-flex",
		title: "Guest mode — data stays in this browser",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "size-3" }), "Local only"]
	});
	const label = status === "saving" || status === "pending" ? "Saving…" : status === "error" ? "Sync error" : "Saved to DB";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("hidden items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] sm:inline-flex", status === "error" ? "text-destructive" : "text-muted-foreground"),
		title: "Signed in — workspace syncs to Postgres",
		children: [status === "saving" || status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-3" }), label]
	});
}
function EmptyWorkspace({ onCreate, onOpenSidebar }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center gap-4 p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-medium",
				children: "No page open"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: "Create a page, open one from the sidebar, or link a markdown folder without importing."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: onCreate,
					children: "New page"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: onOpenSidebar,
					children: "Open sidebar"
				})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
