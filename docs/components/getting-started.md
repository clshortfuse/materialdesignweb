# Getting started

MDW components work in plain HTML. Quick setup steps:

## CDN (zero-install)

```html
<script src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
<mdw-button>Hello World</mdw-button>
```

CDN theming params are documented in [Theming](../theming/README.md).

## npm (ESM)

```bash
npm install @shortfuse/materialdesignweb
```

Full bundle:

```js
import '@shortfuse/materialdesignweb';
```

Single component:

```js
import Button from '@shortfuse/materialdesignweb/components/Button.js';
```

## Next steps

- Component overview: [README.md](README.md)
