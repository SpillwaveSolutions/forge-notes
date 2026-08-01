import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Cloud,
  CloudOff,
  FileDown,
  Link2,
  LogIn,
  Monitor,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Star,
  Sun,
  Terminal,
  Trash2,
  Unlink,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { authEnabled } from "@/lib/auth/client";
import { getAiStatus } from "@/lib/ai-server";
import { AiSetupWizard } from "@/components/ai/AiSetupWizard";
import { useAiSettings } from "@/lib/ai/settings-store";
import { BACKEND_META, PROVIDER_META } from "@/lib/ai/settings-types";
import { LinkFolderDialog } from "@/components/markdown/LinkFolderDialog";
import { MarkdownIODialog } from "@/components/markdown/MarkdownIODialog";
import {
  useMarkdownMounts,
  listBrowserDir,
  loadDirectoryHandle,
} from "@/lib/markdown/mounts-store";
import { listServerMount } from "@/lib/markdown/server-mounts";
import { HarnessPanel } from "@/components/harness/HarnessPanel";
import { getDesktopInfo, isTauri } from "@/lib/tauri";

interface SidebarProps {
  onOpenSearch: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

function SidebarAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-sidebar-fg transition-colors hover:bg-sidebar-hover"
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

export function Sidebar({ onOpenSearch, mobile, onNavigate }: SidebarProps) {
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

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [trashOpen, setTrashOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiWizardOpen, setAiWizardOpen] = useState(false);
  const [aiWizardStep, setAiWizardStep] = useState<
    "welcome" | "provider" | "credentials" | "mcp" | "skills" | "review"
  >("welcome");
  const aiSetup = useAiSettings();
  const [linkFolderOpen, setLinkFolderOpen] = useState(false);
  const [ioOpen, setIoOpen] = useState(false);
  const [harnessOpen, setHarnessOpen] = useState(false);
  const mounts = useMarkdownMounts((s) => s.mounts);
  const mountSelection = useMarkdownMounts((s) => s.selection);
  const setMountSelection = useMarkdownMounts((s) => s.setSelection);
  const removeMount = useMarkdownMounts((s) => s.removeMount);
  const [mountExpanded, setMountExpanded] = useState<Record<string, boolean>>({
    mount_sample: true,
  });
  const [mountChildren, setMountChildren] = useState<
    Record<string, Array<{ name: string; relPath: string; kind: "file" | "dir" }>>
  >({});
  const [desktopLabel, setDesktopLabel] = useState<string | null>(null);
  const [cliSummary, setCliSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!isTauri()) return;
    void getDesktopInfo().then((info) => {
      if (info?.isDesktop) {
        setDesktopLabel(info.platform ? `Desktop · ${info.platform}` : "Desktop app");
      }
    });
  }, []);

  useEffect(() => {
    void getAiStatus()
      .then((s) => {
        const clis = (s as { clis?: Array<{ label: string; available: boolean }> }).clis;
        if (clis?.length) {
          setCliSummary(
            clis.map((c) => `${c.label.split(" ")[0]} ${c.available ? "✓" : "·"}`).join(" · "),
          );
        }
      })
      .catch(() => setCliSummary(null));
  }, []);

  const goPage = useCallback(
    (id: string) => {
      setActivePage(id);
      setMountSelection(null);
      onNavigate?.();
    },
    [setActivePage, setMountSelection, onNavigate],
  );

  const favorites = useMemo(
    () => pages.filter((p) => !p.archived && p.favorite),
    [pages],
  );
  const trash = useMemo(() => pages.filter((p) => p.archived), [pages]);
  const roots = useMemo(
    () =>
      pages
        .filter((p) => !p.archived && !p.parentId)
        .sort((a, b) => a.createdAt - b.createdAt),
    [pages],
  );

  const childrenOf = useCallback(
    (parentId: string) =>
      pages
        .filter((p) => !p.archived && p.parentId === parentId)
        .sort((a, b) => a.createdAt - b.createdAt),
    [pages],
  );

  const loadMountKids = async (mountId: string) => {
    const m = mounts.find((x) => x.id === mountId);
    if (!m) return;
    try {
      if (m.kind === "server" && m.serverPath) {
        const res = await listServerMount({
          data: { root: m.serverPath, relPath: "" },
        });
        const entries = Array.isArray(res) ? res : [];
        setMountChildren((c) => ({
          ...c,
          [mountId]: entries.map((e) => ({
            name: e.name,
            relPath: e.relPath,
            kind: e.kind,
          })),
        }));
      } else if (m.kind === "browser") {
        const handle = await loadDirectoryHandle(mountId);
        if (!handle) {
          setMountChildren((c) => ({ ...c, [mountId]: [] }));
          return;
        }
        const entries = await listBrowserDir(handle, "");
        setMountChildren((c) => ({ ...c, [mountId]: entries }));
      }
    } catch {
      setMountChildren((c) => ({ ...c, [mountId]: [] }));
    }
  };

  const openMount = (mountId: string, relPath: string) => {
    setMountSelection({ mountId, relPath });
    setActivePage(null);
    onNavigate?.();
  };

  const renderTree = (parentId: string | null, depth: number): ReactNode => {
    const list = parentId === null ? roots : childrenOf(parentId);
    return list.map((page) => {
      const kids = childrenOf(page.id);
      const hasKids = kids.length > 0;
      const isOpen = expanded[page.id] ?? depth < 1;
      const active = activePageId === page.id && !mountSelection;
      return (
        <div key={page.id}>
          <div
            className={cn(
              "group flex items-center gap-0.5 rounded-md pr-1",
              active ? "bg-sidebar-active text-foreground" : "hover:bg-sidebar-hover",
            )}
            style={{ paddingLeft: 8 + depth * 12 }}
          >
            <button
              type="button"
              className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground"
              onClick={() => setExpanded((e) => ({ ...e, [page.id]: !isOpen }))}
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {hasKids ? (
                isOpen ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )
              ) : (
                <span className="size-3.5" />
              )}
            </button>
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-sm"
              onClick={() => goPage(page.id)}
            >
              <span className="shrink-0 text-sm">{page.icon || "📄"}</span>
              <span className="truncate">{page.title || "Untitled"}</span>
            </button>
            <div data-hover-reveal className="flex items-center opacity-0 group-hover:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex size-6 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label="Page menu"
                  >
                    <MoreHorizontal className="size-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem
                    onClick={() => updatePage(page.id, { favorite: !page.favorite })}
                  >
                    <Star className="size-4" />
                    {page.favorite ? "Unfavorite" : "Favorite"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      createPage({ parentId: page.id });
                      setExpanded((e) => ({ ...e, [page.id]: true }));
                    }}
                  >
                    <Plus className="size-4" /> Add sub-page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicatePage(page.id)}>
                    <Copy className="size-4" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => deletePage(page.id)}
                  >
                    <Trash2 className="size-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="New sub-page"
                onClick={() => {
                  createPage({ parentId: page.id });
                  setExpanded((e) => ({ ...e, [page.id]: true }));
                }}
              >
                <Plus className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          {hasKids && isOpen && renderTree(page.id, depth + 1)}
        </div>
      );
    });
  };

  const syncIcon =
    storageMode === "database" ? (
      syncStatus === "saving" || syncStatus === "pending" ? (
        <Cloud className="size-3.5 animate-pulse text-muted-foreground" />
      ) : syncStatus === "error" ? (
        <CloudOff className="size-3.5 text-destructive" />
      ) : (
        <Cloud className="size-3.5 text-emerald-600" />
      )
    ) : (
      <CloudOff className="size-3.5 text-muted-foreground" />
    );

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-fg",
        mobile ? "w-full" : "w-[260px] min-w-[260px]",
      )}
    >
      <div className="flex items-center gap-2 px-3 pb-1 pt-3">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sidebar-hover"
          onClick={() => setSettingsOpen(true)}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">
            {name.slice(0, 1).toUpperCase() || "W"}
          </span>
          <span className="truncate text-sm font-semibold text-foreground">{name}</span>
          {syncIcon}
        </button>
        {!mobile && (
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-hover"
            onClick={() => toggleSidebar()}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      {desktopLabel && (
        <div className="mx-3 mb-1 flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground">
          <Monitor className="size-3" />
          {desktopLabel}
        </div>
      )}

      <div className="space-y-0.5 px-2 py-1">
        <SidebarAction icon={<Search className="size-4" />} label="Search" onClick={onOpenSearch} />
        <SidebarAction
          icon={<Plus className="size-4" />}
          label="New page"
          onClick={() => {
            const id = createPage();
            goPage(id);
          }}
        />
        <SidebarAction
          icon={<FileDown className="size-4" />}
          label="Import / export"
          onClick={() => setIoOpen(true)}
        />
        <SidebarAction
          icon={<Link2 className="size-4" />}
          label="Link markdown"
          onClick={() => setLinkFolderOpen(true)}
        />
        <SidebarAction
          icon={<Terminal className="size-4" />}
          label="Agent harness"
          onClick={() => setHarnessOpen(true)}
        />
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2">
        {favorites.length > 0 && (
          <div className="mb-3">
            <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Favorites
            </div>
            {favorites.map((page) => (
              <button
                key={page.id}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                  activePageId === page.id && !mountSelection
                    ? "bg-sidebar-active text-foreground"
                    : "hover:bg-sidebar-hover",
                )}
                onClick={() => goPage(page.id)}
              >
                <span>{page.icon || "📄"}</span>
                <span className="truncate">{page.title || "Untitled"}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mb-3">
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Private
          </div>
          {renderTree(null, 0)}
          {roots.length === 0 && (
            <p className="px-2 py-2 text-xs text-muted-foreground">No pages yet</p>
          )}
        </div>

        <div className="mb-3">
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Linked markdown
          </div>
          {mounts.map((m) => {
            const open = mountExpanded[m.id] ?? false;
            const kids = mountChildren[m.id] ?? [];
            return (
              <div key={m.id} className="mb-0.5">
                <div className="group flex items-center gap-0.5 rounded-md pr-1 hover:bg-sidebar-hover">
                  <button
                    type="button"
                    className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground"
                    onClick={() => {
                      setMountExpanded((e) => ({ ...e, [m.id]: !open }));
                      if (!open) void loadMountKids(m.id);
                    }}
                  >
                    {open ? (
                      <ChevronDown className="size-3.5" />
                    ) : (
                      <ChevronRight className="size-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-sm"
                    onClick={() => {
                      setMountExpanded((e) => ({ ...e, [m.id]: true }));
                      void loadMountKids(m.id);
                      void openMount(m.id, "");
                    }}
                  >
                    <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">{m.name}</span>
                  </button>
                  <button
                    type="button"
                    data-hover-reveal
                    className="flex size-6 items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-black/5"
                    title="Unlink"
                    onClick={() => removeMount(m.id)}
                  >
                    <Unlink className="size-3 text-muted-foreground" />
                  </button>
                </div>
                {open &&
                  kids.map((k) => (
                    <button
                      key={k.relPath}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-left text-sm",
                        mountSelection?.mountId === m.id &&
                          mountSelection.relPath === k.relPath
                          ? "bg-sidebar-active text-foreground"
                          : "text-sidebar-fg hover:bg-sidebar-hover",
                      )}
                      onClick={() => void openMount(m.id, k.relPath)}
                    >
                      <span className="text-xs">{k.kind === "dir" ? "📁" : "📝"}</span>
                      <span className="truncate">{k.name}</span>
                    </button>
                  ))}
              </div>
            );
          })}
          <p className="px-2 py-1 text-[11px] text-muted-foreground">Link folder (no import)</p>
        </div>
      </ScrollArea>

      <div className="space-y-0.5 border-t border-sidebar-border px-2 py-2">
        {authEnabled && !user && (
          <Link
            to="/login"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-hover"
          >
            <LogIn className="size-4" />
            Sign in to sync
          </Link>
        )}
        {user && (
          <div className="px-1 py-1">
            <UserButton />
          </div>
        )}
        {!user && (
          <p className="px-2 py-0.5 text-[11px] text-muted-foreground">
            Local only · Sign in to sync
          </p>
        )}
        <SidebarAction
          icon={<Trash2 className="size-4" />}
          label="Trash"
          onClick={() => setTrashOpen(true)}
        />
        <SidebarAction
          icon={<Settings className="size-4" />}
          label="Settings"
          onClick={() => setSettingsOpen(true)}
        />
      </div>

      <Dialog open={trashOpen} onOpenChange={setTrashOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Trash</DialogTitle>
            <DialogDescription>
              Restored pages return to the top level of your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {trash.length === 0 && (
              <p className="text-sm text-muted-foreground">Trash is empty</p>
            )}
            {trash.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5"
              >
                <span>{p.icon || "📄"}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{p.title || "Untitled"}</span>
                <Button size="sm" variant="outline" onClick={() => restorePage(p.id)}>
                  Restore
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => permanentlyDeletePage(p.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Workspace preferences and AI</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {desktopLabel && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
                <Monitor className="size-3.5" />
                Running as {desktopLabel}
                <span className="text-muted-foreground">· Tauri standalone</span>
              </div>
            )}
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">Workspace name</span>
              <input
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="size-3.5" /> Light
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="size-3.5" /> Dark
                </Button>
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 font-medium">
                <Sparkles className="size-4" /> AI
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Backend: {BACKEND_META[aiSetup.backend]?.label ?? aiSetup.backend}
                {!BACKEND_META[aiSetup.backend]?.isCli && (
                  <>
                    {" "}
                    · {PROVIDER_META[aiSetup.provider]?.label} · {aiSetup.model}
                  </>
                )}
              </p>
              {cliSummary && (
                <p className="mt-1 text-[11px] text-muted-foreground">CLIs: {cliSummary}</p>
              )}
              <Button
                type="button"
                size="sm"
                className="mt-2"
                variant="secondary"
                onClick={() => {
                  setAiWizardStep("provider");
                  setAiWizardOpen(true);
                }}
              >
                Configure AI
              </Button>
            </div>
            <div className="rounded-lg border border-border p-3 text-xs text-muted-foreground">
              Storage: {storageMode === "database" ? "Database (synced)" : "Local only"}
              {storageMode === "database" && ` · ${syncStatus}`}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full text-destructive"
              onClick={() => {
                if (confirm("Reset workspace to seed pages? This cannot be undone.")) {
                  resetWorkspace();
                  setSettingsOpen(false);
                }
              }}
            >
              <RotateCcw className="size-4" /> Reset workspace
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MarkdownIODialog open={ioOpen} onOpenChange={setIoOpen} />
      <LinkFolderDialog open={linkFolderOpen} onOpenChange={setLinkFolderOpen} />
      <HarnessPanel open={harnessOpen} onOpenChange={setHarnessOpen} />
      <AiSetupWizard
        open={aiWizardOpen}
        onOpenChange={setAiWizardOpen}
        initialStep={aiWizardStep}
      />
    </aside>
  );
}
