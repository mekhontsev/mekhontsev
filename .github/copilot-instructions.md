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

- WASM binary: `https://raw.githubusercontent.com/ifsdb/ifsdb.github.io/main/public/ifslib.wasm`
- JS worker examples: `https://github.com/ifsdb/ifsdb.github.io/tree/main/public`
  - `ifslib-worker.js` — rendering (init, ifs_select, render)
  - `ifslib-analytics-worker.js` — analytics (init, ifs_select, information)

To use in Node.js:
```javascript
const fs = require('fs');
const buf = fs.readFileSync('ifslib.wasm');
const mod = await WebAssembly.compile(buf);
const inst = await WebAssembly.instantiate(mod, {});
inst.exports._initialize();
// init(aifsPtr), ifs_select(blockPtr, rootPtr), information(reqPtr), render(w, h, quality, scale)
// get_last_output() returns pointer to result C-string
// Use malloc/free for string passing (see worker examples)
```

Download the WASM file with `curl -O https://raw.githubusercontent.com/ifsdb/ifsdb.github.io/main/public/ifslib.wasm` before running.

## Conventions

- Use `amsart` document class conventions
- Bibliography: `\bibitem` entries sorted alphabetically by first author surname
- All `\label{}` keys use lowercase-with-hyphens: `thm:disklike`, `eq:quartic`
- Prefer minimal edits; do not rewrite paragraphs unnecessarily
- All code, comments, and commit messages must be in English