# Getting started

Quick use cases

- CDN (zero-install):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
<mdw-button>Hello World</mdw-button>
```

- npm (install library):

```bash
npm install @shortfuse/materialdesignweb
```

Import the full bundle:

```js
import '@shortfuse/materialdesignweb';
```

Or import a single component:

```js
import Button from '@shortfuse/materialdesignweb/components/Button.js';
```

See the component index: [docs/COMPONENTS.md](docs/COMPONENTS.md).

Theming (short)

- Runtime: use the CDN `?color=` param for prototyping.
- Static: generate a theme CSS file with the `mdw-css` CLI if you need a pre-built theme asset.

Notes for contributors

- Running `npm run demo` will execute `predemo` automatically; you normally only need `npm run demo` or `npm run serve` to build/serve the demo.
- See `docs/CONTRIBUTING.md` for developer-facing build and edit instructions.
