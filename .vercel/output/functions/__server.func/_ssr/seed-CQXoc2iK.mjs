import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seed-CQXoc2iK.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
function blocks(...items) {
	return items.map((item) => ({
		id: uid("b"),
		type: item.type,
		content: item.content ?? "",
		checked: item.checked,
		collapsed: item.collapsed,
		indent: item.indent ?? 0,
		showSource: item.showSource,
		aiOutput: item.aiOutput
	}));
}
function createEmptyPage(partial) {
	const now = Date.now();
	return {
		id: uid("page"),
		title: "",
		icon: "📄",
		cover: null,
		parentId: null,
		favorite: false,
		createdAt: now,
		updatedAt: now,
		blocks: blocks({
			type: "paragraph",
			content: ""
		}),
		archived: false,
		...partial
	};
}
function seedWorkspace() {
	const gettingStarted = createEmptyPage({
		title: "Getting Started",
		icon: "🚀",
		cover: "warm",
		favorite: true,
		blocks: blocks({
			type: "paragraph",
			content: "Welcome to ForgeNotes — notes, AI assist, Mermaid diagrams, and optional database sync."
		}, {
			type: "heading1",
			content: "What you can do"
		}, {
			type: "bullet",
			content: "Create pages from the sidebar"
		}, {
			type: "bullet",
			content: "Type / for block types — try AI and Mermaid"
		}, {
			type: "bullet",
			content: "Hover a block → ⋮⋮ menu → Edit with AI"
		}, {
			type: "bullet",
			content: "Sign in to sync pages to the database"
		}, {
			type: "bullet",
			content: "Search with ⌘K / Ctrl+K"
		}, {
			type: "heading2",
			content: "Try AI"
		}, {
			type: "ai",
			content: "Summarize this page as three bullets for a new teammate"
		}, {
			type: "heading2",
			content: "Mermaid"
		}, {
			type: "mermaid",
			content: `flowchart LR
  Write[Write notes] --> AI[AI block]
  AI --> Diagram[Mermaid]
  Diagram --> Ship[Ship]`,
			showSource: false
		}, {
			type: "heading2",
			content: "Basics"
		}, {
			type: "todo",
			content: "Rename this page title",
			checked: false
		}, {
			type: "todo",
			content: "Run the AI block above",
			checked: false
		}, {
			type: "todo",
			content: "Toggle Mermaid source / preview",
			checked: true
		}, {
			type: "callout",
			content: "Tip: slash /ai or /mermaid. AI uses Grok when XAI_API_KEY is set; otherwise a local demo mode."
		}, {
			type: "quote",
			content: "Write first. Organize later."
		}, {
			type: "code",
			content: `function hello() {\n  console.log("hello workspace");\n}`
		}, {
			type: "divider",
			content: ""
		}, {
			type: "paragraph",
			content: "This starter page is yours — edit freely or start a blank page."
		})
	});
	const productSpec = createEmptyPage({
		title: "Product Spec",
		icon: "📋",
		parentId: gettingStarted.id,
		blocks: blocks({
			type: "heading1",
			content: "Overview"
		}, {
			type: "paragraph",
			content: "A lightweight personal knowledge base with nested pages, AI, and diagrams."
		}, {
			type: "heading2",
			content: "Goals"
		}, {
			type: "numbered",
			content: "Capture ideas without friction"
		}, {
			type: "numbered",
			content: "Structure docs with nested pages"
		}, {
			type: "numbered",
			content: "Use AI for summaries and checklists"
		}, {
			type: "heading2",
			content: "Non-goals"
		}, {
			type: "bullet",
			content: "Real-time multiplayer (for now)"
		}, {
			type: "bullet",
			content: "Full offline multi-device without sign-in"
		}, {
			type: "mermaid",
			content: `sequenceDiagram
  participant U as User
  participant A as App
  participant D as Database
  U->>A: Edit page
  A->>D: Save (when signed in)`,
			showSource: false
		})
	});
	const weeklyNotes = createEmptyPage({
		title: "Weekly Notes",
		icon: "📅",
		favorite: true,
		cover: "cool",
		blocks: blocks({
			type: "heading1",
			content: "This week"
		}, {
			type: "todo",
			content: "Ship the block editor",
			checked: true
		}, {
			type: "todo",
			content: "Add AI + Mermaid",
			checked: true
		}, {
			type: "todo",
			content: "Write release notes",
			checked: false
		}, {
			type: "heading2",
			content: "Notes"
		}, {
			type: "paragraph",
			content: "Keep daily fragments here. Promote anything durable into its own page."
		}, {
			type: "ai",
			content: "Turn the todos and notes above into a short status update for stakeholders"
		}, {
			type: "callout",
			content: "Use favorites for the 2–3 pages you open every day."
		})
	});
	return {
		pages: [
			gettingStarted,
			productSpec,
			weeklyNotes,
			createEmptyPage({
				title: "Reading List",
				icon: "📚",
				blocks: blocks({
					type: "heading2",
					content: "Queue"
				}, {
					type: "todo",
					content: "Atomic Habits — James Clear",
					checked: false
				}, {
					type: "todo",
					content: "The Design of Everyday Things",
					checked: false
				}, {
					type: "todo",
					content: "Staff Engineer — Will Larson",
					checked: true
				}, {
					type: "heading2",
					content: "Quotes"
				}, {
					type: "quote",
					content: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."
				})
			}),
			createEmptyPage({
				title: "Meeting Notes",
				icon: "🗒",
				parentId: weeklyNotes.id,
				blocks: blocks({
					type: "heading1",
					content: "Kickoff"
				}, {
					type: "paragraph",
					content: "Attendees: design, eng, product"
				}, {
					type: "bullet",
					content: "Align on v1 scope"
				}, {
					type: "bullet",
					content: "Decide on editor primitives"
				}, {
					type: "bullet",
					content: "Ship a polished demo"
				}, {
					type: "divider",
					content: ""
				}, {
					type: "heading3",
					content: "Action items"
				}, {
					type: "todo",
					content: "Draft IA for sidebar",
					checked: true
				}, {
					type: "todo",
					content: "Prototype slash menu",
					checked: true
				}, {
					type: "todo",
					content: "Add AI edit-with-block",
					checked: true
				})
			})
		],
		activePageId: gettingStarted.id
	};
}
var PAGE_ICONS = [
	"📄",
	"📝",
	"📋",
	"📚",
	"💡",
	"🎯",
	"🚀",
	"⭐",
	"🏠",
	"📁",
	"🗂",
	"📅",
	"✅",
	"🔧",
	"🎨",
	"🧠",
	"🌱",
	"🔥",
	"☕",
	"🗒",
	"📦",
	"🧭",
	"🛠",
	"💬",
	"📊",
	"🔍",
	"✨",
	"🏷",
	"📎",
	"🛡"
];
var COVER_PRESETS = {
	warm: {
		label: "Warm",
		className: "bg-gradient-to-br from-stone-200 via-amber-100/80 to-orange-100/60"
	},
	cool: {
		label: "Cool",
		className: "bg-gradient-to-br from-slate-200 via-sky-100/70 to-stone-100"
	},
	soft: {
		label: "Soft",
		className: "bg-gradient-to-br from-zinc-200 via-neutral-100 to-stone-50"
	},
	ink: {
		label: "Ink",
		className: "bg-gradient-to-br from-zinc-800 via-stone-700 to-neutral-800"
	}
};
//#endregion
export { seedWorkspace as a, createEmptyPage as i, PAGE_ICONS as n, uid as o, cn as r, COVER_PRESETS as t };
