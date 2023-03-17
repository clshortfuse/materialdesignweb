import '../../components/Input.js';
import '../../components/Slider.js';
import '../../components/Divider.js';
import '../../components/IconButton.js';
import '../../components/Progress.js';

import Card from '../../components/Card.js';
import '../../typography/Label.js';

/**
 * @param {number} min
 * @param {number} max
 * @return {Promise<void>}
 */
function asyncStall(min = 100, max = 1000) {
  return new Promise((resolve) => setTimeout(resolve, (Math.random() * (max - min)) + min));
}

export default Card
  .extend()
  .setSchema(
    {
      id: 1,
      title: 'iPhone 9',
      description: 'An apple mobile which is nothing like apple',
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
      images: ['https://i.dummyjson.com/data/products/1/1.jpg', 'https://i.dummyjson.com/data/products/1/2.jpg', 'https://i.dummyjson.com/data/products/1/3.jpg', 'https://i.dummyjson.com/data/products/1/4.jpg', 'https://i.dummyjson.com/data/products/1/thumbnail.jpg'],
    },
  )
  .observe({
    productId: {
      type: 'integer',
      empty: 1,
    },
    busy: {
      type: 'boolean',
      reflect: false,
    },
  })
  .set({
    /** @type {number} */
    lastFetchedId: null,
    /** @type {AbortController} */
    fetchAbortController: null,
    outlined: true,
  })
  .css/* css */`
    :host() {
      position:relative;
    }
    #overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      inset: 0;
      visibility: hidden;
      z-index:5;
      transition-property: visibility, opacity;
      transition-duration: 200ms;
      opacity: 0;
    }
    #overlay[busy] {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }
    #content[busy] {
      filter: blur(2px);
    }
    #form {
      position: relative;
      overflow: hidden;
    }
    fieldset{ display: contents;}
  `
  .html/* html */`
    <form id=form>
      <div id=overlay busy={busy}>
        <mdw-progress circle></mdw-progress>
      </div>
      <div id=content busy={busy}>
        <fieldset disabled={busy}>
          <div style="padding:16px">
            <mdw-title>{title}</mdw-title>
            <mdw-label ink=primary size=small>{brand}</mdw-label>
            <mdw-title size=small>{description}</mdw-title>
          </div>
          <mdw-divider></mdw-divider>
          <mdw-box flex=column gap=16 padding=16>
            <mdw-input outlined type=number name=price value={price} label=Price input-prefix=$ step=0.01></mdw-input>
            <mdw-input outlined type=number name=discountPercentage value={discountPercentage} input-suffix=% label=Discount step=0.01></mdw-input>
            <mdw-slider name=rating value={rating} min=0 max=5 step=0.1 ticks=4></mdw-slider>
          </mdw-box>
        </fieldset>
      </div>
    </form>
    <mdw-divider></mdw-divider>
    <mdw-box flex x=end padding=8 gap=8>
      <mdw-icon-button 
        disabled=${({ productId }) => productId === 1}
        id=previous
        icon=chevron_left
        on-click=${function onClick() { this.productId--; }}
        >Previous</mdw-icon-button>
      <mdw-icon-button
        on-click=${function onClick() { this.productId++; }}
        id=next
        icon=chevron_right>Next</mdw-icon-button>
    </mdw-box>
  `
  .methods({
    async refresh() {
      const productId = this.productId;
      this.fetchAbortController?.abort();
      const controller = new AbortController();
      this.fetchAbortController = controller;
      try {
        this.busy = true;
        const response = await fetch(`https://dummyjson.com/products/${productId}`, { signal: this.fetchAbortController.signal });
        await asyncStall();
        const json = await response.json();
        this.render(json);
        this.refs.form.reset();
        this.busy = false;
      } catch (e) {
        if (controller.signal.aborted) {
          console.log('Aborted');
        } else {
          console.error(e);
        }
      }
    },
  })
  .on({
    connected() {
      this.refresh();
    },
    productIdChanged() {
      this.refresh();
    },
  })
  .autoRegister('dummy-product-page');
