# State Arrays

This document describes how array state changes are detected and rendered.

## 1.0 Summary

- Array assignment triggers a render for the array property.
- In-place mutations do not notify; call `render()` or `patch()` explicitly.
- `render()` does not mutate state; `patch()` mutates state and renders.
- Rendering is synchronous; no waiting is required.
- Assigning the same array reference triggers a render; use it to force a re-render.
- Reordering moves DOM nodes to match the new indices.

## 2.0 Assignment (`el.data = nextArray`)

- Replaces the array value on the component.
- Triggers a render for `data` automatically (synchronous).
- Best for full replacement, reorders, or length changes.
- In-place mutations (`el.data[1].title = 'x'`) do not notify.
- Assigning the same array reference forces a re-render, but does not change the array value.
- Reordering can move DOM nodes; do not assume index-stable DOM nodes after a reorder.

## 3.0 Patch (`el.patch({ data: change })`)

- Applies a JSON Merge Patch to the component state and renders (synchronous).
- Good for "update + render" in one call.
- If `data` is an array in the patch, it **replaces** the array.
- If `data` is an object, it **merges by index/length** (object-like patch).
- Setting an index to `null` clears the data value but does not remove the existing row
  from the DOM; use `length` if you want rows removed.

## 4.0 Render (`el.render({ data: change })`)

- Triggers a render without mutating `el.data` (synchronous).
- Use this after in-place mutations or when you want a partial update.
- For arrays, `change` can be:
  - Full array: `el.render({ data: el.data })`
  - Partial index map: `el.render({ data: { 1: el.data[1] } })`
- If the array length changes, also update `el.data` so the iterable uses the new length.
- Rendering a partial index does not change array length.

## 5.0 Examples

### 5.1 Assignment Examples

#### 5.1.a Replace the array

```js
el.data = newData;
```

#### 5.1.b Swap two rows

```js
// Example with a local array
const data = el.data;
const tmp = data[1];
data[1] = data[3];
data[3] = tmp;
el.data = data;

```

#### 5.1.c Update a deep row field

```js
// Example with a local array
const data = el.data;
data[2] = { ...data[2], title: 'Updated' };
el.data = data;

```

#### 5.1.d Clear all rows

```js
el.data = [];
```

#### 5.1.e Sort or filter from an existing array

```js
el.data = el.data.sort((a, b) => a.title.localeCompare(b.title));
```

### 5.2 Patch Examples

#### 5.2.a Patch and truncate rows

```js
el.patch({ data: { length: 1 } });
```

#### 5.2.b Patch a single index

```js
el.patch({ data: { 2: { title: 'Updated' } } });
```

#### 5.2.c Clear a single index (leaves DOM row)

```js
el.patch({ data: { 1: null } });
```

#### 5.2.d Replace the full array via patch

```js
el.patch({ data: [{ title: 'row-0' }, { title: 'row-1' }] });
```

#### 5.2.e Truncate and update in one patch

```js
el.patch({ data: { 0: { title: 'row-0b' }, length: 1 } });
```

### 5.3 Render Examples

#### 5.3.a Insert in the middle

```js
const next = el.data.slice();
next.splice(1, 0, { title: 'row-new' });
el.data = next;
```


#### 5.3.b Remove from the middle

```js
const next = el.data.slice();
next.splice(1, 1);
el.data = next;
```

#### 5.3.c Reorder without changing items

```js
el.data = [el.data[2], el.data[1], el.data[0]];
```

Focus stays on the moved DOM node, which can preserve user focus during reorders:

```js
button.focus(); // user focuses row-1
el.data = [el.data[2], el.data[1], el.data[0]];
// The same DOM node moves, so focus remains on row-1.
```

#### 5.3.d Partial render for a single row

```js
el.data[2].title = 'Updated';
el.render({ data: { 2: el.data[2] } });
```

## 8.0 Gotchas

- In-place mutations are ignored unless followed by `render()` or `patch()`.
- `render()` updates the DOM only; it does not update `el.data`.
- `patch()` updates `el.data` and renders, but array handling is object-merge.
- Deleting an index via `null` does not remove the DOM row; use `length` to truncate.
- Length-only patching of nested arrays (e.g. `{ items: { 1: { tags: { length: 1 } } } }`) does not trim nested `mdw-for` loops; replace the nested array to remove rows.
