import { useEffect, useMemo, useRef } from "react";
import type { BlockType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BLOCK_TYPES } from "./block-types";

interface SlashMenuProps {
  query: string;
  selectedIndex: number;
  onSelect: (type: BlockType) => void;
  onHover: (index: number) => void;
  position: { top: number; left: number };
}

export function filterBlockTypes(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return BLOCK_TYPES;
  return BLOCK_TYPES.filter(
    (b) =>
      b.label.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.keywords.some((k) => k.includes(q)),
  );
}

export function SlashMenu({
  query,
  selectedIndex,
  onSelect,
  onHover,
  position,
}: SlashMenuProps) {
  const items = useMemo(() => filterBlockTypes(query), [query]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <div
        className="fixed z-50 w-72 overflow-hidden rounded-xl border border-border bg-popover p-3 text-sm text-muted-foreground shadow-xl"
        style={{ top: position.top, left: position.left }}
      >
        No matching blocks
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="fixed z-50 max-h-72 w-72 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-xl"
      style={{ top: position.top, left: Math.min(position.left, window.innerWidth - 300) }}
      role="listbox"
    >
      <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Basic blocks
      </div>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.type}
            type="button"
            data-index={index}
            role="option"
            aria-selected={index === selectedIndex}
            className={cn(
              "flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
              index === selectedIndex ? "bg-muted" : "hover:bg-muted/70",
            )}
            onMouseEnter={() => onHover(index)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item.type);
            }}
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground">
              <Icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">{item.label}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {item.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
