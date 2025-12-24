# ObserverOptions

`ObserverOptions<T1,T2,C>` is the configuration object passed to `CustomElement.observe()` for each reactive property. It defines how a property behaves, including its type, default value, attribute binding, change callbacks, and mutation helpers.

## Quick reference table of all fields with their TypeScript types

| Property                   | Type                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| `type`                     | `T1`                                                                |
| `readonly`                 | `boolean`                                                           |
| `enumerable`               | `boolean`                                                           |
| `empty`                    | `T2`                                                                |
| `value`                    | `T2`                                                                |
| `nullable`                 | `boolean`                                                           |
| `parser`                   | `(this:C, value:any)=>T2`                                           |
| `nullParser`               | `(this:C, value:null\|undefined)=>T2`                               |
| `reflect`                  | `boolean\|'write'\|'read'`                                          |
| `attr`                     | `string`                                                            |
| `changedCallback`          | `(this:C, oldValue:T2, newValue:T2, changes:any)=>any`              |
| `propChangedCallback`      | `(this:C, name:string, oldValue:T2, newValue:T2, changes:any)=>any` |
| `attributeChangedCallback` | `(this:C, name:string, oldValue:string, newValue:string)=>any`      |
| `get`                      | `(this:C, data:Partial<C>, fn?:()=>T2)=>T2`                         |
| `set`                      | `(this:C, value:T2, fn?:(value2:T2)=>any)=>any`                     |
| `diff`                     | `(this:C, a:T2, b:T2)=>any`                                         |
| `is`                       | `(this:C, a:T2, b:T2)=>boolean`                                     |
| `props`                    | `Set<keyof C>`                                                      |

## T1 ↔ T2 Mapping

| ObserverPropertyType (`T1`) | JavaScript Type (`T2`) | Default Parser      | Default Empty Value |
| --------------------------- | ---------------------- | ------------------- | ------------------- |
| `'string'`                  | `string`               | ```${value}```      | `''`                |
| `'boolean'`                 | `boolean`              | `!!(value)`         | `false`             |
| `'float'`                   | `number`               | `+(value)`          | `0`                 |
| `'integer'`                 | `number`               | `Math.round(value)` | `0`                 |
| `'array'`                   | `any[]`                | `(value) => value`  | `[]`                |
| `'object'`                  | `Object`               | `(value) => value`  | `{}`                |
| `'map'`                     | `Map<any, any>`        | `new Map(value)`    | `new Map()`         |
| `'set'`                     | `Set<any>`             | `new Set(value)`    | `new Set()`         |
| `'function'`                | `Function`             | `value` (identity)  | `undefined`         |

When you provide only a type string or an initial value in `observe()`, the framework infers `T1` and `T2` automatically. For example:

```js
.observe({ enabled: 'boolean' }) // T1='boolean', T2=boolean, parser=Boolean, empty=false
```

You can also use the shorthand syntax by passing a string directly to `observe()` instead of an object:

```js
// Shorthand for { type: 'string' }
.observe({ title: 'string' })
```

## Grouping by Purpose

### 1️⃣ Definition
These options describe the core value of the property.

- **`type`** – The declared type string (e.g., `'string'`, `'integer'`). Determines default parser and empty value.
- **`value`** – Initial value when the component is instantiated. If omitted, it defaults to `empty` for that type.
- **`empty`** – Value used when the attribute is missing or set to an empty string. Defaults are derived from `type`.
- **`readonly`** – If `true`, attempts to modify the property after initialization will be ignored or throw, depending on configuration.
- **`nullable`** – Whether the property can hold `null`/`undefined`. Defaults to `false`, except for non‑boolean types without an explicit `empty` value.
- **`enumerable`** – Whether the property shows up in enumeration (`for…in`). Defaults to `true`; properties starting with `_` are automatically set to `false`.
- **`parser`** – Function that converts incoming values into the runtime type. Automatically inferred from `type`; override only for custom parsing.
- **`nullParser`** – Handles `null`/`undefined` inputs when `nullable` is true. Defaults to the same logic as `parser`.

### 2️⃣ Attribute Binding
These options control how a property maps to a DOM attribute and whether it can be modified from outside.

- **`reflect`** – Determines if the property syncs with an attribute (`true`/`'read'`, `'write'`, or `false`). Defaults: `true` for enumerable primitive properties, otherwise `false` unless an explicit `attr` is supplied.
- **`attr`** – Custom attribute name. If omitted and `reflect` is truthy, the framework uses a kebab‑cased version of the property key.

