# Theming

Three simple options:

- Prebuilt CSS: generate a `theme.css` at build time and include it.
  ```html
  <link rel="stylesheet" href="/theme.css">
  ```

- JS via URL params (loader/CDN): append `?color=6750A4` (and `custom`, `lightness`) to the module URL.
  ```html
  <script type="module" src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
  ```

- JS on demand (`setupTheme`): call the helper to inject CSS variables at runtime.
  ```js
  import { setupTheme } from './services/theme.js';
  setupTheme({ color: '#6750A4', custom: [['alias','aqua']], lightness: 'auto' });
  ```

Notes

- Default primary color is `#6750A4`.
- `custom` entries are `['name','#hex']` pairs; URL `custom` uses `name:hex` syntax.
- `lightness` can be `auto`, `light`, or `dark`.
