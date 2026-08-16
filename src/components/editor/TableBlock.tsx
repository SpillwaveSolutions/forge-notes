import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_TABLE = "| Column 1 | Column 2 |\n| --- | --- |\n|  |  |";

function parseMdTable(md: string): string[][] {
  const lines = md
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.includes("|"));
  const rows = lines
    .filter((l) => !/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(l))
    .map((l) =>
      l
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim()),
    )
    .filter((r) => r.length > 0);
  if (!rows.length) return parseMdTable(DEFAULT_TABLE);
  const cols = Math.max(...rows.map((r) => r.length), 2);
  return rows.map((r) => [...r, ...Array.from({ length: cols - r.length }, () => "")]);
}

function serializeMdTable(rows: string[][]): string {
  const cols = Math.max(...rows.map((r) => r.length), 2);
  const norm = rows.map((r) => [...r, ...Array.from({ length: cols - r.length }, () => "")]);
  const line = (r: string[]) => `| ${r.join(" | ")} |`;
  const sep = `| ${norm[0]!.map(() => "---").join(" | ")} |`;
  return [line(norm[0]!), sep, ...norm.slice(1).map(line)].join("\n");
}

export function TableBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const rows = parseMdTable(content || DEFAULT_TABLE);
  const cols = rows[0]?.length ?? 2;

  const setCell = (r: number, c: number, value: string) => {
    const next = rows.map((row, i) => row.map((cell, j) => (i === r && j === c ? value : cell)));
    onChange(serializeMdTable(next));
  };

  const addRow = () => {
    onChange(serializeMdTable([...rows, Array.from({ length: cols }, () => "")]));
  };

  const addColumn = () => {
    onChange(serializeMdTable(rows.map((row) => [...row, ""])));
  };

  return (
    <div className="w-full min-w-0 space-y-2">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {rows[0]!.map((cell, c) => (
                <th key={c} className="border-b border-border bg-muted/40 p-0 font-medium">
                  <input
                    className="w-full bg-transparent px-2 py-1.5 outline-none"
                    value={cell}
                    aria-label={`Column ${c + 1} header`}
                    onChange={(e) => setCell(0, c, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((cell, c) => (
                  <td key={c} className="border-t border-border p-0">
                    <input
                      className="w-full bg-transparent px-2 py-1.5 outline-none"
                      value={cell}
                      aria-label={`Row ${i + 1} column ${c + 1}`}
                      onChange={(e) => setCell(i + 1, c, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-1 size-3" />
          Add row
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addColumn}>
          <Plus className="mr-1 size-3" />
          Add column
        </Button>
      </div>
    </div>
  );
}

export { DEFAULT_TABLE, parseMdTable, serializeMdTable };