### 3️⃣ Callbacks
Hooks that run when values change or attributes update. All of these callbacks are defined per‑property, not globally on the `CustomElement`.

- **`changedCallback`** – Invoked whenever the property's value changes. Receives old/new values and an optional diff object.
- **`propChangedCallback`** – Similar to `changedCallback`, but also receives the property name (`name`). This is primarily intended for templating scenarios where a single handler dispatches based on which property changed.
- **`attributeChangedCallback`** – Runs after an observed attribute changes. Receives the attribute name and its old/new string values.

### 4️⃣ Mutation / Computed Helpers
These options help create derived or computed properties and manage internal state.

- **`get`** – Custom getter that can compute a value based on other properties. When provided, the framework automatically generates `props` by inspecting which properties the getter accesses.
- **`set`** – Custom setter logic; receives the new value and an optional callback for validation or transformation.
- **`diff`** – Function to compute differences between two values of type `T2`. For objects it defaults to JSON Merge Patch (RFC 7386); otherwise a shallow comparison is used. The framework treats a return value of `null` or `undefined` as *no change*. Both `diff` and `is` already perform null checks internally, so you don't need to handle them separately.
- **`is`** – Equality checker. Defaults to `Object.is` for non‑objects, JSON Merge Patch comparison for objects, and always `false` for arrays. It is only consulted when no custom `diff` function is provided; it also performs null checks internally.
- **`props`** – Set of other observable properties that should be invalidated when this property changes (auto‑generated if a custom `get` is used).
- **`watchers`** – Array of `[keyof C, callback]` tuples; each runs when its associated property changes.

## Examples

### Simple shorthand declarations

```js
.observe({
  title: 'string',
  enabled: 'boolean',
});
```

### Full `ObserverOptions` with callbacks (avoid overriding defaults unless needed)

```js
.observe({
  count: {
    type: 'integer',
    // `value` defaults to 0 for integer types.
    // `reflect` defaults to `'read'` for non‑boolean enumerable properties.
    // No custom parser: the framework will use the default integer parser.
    changedCallback(oldValue, newValue, changes) {
      console.log('count changed', oldValue, newValue, changes);
    }
  }
})
```

### Objects use JSON Merge Patch by default for diffs/equality (see `diff` / `is` docs). Arrays are treated as unequal by default.

```js
.observe({
  settings: {
    type: 'object',
    value: { theme: 'light' },
    // No custom diff or is needed – framework supplies JSON Merge Patch.
  }
})
```

### Computed property using `get` (the framework will auto‑generate `props` by inspecting the getter)

```js
.observe({
  firstName: 'string',
  lastName: 'string',
  fullName: {
    get(thisData) {
      return `${thisData.firstName ?? ''} ${thisData.lastName ?? ''}`.trim();
    }
  }
})
```

### Using a single `propChangedCallback` for multiple properties

You can share the same callback across several properties by assigning it to each property’s `propChangedCallback`. The function receives the property name, so you can distinguish which one changed.

```js
// Persist changed values to localStorage. The callback receives the property
// name, so we can store each value under a unique key.
function persistToLocalStorage(name, oldValue, newValue) {
  const key = `myapp-${name}`;
  if (newValue !== undefined && newValue !== null) {
    localStorage.setItem(key, JSON.stringify(newValue));
  } else {
    localStorage.removeItem(key);
  }
}

CustomElement.extend().observe({
  theme: { type: 'string', propChangedCallback: persistToLocalStorage },
  fontSize: { type: 'integer', propChangedCallback: persistToLocalStorage }
});
```



### Using `diff` and `is`

```js
.observe({
  title: {
    type: 'string',
    value: 'Hello World',
    is(a, b) {
      // A and B have already been null-checked
      return a.trim().toLowerCase() != b.trim().toLowerCase();
    }
  },
  settings: {
    type: 'object',
    value: { enabled: false, theme: 'light', fontSize: 14 },
    // For objects, use JSON Merge Patch to compute the diff.
    diff(a, b) {
      if (!a.enabled && !b.enabled) return null; // Don't invoke unless enabled
      return buildMergePatch(a, b); // assumes buildMergePatch is imported
    }
  }
});
```
