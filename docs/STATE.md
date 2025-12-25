# State Management — Element-Local State

A lightweight state system for managing component-local state with automatic DOM updates and computed values.

## Overview

State is declared directly on the element using `.observe()` and updated by assigning to properties. The framework automatically tracks changes and updates only the affected parts of the DOM.

**Core concepts:**
- **Observable properties**: Declared with `.observe()`, automatically trigger updates when changed
- **Expressions**: Computed values that depend on observable properties
- **Template bindings**: Connect state to DOM using `{property}` syntax
- **CSS reactions**: Styles respond to state via attributes and CSS variables
- **Automatic updates**: Framework diffs changes and updates only what's necessary

## Basic Example

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    count: {
      type: 'integer',
      value: 0,
    },
    name: {
      type: 'string',
      value: 'World',
    },
    // Computed observables can be defined inline
    isPositive({ count }) {
      return count > 0;
    },
  })
  .expressions({
    greeting({ name }) {
      if (!name) return '';
      return `Hello, ${name}!`;
    },
    statusText({ isPositive }) {
      return isPositive ? 'Positive' : 'Zero or negative';
    },
  })
  .html`
    <h3>{greeting}</h3>
    <div>Count: {count}</div>
    <button id="inc">Increment</button>
    <div id="status" positive={isPositive}>
      {statusText}
    </div>
  `
  .css`
    #status { color: gray; }
    #status[positive] { color: green; }
  `
  .childEvents({
    inc: {
      click() {
        this.count++; // Automatically updates DOM
      },
    },
  })
  .autoRegister('counter-demo');
```

**How it works:**
1. Observable properties are declared with `.observe()` with inline default values
2. Computed observables (like `isPositive`) can be defined directly in `.observe()`
3. Expressions provide additional computed values that may depend on other computed observables
4. Templates bind to properties, computed observables, and expressions
5. When `this.count++` executes, framework updates only affected DOM nodes

## Observable Properties

Declare properties that trigger updates when changed:

```js
.observe({
  // Simple declarations with inline defaults
  name: { type: 'string', value: 'World' },
  count: { type: 'integer', value: 0 },
  enabled: { type: 'boolean', value: false },
  
  // Computed observables (depend on other observables)
  total({ price, quantity }) {
    return price * quantity;
  },
})
```

**Common types**: `string`, `integer`, `float`, `boolean`, `array`, `object`

See [OBSERVABLE_PROPERTIES.md](OBSERVABLE_PROPERTIES.md) for complete type reference and advanced configuration options.

## Expressions

Expressions compute display values from observables:

```js
.observe({
  price: { type: 'float', value: 10 },
  quantity: { type: 'integer', value: 1 },
  
  // Computed observable - fires events, can be observed
  total({ price, quantity }) {
    return price * quantity;
  },
})
.expressions({
  // Expression - for display only, no events
  totalLabel({ total }) {
    if (total == null) return '';
    return `$${total.toFixed(2)}`;
  },
})
```

**Computed Observable vs Expression:**

| Feature | Computed Observable (`.observe()`) | Expression (`.expressions()`) |
|---------|-----------------------------------|------------------------------|
| **Purpose** | Core state calculations | Display formatting |
| **Events** | ✅ Fires `propertyChanged` events | ❌ No events |
| **Use with `.on()`** | ✅ Yes | ❌ No |
| **Dependencies** | Other observables | Observables + computed observables |
| **When to use** | When other code needs to observe | Template-only display logic |

**Always include null checks** - both run during initialization before values are set.

## Observing Property Changes

Observable properties and computed observables fire change events that can be listened to using `.on()`:

```js
.observe({
  count: { type: 'integer', value: 0 },
  price: { type: 'float', value: 10 },
  
  // Computed observable - fires events when dependencies change
  total({ count, price }) {
    return count * price;
  },
})
.on({
  // Listen to regular observable changes
  countChanged(value, oldValue) {
    console.log(`Count changed from ${oldValue} to ${value}`);
  },
  
  // Listen to computed observable changes
  totalChanged(value, oldValue) {
    console.log(`Total changed from ${oldValue} to ${value}`);
  },
  
  // Lifecycle events
  connected() {
    console.log('Element connected to DOM');
  },
  disconnected() {
    console.log('Element disconnected from DOM');
  },
})
```

**Event naming convention:**
- Property `count` fires `countChanged(newValue, oldValue)`
- Property `isActive` fires `isActiveChanged(newValue, oldValue)`

**Important:** Expressions defined in `.expressions()` do **not** fire change events. Only observables and computed observables in `.observe()` fire events.

## Template Bindings

Bind observables, computed observables, and expressions to DOM:

```html
<h3>{title}</h3>
<img src={thumbnail} alt={title} />
<button disabled={!hasStock}>Add</button>
```

**Allowed**: `{property}`, `{!property}`, `{!!property}`  
**Not allowed**: Complex logic - use expressions instead

## CSS State Reactions

Style elements based on state using attributes:

```css
/* Boolean state */
#overlay { 
  opacity: 0; 
  visibility: hidden; 
  transition: opacity 0.2s;
}
#overlay[busy] { 
  opacity: 1; 
  visibility: visible; 
}

