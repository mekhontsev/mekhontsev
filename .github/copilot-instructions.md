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

## Conventions

- Use `amsart` document class conventions
- Bibliography: `\bibitem` entries sorted alphabetically by first author surname
- All `\label{}` keys use lowercase-with-hyphens: `thm:disklike`, `eq:quartic`
- Prefer minimal edits; do not rewrite paragraphs unnecessarily
- All code, comments, and commit messages must be in English