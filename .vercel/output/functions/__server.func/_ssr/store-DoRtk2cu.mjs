import { a as seedWorkspace, i as createEmptyPage, o as uid } from "./seed-CQXoc2iK.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DoRtk2cu.js
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
function cloneBlocks(blocks) {
	return blocks.map((b) => ({
		...b,
		id: uid("b")
	}));
}
var seeded = seedWorkspace();
var useWorkspace = create()(persist((set, get) => ({
	name: "ForgeNotes",
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
	setStorageMode: (mode) => set({ storageMode: mode }),
	setSyncStatus: (status) => set({ syncStatus: status }),
	loadFromRemote: (data) => set({
		name: data.name,
		pages: data.pages,
		activePageId: data.activePageId,
		sidebarOpen: data.sidebarOpen,
		theme: data.theme,
		storageMode: "database",
		syncStatus: "saved",
		hydrated: true
	}),
	getPage: (id) => get().pages.find((p) => p.id === id),
	getChildren: (parentId) => get().pages.filter((p) => !p.archived && p.parentId === parentId).sort((a, b) => a.createdAt - b.createdAt),
	createPage: (opts) => {
		const page = createEmptyPage({
			parentId: opts?.parentId ?? null,
			title: opts?.title ?? "",
			icon: opts?.icon
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
				archived: true,
				favorite: false
			}) : p);
			let activePageId = s.activePageId;
			if (activePageId && ids.has(activePageId)) activePageId = pages.find((p) => !p.archived && !ids.has(p.id))?.id ?? null;
			return {
				pages,
				activePageId
			};
		});
	},
	restorePage: (id) => set((s) => ({ pages: s.pages.map((p) => p.id === id ? touch({
		...p,
		archived: false,
		parentId: null
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
		const src = get().pages.find((p) => p.id === id);
		if (!src) return null;
		const copy = createEmptyPage({
			title: src.title ? `${src.title} (copy)` : "Untitled (copy)",
			icon: src.icon,
			cover: src.cover,
			parentId: src.parentId,
			favorite: false,
			blocks: cloneBlocks(src.blocks)
		});
		set((s) => ({
			pages: [...s.pages, copy],
			activePageId: copy.id
		}));
		return copy.id;
	},
	movePage: (id, parentId) => {
		if (id === parentId) return;
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
			indent: 0
		};
		set((s) => ({ pages: s.pages.map((p) => {
			if (p.id !== pageId) return p;
			const blocks = [...p.blocks];
			if (!afterId) blocks.unshift(block);
			else {
				const idx = blocks.findIndex((b) => b.id === afterId);
				if (idx >= 0) blocks.splice(idx + 1, 0, block);
				else blocks.push(block);
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
		let blocks = p.blocks.filter((b) => b.id !== blockId);
		if (blocks.length === 0) blocks = [{
			id: uid("b"),
			type: "paragraph",
			content: "",
			indent: 0
		}];
		return touch({
			...p,
			blocks
		});
	}) })),
	changeBlockType: (pageId, blockId, type) => set((s) => ({ pages: s.pages.map((p) => {
		if (p.id !== pageId) return p;
		return touch({
			...p,
			blocks: p.blocks.map((b) => b.id === blockId ? {
				...b,
				type,
				checked: type === "todo" ? b.checked ?? false : void 0
			} : b)
		});
	}) })),
	moveBlock: (pageId, blockId, direction) => set((s) => ({ pages: s.pages.map((p) => {
		if (p.id !== pageId) return p;
		const blocks = [...p.blocks];
		const idx = blocks.findIndex((b) => b.id === blockId);
		if (idx < 0) return p;
		const swap = direction === "up" ? idx - 1 : idx + 1;
		if (swap < 0 || swap >= blocks.length) return p;
		const tmp = blocks[idx];
		blocks[idx] = blocks[swap];
		blocks[swap] = tmp;
		return touch({
			...p,
			blocks
		});
	}) })),
	importPages: (pages, activateId) => set((s) => ({
		pages: [...s.pages, ...pages],
		activePageId: activateId ?? pages[0]?.id ?? s.activePageId
	})),
	resetWorkspace: () => {
		const next = seedWorkspace();
		set({
			name: "ForgeNotes",
			pages: next.pages,
			activePageId: next.activePageId,
			sidebarOpen: true,
			theme: "light",
			storageMode: "local",
			syncStatus: "local"
		});
	}
}), {
	name: "workspace-v1",
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
//#endregion
export { useWorkspace as t };
