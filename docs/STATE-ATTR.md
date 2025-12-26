# State Sharing — Attribute Pattern

For parent-child communication, use a unidirectional data flow: **events up, attributes down**.

> **Prerequisites**: Read [STATE.md](STATE.md) and [STATE-EVENTS.md](STATE-EVENTS.md) first.

## Core Pattern

**Events Up**: Child components dispatch events (with `bubbles: true, composed: true`) to notify parent of changes.

**Attributes Down**: Parent updates observable properties which are bound to child element attributes.

**Key Benefits:**
- Clear data flow direction
- Parent owns the state
- Children are stateless and reusable
- Easy to reason about
- Testable in isolation

## How It Works

```
┌──────────────┐
│   Parent     │  ← Owns state
│  (manages)   │
└──────────────┘
      ↑│
 event││attribute
      ││
    ┌─┴┴──────┐
    │ Child A │  ← Fires events
    └─────────┘
         │
         │attribute
         ↓
    ┌─────────┐
    │ Child B │  ← Receives state
    └─────────┘
```

## Scenario: Calculator

Three components work together:
- `input-field` (Child A): User enters numbers, fires events up
- `calculator-app` (Parent): Receives events, computes total, passes down via attributes
- `display-total` (Child B): Receives total via attribute, displays it

### Child A: Input Field (fires events up)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    value: { type: 'float', value: 0 },
    label: 'string',
  })
  .html`
    <label>{label}</label>
    <input id="field" type="number" value={value}>
  `
  .childEvents({
    field: {
      input(event) {
        const newValue = parseFloat(event.target.value) || 0;
        // Dispatch event up to parent
        this.dispatchEvent(new CustomEvent('value-changed', {
          detail: { value: newValue },
          bubbles: true,
          composed: true,
        }));
      },
    },
  })
  .autoRegister('input-field');
```

### Parent: Calculator (manages state)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    valueA: { type: 'float', value: 0 },
    valueB: { type: 'float', value: 0 },
    total: { type: 'float', value: 0 },
  })
  .html`
    <div class="calculator">
      <input-field id="inputA" label="Value A"></input-field>
      <input-field id="inputB" label="Value B"></input-field>
      <display-total id="display"></display-total>
    </div>
  `
  .on({
    connected() {
      // Get child element references
      const inputA = this.shadowRoot.querySelector('#inputA');
      const inputB = this.shadowRoot.querySelector('#inputB');
      const display = this.shadowRoot.querySelector('#display');
      
      // Listen to events from inputA
      inputA.addEventListener('value-changed', (event) => {
        this.valueA = event.detail.value;
        this.total = this.valueA + this.valueB;
        // Manually update child attribute
        display.total = this.total;
      });
      
      // Listen to events from inputB
      inputB.addEventListener('value-changed', (event) => {
        this.valueB = event.detail.value;
        this.total = this.valueA + this.valueB;
        // Manually update child attribute
        display.total = this.total;
      });
    },
  })
  .autoRegister('calculator-app');
```

### Child B: Display (receives state via attributes)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    total: { type: 'float', value: 0 },
  })
  .expressions({
    totalLabel({ total }) {
      if (total == null) return '$0.00';
      return `$${total.toFixed(2)}`;
    },
  })
  .html`
    <div class="display">
      <strong>Total:</strong> {totalLabel}
    </div>
  `
  .autoRegister('display-total');
```

### Usage

```html
<calculator-app></calculator-app>
```

When user types in an input:
1. `input-field` dispatches `value-changed` event (bubbles up)
2. `calculator-app` receives event via direct child listener
3. Parent updates its `valueA` or `valueB` observable
4. Parent computes new `total`
5. Parent manually sets `display.total = this.total`
6. `display-total` receives new total and re-renders

## Data Flow Example

```
User types "5" in inputA
    ↓
input-field fires: { detail: { value: 5 }, bubbles: true }
    ↓
calculator-app receives event
    ↓
this.valueA = 5
this.total = 5 + valueB
display.total = 5
    ↓
display-total.total = 5
    ↓
