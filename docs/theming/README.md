# Theming

Three simple options:

- Prebuilt CSS: generate a `theme.css` at build time and include it.
  ```html
  <link rel="stylesheet" href="/theme.css">
  ```

- JS via URL params (loader/CDN): append `?color=6750A4` (and `custom`, `lightness`, `resetCSS`) to the module URL.
  ```html
  <script type="module" src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
  <!-- Add resetCSS=false to disable html/body resets -->
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

## Applying theme colors

Use `color` and `ink` attributes on components:

```html
<mdw-button color="primary" ink="on-primary">Primary</mdw-button>
<mdw-button color="secondary" ink="on-secondary">Secondary</mdw-button>
<mdw-card color="primary-container">
  <mdw-title ink="on-primary-container">Card</mdw-title>
</mdw-card>
```

Use CSS variables for custom styling:

```css
.custom {
  background: rgb(var(--mdw-color__primary));
  color: rgb(var(--mdw-color__on-primary));
  border-radius: var(--mdw-shape__medium);
}
```
