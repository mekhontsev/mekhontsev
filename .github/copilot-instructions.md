# Copilot Instructions

## Repository structure

This repository contains LaTeX research papers in `papers/` subdirectories.
Pending improvements are tracked in `TODO.md` in the repository root.

## Workflow

1. Before making changes, check `TODO.md` in the repository root.
2. Batch multiple small fixes into a single commit/PR when possible.
3. After completing a task, mark it `[x]` in `TODO.md` in the same commit.
4. Do not create separate PRs for each minor fix — accumulate in TODO first.

## Papers

- `papers/comb-tile/` — "Disk-Like Self-Similar Tiles with High Boundary Dimension"

## Tools

`ifslib` is a WASM library for IFS tile computation (rendering, neighbor graphs, Hausdorff dimensions, etc.).

- WASM binary: `C:\workspace\ifsdb\public\ifslib.wasm` (local, always up to date after running the "sync: ifslib.wasm" workspace task)
- JS worker examples: `C:\workspace\ifsdb\public\`
  - `ifslib-worker.js` — rendering (init, set_block, render)
  - `ifslib-analytics-worker.js` — analytics (init, set_block, information)

To use in Node.js:
```javascript
const fs = require('fs');
const buf = fs.readFileSync('C:/workspace/ifsdb/public/ifslib.wasm');
const mod = await WebAssembly.compile(buf);
const inst = await WebAssembly.instantiate(mod, {});
inst.exports._initialize();
// init(aifsPtr), set_block(blockPtr), set_root(rootPtr), information(reqPtr), render(w, h, quality, scale)
// get_last_output() returns pointer to result C-string
// Use malloc/free for string passing (see worker examples)
```

## Scratch folder

Use a scratch folder **outside the repository** for all temporary scripts, Node.js experiments, and intermediate files. Never create temporary files inside the repository.

## Conventions

- Use `amsart` document class conventions
- Bibliography: `\bibitem` entries sorted alphabetically by first author surname
- All `\label{}` keys use lowercase-with-hyphens: `thm:disklike`, `eq:quartic`
- Prefer minimal edits; do not rewrite paragraphs unnecessarily
- All code, comments, and commit messages must be in English