Shadow DOM updates: "Total: $5.00"
```

## List Example: Todo App

Parent manages array of items, children communicate via events:

```js
// Child: Todo Item (fires events up)
export default CustomElement
  .extend()
  .observe({
    todoId: 'integer',
    text: 'string',
    completed: 'boolean',
  })
  .html`
    <input id="check" type="checkbox" checked={completed}>
    <span>{text}</span>
    <button id="delete">Delete</button>
  `
  .childEvents({
    check: {
      change(event) {
        this.dispatchEvent(new CustomEvent('todo-toggle', {
          detail: { id: this.todoId, completed: event.target.checked },
          bubbles: true,
          composed: true,
        }));
      },
    },
    delete: {
      click() {
        this.dispatchEvent(new CustomEvent('todo-delete', {
          detail: { id: this.todoId },
          bubbles: true,
          composed: true,
        }));
      },
    },
  })
  .autoRegister('todo-item');

// Parent: Todo List (manages state)
export default CustomElement
  .extend()
  .observe({
    todos: { type: 'array', value: [] },
  })
  .html`
    <div class="list">
      <todo-item mdw-for="{item of todos}" 
                 todo-id="{item.id}" 
                 text="{item.text}" 
                 completed="{item.completed}">
      </todo-item>
    </div>
  `
  .on({
    connected() {
      this.addEventListener('todo-toggle', (event) => {
        const { id, completed } = event.detail;
        this.todos = this.todos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        );
      });
      this.addEventListener('todo-delete', (event) => {
        const { id } = event.detail;
        this.todos = this.todos.filter((todo) => todo.id !== id);
      });
    },
  })
  .autoRegister('todo-list');
```

**How it works:**
- `mdw-for="{item of todos}"` - Loops over the `todos` array
- `todo-id="{item.id}"` - Binds `item.id` to the `todo-id` attribute
- When `todos` array changes, the framework automatically re-renders the list
- No manual DOM manipulation needed!

## Comparison with Other Patterns

| Aspect | Attributes (this doc) | Events Only ([STATE-EVENTS.md](STATE-EVENTS.md)) | Services ([STATE-SERVICE.md](STATE-SERVICE.md)) |
|--------|----------------------|--------------------------------------------------|------------------------------------------------|
| **Direction** | Bidirectional (events ↑, attrs ↓) | Any direction | Any direction |
| **Parent-Child** | Perfect fit | Works but less clear | No parent-child concept |
| **State Owner** | Parent component | Manager component or distributed | Centralized service |
| **Reusability** | High - children are pure | Medium | High - shared logic |
| **Complexity** | Low | Low | Medium |
| **Use Case** | Forms, lists, parent-child UI | Loosely coupled widgets | App-wide shared state |

## Best Practices

1. **Immutable Updates**: Always create new arrays/objects when updating observables (use `.map()`, `.filter()`, spread operator)
2. **Event Detail**: Include all necessary data in `event.detail`
3. **Event Names**: Use descriptive names like `value-changed`, not generic `change`
4. **Bubbling**: Always set `bubbles: true, composed: true` for parent-child events
5. **Stateless Children**: Children should not maintain derived state - receive everything via attributes
6. **Type Safety**: Use JSDoc to document event detail structure
7. **List Rendering**: Use `mdw-for="{item of array}"` for declarative list rendering
8. **Attribute Binding**: Use `{expression}` syntax in attributes for reactive bindings

## When to Use Attribute Pattern

**Good for:**
- Parent-child relationships
- Form components
- List/grid with items
- Wizard/stepper components
- Any container with managed children

**Not ideal for:**
- Deeply nested components (events bubble far)
- Sibling communication (use events on window)
- App-wide state (use services)
- Components that don't have a natural parent

## Debugging

The bidirectional flow is easy to trace:
1. **DevTools Event Breakpoints**: Set breakpoints on custom event names
2. **Observe Attributes**: Watch element attributes change in inspector
3. **Console Logging**: Log in parent's event handlers and child's observable setters

```js
// Debug parent receiving events
.on({
  'value-changed'(event) {
    console.log('Received:', event.detail);
    this.valueA = event.detail.value;
  },
})

// Debug child receiving attributes
.observe({
  total: {
    type: 'float',
    value: 0,
    changedCallback(oldValue, newValue) {
      console.log('Total changed:', oldValue, '→', newValue);
    },
  },
})
```
