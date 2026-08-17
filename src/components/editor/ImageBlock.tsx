import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MAX_BYTES = 2 * 1024 * 1024;

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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read file"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
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
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const embedded = url.startsWith("data:image/");

  useEffect(() => {
    setBroken(false);
  }, [src]);

  async function acceptFile(file: File | undefined) {
    if (!file) return;
    setFileError(null);
    if (!file.type.startsWith("image/")) {
      setFileError("Choose an image file (png, jpeg, gif, webp, svg)");
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError("Image is larger than 2 MB");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const nextAlt = alt || file.name.replace(/\.[^.]+$/, "");
      onChange(serializeImage(dataUrl, nextAlt));
    } catch {
      setFileError("Could not read that file");
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    void acceptFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    void acceptFile(e.dataTransfer.files?.[0]);
  }

  const showPreview = Boolean(src) && !broken;

  return (
    <div data-testid="image-block" className="w-full min-w-0 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          {embedded ? (
            <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
              <ImageIcon className="size-3.5 shrink-0" />
              <span className="truncate">Embedded file</span>
              <button
                type="button"
                className="ml-auto shrink-0 text-xs underline-offset-2 hover:underline"
                onClick={() => onChange(serializeImage("", alt))}
              >
                Clear
              </button>
            </div>
          ) : (
            <>
              <ImageIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => onChange(serializeImage(e.target.value, alt))}
                placeholder="https://example.com/image.png"
                aria-label="Image URL"
                className="pl-8 font-mono text-sm"
              />
            </>
          )}
        </div>
        <Input
          value={alt}
          onChange={(e) => onChange(serializeImage(url, e.target.value))}
          placeholder="Optional alt text"
          aria-label="Image alt text"
          className="sm:max-w-[40%]"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="size-3.5" />
          Upload
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          data-testid="image-upload"
          className="sr-only"
          aria-label="Upload image file"
          onChange={onFileChange}
        />
      </div>

      {fileError ? (
        <p className="text-xs text-destructive" role="alert">
          {fileError}
        </p>
      ) : null}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={dragging ? "rounded-lg ring-2 ring-ring/50" : undefined}
      >
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
            {broken
              ? "Could not load image — check the URL"
              : "Paste a URL, upload, or drop an image here"}
          </div>
        )}
      </div>
    </div>
  );
}
