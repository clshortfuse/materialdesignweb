# materialdesignweb
Material Design for Web — a standards-focused, zero-dependency implementation of Material Design 3 (Material You).

![Version](https://badgen.net/npm/v/@shortfuse/materialdesignweb) ![License](https://badgen.net/npm/license/@shortfuse/materialdesignweb)

Quick links

- Getting started (for app authors): [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
- Theming reference: [docs/THEMING.md](docs/THEMING.md)
- Contributing / local build: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- Component authoring: [docs/CREATING_CUSTOM_ELEMENTS.md](docs/CREATING_CUSTOM_ELEMENTS.md)
- API / manifest: [docs/custom-elements.json](docs/custom-elements.json)

Quick start (for app authors)

Install via npm:

```bash
npm install @shortfuse/materialdesignweb
```

Use the CDN (zero-install):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
<mdw-button>Hello World</mdw-button>
```

About the component manifest

The file [docs/custom-elements.json](docs/custom-elements.json) is a Custom Elements Manifest (a "custom-elements-manifest"). It describes the components in this repo (tags, classes, attributes, events, slots and demos) and is consumed by documentation generators and IDE integrations to provide API references and autocomplete. Open that file directly or use tooling (web-component-analyzer / VS Code web-component extensions) to view a browsable reference.

If you're contributing, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for build and demo commands.

License: ISC
