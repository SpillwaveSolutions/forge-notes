import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, Star, MoreHorizontal, Trash2, Copy, Plus, Sparkles } from "lucide-react";
import type { Block, BlockType, Page } from "@/lib/types";
import { COVER_PRESETS, PAGE_ICONS } from "@/lib/seed";
import { useWorkspace } from "@/lib/store";
import { cn, uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BlockRow } from "./BlockRow";
import type { AiGeneratedBlock } from "./AiBlockPanel";

interface PageEditorProps {
  page: Page;
}

function blocksToPlainText(page: Page): string {
  return page.blocks
    .filter((b) => b.type !== "ai" && b.type !== "divider")
    .map((b) => {
      const prefix =
        b.type === "heading1"
          ? "# "
          : b.type === "heading2"
            ? "## "
            : b.type === "heading3"
              ? "### "
              : b.type === "bullet"
                ? "- "
                : b.type === "numbered"
                  ? "1. "
                  : b.type === "todo"
                    ? b.checked
                      ? "[x] "
                      : "[ ] "
                    : b.type === "quote"
                      ? "> "
                      : b.type === "code" || b.type === "mermaid"
                        ? ""
                        : "";
      return `${prefix}${b.content}`.trim();
    })
    .filter(Boolean)
    .join("\n");
}

