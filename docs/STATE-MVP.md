# State Management — MVP Pattern

For external data sources (APIs, databases, stores), use the **Model-View-Presenter (MVP)** pattern where a store owns data and notifies views.

> **Prerequisites**: Read [STATE.md](STATE.md) first for element-local state basics.

## Overview

- **Model**: Store that holds data and business logic (e.g., `UserStore`)
- **View**: The rendered DOM (shadow DOM elements)
- **Presenter**: The CustomElement itself - subscribes to Model events in `connected()`, transforms data via expressions, updates the View (DOM)

The CustomElement acts as the Presenter: it retrieves data from the Model (store), formats it (via expressions), and updates the View (its shadow DOM).

## Pattern 1: Full State Assignment

Store the entire state object in a single observable property. The framework automatically generates a JSON Merge Patch and updates only the affected DOM nodes.

**When to use**: Simple components where the entire state object changes together, or when you want the element to own a complete copy of the state.

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';
import UserStore from '../services/UserStore.js';

export default CustomElement
  .extend()
  .observe({
    _user: {
      type: 'object',
      /** @type {{name: string, address: {city: string, state: string}}} */
      value: null,
    },
  })
  .set({
    _listener: null,
  })
  .expressions({
    fullAddress({ _user }) {
      if (!_user?.address) return '';
      return `${_user.address.city}, ${_user.address.state}`;
    },
  })
  .html`
    <div id="name">{_user.name}</div>
    <div id="addr">{fullAddress}</div>
  `
  .on({
    connected() {
      // Subscribe to full state updates
      this._listener = UserStore.on('put', (user) => {
        this._user = user; // Assigns full object, framework diffs and updates selectively
      });
      
      // Load initial state
      this._user = UserStore.get();
    },
    disconnected() {
      this._listener = UserStore.off('put', this._listener);
    },
  })
  .autoRegister('demo-user-full');
```

**How it works**:
- Element stores complete state in `_user` property
- When `_user` is assigned a new object, the framework compares old vs new
- Only changed properties trigger expression recalculation and DOM updates
- Best for nested data structures where you want a single source of truth

## Pattern 2: Partial State with Flattened Properties

Store state as individual observable properties. Update only the properties that changed.

**When to use**: When different parts of state update independently, or when you want explicit control over which properties exist on the element.

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';
import UserStore from '../services/UserStore.js';

export default CustomElement
  .extend()
  .observe({
    name: 'string',
    address: {
      type: 'object',
      /** @type {{city: string, state: string}} */
      value: null,
    },
  })
  .set({
    _listener: null,
  })
  .expressions({
    fullAddress({ address }) {
      if (!address) return '';
      return `${address.city}, ${address.state}`;
    },
  })
  .html`
    <div id="name">{name}</div>
    <div id="addr">{fullAddress}</div>
  `
  .on({
    connected() {
      // Subscribe to full state updates
      this._listener = UserStore.on('put', (data) => {
        // Use helper to patch only changed properties in batch
        this.patch(data);
      });

      // Load initial state
      const initial = UserStore.get();
      this.patch(initial);
    },
    disconnected() {
      this._listener = UserStore.off('put', this._listener);
    },
  })
  .autoRegister('demo-user-partial');
```

**How it works**:
- Element has separate observable properties (`name`, `address`)
- `this.patch(data)` applies only changed properties from the data object
- Only updated properties trigger their dependent expressions
- If only `name` changes, `fullAddress` expression won't recalculate
- More granular control and potentially better performance

## Pattern 3: Stateless View

The element stores no state. The presenter provides both patch and full data, element renders directly using `render(patch, data)`.

**When to use**: 
- Maximum performance (no state diffing overhead)
- When the presenter/store already computes patches
- When you want the element to be a pure presentation layer

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';
import UserStore from '../services/UserStore.js';

export default CustomElement
  .extend()
  .set({
    _onPatch: null,
  })
  .expressions({
    fullAddress({ address }) {
      if (!address) return '';
      return `${address.city}, ${address.state}`;
    },
  })
  .html`
    <div id="name">{name}</div>
    <div id="addr">{fullAddress}</div>
  `
  .on({
    connected() {
      // Subscribe to patch events
      this._onPatch = UserStore.on('patch', (patch, data) => {
        // Directly render with patch information
        this.render(patch, data);
      });
      
      // Render initial state
      const initial = UserStore.get();
      if (initial) {
        this.render(initial);
      }
    },
    disconnected() {
      UserStore.off('patch', this._onPatch);
    },
  })
  .autoRegister('demo-user-stateless');
```

**How it works**:
- Element has no observable state properties for user data
- `render(patch, data)` receives:
  - `patch`: Object with only the changed properties
  - `data`: (Optional) Full current state for reference
- Framework uses patch to determine which expressions need recalculation
- Most efficient for frequently updating views

## Example Store Implementation

Here's a minimal store implementation that supports all three patterns:

```js
class UserStore {
  _data = null;
  _et = new EventTarget();
  _wrappers = new Map();

  get() { 
    return this._data; 
  }

  /** Full state replacement */
  set(obj) {
    this._data = this._data ? Object.assign(this._data, obj) : { ...obj };
    
    // Emit 'put' event with full state
    this._et.dispatchEvent(new CustomEvent('put', { 
      detail: this._data 
    }));
    
    // Also emit 'patch' event
    this._et.dispatchEvent(new CustomEvent('patch', { 
      detail: { patch: this._data, data: this._data } 
    }));
  }

  /** Partial state update */
  patch(patch) {
    Object.assign(this._data, patch);
    
    // Emit 'patch' event with patch and full state
    this._et.dispatchEvent(new CustomEvent('patch', { 
      detail: { patch, data: this._data } 
    }));
  }

  /** Subscribe to events */
  on(name, handler) {
    const wrapper = (e) => {
      const detail = e?.detail;
      if (name === 'patch') {
        handler(detail.patch, detail.data);
      } else {
        handler(detail);
      }
    };
    this._wrappers.set(handler, wrapper);
    this._et.addEventListener(name, wrapper);
    return wrapper;
  }

  /** Unsubscribe from events */
  off(name, handler) {
    const wrapper = this._wrappers.get(handler);
    if (wrapper) {
      this._et.removeEventListener(name, wrapper);
    }
    this._wrappers.delete(handler);
    return null;
  }
}

export default new UserStore();
```

## Choosing a Pattern

| Pattern           | State Storage                | Performance | Complexity | Use Case                                  |
| ----------------- | ---------------------------- | ----------- | ---------- | ----------------------------------------- |
| **Full State**    | Element owns copy            | Good        | Low        | Simple components, nested data            |
| **Partial State** | Element owns flat properties | Better      | Medium     | Independent state properties              |
| **Stateless**     | No state storage             | Best        | Low        | Pure presentation, high-frequency updates |

## Key Concepts

1. **Automatic Diffing**: When you assign to observable properties, the framework computes what changed
2. **Selective Updates**: Only expressions that depend on changed properties recalculate
3. **Efficient DOM Updates**: Only affected DOM nodes are updated
4. **Event Lifecycle**: Always subscribe in `connected()` and unsubscribe in `disconnected()`
5. **Patch-based Rendering**: `render(patch, data)` allows external diff computation for maximum efficiency

