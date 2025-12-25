import '../../components/Input.js';
import '../../components/Slider.js';
import '../../components/Divider.js';
import '../../components/IconButton.js';
import '../../components/Progress.js';
import '../../components/Shape.js';
import '../../components/Surface.js';
import '../../components/Box.js';
import '../../components/Checkbox.js';

import Card from '../../components/Card.js';
import '../../components/Label.js';
import { addSVGAlias } from '../../services/svgAlias.js';

const SAMPLE_DATA = {
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
  images: ['https://i.dummyjson.com/data/products/1/1.jpg',
    'https://i.dummyjson.com/data/products/1/2.jpg',
    'https://i.dummyjson.com/data/products/1/3.jpg',
    'https://i.dummyjson.com/data/products/1/4.jpg',
    'https://i.dummyjson.com/data/products/1/thumbnail.jpg'],
};

/**
 * @param {number} min
 * @param {number} max
 * @return {Promise<void>}
 */
function asyncStall(min = 0, max = 4000) {
  return new Promise((resolve) => setTimeout(resolve, (Math.random() * (max - min)) + min));
}

export default Card
  .extend()
  // .setSchema(/** @type {SAMPLE_DATA} */ (null))
  .observe({
    title: 'string',
    productId: {
      type: 'integer',
      empty: 1,
    },
    busy: {
      type: 'boolean',
      reflect: false,
      empty: true,
    },
    data: {
      type: 'object',
      reflect: false,
      /** @type {SAMPLE_DATA} */
      value: null,
    },
    lastObject: 'object',
  })
  .observe({
    // Nested array need own observable
    _images({ data }) {
      return data?.images || [];
    },
  })
  .set({
    /** @type {number} */
    lastFetchedId: null,
    /** @type {AbortController} */
    fetchAbortController: null,
    // Override Card defaults
    outlined: true,
  })
  .expressions({
    // Automatically tracks data change
    hasStock({ data }) {
      return data?.stock > 0;
    },
  })
  .css`
    :host {
      /* Time until busy styles show */
      --busy-delay: 500ms;
    }

    #overlay {
      position: absolute;
      inset: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      opacity: 0;
      visibility: hidden;
      z-index:5;

      transition-duration: 200ms;
      transition-property: visibility, opacity;
    }

    #overlay[busy] {
      pointer-events: auto;
      
      opacity: 1;
      visibility: inherit;

      transition-delay: var(--busy-delay);
    }

    #content {
      transition: filter 200ms;
    }

    #content[busy] {
      filter: blur(2px) grayscale(1);

      transition-delay: var(--busy-delay);
    }

    #form {
      position: relative;

      overflow: hidden;
    }

    #thumbnail-shape {
      overflow: hidden;

      block-size: 128px;
      min-block-size: 128px;
      inline-size: 128px;
      min-inline-size: 128px;
    }

    #thumbnail {
      block-size: 100%;
      inline-size: 100%;

      object-fit: cover;
    }
    fieldset{ display: contents;}

    #images {
      display: grid;
      align-items: center;
      column-gap: 24px;
      grid-auto-flow: column;
      grid-template-rows: minmax(auto, 200px);
      justify-items: center;
      overflow-x: auto;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;

      flex-grow: 1;
      padding-inline: 24px;
      -webkit-scroll-snap-type-x: mandatory;
      scroll-snap-type-x: mandatory;
      -webkit-scroll-snap-points-x: repeat(100%);
      scroll-snap-points-x: repeat(100%);
      overscroll-behavior-x: none;
    }

    .image {
      scroll-snap-align: center;

      max-block-size: 100%;

      object-fit: contain;
    }
  `.html`
    <form id=form>
      <!-- Binding to enumerable observable (busy) -->
      <div id=overlay busy={busy}>
        <mdw-progress circle></mdw-progress>
      </div>
      <div id=content busy={busy}>
        <fieldset disabled={busy}>
          <mdw-box row y=center gap=16 padding=16>
            <mdw-surface id=thumbnail-shape outlined shape-style=full>
              <img id=thumbnail src={data.thumbnail} />
            </mdw-surface>
            <div>
              <!-- Binding to nested variable (data.*) -->
              <mdw-title>{data.title}</mdw-title>
              <mdw-label ink=primary size=small>{data.brand}</mdw-label>
              <mdw-title size=small>{data.description}</mdw-title>
            </div>
          </mdw-box>
          <mdw-divider></mdw-divider>
          <mdw-box gap=16 padding=16>
            <mdw-input outlined type=number name=price value={data.price} label=Price input-prefix=$ step=0.01></mdw-input>
            <mdw-input outlined type=number name=discountPercentage value={data.discountPercentage} input-suffix=% label=Discount step=0.01></mdw-input>
            <mdw-slider name=rating value={data.rating} min=0 max=5 step=0.1 ticks=4></mdw-slider>
            <mdw-box row y=center gap=8>
                <mdw-checkbox-icon icon=check selected={hasStock}></mdw-checkbox-icon> Stock: {data.stock} </div>
            <mdw-box>
          </mdw-box>
          <mdw-divider></mdw-divider>
          <div id=images>
            <!-- mdw-if may remove element from DOM -->
            <mdw-label mdw-if={!_images.length}>(No images available)</mdw-label>
            <!-- mdw-for creates a sub-observable -->
            <img mdw-for="{image of _images}" class="image" src={image} />
          </div>
        </fieldset>
      </div>
    </form>
    <mdw-divider></mdw-divider>
    <mdw-box row x=between y=center padding=8 gap=8>
      <mdw-title ink=secondary>Product ID: {productId}</mdw-title>
      <mdw-box row gap=8>
        <!-- Inline attribute expression and event listener -->
        <mdw-icon-button
          disabled="${({ productId }) => productId === 1}"
          id="previous"
          icon="chevron_left"
          on-click="${function onClick() { this.productId--; }}">Previous</mdw-icon-button>
        <!-- Inline event listener -->
        <mdw-icon-button
          on-click=${function onClick() { this.productId++; }}
          id=next
          icon=chevron_right>Next</mdw-icon-button>
        </mdw-box>
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
        // await asyncStall();
        const json = await response.json();
        // Automatically performs JSON Merge Patch comparison and updates DOM
        this.data = json;
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
    // Automatically listen for changes to productId and refresh data
    productIdChanged() {
      this.refresh();
    },
  })
  .autoRegister('dummy-product-page');

addSVGAlias('check', 'M382 816 154 588l57-57 171 171 367-367 57 57-424 424Z', '0 96 960 960');
addSVGAlias('chevron_left', 'M560 816 320 576l240-240 56 56-184 184 184 184-56 56Z', '0 96 960 960');
addSVGAlias('chevron_right', 'm376 816-56-56 184-184-184-184 56-56 240 240-240 240Z', '0 96 960 960');
