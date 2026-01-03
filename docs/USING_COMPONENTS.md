# Using the Component Library

This guide covers how to use the prebuilt Material Design components in this repo.
For building custom elements or extending the framework, see `docs/CREATING_CUSTOM_ELEMENTS.md`.

## 1.0 Install

```bash
npm install @shortfuse/materialdesignweb
```

CDN (zero-install):

```html
<script src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4"></script>
<mdw-button>Hello World</mdw-button>
```

## 2.0 Import patterns

Full bundle:

```js
import '@shortfuse/materialdesignweb';
```

Single component:

```js
import Button from '@shortfuse/materialdesignweb/components/Button.js';
```

## 3.0 Theming

- CDN: add `?color=` to set the base color (`custom`, `lightness` also supported).
- Runtime/build: see `docs/THEMING.md` for theme generation and CSS outputs.

Example:

```html
<script src="https://cdn.jsdelivr.net/npm/@shortfuse/materialdesignweb?color=6750A4&custom=brand:FF5722,success:4CAF50&lightness=dark"></script>
```

## 4.0 Component index

Use the index to discover available components and their props:
- `docs/COMPONENTS.md`

## 5.0 Component usage basics

- Components are custom elements with kebab-case tags: `<mdw-button>`.
- Properties reflect to attributes by default (unless documented otherwise).
- Slots are used for content composition.
- Events follow standard DOM event patterns.

Example:

```html
<mdw-card outlined>
  <mdw-title>Title</mdw-title>
  <mdw-divider></mdw-divider>
  <mdw-body>Body</mdw-body>
</mdw-card>
```

## 6.0 When to extend

Use the framework track when:
- you need new components beyond the library
- you need behavior not exposed by the prebuilt components

Start here:
- `docs/CREATING_CUSTOM_ELEMENTS.md`
- `docs/CUSTOMELEMENT.md`
- `docs/STATE.md`
