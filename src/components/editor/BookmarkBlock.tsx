import { ExternalLink, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Parse stored content: first non-empty line = URL, optional second line = title. */
export function parseBookmark(content: string): { url: string; title: string } {
  const lines = (content || "").split("\n").map((l) => l.trim());
  const url = lines[0] || "";
  const title = lines[1] || "";
  return { url, title };
}

export function serializeBookmark(url: string, title: string): string {
  const u = url.trim();
  const t = title.trim();
  if (!t) return u;
  return `${u}\n${t}`;
}

function hostnameOf(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url || "Link";
  }
}

function hrefOf(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function BookmarkBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const { url, title } = parseBookmark(content);
  const href = hrefOf(url);
  const displayTitle = title || (url ? hostnameOf(url) : "");

  return (
    <div data-testid="bookmark-block" className="w-full min-w-0 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Link2 className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => onChange(serializeBookmark(e.target.value, title))}
            placeholder="https://example.com"
            aria-label="Bookmark URL"
            className="pl-8 font-mono text-sm"
          />
        </div>
        <Input
          value={title}
          onChange={(e) => onChange(serializeBookmark(url, e.target.value))}
          placeholder="Optional title"
          aria-label="Bookmark title"
          className="sm:max-w-[40%]"
        />
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/50"
        >
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
            <ExternalLink className="size-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">{displayTitle}</div>
            <div className="truncate font-mono text-xs text-muted-foreground">{href}</div>
          </div>
        </a>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
          Paste a URL to create a bookmark card
        </div>
      )}
    </div>
  );
}