export function PageEditor({ page }: PageEditorProps) {
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

  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<string | null>(null);
  const inputRefs = useRef<Map<string, HTMLElement>>(new Map());
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const pageText = useMemo(() => blocksToPlainText(page), [page]);

  const listNumbers = useMemo(() => {
    const map = new Map<string, number>();
    let n = 0;
    for (const b of page.blocks) {
      if (b.type === "numbered") {
        n += 1;
        map.set(b.id, n);
      } else {
        n = 0;
      }
    }
    return map;
  }, [page.blocks]);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [page.title]);

  const handleEnter = useCallback(
    (blockId: string) => {
      const newId = insertBlock(page.id, blockId, "paragraph", "");
      setFocusRequest(newId);
      setFocusedId(newId);
    },
    [insertBlock, page.id],
  );

  const handleBackspaceEmpty = useCallback(
    (blockId: string) => {
      const idx = page.blocks.findIndex((b) => b.id === blockId);
      if (idx < 0) return;
      const prev = page.blocks[idx - 1];
      deleteBlock(page.id, blockId);
      if (prev) {
        setFocusRequest(prev.id);
        setFocusedId(prev.id);
      }
    },
    [deleteBlock, page.blocks, page.id],
  );

  const handleIndent = useCallback(
    (blockId: string, delta: number) => {
      const block = page.blocks.find((b) => b.id === blockId);
      if (!block) return;
      const next = Math.max(0, Math.min(4, (block.indent ?? 0) + delta));
      updateBlock(page.id, blockId, { indent: next });
    },
    [page.blocks, page.id, updateBlock],
  );

  const handleAiInsert = useCallback(
    (afterId: string, generated: AiGeneratedBlock[]) => {
      const idx = page.blocks.findIndex((b) => b.id === afterId);
      if (idx < 0 || generated.length === 0) return;
      const newBlocks: Block[] = generated.map((g) => ({
        id: uid("b"),
        type: g.type,
        content: g.content,
        indent: 0,
        checked: g.type === "todo" ? false : undefined,
        showSource: g.type === "mermaid" ? false : undefined,
      }));
      const next = [...page.blocks];
      next.splice(idx + 1, 0, ...newBlocks);
      setBlocks(page.id, next);
      setFocusRequest(newBlocks[0]!.id);
    },
    [page.blocks, page.id, setBlocks],
  );

  const cover = page.cover ? COVER_PRESETS[page.cover] : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-4 sm:px-12 sm:pt-8">
      {cover ? (
        <div className="group/cover relative -mx-4 mb-2 h-36 overflow-hidden rounded-xl sm:-mx-6 sm:h-44">
          <div className={cn("absolute inset-0", cover.className)} />
          <div className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover/cover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="bg-background/90 shadow-sm backdrop-blur-sm"
              onClick={() => updatePage(page.id, { cover: null })}
            >
              Remove cover
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-1 flex flex-wrap items-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex size-16 items-center justify-center rounded-xl text-4xl transition-colors hover:bg-muted"
              aria-label="Change page icon"
            >
              {page.icon}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Page icon</div>
            <div className="grid grid-cols-8 gap-1">
              {PAGE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-muted",
                    page.icon === icon && "bg-muted ring-1 ring-border",
                  )}
                  onClick={() => updatePage(page.id, { icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="mb-2 flex flex-1 flex-wrap items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => updatePage(page.id, { favorite: !page.favorite })}
          >
            <Star className={cn("size-3.5", page.favorite && "fill-amber-400 text-amber-500")} />
            {page.favorite ? "Unfavorite" : "Favorite"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => {
              const last = page.blocks[page.blocks.length - 1];
              const id = insertBlock(page.id, last?.id ?? null, "ai", "");
              setFocusRequest(id);
            }}
          >
            <Sparkles className="size-3.5" />
            AI block
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="sm" variant="ghost" className="text-muted-foreground">
                <ImageIcon className="size-3.5" />
                Cover
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {Object.entries(COVER_PRESETS).map(([key, preset]) => (
                <DropdownMenuItem key={key} onClick={() => updatePage(page.id, { cover: key })}>
                  <span className={cn("mr-2 size-4 rounded", preset.className)} />
                  {preset.label}
                </DropdownMenuItem>
              ))}
              {page.cover && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => updatePage(page.id, { cover: null })}>
                    Remove cover
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-label="Page actions"
                className="text-muted-foreground"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => createPage({ parentId: page.id })}>
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
                <Trash2 className="size-4" /> Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <textarea
        ref={titleRef}
        value={page.title}
        onChange={(e) => updatePage(page.id, { title: e.target.value })}
        placeholder="Untitled"
        rows={1}
        className="mb-4 w-full resize-none overflow-hidden bg-transparent text-4xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const first = page.blocks[0];
            if (first) {
              setFocusRequest(first.id);
              setFocusedId(first.id);
            }
          }
        }}
      />

      <div className="relative space-y-0.5 pl-10 sm:pl-12">
        {page.blocks.map((block, index) => (
          <BlockRow
            key={block.id}
            pageId={page.id}
            block={block}
            index={index}
            isFocused={focusedId === block.id}
            listNumber={listNumbers.get(block.id)}
            pageTitle={page.title}
            pageText={pageText}
            onFocus={setFocusedId}
            onChange={(id, content) => updateBlock(page.id, id, { content })}
            onTypeChange={(id, type: BlockType) => changeBlockType(page.id, id, type)}
            onToggleCheck={(id) => {
              const b = page.blocks.find((x) => x.id === id);
              if (b) updateBlock(page.id, id, { checked: !b.checked });
            }}
            onToggleCollapse={(id) => {
              const b = page.blocks.find((x) => x.id === id);
              if (b) updateBlock(page.id, id, { collapsed: !b.collapsed });
            }}
            onEnter={handleEnter}
            onBackspaceEmpty={handleBackspaceEmpty}
            onMove={(id, dir) => moveBlock(page.id, id, dir)}
            onDelete={(id) => deleteBlock(page.id, id)}
            onIndent={handleIndent}
            onPatch={(id, patch) => updateBlock(page.id, id, patch)}
            onAiInsert={handleAiInsert}
            focusRequest={focusRequest}
            onFocusHandled={() => setFocusRequest(null)}
            inputRefs={inputRefs}
          />
        ))}
      </div>

      <button
        type="button"
        className="mt-2 ml-10 min-h-16 w-[calc(100%-2.5rem)] cursor-text rounded-md sm:ml-12 sm:w-[calc(100%-3rem)]"
        aria-label="Add block at end"
        onClick={() => {
          const last = page.blocks[page.blocks.length - 1];
          if (last && last.type === "paragraph" && !last.content) {
            setFocusRequest(last.id);
            setFocusedId(last.id);
          } else {
            const id = insertBlock(page.id, last?.id ?? null, "paragraph", "");
            setFocusRequest(id);
            setFocusedId(id);
          }
        }}
      />
    </div>
  );
}
