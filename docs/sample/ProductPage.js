import '../../components/Input.js';
import '../../components/Slider.js';
import '../../components/Divider.js';
import '../../components/IconButton.js';
import '../../components/Progress.js';
import '../../components/Shape.js';
import '../../components/Box.js';

import Card from '../../components/Card.js';
import '../../components/Label.js';
import { buildMergePatch } from '../../utils/jsonMergePatch.js';

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
  images: ['https://i.dummyjson.com/data/products/1/1.jpg', 'https://i.dummyjson.com/data/products/1/2.jpg', 'https://i.dummyjson.com/data/products/1/3.jpg', 'https://i.dummyjson.com/data/products/1/4.jpg', 'https://i.dummyjson.com/data/products/1/thumbnail.jpg'],
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
  .setSchema(/** @type {SAMPLE_DATA} */ (null))
  .observe({
    productId: {
      type: 'integer',
      empty: 1,
    },
    busy: {
      type: 'boolean',
      reflect: false,
      empty: true,
    },
    lastObject: 'object',
    coords: {
      reflect: false,
      empty: { x: 0, y: 0 },
    },
  })
  .set({
    /** @type {number} */
    lastFetchedId: null,
    /** @type {AbortController} */
    fetchAbortController: null,
    outlined: true,
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
      visibility: visible;

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
      block-size: 128px;
      min-block-size: 128px;
      inline-size: 128px;
      min-inline-size: 128px;
    }

    #thumbnail {
      block-size: inherit;
      inline-size: inherit;

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
  `.html/* html */`
    <form id=form>
      <div id=overlay busy={busy}>
        <mdw-progress circle></mdw-progress>
      </div>
      <div id=content busy={busy}>
        <fieldset disabled={busy}>
          <mdw-box flex y=center gap=16 padding=16>
            <mdw-shape id=thumbnail-shape outlined shape-style=full>
              <img id=thumbnail src={thumbnail} />
            </mdw-shape>
            <div>
              <mdw-title>{title}</mdw-title>
              <mdw-label ink=primary size=small>{brand}</mdw-label>
              <mdw-title size=small>{description}</mdw-title>
            </div>
          </mdw-box>
          <mdw-divider></mdw-divider>
          <mdw-box flex=column gap=16 padding=16>
            <mdw-input outlined type=number name=price value={price} label=Price input-prefix=$ step=0.01></mdw-input>
            <mdw-input outlined type=number name=discountPercentage value={discountPercentage} input-suffix=% label=Discount step=0.01></mdw-input>
            <mdw-slider name=rating value={rating} min=0 max=5 step=0.1 ticks=4></mdw-slider>
          </mdw-box>
          <mdw-divider></mdw-divider>
          <div id=images>
            <mdw-label _if={!images.length}>(No images available)</mdw-label>
            <img _if={images.0} class="image" src={images.0} />
            <img _if={images.1} class="image" src={images.1} />
            <img _if={images.2} class="image" src={images.2} />
          </div>
        </fieldset>
      </div>
    </form>
    <mdw-divider></mdw-divider>
    <mdw-box flex x=between y=center padding=8 gap=8>
      <mdw-title ink=secondary>Product ID: {productId}</mdw-title>
      <mdw-box flex gap=8>
        <mdw-icon-button
          disabled="${({ productId }) => productId === 1}"
          id="previous"
          icon="chevron_left"
          on-click="${function onClick() { this.productId--; }}">Previous</mdw-icon-button>
        <mdw-icon-button
          on-click=${function onClick() { this.productId++; }}
          id=next
          icon=chevron_right>Next</mdw-icon-button>
        </mdw-box>
    </mdw-box>
    <!-- <p>My coords are ({coords.x}, {coords.y})</p> -->
    <p>${({ coords }) => `My coords are (${coords.x}, ${coords.y})`}</p>

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
        const changes = buildMergePatch(this.lastData, json, 'object');
        console.log(json, changes);
        this.render(changes, json);
        this.lastData = json;
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
