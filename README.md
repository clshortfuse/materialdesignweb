# materialdesignweb
Material Design for Web

*A standards-focused, zero-dependency implemention of Material Design 3 (Material You).*

![Version](https://badgen.net/npm/v/@shortfuse/materialdesignweb) ![License](https://badgen.net/npm/license/@shortfuse/materialdesignweb) ![MinZip](https://badgen.net/bundlephobia/minzip/@shortfuse/materialdesignweb) ![Dependents](https://badgen.net/npm/dependents/@shortfuse/materialdesignweb)

Live demo: https://clshortfuse.github.io/materialdesignweb/

Quick links

- Getting started: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
- Theming: [docs/THEMING.md](docs/THEMING.md)
- Component index: [docs/COMPONENTS.md](docs/COMPONENTS.md)
- Component manifest (CEM): [docs/custom-elements.json](docs/custom-elements.json) — see ([custom-elements-manifest](https://github.com/webcomponents/custom-elements-manifest))


Install via npm:

```bash
npm install @shortfuse/materialdesignweb
```

Use the CDN (zero-install):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
<mdw-button>Hello World</mdw-button>
```

Import what you need (ESM):

```js
import '@shortfuse/materialdesignweb'; // full bundle
// or
import Button from '@shortfuse/materialdesignweb/components/Button.js'; // single component
```

See theming options: [docs/THEMING.md](docs/THEMING.md)

Theming

- Use the CDN `?color=` param for quick prototyping, or see [docs/THEMING.md](docs/THEMING.md) for runtime/build options.

Archive

The Material Design 1/2 version has been archived in the [`archive-md2`](https://github.com/clshortfuse/materialdesignweb/tree/archive-md2) branch.
