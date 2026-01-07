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

## Support

Compatibility is kept for as long possible by including browser-version-based patches. Ultimately, compatiblity may be dropped as new features get added. Bugs present in supported browsers should always be fixed.

| Feature                                                                                                |                                                                                                                                                                                            Chrome |                                                                                                                                                                                            Edge |                                                                                                                                                                                          Firefox |                                                                                                                                                                                        Safari |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot)                              |                                                                                                                                                                                                53 |                                                                                                                                                                                              79 |                                                                                                                                                                                               63 |                                                                                                                                                                                            10 |
| [WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)    |                                                                                                                                                                                                84 |                                                                                                                                                                                              84 |                                                                                                                                                                                               79 |                                                                                                                                                                                          14.1 |
| [:where()](https://developer.mozilla.org/en-US/docs/Web/CSS/:where)                                    |                                                                                                                                                                                                88 |                                                                                                                                                                                              88 |                                                                                                                                                                                               78 |                                                                                                                                                                                            14 |
|                                                                                                        |                                                                                                                                                                                                   |                                                                                                                                                                                                 |                                                                                                                                                                                                  |                                                                                                                                                                                               |
| [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)† |                                                                                                                                                                                                92 |                                                                                                                                                                                              92 |                                                                                                                                                                                               90 |                                                                                                                                                                                          15.4 |
| [replaceChildren](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren)†           |                                                                                                                                                                                                84 |                                                                                                                                                                                              86 |                                                                                                                                                                                               79 |                                                                                                                                                                                          14.1 |
| [ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)†                 |                                                                                                                                                                                                77 |                                                                                                                                                                                              79 |                                                                                                                                                                                               93 |                                                                                                                                                                                          16.4 |
| [delegatesFocus](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus)†          |                                                                                                                                                                                                53 |                                                                                                                                                                                              79 |                                                                                                                                                                                               94 |                                                                                                                                                                                            15 |
| [AdoptedStyleSheets](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets)*  |                                                                                                                                                                                                73 |                                                                                                                                                                                              79 |                                                                                                                                                                                              101 |                                                                                                                                                                                          16.4 |
| [CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)*       |                                                                                                                                                                                               106 |                                                                                                                                                                                             106 |                                                                                                                                                                                              110 |                                                                                                                                                                                          16.0 |
|                                                                                                        |
| Compatibility                                                                                          |                                                                                                                                                                                                88 |                                                                                                                                                                                              88 |                                                                                                                                                                                               78 |                                                                                                                                                                                          16.4 |
| Support                                                                                                |                                                                                                                     [Latest ChromeOS LTS Release](https://chromeos.dev/en/education/chromeos-lts) |                                                          [Microsoft Edge Extended Stable Channel](https://learn.microsoft.com/en-us/DeployEdge/microsoft-edge-channels#extended-stable-channel) |                                                                                                                                                                                          ESR 115 |                                                                                                                                                                               Last 2 Versions |
| Status                                                                                                 | [![Chrome](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-chromium.yml/badge.svg)](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-chromium.yml) | [![Edge](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-chromium.yml/badge.svg)](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-chromium.yml) | [![Firefox](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-firefox.yml/badge.svg)](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-firefox.yml) | [![Safari](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-webkit.yml/badge.svg)](https://github.com/clshortfuse/materialdesignweb/actions/workflows/test-webkit.yml) |

*Optional

†Can be polyfilled

Notes:

* Compatibility may be extended via polyfills (not included)

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
