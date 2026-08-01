#!/usr/bin/env node
/**
 * Gate: a change to a screen must come with a change to that screen's doc.
 *
 * This is the only part of the verification loop a machine can enforce. The
 * rubric walk itself is judgement — a human or an agent reading a screenshot
 * against a checklist — and pretending otherwise would produce a gate that
 * passes while the thing it names goes unchecked.
 *
 * So this asserts the cheap, deterministic invariant: UI code moved, therefore
 * the spec that describes it must have moved too. It cannot tell whether the
 * doc was updated WELL. It can tell when it was not updated at all, which is
 * the failure that actually happens.
 *
 *   node scripts/check-ui-docs.mjs <base-ref>
 */
import { execFileSync } from "node:child_process";

const base = process.argv[2] ?? "origin/main";

function changedFiles(baseRef) {
  const out = execFileSync("git", ["diff", "--name-only", `${baseRef}...HEAD`], {
    encoding: "utf8",
  });
  return out.split("\n").filter(Boolean);
}

let files;
try {
  files = changedFiles(base);
} catch (err) {
  console.error(`could not diff against ${base}: ${err.message}`);
  process.exit(2);
}

/** Screen code whose appearance a rubric would describe. */
const isScreenCode = (f) =>
  (f.startsWith("src/components/") || f.startsWith("src/routes/")) &&
  (f.endsWith(".tsx") || f.endsWith(".ts")) &&
  // tests describe behaviour, not appearance
  !f.includes(".test.") &&
  // generated
  !f.endsWith("routeTree.gen.ts") &&
  // API routes render nothing
  !f.startsWith("src/routes/api/");

const isUiDoc = (f) => f.startsWith("docs/ui/") && (f.endsWith(".md") || f.endsWith(".puml"));

const screenChanges = files.filter(isScreenCode);
const docChanges = files.filter(isUiDoc);

if (screenChanges.length === 0) {
  console.log("ui-docs: no screen code changed — nothing to check");
  process.exit(0);
}

if (docChanges.length > 0) {
  console.log(
    `ui-docs: ${screenChanges.length} screen file(s) changed, ` +
      `${docChanges.length} doc file(s) changed — ok`,
  );
  process.exit(0);
}

console.error("ui-docs: screen code changed with no docs/ui/ update.\n");
console.error("Changed:");
for (const f of screenChanges) console.error(`  ${f}`);
console.error(
  "\nUpdate the matching docs/ui/<screen>.md (spec, capture recipe, rubric) and its\n" +
    ".puml, then `npm run ui:render`. See docs/ui/README.md.\n" +
    "\nNo doc exists for this screen yet? Start from docs/ui/TEMPLATE.md — that is the\n" +
    "backlog being paid down, not a reason to skip.\n" +
    "\nGenuinely not a visual change (a pure refactor, a comment)? Say so in the PR and\n" +
    "add [skip-ui-docs] to the PR title.",
);
process.exit(1);
