import { assert } from '@esm-bundle/chai';

import Badge from '../../components/Badge.js';
import '../../theming/loader.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-badge', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-badge');
    assert.equal(element.tagName.toLowerCase(), 'mdw-badge');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(Badge);
    assert.equal(element.tagName.toLowerCase(), 'mdw-badge');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-badge>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-badge');
  });

  describe('layout', () => {
    it('should have inline-block display', () => {
      const element = html`<mdw-badge></mdw-badge>`;
      assert.equal(window.getComputedStyle(element).display, 'inline-block');
    });
  });

  describe('size', () => {
    it('should have 16px x 16px bounds when empty', () => {
      /** @type {InstanceType<Badge>} */
      const element = html`<mdw-badge></mdw-badge>`;
      const { width, height } = element.getBoundingClientRect();
      assert.equal(width, 16);
      assert.equal(height, 16);
    });

    it('should have 16px x 16px bounds minimum', () => {
      const element = html`<mdw-badge>x</mdw-badge>`;
      const { width, height } = element.getBoundingClientRect();
      assert.equal(width, 16);
      assert.equal(height, 16);
    });
  });
});
