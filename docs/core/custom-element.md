# CustomElement

This document explains what `core/CustomElement.js` provides, why it exists,
and how the fluent API reduces author code without a build step.

## 1.0 Purpose

- Provide observable properties with attribute reflection.
- Provide a template composer + render pipeline.
- Provide a fluent API for definition without decorators or transpilers.
- Provide consistent lifecycle hooks (`constructed`, `connected`, `disconnected`).
- Keep author code short while still supporting JSDoc typing.

## 2.0 Fluent + class API (summary)

- Fluent chains configure a class without mutating the base.
- Class syntax uses `static {}` or post-class configuration.
- Observed props should not be declared as class fields.
- For usage examples and gotchas, see `creating-custom-elements.md`.

## 3.0 Observed properties

- `observe()` and `prop()` create accessor-backed properties on the prototype.
- Accessors feed `render.byProp(...)` for incremental updates.
- Observable props reflect to attributes by default (except object-like types).
- Attribute reflection requires static-phase setup (fluent chain or `static {}`).

```js
this.observe({ count: { type: 'integer', value: 0 } });
this.prop('label', { type: 'string', value: 'ok' });
```

## 4.0 Methods and expressions

- `.methods({ ... })` attaches instance methods in fluent API.
- Class API uses normal class methods.
- `.expressions({ ... })` defines computed getters for templates.

## 5.0 Template composition

- `.html\`...\`` appends a template into the `Composition`.
- `.css\`...\`` appends styles into the `Composition` (tagged template syntax).
- `Composition.render()` handles initial render and incremental updates.

## 6.0 Lifecycle hooks

- `onConstructed(fn)`
- `onConnected(fn)`
- `onDisconnected(fn)`
- `on('composed', fn)` for composition-time hook
- Hooks receive `callbackArguments`.

## 7.0 Typing without TypeScript

- JSDoc typing works without a build step.
- Fluent API reduces annotation noise compared to class fields.
- See `test/core/custom-element.test.js` for parity coverage.

## 8.0 Static API reference (class-level)

### 8.1 Configuration + structure

- `extend(customExtender?)`: clone/extend a class without mutating the base.
- `mixin(fn)`: apply a mixin to the current class.
- `setStatic(source)`: assign static fields directly to the class.
- `register(name?)` / `autoRegister(name)`: define the element with `customElements`.
- `observedAttributes`: platform hook for attribute callbacks.
- `define(props)` / `set(source)` / `readonly(source)`: define prototype props.
- `undefine(name)`: remove a prototype property and unregister observers.
- `propList` / `attrList`: maps of observable and attribute props.

### 8.2 Observables and props

- `observe(props)`: define multiple observable props.
- `prop(name, options)` / `props(...)`: define one observable prop.
- `idl(name, options)`: alias of `prop`.
- `defineStatic(props)`: define observable properties on the class itself.
- `setPrototype(name, options)`: create accessor + return `null` for typing.

### 8.3 Templates and composition

- `html\`...\``: append a template into the `Composition`.
- `css\`...\``: append styles into the `Composition` (tagged template syntax).
- `css(...)`: programmatic form for string/array/stylesheet inputs.
- `append(...)`: append `Composition` parts directly.
- `recompose(cb)`: hook after composition step.

### 8.4 Methods, expressions, and overrides

- `methods({ ... })`: attach instance methods (fluent API).
- `expressions({ ... })`: attach derived getters.
- `overrides({ ... })`: define prototype overrides with typing.

### 8.5 Events and lifecycle

- `events(listeners, options?)`: composition-level listeners.
- `childEvents(map, options?)`: scoped child element events.
- `rootEvents(listeners, options?)`: scoped to shadow root.
- `on(nameOrCallbacks, callback?)`: register lifecycle + prop/attr hooks.
- `onPropChanged(options)` / `onAttributeChanged(options)`: prop/attr callbacks.

### 8.6 Registry helpers

- `registrations`: map of registered element names to classes.
- `defined`, `elementName`: registration state helpers.
- `interpolatesTemplate`: template configuration flag.
- `supportsElementInternals`, `supportsElementInternalsRole`: feature flags.

## 9.0 Instance API (runtime)

- `render(...)`: initial render + incremental updates.
- `render.byProp(...)`: targeted updates for a single prop.
- `patch(patch)`: apply JSON merge patch, then render.
- `propChangedCallback(...)`: internal prop update hook.
- `attributeChangedCallback(...)`: standard hook, extended by CustomElement.
- `connectedCallback()` / `disconnectedCallback()`: standard hooks, extended by CustomElement.
- `compose()` / `composition`: composition creation and access.
- `refs`: id lookup proxy with WeakRef caching.
- `attributeCache`: parsed attribute cache (Map).
- `callbackArguments`: `{ composition, refs, html, inline, template, element }`.

## 10.0 Refs behavior

- `refs.fooBar` resolves `id="foo-bar"` in the template/rendered DOM.
- Before interpolation, `refs` uses the template and `#refsCompositionCache`.
- After interpolation, `refs` uses the live DOM and `#refsCache`.
