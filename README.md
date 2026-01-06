# materialdesignweb
Material Design 3 (Material You) Web Components — standards‑focused and zero‑dependency.

![Version](https://badgen.net/npm/v/@shortfuse/materialdesignweb) ![License](https://badgen.net/npm/license/@shortfuse/materialdesignweb) ![MinZip](https://badgen.net/bundlephobia/minzip/@shortfuse/materialdesignweb) ![Dependents](https://badgen.net/npm/dependents/@shortfuse/materialdesignweb)

[![Chromium](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-chromium.yml/badge.svg)](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-chromium.yml) [![Firefox](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-firefox.yml/badge.svg)](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-firefox.yml) [![Webkit](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-webkit.yml/badge.svg)](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-webkit.yml)

Live demo: https://clshortfuse.github.io/materialdesignweb/
Samples: https://clshortfuse.github.io/materialdesignweb/samples/

## Use the CDN (zero-install)

```html
<script src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
<mdw-button>Hello World</mdw-button>
```

CDN theming params: `color`, `custom`, `lightness`, `resetCSS`.

Access exports via `globalThis['@shortfuse/materialdesignweb']`:

```js
const { CustomElement } = globalThis['@shortfuse/materialdesignweb'];
```

## Import what you need (ESM)

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

## Documentation

Material Design Web (MDW) is components-first. If you just want to build UI, start with the component docs and use HTML only — no JavaScript required.

### 1) Use the components
- [Getting started](docs/components/getting-started.md)
- [Component library overview](docs/components/README.md)
- [Layout](docs/components/layout.md)
- [Typography](docs/components/typography.md)
- [Controls & inputs](docs/components/controls.md)
- [Navigation](docs/components/navigation.md)
- [Feedback & overlays](docs/components/feedback.md)
- [Content & surfaces](docs/components/content.md)
- [Component list](docs/components/README.md)

### 2) Theming
- [Theming overview](docs/theming/README.md)

### 3) Samples
- [Samples index](docs/samples/index.md)

### 4) Advanced: extend the core system (JavaScript)
Use these only if you need custom behavior, state models, or new components.
- [Core overview](docs/core/README.md)
- [Custom elements](docs/core/creating-custom-elements.md)
- [CustomElement API](docs/core/custom-element.md)
- [Observable properties](docs/core/observable-properties.md)
- [State patterns](docs/core/state.md)
- [Mixins](docs/core/mixins.md)
- [Core modules](docs/core/modules.md)

### 5) Reference
- [API reference](docs/api/README.md)
- Generated artifacts (API + types) are published to npm on release.

### 6) Contributing
- [Contributing](docs/CONTRIBUTING.md)
