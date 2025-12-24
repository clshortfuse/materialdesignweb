# Contributing / Developer guide

This document contains the commands and file locations you need if you want to build, run, or edit the demo and documentation site for this project.

Repository layout (relevant parts)

- `components/` — the web component source files (library code).
- `demo/` — demo pages and demo entry (`demo/demo.js`) used for playgrounds and examples.
- `docs/` — documentation site pages (component docs, md files); source docs live here.
- `bin/mdw-css.js` — theme CSS generator (optional static theme generation).

Common commands

- Install dependencies:

```bash
npm install
```

- Build demo bundle (writes to `demo/`):

```bash
npm run demo
```

- Serve demo with live reload (recommended for development):

```bash
npm run serve
```

- Build smaller sample or benchmark pages:

```bash
npm run sample
npm run benchmark
```

- Generate a static theme file for demo pages (optional):

```bash
npm run predemo
```

Notes and recommendations

- The default workflow for contributors is to run `npm run serve` and edit files under `demo/` (interactive playgrounds) or `docs/components/` (component doc pages). The `demo/` entry (`demo/demo.js`) wires up the preview pages.
- `predemo`/`predocs` produce static theme CSS. You do not normally need to run them manually: npm runs `pre` scripts automatically, so `npm run demo` will execute `predemo` first and `npm run docs` will execute `predocs` first when present.
- Keep demos and documentation edits separate: editors should prefer `docs/` for documentation content and `demo/` for interactive experiments.
