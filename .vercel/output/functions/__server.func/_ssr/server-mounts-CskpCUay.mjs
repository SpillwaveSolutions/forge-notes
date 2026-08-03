import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/server-mounts-CskpCUay.js
/** Only allow reading/writing under these roots (safety). */
var ALLOWED_ROOTS = [
	path.resolve("/workspace/markdown-samples"),
	path.resolve("/workspace/markdown-mounts"),
	path.resolve("/workspace")
];
function resolveSafe(userPath) {
	const resolved = path.resolve(userPath);
	if (!ALLOWED_ROOTS.some((root) => resolved === root || resolved.startsWith(root + path.sep))) throw new Error("Path not allowed. Use a folder under /workspace (e.g. /workspace/markdown-samples).");
	return resolved;
}
var listServerMount_createServerFn_handler = createServerRpc({
	id: "e157ab9abea20eda7cb1dfe0993f10e014c05e1948b91dad507e96d5387ed401",
	name: "listServerMount",
	filename: "src/lib/markdown/server-mounts.ts"
}, (opts) => listServerMount.__executeServer(opts));
var listServerMount = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.root || typeof d.root !== "string") throw new Error("root required");
	return {
		root: d.root.slice(0, 500),
		relPath: typeof d.relPath === "string" ? d.relPath.slice(0, 500) : ""
	};
}).handler(listServerMount_createServerFn_handler, async ({ data }) => {
	const root = resolveSafe(data.root);
	const resolvedDir = resolveSafe(data.relPath ? path.join(root, data.relPath) : root);
	if (!(await stat(resolvedDir)).isDirectory()) throw new Error("Not a directory");
	const names = await readdir(resolvedDir);
	const entries = [];
	for (const name of names) {
		if (name.startsWith(".")) continue;
		const s = await stat(path.join(resolvedDir, name));
		const relPath = data.relPath ? `${data.relPath}/${name}` : name;
		if (s.isDirectory()) entries.push({
			name,
			relPath,
			kind: "dir"
		});
		else if (name.toLowerCase().endsWith(".md")) entries.push({
			name,
			relPath,
			kind: "file"
		});
	}
	return entries.sort((a, b) => {
		if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
});
var readServerMountFile_createServerFn_handler = createServerRpc({
	id: "c3a114c6a1c5b50dbdfd57a20fe11e1478b2807ee716176eb560a65a27d27cdc",
	name: "readServerMountFile",
	filename: "src/lib/markdown/server-mounts.ts"
}, (opts) => readServerMountFile.__executeServer(opts));
var readServerMountFile = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.root || !d?.relPath) throw new Error("root and relPath required");
	return {
		root: d.root.slice(0, 500),
		relPath: d.relPath.slice(0, 500)
	};
}).handler(readServerMountFile_createServerFn_handler, async ({ data }) => {
	const root = resolveSafe(data.root);
	const full = resolveSafe(path.join(root, data.relPath));
	if (!full.toLowerCase().endsWith(".md")) throw new Error("Only .md files");
	return {
		content: await readFile(full, "utf8"),
		absPath: full
	};
});
var writeServerMountFile_createServerFn_handler = createServerRpc({
	id: "0cc4b6b2ef3fcd2c2324866a03056ffdffdb4bfdfdb4862fc42fd41f6339f896",
	name: "writeServerMountFile",
	filename: "src/lib/markdown/server-mounts.ts"
}, (opts) => writeServerMountFile.__executeServer(opts));
var writeServerMountFile = createServerFn({ method: "POST" }).validator((input) => {
	const d = input;
	if (!d?.root || !d?.relPath || typeof d.content !== "string") throw new Error("root, relPath, content required");
	return {
		root: d.root.slice(0, 500),
		relPath: d.relPath.slice(0, 500),
		content: d.content.slice(0, 2e6)
	};
}).handler(writeServerMountFile_createServerFn_handler, async ({ data }) => {
	const root = resolveSafe(data.root);
	const full = resolveSafe(path.join(root, data.relPath));
	if (!full.toLowerCase().endsWith(".md")) throw new Error("Only .md files");
	await mkdir(path.dirname(full), { recursive: true });
	await writeFile(full, data.content, "utf8");
	return { ok: true };
});
var exportPagesToServerDir_createServerFn_handler = createServerRpc({
	id: "b62660f341ad0ae3ab4593f5ba2b4559082a2961290a3f1c4443f4cff98a92c1",
	name: "exportPagesToServerDir",
	filename: "src/lib/markdown/server-mounts.ts"
}, (opts) => exportPagesToServerDir.__executeServer(opts));
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
}).handler(exportPagesToServerDir_createServerFn_handler, async ({ data }) => {
	const base = resolveSafe(data.targetDir);
	await mkdir(base, { recursive: true });
	for (const f of data.files) {
		const full = resolveSafe(path.join(base, f.relPath));
		await mkdir(path.dirname(full), { recursive: true });
		await writeFile(full, f.content, "utf8");
	}
	return {
		ok: true,
		dir: base,
		count: data.files.length
	};
});
//#endregion
export { exportPagesToServerDir_createServerFn_handler, listServerMount_createServerFn_handler, readServerMountFile_createServerFn_handler, writeServerMountFile_createServerFn_handler };
