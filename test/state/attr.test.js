import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('State Attributes', () => {
  /** @type {HTMLElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should pass state down via attributes and receive events up', async () => {
    // Child A: Input Field (fires events up)
    const InputField = CustomElement
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
            const newValue = Number.parseFloat(event.target.value) || 0;
            // Dispatch event up to parent
            this.dispatchEvent(new CustomEvent('value-changed', {
              detail: { value: newValue },
              bubbles: true,
              composed: true,
            }));
          },
        },
      })
      .register('input-field-test');

    // Child B: Display (receives state via attributes)
    const DisplayTotal = CustomElement
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
      .register('display-total-test');

    // Parent: Calculator (manages state)
    const CalculatorApp = CustomElement
      .extend()
      .observe({
        valueA: { type: 'float', value: 0 },
        valueB: { type: 'float', value: 0 },
        total: { type: 'float', value: 0 },
      })
      .html`
        <div class="calculator">
          <input-field-test id="inputA" label="Value A"></input-field-test>
          <input-field-test id="inputB" label="Value B"></input-field-test>
          <display-total-test id="display"></display-total-test>
        </div>
      `
      .on({
        connected() {
          // Listen on specific children
          const inputA = this.shadowRoot.querySelector('#inputA');
          const inputB = this.shadowRoot.querySelector('#inputB');
          const display = this.shadowRoot.querySelector('#display');

          inputA.addEventListener('value-changed', (event) => {
            this.valueA = event.detail.value;
            this.total = this.valueA + this.valueB;
            display.total = this.total;
          });

          inputB.addEventListener('value-changed', (event) => {
            this.valueB = event.detail.value;
            this.total = this.valueA + this.valueB;
            display.total = this.total;
          });
        },
      })
      .register('calculator-app-test');

    container.innerHTML = '<calculator-app-test></calculator-app-test>';

    await customElements.whenDefined('input-field-test');
    await customElements.whenDefined('display-total-test');
    await customElements.whenDefined('calculator-app-test');

    const calculator = container.querySelector('calculator-app-test');
    await Promise.resolve();

    const inputA = calculator.shadowRoot.querySelector('#inputA');
    const inputB = calculator.shadowRoot.querySelector('#inputB');
    const display = calculator.shadowRoot.querySelector('#display');

    await Promise.resolve();

    // Initial state
    assert.equal(calculator.valueA, 0, 'Initial valueA is 0');
    assert.equal(calculator.valueB, 0, 'Initial valueB is 0');
    assert.equal(calculator.total, 0, 'Initial total is 0');
    assert.equal(display.total, 0, 'Display shows 0');
    assert.include(display.shadowRoot.querySelector('.display').textContent, '$0.00', 'Display renders $0.00');

    // User types in inputA
    const fieldA = inputA.shadowRoot.querySelector('#field');
    fieldA.value = '10';
    fieldA.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();

    // Parent should update and pass down to display
    assert.equal(calculator.valueA, 10, 'Parent valueA updated to 10');
    assert.equal(calculator.total, 10, 'Parent total updated to 10');
    assert.equal(display.total, 10, 'Display received total 10 via attribute');
    assert.include(display.shadowRoot.querySelector('.display').textContent, '$10.00', 'Display renders $10.00');

    // User types in inputB
    const fieldB = inputB.shadowRoot.querySelector('#field');
    fieldB.value = '5.5';
    fieldB.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();

    // Parent should compute new total
    assert.equal(calculator.valueB, 5.5, 'Parent valueB updated to 5.5');
    assert.equal(calculator.total, 15.5, 'Parent total updated to 15.5');
    assert.equal(display.total, 15.5, 'Display received total 15.5 via attribute');
    assert.include(display.shadowRoot.querySelector('.display').textContent, '$15.50', 'Display renders $15.50');

    // Update inputA again
    fieldA.value = '20';
    fieldA.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();

    assert.equal(calculator.total, 25.5, 'Parent total updated to 25.5');
    assert.equal(display.total, 25.5, 'Display received total 25.5 via attribute');
  });

  it('should manage todo list with events up and attributes down', async () => {
    // Child: Todo Item (fires events up)
    const TodoItem = CustomElement
      .extend()
      .observe({
        todoId: 'integer',
        text: 'string',
        completed: 'boolean',
      })
      .html`
        <input id="check" type="checkbox" checked={completed}>
        <span class="text">{text}</span>
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
      .register('todo-item-test');

    // Parent: Todo List (manages state)
    const TodoList = CustomElement
      .extend()
      .observe({
        todos: { type: 'array', value: [] },
      })
      .html`
        <div class="list" id="list">
          <todo-item-test mdw-for="{item of todos}" todo-id="{item.id}" text="{item.text}" completed="{item.completed}"></todo-item-test>
        </div>
      `
      .on({
        connected() {
          this.addEventListener('todo-toggle', (event) => {
            const { id, completed } = event.detail;
            this.todos = this.todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo));
          });
          this.addEventListener('todo-delete', (event) => {
            const { id } = event.detail;
            this.todos = this.todos.filter((todo) => todo.id !== id);
          });
        },
      })
      .register('todo-list-test');

    container.innerHTML = '<todo-list-test></todo-list-test>';

    await customElements.whenDefined('todo-item-test');
    await customElements.whenDefined('todo-list-test');

    const todoList = container.querySelector('todo-list-test');
    await Promise.resolve();

    // Set initial todos
    todoList.todos = [
      { id: 1, text: 'Buy milk', completed: false },
      { id: 2, text: 'Walk dog', completed: false },
      { id: 3, text: 'Write code', completed: true },
    ];
    await Promise.resolve();

    const items = todoList.shadowRoot.querySelectorAll('todo-item-test');
    assert.equal(items.length, 3, 'Three todo items rendered');

    // Check attributes passed down
    assert.equal(items[0].todoId, 1, 'Item 1 has correct id');
    assert.equal(items[0].text, 'Buy milk', 'Item 1 has correct text');
    assert.equal(items[0].completed, false, 'Item 1 is not completed');
    assert.equal(items[2].completed, true, 'Item 3 is completed');

    // Toggle first item
    const checkbox = items[0].shadowRoot.querySelector('#check');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    await Promise.resolve();

    // Parent should update state and pass back down
    assert.equal(todoList.todos[0].completed, true, 'Item 1 marked completed in parent');

    const updatedItems = todoList.shadowRoot.querySelectorAll('todo-item-test');
    assert.equal(updatedItems[0].completed, true, 'Item 1 attribute updated to completed');

    // Delete second item
    const deleteBtn = updatedItems[1].shadowRoot.querySelector('#delete');
    deleteBtn.click();
    await Promise.resolve();

    // Parent should filter out deleted item
    assert.equal(todoList.todos.length, 2, 'Two items remain');
    assert.equal(todoList.todos[0].id, 1, 'Item 1 still exists');
    assert.equal(todoList.todos[1].id, 3, 'Item 3 still exists');

    const finalItems = todoList.shadowRoot.querySelectorAll('todo-item-test');
    assert.equal(finalItems.length, 2, 'Two todo items rendered');
    assert.equal(finalItems[0].text, 'Buy milk', 'First item is Buy milk');
    assert.equal(finalItems[1].text, 'Write code', 'Second item is Write code');
  });

  it('should support multiple levels of nesting', async () => {
    let grandparentValue = 0;

    // Grandchild (fires events up)
    const Counter = CustomElement
      .extend()
      .observe({
        value: { type: 'integer', value: 0 },
      })
      .html`
        <button id="inc">+</button>
        <span>{value}</span>
      `
      .childEvents({
        inc: {
          click() {
            this.dispatchEvent(new CustomEvent('increment', {
              bubbles: true,
              composed: true,
            }));
          },
        },
      })
      .register('counter-test');

    // Middle component (passes through)
    const Panel = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0 },
      })
      .html`
        <div class="panel">
          <counter-test value={count}></counter-test>
        </div>
      `
      .register('panel-test');

    // Top-level (manages state)
    const App = CustomElement
      .extend()
      .observe({
        total: { type: 'integer', value: 0 },
      })
      .html`
        <panel-test count={total}></panel-test>
        <div class="result">{total}</div>
      `
      .on({
        connected() {
          this.addEventListener('increment', () => {
            grandparentValue++;
            this.total++;
          });
        },
      })
      .register('app-test');

    container.innerHTML = '<app-test></app-test>';

    await customElements.whenDefined('counter-test');
    await customElements.whenDefined('panel-test');
    await customElements.whenDefined('app-test');

    const app = container.querySelector('app-test');
    await Promise.resolve();

    const panel = app.shadowRoot.querySelector('panel-test');
    const counter = panel.shadowRoot.querySelector('counter-test');

    // Initial state
    assert.equal(app.total, 0, 'App total is 0');
    assert.equal(panel.count, 0, 'Panel count is 0');
    assert.equal(counter.value, 0, 'Counter value is 0');

    // Click increment in deeply nested counter
    counter.shadowRoot.querySelector('#inc').click();
    await Promise.resolve();

    // Event should bubble all the way up and state flow back down
    assert.equal(grandparentValue, 1, 'Grandparent received event');
    assert.equal(app.total, 1, 'App total updated to 1');
    assert.equal(panel.count, 1, 'Panel count updated to 1');
    assert.equal(counter.value, 1, 'Counter value updated to 1');
    assert.equal(app.shadowRoot.querySelector('.result').textContent, '1', 'Result displays 1');
  });
});
