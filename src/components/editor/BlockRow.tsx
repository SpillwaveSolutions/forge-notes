import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from "react";
import {
  Check,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Code2,
  Eye,
} from "lucide-react";
import type { Block, BlockType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBlockMeta, BLOCK_TYPES } from "./block-types";
import { SlashMenu, filterBlockTypes } from "./SlashMenu";
import { MermaidDiagram } from "./MermaidDiagram";
import { TableBlock } from "./TableBlock";
import { BookmarkBlock } from "./BookmarkBlock";
import { ImageBlock } from "./ImageBlock";
import { AiBlockPanel, type AiGeneratedBlock } from "./AiBlockPanel";
import { AiEditDialog } from "./AiEditDialog";

interface BlockRowProps {
  pageId: string;
  block: Block;
  index: number;
  isFocused: boolean;
  listNumber?: number;
  pageTitle: string;
  pageText: string;
  onFocus: (id: string) => void;
  onChange: (id: string, content: string) => void;
  onTypeChange: (id: string, type: BlockType) => void;
  onToggleCheck: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onEnter: (id: string) => void;
  onBackspaceEmpty: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onDelete: (id: string) => void;
  onIndent: (id: string, delta: number) => void;
  onPatch: (id: string, patch: Partial<Block>) => void;
  onAiInsert: (afterId: string, blocks: AiGeneratedBlock[]) => void;
  focusRequest: string | null;
  onFocusHandled: () => void;
  inputRefs: RefObject<Map<string, HTMLElement>>;
}

