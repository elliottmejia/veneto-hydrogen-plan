# Veneto — CLAUDE.md

## What this project is

A minimal Vite static site that renders two Markdown planning documents for the **Veneto Luce** Shopify Hydrogen storefront project. No framework, no backend — pure vanilla JS + HTML + CSS.

## Stack

| Tool | Version | Role |
|---|---|---|
| Vite | ^8 | Dev server, build, custom MD plugin |
| marked | ^18 | Markdown → HTML |
| highlight.js | ^11 | Syntax highlighting |
| mermaid | ^11 | Architecture/flow diagrams |

## Key files

```
index.html    — HTML shell, all CSS (design tokens, layout, tabs, sidebar, content styles)
main.js       — Entry point: parses MD, renders tabs, builds sidebar nav, scrollspy
vite.config.js — Custom plugin: transforms .md imports into raw string exports
HYDROGEN_BUILD_PLAN.md           — Technical build plan (599 lines)
HYDROGEN_BUILD_PLAN_BUSINESS.md  — Business overview / timeline (201 lines)
```

## How MD rendering works

1. Vite plugin (`md-raw`) converts any `.md` import → `export default "<raw string>"`
2. `main.js` imports both MD files as strings
3. Mermaid code blocks are stashed before `marked.parse()`, restored as `<pre class="mermaid">` after
4. `hljs.highlightElement()` colorizes all `<pre code>` blocks
5. `mermaid.run()` converts stashed diagram syntax to SVG
6. Sidebar nav is auto-generated from `h2`/`h3` headings with scrollspy via `IntersectionObserver`

## Tab system

Two tabs (Technical Plan / Business Overview) share a single `#content` + `#sidebar-nav`. Switching a tab:
- Re-renders `#content` with the new MD
- Rebuilds sidebar nav
- Resets scroll to top
- Re-runs hljs + mermaid on the new content

The tab bar is sticky at `top: 56px` (below the header). Sidebar `top` is offset to `56px + 44px` to account for both sticky bars.

## Dev commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Design tokens (CSS custom properties)

```css
--font-display: 'Cormorant Garamond', Georgia, serif
--font-body:    'Inter', system-ui, sans-serif
--font-mono:    'Menlo', 'Monaco', monospace
--color-canvas: #FAF9F7
--color-bg:     #FFFFFF
--color-accent: #8B7355   /* warm brown — used for active states, links */
--color-border: #E8E6E2
--sidebar-w:    230px
```

## Adding a new document tab

1. Place the `.md` file in the project root
2. Import it in `main.js`: `import mdNew from './NEW_DOC.md'`
3. Add an entry to the `docs` array: `{ id: 'new-id', label: 'Tab Label', md: mdNew }`
4. Add a `<button class="tab-btn" data-tab="new-id">Tab Label</button>` in `index.html`
