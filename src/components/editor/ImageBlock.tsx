import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Parse stored content: first non-empty line = URL, optional second line = alt. */
export function parseImage(content: string): { url: string; alt: string } {
  const lines = (content || "").split("\n").map((l) => l.trim());
  const url = lines[0] || "";
  const alt = lines[1] || "";
  return { url, alt };
}

export function serializeImage(url: string, alt: string): string {
  const u = url.trim();
  const a = alt.trim();
  if (!a) return u;
  return `${u}\n${a}`;
}

function srcOf(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;
  try {
    if (raw.startsWith("data:image/")) return raw;
    if (raw.startsWith("/") || raw.startsWith("./") || raw.startsWith("../")) return raw;
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function ImageBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const { url, alt } = parseImage(content);
  const src = srcOf(url);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const showPreview = Boolean(src) && !broken;

  return (
    <div data-testid="image-block" className="w-full min-w-0 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <ImageIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => onChange(serializeImage(e.target.value, alt))}
            placeholder="https://example.com/image.png"
            aria-label="Image URL"
            className="pl-8 font-mono text-sm"
          />
        </div>
        <Input
          value={alt}
          onChange={(e) => onChange(serializeImage(url, e.target.value))}
          placeholder="Optional alt text"
          aria-label="Image alt text"
          className="sm:max-w-[40%]"
        />
      </div>

      {showPreview ? (
        <figure className="overflow-hidden rounded-lg border border-border bg-muted/20">
          <img
            src={src!}
            alt={alt || "Embedded image"}
            className="mx-auto max-h-80 w-full object-contain"
            onError={() => setBroken(true)}
          />
          {alt ? (
            <figcaption className="border-t border-border px-3 py-1.5 text-center text-xs text-muted-foreground">
              {alt}
            </figcaption>
          ) : null}
        </figure>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-xs text-muted-foreground">
          {broken ? "Could not load image — check the URL" : "Paste an image URL to preview"}
        </div>
      )}
    </div>
  );
}
