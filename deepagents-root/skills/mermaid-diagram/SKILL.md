---
name: mermaid-diagram
description: Create a Mermaid diagram from page structure. Use for flowcharts, sequence diagrams, or architecture sketches from notes.
---

# Mermaid diagram

## Steps
1. Choose diagram type (flowchart TD for processes, sequenceDiagram for interactions).
2. Map entities/steps from the page to nodes.
3. Emit:
   - heading2: `Diagram`
   - mermaid block with valid Mermaid source only

## Rules
- Valid Mermaid only — no markdown fences inside content.
- Use short node labels (≤28 chars).
- Prefer `flowchart TD` when unsure.