export function BlockRow({
  block,
  index,
  isFocused,
  listNumber,
  pageTitle,
  pageText,
  onFocus,
  onChange,
  onTypeChange,
  onToggleCheck,
  onToggleCollapse,
  onEnter,
  onBackspaceEmpty,
  onMove,
  onDelete,
  onIndent,
  onPatch,
  onAiInsert,
  focusRequest,
  onFocusHandled,
  inputRefs,
}: BlockRowProps) {
  const meta = getBlockMeta(block.type);
  const areaRef = useRef<HTMLTextAreaElement | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  const [hovered, setHovered] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const setRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      areaRef.current = el;
      if (el) inputRefs.current.set(block.id, el);
      else inputRefs.current.delete(block.id);
    },
    [block.id, inputRefs],
  );

  const autosize = useCallback(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(el.scrollHeight, 28)}px`;
  }, []);

  useEffect(() => {
    autosize();
  }, [block.content, block.type, autosize]);

  useEffect(() => {
    if (focusRequest !== block.id) return;
    const el = areaRef.current;
    if (el) {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
    onFocusHandled();
  }, [focusRequest, block.id, onFocusHandled]);

  const openSlash = (query: string) => {
    const el = rowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = Math.min(rect.left + 48, window.innerWidth - 300);
    const top =
      rect.bottom + 280 > window.innerHeight ? Math.max(8, rect.top - 280) : rect.bottom + 4;
    setSlashPos({ top, left });
    setSlashQuery(query);
    setSlashIndex(0);
    setSlashOpen(true);
  };

  const closeSlash = () => {
    setSlashOpen(false);
    setSlashQuery("");
    setSlashIndex(0);
  };

  const applySlash = (type: BlockType) => {
    const content = block.content;
    const slashIdx = content.lastIndexOf("/");
    const cleaned = slashIdx >= 0 ? content.slice(0, slashIdx) : content;
    onChange(block.id, cleaned);
    onTypeChange(block.id, type);
    closeSlash();
    requestAnimationFrame(() => {
      inputRefs.current.get(block.id)?.focus();
    });
  };

  const handleChange = (value: string) => {
    onChange(block.id, value);
    requestAnimationFrame(autosize);

    const slashIdx = value.lastIndexOf("/");
    if (slashIdx >= 0) {
      const after = value.slice(slashIdx + 1);
      const before = value[slashIdx - 1];
      if ((slashIdx === 0 || before === " " || before === "\n") && !after.includes("\n")) {
        openSlash(after);
        return;
      }
    }
    if (slashOpen) closeSlash();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (slashOpen) {
      const items = filterBlockTypes(slashQuery);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIndex((i) => (i + 1) % Math.max(items.length, 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIndex((i) => (i - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const pick = items[slashIndex];
        if (pick) applySlash(pick.type);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeSlash();
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey && block.type !== "code" && block.type !== "mermaid") {
      e.preventDefault();
      onEnter(block.id);
      return;
    }

    if (e.key === "Backspace") {
      const el = e.currentTarget;
      if (!el.value && el.selectionStart === 0) {
        e.preventDefault();
        onBackspaceEmpty(block.id);
        return;
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      onIndent(block.id, e.shiftKey ? -1 : 1);
    }

    if (e.key === "ArrowUp" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onMove(block.id, "up");
    }
    if (e.key === "ArrowDown" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onMove(block.id, "down");
    }
  };

  const indentStyle: CSSProperties = {
    paddingLeft: `${(block.indent ?? 0) * 1.5}rem`,
  };

  const canAiEdit =
    block.type !== "divider" &&
    block.type !== "ai" &&
    block.type !== "mermaid" &&
    block.type !== "table" &&
    block.type !== "bookmark" &&
    block.type !== "image";

  if (block.type === "divider") {
    return (
      <div
        ref={rowRef}
        data-block-id={block.id}
        data-block-type={block.type}
        className="group relative flex items-center gap-1 py-2"
        style={indentStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <BlockHandles
          visible={hovered || isFocused}
          canAiEdit={false}
          onAdd={() => onEnter(block.id)}
          onMoveUp={() => onMove(block.id, "up")}
          onMoveDown={() => onMove(block.id, "down")}
          onDelete={() => onDelete(block.id)}
          onTypeChange={(t) => onTypeChange(block.id, t)}
          onAiEdit={() => setAiOpen(true)}
        />
        <hr className="w-full border-0 border-t border-border" />
      </div>
    );
  }

  if (block.type === "ai") {
    return (
      <div
        ref={rowRef}
        data-block-id={block.id}
        data-block-type={block.type}
        className="group relative py-1"
        style={indentStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <BlockHandles
          visible={hovered || isFocused}
          canAiEdit={false}
          onAdd={() => onEnter(block.id)}
          onMoveUp={() => onMove(block.id, "up")}
          onMoveDown={() => onMove(block.id, "down")}
          onDelete={() => onDelete(block.id)}
          onTypeChange={(t) => onTypeChange(block.id, t)}
          onAiEdit={() => undefined}
        />
        <div className="pl-1">
          <AiBlockPanel
            content={block.content}
            aiOutput={block.aiOutput}
            aiError={block.aiError}
            pageTitle={pageTitle}
            pageText={pageText}
            onChangePrompt={(v) => onChange(block.id, v)}
            onResult={({ output, blocks, error }) => {
              onPatch(block.id, {
                aiOutput: output,
                aiError: error,
              });
              if (blocks?.length) onAiInsert(block.id, blocks);
            }}
          />
        </div>
      </div>
    );
  }

  if (block.type === "mermaid") {
    const showSource = block.showSource ?? !block.content.trim();
    return (
      <div
        ref={rowRef}
        data-block-id={block.id}
        data-block-type={block.type}
        className="group relative py-1"
        style={indentStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <BlockHandles
          visible={hovered || isFocused}
          canAiEdit={false}
          onAdd={() => onEnter(block.id)}
          onMoveUp={() => onMove(block.id, "up")}
          onMoveDown={() => onMove(block.id, "down")}
          onDelete={() => onDelete(block.id)}
          onTypeChange={(t) => onTypeChange(block.id, t)}
          onAiEdit={() => undefined}
        />
        <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mermaid
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 text-muted-foreground"
              onClick={() => onPatch(block.id, { showSource: !showSource })}
            >
              {showSource ? (
                <>
                  <Eye className="size-3.5" /> Preview
                </>
              ) : (
                <>
                  <Code2 className="size-3.5" /> Edit source
                </>
              )}
            </Button>
          </div>
          {showSource ? (
            <textarea
              ref={setRef}
              value={block.content}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => onFocus(block.id)}
              onKeyDown={handleKeyDown}
              placeholder={meta.placeholder}
              rows={Math.max(4, block.content.split("\n").length)}
              spellCheck={false}
              className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          ) : (
            <MermaidDiagram source={block.content} />
          )}
        </div>
        {slashOpen && (
          <SlashMenu
            query={slashQuery}
            selectedIndex={slashIndex}
            onSelect={applySlash}
            onHover={setSlashIndex}
            position={slashPos}
          />
        )}
      </div>
    );
  }

  if (block.type === "table") {
    return (
      <div
        ref={rowRef}
        data-block-id={block.id}
        data-block-type={block.type}
        className="group relative py-1"
        style={indentStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <BlockHandles
          visible={hovered || isFocused}
          canAiEdit={false}
          onAdd={() => onEnter(block.id)}
          onMoveUp={() => onMove(block.id, "up")}
          onMoveDown={() => onMove(block.id, "down")}
          onDelete={() => onDelete(block.id)}
          onTypeChange={(t) => onTypeChange(block.id, t)}
          onAiEdit={() => undefined}
        />
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Table
          </div>
          <TableBlock content={block.content} onChange={(v) => onChange(block.id, v)} />
        </div>
      </div>
    );
  }

  if (block.type === "bookmark") {
    return (
      <div
        ref={rowRef}
        data-block-id={block.id}
        data-block-type={block.type}
        className="group relative py-1"
        style={indentStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <BlockHandles
          visible={hovered || isFocused}
          canAiEdit={false}
          onAdd={() => onEnter(block.id)}
          onMoveUp={() => onMove(block.id, "up")}
          onMoveDown={() => onMove(block.id, "down")}
          onDelete={() => onDelete(block.id)}
          onTypeChange={(t) => onTypeChange(block.id, t)}
          onAiEdit={() => undefined}
        />
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bookmark
          </div>
          <BookmarkBlock content={block.content} onChange={(v) => onChange(block.id, v)} />
        </div>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div
        ref={rowRef}
        data-block-id={block.id}
        data-block-type={block.type}
        className="group relative py-1"
        style={indentStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <BlockHandles
          visible={hovered || isFocused}
          canAiEdit={false}
          onAdd={() => onEnter(block.id)}
          onMoveUp={() => onMove(block.id, "up")}
          onMoveDown={() => onMove(block.id, "down")}
          onDelete={() => onDelete(block.id)}
          onTypeChange={(t) => onTypeChange(block.id, t)}
          onAiEdit={() => undefined}
        />
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Image
          </div>
          <ImageBlock content={block.content} onChange={(v) => onChange(block.id, v)} />
        </div>
      </div>
    );
  }

  const fieldClass = cn(
    "block w-full resize-none overflow-hidden border-0 bg-background p-0 text-foreground shadow-none outline-none ring-0 focus:outline-none focus:ring-0",
    "placeholder:text-muted-foreground/60",
    block.type === "paragraph" && "text-base leading-relaxed",
    block.type === "heading1" && "text-3xl font-semibold leading-tight tracking-tight",
    block.type === "heading2" && "text-2xl font-semibold leading-tight tracking-tight",
    block.type === "heading3" && "text-xl font-semibold leading-snug tracking-tight",
    (block.type === "bullet" || block.type === "numbered") && "text-base leading-relaxed",
    block.type === "todo" &&
      cn("text-base leading-relaxed", block.checked && "text-muted-foreground line-through"),
    block.type === "toggle" && "text-base font-medium leading-relaxed",
    block.type === "quote" && "text-base leading-relaxed text-muted-foreground",
    block.type === "callout" && "text-base leading-relaxed",
    block.type === "code" && "min-h-16 font-mono text-sm leading-relaxed",
  );

  return (
    <div
      ref={rowRef}
      data-block-id={block.id}
      data-block-type={block.type}
      className={cn(
        "group relative flex items-start gap-1 rounded-md py-0.5",
        isFocused && "bg-muted/40",
      )}
      style={indentStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <BlockHandles
        visible={hovered || isFocused}
        canAiEdit={canAiEdit}
        onAdd={() => onEnter(block.id)}
        onMoveUp={() => onMove(block.id, "up")}
        onMoveDown={() => onMove(block.id, "down")}
        onDelete={() => onDelete(block.id)}
        onTypeChange={(t) => onTypeChange(block.id, t)}
        onAiEdit={() => setAiOpen(true)}
      />

      <div
        className={cn(
          "flex min-w-0 flex-1 items-start gap-2 rounded-md px-1 py-1",
          block.type === "callout" && "border border-border bg-muted/50 px-3 py-2.5",
          block.type === "quote" && "border-l-2 border-foreground/25 pl-3",
          block.type === "code" && "border border-border bg-muted/60 px-3 py-2.5",
        )}
      >
        {block.type === "bullet" && (
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/80" />
        )}
        {block.type === "numbered" && (
          <span className="mt-1 w-5 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
            {listNumber ?? index + 1}.
          </span>
        )}
        {block.type === "todo" && (
          <button
            type="button"
            className={cn(
              "mt-1.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
              block.checked
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-foreground/40",
            )}
            onClick={() => onToggleCheck(block.id)}
            aria-label={block.checked ? "Mark incomplete" : "Mark complete"}
          >
            {block.checked && <Check className="size-3" strokeWidth={3} />}
          </button>
        )}
        {block.type === "toggle" && (
          <button
            type="button"
            className="mt-1 flex size-5 shrink-0 items-center justify-center rounded hover:bg-muted"
            onClick={() => onToggleCollapse(block.id)}
            aria-label={block.collapsed ? "Expand" : "Collapse"}
          >
            <ChevronRight
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-150",
                !block.collapsed && "rotate-90",
              )}
            />
          </button>
        )}
        {block.type === "callout" && (
          <span className="mt-1 shrink-0 text-base leading-none" aria-hidden>
            💡
          </span>
        )}

        <textarea
          ref={setRef}
          value={block.content}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => onFocus(block.id)}
          onKeyDown={handleKeyDown}
          placeholder={meta.placeholder}
          rows={1}
          spellCheck={block.type !== "code"}
          className={fieldClass}
        />
      </div>

      {slashOpen && (
        <SlashMenu
          query={slashQuery}
          selectedIndex={slashIndex}
          onSelect={applySlash}
          onHover={setSlashIndex}
          position={slashPos}
        />
      )}

      {canAiEdit && (
        <AiEditDialog
          open={aiOpen}
          onOpenChange={setAiOpen}
          blockText={block.content}
          blockType={block.type}
          pageTitle={pageTitle}
          pageText={pageText}
          onApply={(text) => onChange(block.id, text)}
        />
      )}
    </div>
  );
}

function BlockHandles({
  visible,
  canAiEdit,
  onAdd,
  onMoveUp,
  onMoveDown,
  onDelete,
  onTypeChange,
  onAiEdit,
}: {
  visible: boolean;
  canAiEdit: boolean;
  onAdd: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onTypeChange: (t: BlockType) => void;
  onAiEdit: () => void;
}) {
  return (
    <div
      data-hover-reveal
      className={cn(
        "absolute -left-12 top-1 flex items-center gap-0.5 opacity-0 transition-opacity max-sm:-left-10",
        visible && "opacity-100",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        onClick={onAdd}
        aria-label="Add block below"
      >
        <Plus className="size-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label="Block menu"
          >
            <GripVertical className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Block</DropdownMenuLabel>
          {canAiEdit && (
            <DropdownMenuItem onClick={onAiEdit}>
              <Sparkles className="size-4" /> Edit with AI
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onMoveUp}>
            <ArrowUp className="size-4" /> Move up
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onMoveDown}>
            <ArrowDown className="size-4" /> Move down
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <MoreHorizontal className="size-4" /> Turn into
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
              {BLOCK_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <DropdownMenuItem key={t.type} onClick={() => onTypeChange(t.type)}>
                    <Icon className="size-4" /> {t.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
            <Trash2 className="size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