/* Value-based */
.badge {
  display: none;
}
.badge[count] {
  display: block;
}

/* CSS variables (if using custom properties) */
:host {
  --item-count: attr(count);
}
```

## Updating State

Assign to properties to trigger updates:

```js
// Direct assignment
this.count = 5;
this.count++;

// Arrays and objects - create new instances
this.items = [...this.items, newItem];
this.config = { ...this.config, theme: 'dark' };

// Batch updates
this.patch({ title: 'New', price: 29.99 });
```

## Batch Updates with `patch()`

Update multiple properties efficiently in a single operation:

```js
.methods({
  async loadUser() {
    this.busy = true;
    
    const user = await fetch('/api/user/123').then(r => r.json());
    
    // Update all properties at once
    this.patch({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });
    
    this.busy = false;
  },
})
```

**Benefits:**
- Single DOM update cycle
- Only changed properties trigger expression updates
- Cleaner than multiple assignments

## Complete Example: Product Card

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    productId: 'integer',
    title: 'string',
    price: 'float',
    stock: 'integer',
    thumbnail: 'string',
    busy: { type: 'boolean', value: false },
    
    // Computed observable
    hasStock({ stock }) {
      return stock > 0;
    },
  })
  .expressions({
    priceLabel({ price }) {
      if (price == null) return '';
      return `$${price.toFixed(2)}`;
    },
    stockLabel({ stock }) {
      if (stock == null) return '';
      if (stock === 0) return 'Out of stock';
      if (stock < 5) return `Only ${stock} left`;
      return 'In stock';
    },
  })
  .html`
    <div id="overlay" busy={busy}>Loading…</div>
    <img src={thumbnail} alt={title} />
    <h3>{title}</h3>
    <div class="price">{priceLabel}</div>
    <div class="stock">{stockLabel}</div>
    <button id="add" disabled={!hasStock}>
      Add to cart
    </button>
  `
  .css`
    :host {
      display: block;
      position: relative;
      padding: 16px;
      border: 1px solid #ddd;
    }
    
    #overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.9);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s;
    }
    
    #overlay[busy] {
      opacity: 1;
      visibility: visible;
    }
    
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .price {
      font-size: 1.5em;
      font-weight: bold;
      color: #2196F3;
    }
  `
  .methods({
    async refresh() {
      this.busy = true;
      
      try {
        const response = await fetch(`/api/products/${this.productId}`);
        const data = await response.json();
        
        // Update all product properties
        this.patch({
          title: data.title,
          price: data.price,
          stock: data.stock,
          thumbnail: data.thumbnail,
        });
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        this.busy = false;
      }
    },
  })
  .on({
    connected() {
      // Load data when element is added to DOM
      if (this.productId) {
        this.refresh();
      }
    },
  })
  .childEvents({
    add: {
      click() {
        // Dispatch custom event for parent to handle
        this.dispatchEvent(new CustomEvent('add-to-cart', {
          bubbles: true,
          detail: { productId: this.productId },
        }));
      },
    },
  })
  .autoRegister('product-card');
```

## Best Practices

1. **Keep state flat** - individual properties detect changes better than nested objects
2. **Computed observables vs expressions** - use observables when other code needs to observe, expressions for display-only
3. **Destructure dependencies** - `({ price, quantity })` explicitly declares what each computation uses
4. **Always null check** - computed observables and expressions run during initialization
5. **Use `patch()` for bulk updates** - single update cycle vs multiple assignments
6. **Immutable array/object updates** - create new instances: `[...items, item]`, `{...config, key: val}`

## When to Use Element-Local State

**Good for:**
- Self-contained components (buttons, cards, forms)
- UI state (open/closed, selected, loading)
- Form inputs and validation
- Component-specific calculations

**Not ideal for:**
- Shared state across multiple components
- Data from external sources (APIs, databases)
- Application-level state management

For external data sources and shared state, see [STATE-MVP.md](./STATE-MVP.md) for presenter-driven patterns.

## Type Safety

Add TypeScript or JSDoc types for better tooling:

```js
.observe({
  /** @type {string} */
  name: 'string',
  
  items: {
    type: 'array',
    /** @type {Array<{id: number, title: string}>} */
    value: [],
  },
  
  config: {
    type: 'object',
    /** @type {{theme: string, locale: string}} */
    value: { theme: 'light', locale: 'en' },
  },
})
```
