import { useEffect, useState } from "react";
import {
  Menu,
  PanelLeft,
  ChevronRight,
  Star,
  Cloud,
  CloudOff,
  Loader2,
  FileDown,
  Link2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "./Sidebar";
import { PageEditor } from "@/components/editor/PageEditor";
import { CommandPalette } from "@/components/search/CommandPalette";
import { MountedMarkdownView } from "@/components/markdown/MountedMarkdownView";
import { MarkdownIODialog } from "@/components/markdown/MarkdownIODialog";
import { useMarkdownMounts } from "@/lib/markdown/mounts-store";
import { Toaster } from "sonner";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { authEnabled } from "@/lib/auth/client";
import {
  bootstrapRemoteWorkspace,
  flushRemoteSaveNow,
  useLocalOnlyMode,
} from "@/lib/workspace-sync";

export function AppShell() {
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

  const mountSelection = useMarkdownMounts((s) => s.selection);
  const mounts = useMarkdownMounts((s) => s.mounts);
  const setMountSelection = useMarkdownMounts((s) => s.setSelection);
  const mount = mounts.find((m) => m.id === mountSelection?.mountId);

  const { user, isPending: authPending } = useCurrentUserState();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [ioOpen, setIoOpen] = useState(false);

  useEffect(() => {
    const unsub = useWorkspace.persist.onFinishHydration(() => {
      if (!user) setHydrated(true);
    });
    if (useWorkspace.persist.hasHydrated() && !user) setHydrated(true);
    return unsub;
  }, [setHydrated, user]);

  useEffect(() => {
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

    void run();
    return () => {
      cancelled = true;
    };
  }, [user, authPending, setHydrated]);

  useEffect(() => {
    const onHide = () => {
      if (storageMode === "database") void flushRemoteSaveNow();
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [storageMode]);

  useEffect(() => {
    const clear = () => setMountSelection(null);
    window.addEventListener("workspace:clear-mount", clear);
    return () => window.removeEventListener("workspace:clear-mount", clear);
  }, [setMountSelection]);

  const showMount = Boolean(mountSelection && mount);
  const page = !showMount
    ? pages.find((p) => p.id === activePageId && !p.archived)
    : undefined;

  const breadcrumbs = (() => {
    if (!page) return [];
    const chain: typeof pages = [];
    let cur: typeof page | undefined = page;
    const byId = new Map(pages.map((p) => [p.id, p]));
    while (cur) {
      chain.unshift(cur);
      cur = cur.parentId ? byId.get(cur.parentId) : undefined;
    }
    return chain;
  })();

  if (!hydrated || authPending || remoteLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-pulse rounded-lg bg-muted" />
          <p className="text-sm">
            {remoteLoading ? "Loading workspace from database…" : "Loading workspace…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-dvh overflow-hidden bg-background text-foreground">
        <div
          className={cn(
            "hidden h-full shrink-0 transition-[width,opacity] duration-200 md:block",
            sidebarOpen ? "w-[260px] opacity-100" : "w-0 overflow-hidden opacity-0",
          )}
        >
          {sidebarOpen && <Sidebar onOpenSearch={() => setSearchOpen(true)} />}
        </div>

        {mobileSidebar && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileSidebar(false)}
              aria-hidden
            />
            <div className="absolute inset-y-0 left-0 w-[min(280px,88vw)] shadow-xl">
              <Sidebar
                mobile
                onOpenSearch={() => {
                  setMobileSidebar(false);
                  setSearchOpen(true);
                }}
                onNavigate={() => setMobileSidebar(false)}
              />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-11 shrink-0 items-center gap-1 border-b border-border px-2 sm:px-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setMobileSidebar(true)}
              aria-label="Open sidebar"
            >
              <Menu className="size-4" />
            </Button>
            {!sidebarOpen && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="hidden md:inline-flex"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
              >
                <PanelLeft className="size-4" />
              </Button>
            )}

            <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden text-sm">
              {showMount ? (
                <span className="flex items-center gap-1.5 px-1.5 text-muted-foreground">
                  <Link2 className="size-3.5" />
                  <span className="truncate font-medium text-foreground">
                    {mount?.name}
                    {mountSelection?.relPath ? ` / ${mountSelection.relPath}` : ""}
                  </span>
                </span>
              ) : (
                breadcrumbs.map((crumb, i) => (
                  <span key={crumb.id} className="flex min-w-0 items-center gap-0.5">
                    {i > 0 && (
                      <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <button
                      type="button"
                      className={cn(
                        "max-w-[140px] truncate rounded px-1.5 py-0.5 transition-colors hover:bg-muted sm:max-w-[200px]",
                        i === breadcrumbs.length - 1
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                      onClick={() => setActivePage(crumb.id)}
                    >
                      <span className="mr-1">{crumb.icon}</span>
                      {crumb.title || "Untitled"}
                    </button>
                  </span>
                ))
              )}
              {!page && !showMount && (
                <span className="px-1.5 text-muted-foreground">No page selected</span>
              )}
            </nav>

            <SyncChip mode={storageMode} status={syncStatus} />

            {(page || showMount) && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="Import / export markdown"
                onClick={() => setIoOpen(true)}
              >
                <FileDown className="size-4 text-muted-foreground" />
              </Button>
            )}

            {page && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => updatePage(page.id, { favorite: !page.favorite })}
                aria-label={page.favorite ? "Unfavorite" : "Favorite"}
              >
                <Star
                  className={cn(
                    "size-4",
                    page.favorite ? "fill-amber-400 text-amber-500" : "text-muted-foreground",
                  )}
                />
              </Button>
            )}

            {authEnabled && (
              <div className="ml-1 hidden items-center gap-2 sm:flex">
                {user ? (
                  <UserButton />
                ) : (
                  <Button type="button" size="sm" variant="outline" asChild>
                    <Link to="/login">Sign in to sync</Link>
                  </Button>
                )}
              </div>
            )}
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">
            {showMount ? (
              <MountedMarkdownView key={`${mountSelection!.mountId}:${mountSelection!.relPath}`} />
            ) : page ? (
              <PageEditor key={page.id} page={page} />
            ) : (
              <EmptyWorkspace
                onCreate={() => createPage()}
                onOpenSidebar={() => {
                  setSidebarOpen(true);
                  setMobileSidebar(true);
                }}
              />
            )}
          </main>
        </div>

        <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
        <MarkdownIODialog open={ioOpen} onOpenChange={setIoOpen} />
        <Toaster
          position="bottom-right"
          theme={theme}
          toastOptions={{
            className: "border border-border bg-background text-foreground",
          }}
        />
      </div>
    </TooltipProvider>
  );
}

function SyncChip({
  mode,
  status,
}: {
  mode: "local" | "database";
  status: "local" | "pending" | "saving" | "saved" | "error";
}) {
  if (mode === "local") {
    return (
      <span
        className="hidden items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground sm:inline-flex"
        title="Guest mode — data stays in this browser"
      >
        <CloudOff className="size-3" />
        Local only
      </span>
    );
  }

  const label =
    status === "saving" || status === "pending"
      ? "Saving…"
      : status === "error"
        ? "Sync error"
        : "Saved to DB";

  return (
    <span
      className={cn(
        "hidden items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] sm:inline-flex",
        status === "error" ? "text-destructive" : "text-muted-foreground",
      )}
      title="Signed in — workspace syncs to Postgres"
    >
      {status === "saving" || status === "pending" ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <Cloud className="size-3" />
      )}
      {label}
    </span>
  );
}

function EmptyWorkspace({
  onCreate,
  onOpenSidebar,
}: {
  onCreate: () => void;
  onOpenSidebar: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-lg font-medium">No page open</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Create a page, open one from the sidebar, or link a markdown folder without importing.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={onCreate}>
          New page
        </Button>
        <Button type="button" variant="outline" onClick={onOpenSidebar}>
          Open sidebar
        </Button>
      </div>
    </div>
  );
}
