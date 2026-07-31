import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as createServerFn, o as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { i as signOut } from "./client-C9atugA7.mjs";
import { n as uid, t as cn } from "./utils-DkRSI2_g.mjs";
import { n as useCurrentUser, r as useCurrentUserState, t as Button } from "./use-current-user-Ct6wm9as.mjs";
import { a as seedWorkspace, i as createEmptyPage, n as PAGE_ICONS, r as authMiddleware, t as COVER_PRESETS } from "./seed-D7faJ9JV.mjs";
import { A as Heading3, B as Cloud, C as LogIn, D as ListTodo, E as ListTree, F as FilePlus, G as ArrowUp, H as ChevronRight, I as Eye, K as ArrowDown, L as Ellipsis, M as Heading1, N as GripVertical, O as ListOrdered, P as FileText, R as Copy, S as Menu, T as List, U as ChevronDown, V as CloudOff, W as Check, _ as PanelLeft, a as Trash2, b as Minus, c as Star, d as Settings, f as Search, g as Play, h as Plus, i as Type, j as Heading2, k as Image, l as SquareCheckBig, m as Quote, n as Workflow, o as Table2, p as RotateCcw, r as WandSparkles, s as Sun, t as X, u as Sparkles, v as PanelLeftClose, w as LoaderCircle, x as MessageSquare, y as Moon, z as CodeXml } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as DropdownMenuPortal, c as DropdownMenuSubContent$1, i as DropdownMenuLabel$1, l as DropdownMenuSubTrigger$1, n as DropdownMenuContent$1, o as DropdownMenuSeparator$1, r as DropdownMenuItem$1, s as DropdownMenuSub$1, t as DropdownMenu$1, u as DropdownMenuTrigger$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as TooltipProvider$1 } from "../_libs/radix-ui__react-tooltip.mjs";
import { a as ScrollAreaViewport, i as ScrollAreaThumb, n as ScrollAreaCorner, r as ScrollAreaScrollbar, t as ScrollArea$1 } from "../_libs/radix-ui__react-scroll-area.mjs";
import { i as PopoverTrigger$1, n as PopoverContent$1, r as PopoverPortal, t as Popover$1 } from "../_libs/radix-ui__react-popover.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cr5s3SSS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function touch(page) {
	return {
		...page,
		updatedAt: Date.now()
	};
}
function collectDescendants(pages, rootId) {
	const ids = /* @__PURE__ */ new Set([rootId]);
	let changed = true;
	while (changed) {
		changed = false;
		for (const p of pages) if (p.parentId && ids.has(p.parentId) && !ids.has(p.id)) {
			ids.add(p.id);
			changed = true;
		}
	}
	return ids;
}
var seeded = seedWorkspace();
var useWorkspace = create()(persist((set, get) => ({
	name: "Rick's Workspace",
	pages: seeded.pages,
	activePageId: seeded.activePageId,
	sidebarOpen: true,
	theme: "light",
	hydrated: false,
	storageMode: "local",
	syncStatus: "local",
	setHydrated: (v) => set({ hydrated: v }),
	setName: (name) => set({ name }),
	setSidebarOpen: (open) => set({ sidebarOpen: open }),
	toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
	setTheme: (theme) => set({ theme }),
	setActivePage: (id) => set({ activePageId: id }),
	getPage: (id) => get().pages.find((p) => p.id === id),
	getChildren: (parentId) => get().pages.filter((p) => !p.archived && p.parentId === parentId).sort((a, b) => a.createdAt - b.createdAt),
	createPage: (opts = {}) => {
		const page = createEmptyPage({
			parentId: opts.parentId ?? null,
			title: opts.title ?? "",
			icon: opts.icon ?? "📄"
		});
		set((s) => ({
			pages: [...s.pages, page],
			activePageId: page.id
		}));
		return page.id;
	},
	updatePage: (id, patch) => set((s) => ({ pages: s.pages.map((p) => p.id === id ? touch({
		...p,
		...patch
	}) : p) })),
	deletePage: (id) => {
		const ids = collectDescendants(get().pages, id);
		set((s) => {
			const pages = s.pages.map((p) => ids.has(p.id) ? touch({
				...p,
				archived: true
			}) : p);
			let activePageId = s.activePageId;
			if (activePageId && ids.has(activePageId)) activePageId = pages.find((p) => !p.archived)?.id ?? null;
			return {
				pages,
				activePageId
			};
		});
	},
	restorePage: (id) => set((s) => ({ pages: s.pages.map((p) => p.id === id ? touch({
		...p,
		archived: false
	}) : p) })),
	permanentlyDeletePage: (id) => {
		const ids = collectDescendants(get().pages, id);
		set((s) => {
			const pages = s.pages.filter((p) => !ids.has(p.id));
			let activePageId = s.activePageId;
			if (activePageId && ids.has(activePageId)) activePageId = pages.find((p) => !p.archived)?.id ?? null;
			return {
				pages,
				activePageId
			};
		});
	},
	duplicatePage: (id) => {
		const src = get().getPage(id);
		if (!src) return null;
		const copy = {
			...src,
			id: uid("page"),
			title: src.title ? `${src.title} (copy)` : "Untitled (copy)",
			createdAt: Date.now(),
			updatedAt: Date.now(),
			favorite: false,
			archived: false,
			blocks: src.blocks.map((b) => ({
				...b,
				id: uid("b")
			}))
		};
		set((s) => ({
			pages: [...s.pages, copy],
			activePageId: copy.id
		}));
		return copy.id;
	},
	movePage: (id, parentId) => {
		if (parentId === id) return;
		if (parentId) {
			if (collectDescendants(get().pages, id).has(parentId)) return;
		}
		set((s) => ({ pages: s.pages.map((p) => p.id === id ? touch({
			...p,
			parentId
		}) : p) }));
	},
	setBlocks: (pageId, blocks) => set((s) => ({ pages: s.pages.map((p) => p.id === pageId ? touch({
		...p,
		blocks
	}) : p) })),
	updateBlock: (pageId, blockId, patch) => set((s) => ({ pages: s.pages.map((p) => {
		if (p.id !== pageId) return p;
		return touch({
			...p,
			blocks: p.blocks.map((b) => b.id === blockId ? {
				...b,
				...patch
			} : b)
		});
	}) })),
	insertBlock: (pageId, afterId, type = "paragraph", content = "") => {
		const block = {
			id: uid("b"),
			type,
			content,
			indent: 0,
			checked: type === "todo" ? false : void 0
		};
		set((s) => ({ pages: s.pages.map((p) => {
			if (p.id !== pageId) return p;
			const blocks = [...p.blocks];
			if (!afterId) blocks.unshift(block);
			else {
				const idx = blocks.findIndex((b) => b.id === afterId);
				if (idx === -1) blocks.push(block);
				else blocks.splice(idx + 1, 0, block);
			}
			return touch({
				...p,
				blocks
			});
		}) }));
		return block.id;
	},
	deleteBlock: (pageId, blockId) => set((s) => ({ pages: s.pages.map((p) => {
		if (p.id !== pageId) return p;
		if (p.blocks.length <= 1) return touch({
			...p,
			blocks: [{
				id: uid("b"),
				type: "paragraph",
				content: "",
				indent: 0
			}]
		});
		return touch({
			...p,
			blocks: p.blocks.filter((b) => b.id !== blockId)
		});
	}) })),
	changeBlockType: (pageId, blockId, type) => set((s) => ({ pages: s.pages.map((p) => {
		if (p.id !== pageId) return p;
		return touch({
			...p,
			blocks: p.blocks.map((b) => b.id === blockId ? {
				...b,
				type,
				checked: type === "todo" ? b.checked ?? false : void 0,
				collapsed: type === "toggle" ? b.collapsed ?? false : void 0
			} : b)
		});
	}) })),
	moveBlock: (pageId, blockId, direction) => set((s) => ({ pages: s.pages.map((p) => {
		if (p.id !== pageId) return p;
		const blocks = [...p.blocks];
		const idx = blocks.findIndex((b) => b.id === blockId);
		if (idx < 0) return p;
		const target = direction === "up" ? idx - 1 : idx + 1;
		if (target < 0 || target >= blocks.length) return p;
		[blocks[idx], blocks[target]] = [blocks[target], blocks[idx]];
		return touch({
			...p,
			blocks
		});
	}) })),
	resetWorkspace: () => {
		const fresh = seedWorkspace();
		set({
			name: "Rick's Workspace",
			pages: fresh.pages,
			activePageId: fresh.activePageId,
			sidebarOpen: true,
			theme: "light"
		});
	}
}), {
	name: "notion-clone-workspace-v1",
	partialize: (s) => ({
		name: s.name,
		pages: s.pages,
		activePageId: s.activePageId,
		sidebarOpen: s.sidebarOpen,
		theme: s.theme
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated(true);
	}
}));
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
	const active = pages.filter((p) => !p.archived);
	const archived = pages.filter((p) => p.archived);
	const favorites = active.filter((p) => p.favorite);
	const childrenOf = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of active) {
			const key = p.parentId;
			const list = map.get(key) ?? [];
			list.push(p);
			map.set(key, list);
		}
		for (const [, list] of map) list.sort((a, b) => a.createdAt - b.createdAt);
		return map;
	}, [active]);
	const select = (id) => {
		setActivePage(id);
		onNavigate?.();
	};
	const toggleExpand = (id) => {
		setExpanded((e) => ({
			...e,
			[id]: !e[id]
		}));
	};
	const renderTree = (parentId, depth = 0) => {
		return (childrenOf.get(parentId) ?? []).map((page) => {
			const hasKids = (childrenOf.get(page.id) ?? []).length > 0;
			const isOpen = expanded[page.id] ?? depth < 1;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("group flex items-center gap-0.5 rounded-md pr-1 text-sm transition-colors", activePageId === page.id ? "bg-sidebar-active text-foreground" : "text-sidebar-fg hover:bg-sidebar-hover"),
				style: { paddingLeft: `${8 + depth * 12}px` },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/10", !hasKids && "opacity-0"),
						onClick: () => toggleExpand(page.id),
						"aria-label": isOpen ? "Collapse" : "Expand",
						tabIndex: hasKids ? 0 : -1,
						children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left",
						onClick: () => select(page.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-sm leading-none",
							children: page.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium",
							children: page.title || "Untitled"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-6 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10",
								"aria-label": "Page options",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-3.5 text-muted-foreground" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "start",
							className: "w-48",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => updatePage(page.id, { favorite: !page.favorite }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4" }), page.favorite ? "Remove favorite" : "Add to favorites"]
								}),
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5 shrink-0 text-muted-foreground" })
					]
				}), !mobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon-sm",
					className: "shrink-0 text-muted-foreground",
					onClick: toggleSidebar,
					"aria-label": "Close sidebar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5 px-2 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
					label: "Search",
					shortcut: "⌘K",
					onClick: onOpenSearch
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarAction, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlus, { className: "size-4" }),
					label: "New page",
					onClick: () => createPage()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea, {
				className: "flex-1 px-2",
				children: [favorites.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
						children: "Favorites"
					}), favorites.map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => select(page.id),
						className: cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors", activePageId === page.id ? "bg-sidebar-active text-foreground" : "text-sidebar-fg hover:bg-sidebar-hover"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm leading-none",
							children: page.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium",
							children: page.title || "Untitled"
						})]
					}, `fav-${page.id}`))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-2 py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
								children: "Private"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-sidebar-hover",
								onClick: () => createPage(),
								"aria-label": "New page",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
							})]
						}),
						renderTree(null),
						active.filter((p) => !p.parentId).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-2 py-2 text-xs text-muted-foreground",
							children: "No pages yet"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5 border-t border-sidebar-border p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground",
						children: storageMode === "database" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: syncStatus === "error" ? "Database sync error" : syncStatus === "saving" || syncStatus === "pending" ? "Saving to database…" : "Synced to database"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Local browser only"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-1 py-1",
						children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/login",
							className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-fg transition-colors hover:bg-sidebar-hover",
							onClick: onNavigate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4 text-muted-foreground" }), "Sign in to sync"]
						})
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
						children: [archived.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: "Trash is empty"
						}), archived.map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-lg border border-border px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: page.icon }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate text-sm font-medium",
									children: page.title || "Untitled"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "ghost",
									onClick: () => restorePage(page.id),
									children: "Restore"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "ghost",
									className: "text-destructive",
									onClick: () => permanentlyDeletePage(page.id),
									children: "Delete"
								})
							]
						}, page.id))]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: settingsOpen,
				onOpenChange: setSettingsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Workspace settings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: storageMode === "database" ? "Changes save to your database automatically." : "Guest data stays in this browser. Sign in to sync to the database." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: "Workspace name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
									value: name,
									onChange: (e) => setName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: "Appearance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: theme === "light" ? "secondary" : "outline",
										className: "flex-1",
										onClick: () => setTheme("light"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }), " Light"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: theme === "dark" ? "secondary" : "outline",
										className: "flex-1",
										onClick: () => setTheme("dark"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }), " Dark"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground",
									children: "Storage"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: storageMode === "database" ? "Postgres (Neon when deployed, embedded PGLite in this preview)." : "Browser localStorage only. Sign in to use the database."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								className: "w-full",
								onClick: () => {
									resetWorkspace();
									setSettingsOpen(false);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Reset demo content"]
							})
						]
					})]
				})
			})
		]
	});
}
function SidebarAction({ icon, label, shortcut, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-fg transition-colors hover:bg-sidebar-hover",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 text-left font-medium",
				children: label
			}),
			shortcut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-muted-foreground",
				children: shortcut
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
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
		pageText: typeof data.pageText === "string" ? data.pageText.slice(0, 2e4) : ""
	};
}
/** Local heuristic fallback so the preview is demoable without XAI_API_KEY. */
var runAi = createServerFn({ method: "POST" }).validator((input) => validateRequest(input)).handler(createSsrRpc("76d08ea8f0b0103fcaf7055c8b138a9579e4124d0d2f62a0686a1011273cd47a"));
createServerFn({ method: "GET" }).handler(createSsrRpc("5252add61246cf72a4fa382b4734734c4e8ea74302302ba378f1ecb54d53868d"));
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
function AiBlockPanel({ content, aiOutput, aiError, pageTitle, pageText, onChangePrompt, onResult }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [provider, setProvider] = (0, import_react.useState)(null);
	const execute = async (action, instruction) => {
		setLoading(true);
		try {
			const res = await runAi({ data: {
				action,
				instruction: instruction ?? content,
				pageTitle,
				pageText
			} });
			setProvider(res.provider === "xai" ? res.model ?? "Grok" : "Local demo AI");
			onResult({
				output: res.text || (res.blocks ? res.blocks.map((b) => `${b.type}: ${b.content}`).join("\n") : ""),
				blocks: res.blocks
			});
		} catch (e) {
			onResult({
				output: "",
				error: e instanceof Error ? e.message : "AI request failed"
			});
		} finally {
			setLoading(false);
		}
	};
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
					provider && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] font-normal text-muted-foreground",
						children: provider
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Uses the rest of this page as context. Inserts results below this block."
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: content,
				onChange: (e) => onChangePrompt(e.target.value),
				placeholder: "Custom instruction — e.g. Turn this into a launch checklist…",
				rows: 2,
				className: "w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					disabled: loading || !content.trim(),
					onClick: () => void execute("custom", content.trim()),
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Run custom"]
				}), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Thinking…"
				})]
			}),
			aiError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: aiError
			}),
			aiOutput && !aiError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground"),
				children: "Last run applied below this block."
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
function AiEditDialog({ open, onOpenChange, blockText, blockType, pageTitle, pageText, onApply }) {
	const [instruction, setInstruction] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [provider, setProvider] = (0, import_react.useState)(null);
	const run = async (instr) => {
		setLoading(true);
		setError(null);
		try {
			const res = await runAi({ data: {
				action: "edit_block",
				instruction: instr,
				blockText,
				blockType,
				pageTitle,
				pageText
			} });
			setPreview(res.text);
			setProvider(res.provider === "xai" ? res.model ?? "Grok" : "Local demo AI");
		} catch (e) {
			setError(e instanceof Error ? e.message : "AI request failed");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) {
				setPreview(null);
				setError(null);
				setInstruction("");
			}
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Edit block with AI"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"Rewrite this block. Uses Grok when ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "text-xs",
					children: "XAI_API_KEY"
				}),
				" is set; otherwise a local demo fallback."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 text-[11px] font-medium uppercase tracking-wide",
							children: "Original"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap text-foreground",
							children: blockText || "(empty)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							disabled: loading,
							onClick: () => void run(p.instruction),
							children: p.label
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "flex h-9 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
							placeholder: "Custom instruction…",
							value: instruction,
							onChange: (e) => setInstruction(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && instruction.trim()) run(instruction.trim());
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							disabled: loading || !instruction.trim(),
							onClick: () => void run(instruction.trim()),
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), "Run"]
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					preview != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-background px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Suggestion" }), provider && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "normal-case",
									children: provider
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("whitespace-pre-wrap text-foreground"),
								children: preview
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setPreview(null),
								children: "Discard"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => {
									onApply(preview);
									onOpenChange(false);
									setPreview(null);
									setInstruction("");
								},
								children: "Replace block"
							})]
						})]
					})
				]
			})]
		})
	});
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
	const setActivePage = useWorkspace((s) => s.setActivePage);
	const createPage = useWorkspace((s) => s.createPage);
	const [query, setQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) setQuery("");
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
	const activePages = (0, import_react.useMemo)(() => pages.filter((p) => !p.archived), [pages]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/40",
			onClick: () => onOpenChange(false),
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute left-1/2 top-[18%] w-[min(560px,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e, {
				className: "flex flex-col",
				label: "Search pages",
				shouldFilter: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border px-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
							value: query,
							onValueChange: setQuery,
							placeholder: "Search pages…",
							className: "h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
							autoFocus: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline",
							children: "ESC"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
					className: "max-h-80 overflow-y-auto p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: "No pages found"
						}),
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
							heading: "Pages",
							className: "mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground",
							children: activePages.map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
								value: `${page.title} ${page.icon} untitled`,
								onSelect: () => {
									setActivePage(page.id);
									onOpenChange(false);
								},
								className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base leading-none",
										children: page.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate font-medium",
										children: page.title || "Untitled"
									}),
									page.favorite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-amber-400 text-amber-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 text-muted-foreground" })
								]
							}, page.id))
						})
					]
				})]
			})
		})]
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
/** Load the signed-in user's workspace. Seeds demo content on first visit. */
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e3fb77d67dfdadad5d019581d79338a7f7cf2e42797c44110574e289b39fd293"));
/** Replace the signed-in user's full workspace snapshot (debounced from the client). */
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
	const updatePage = useWorkspace((s) => s.updatePage);
	const createPage = useWorkspace((s) => s.createPage);
	const setHydrated = useWorkspace((s) => s.setHydrated);
	const { user, isPending: authPending } = useCurrentUserState();
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [mobileSidebar, setMobileSidebar] = (0, import_react.useState)(false);
	const [remoteLoading, setRemoteLoading] = (0, import_react.useState)(false);
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
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
	}, [theme]);
	const page = pages.find((p) => p.id === activePageId && !p.archived);
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
					className: cn("hidden h-full shrink-0 transition-[width,opacity] duration-200 md:block", sidebarOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 overflow-hidden"),
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
								children: [breadcrumbs.map((crumb, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
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
								}, crumb.id)), !page && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1.5 text-muted-foreground",
									children: "No page selected"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyncChip, {
								mode: storageMode,
								status: syncStatus
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
						children: page ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageEditor, { page }, page.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyWorkspace, {
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
		className: "flex h-full flex-col items-center justify-center gap-4 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-14 items-center justify-center rounded-2xl border border-border bg-muted text-2xl",
				children: "📄"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "No pages yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm text-muted-foreground",
					children: "Create a page to start writing, or restore one from trash."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-center gap-2",
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
