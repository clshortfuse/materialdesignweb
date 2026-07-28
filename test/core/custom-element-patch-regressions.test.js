import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('CustomElement patch transactions', () => {
  /** @type {HTMLElement} */
  let element;

  afterEach(() => {
    element?.remove();
  });

  it('does not replay pending property renders across patches', () => {
    const PatchQueue = CustomElement
      .extend()
      .observe({
        first: 'string',
        second: 'string',
      })
      .html`<span>{first}{second}</span>`
      .register('patch-queue-regression-test');

    element = new PatchQueue();
    document.body.append(element);

    let propertyRenders = 0;
    const originalByProp = element.render.byProp;
    element.render.byProp = function countPropertyRender(...args) {
      propertyRenders += 1;
      return originalByProp.apply(this, args);
    };

    for (let index = 0; index < 100; index += 1) {
      element.patch(index % 2
        ? { first: `${index}` }
        : { second: `${index}` });
    }

    assert.equal(propertyRenders, 0, 'patch-owned changes render only in the final batch');
  });
});
