import { assert } from '@esm-bundle/chai';

import Badge from '../../components/Badge.js';
import '../../theming/loader.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => {
  document.body.replaceChildren();
});

describe('mdw-badge', () => {
  it('can be created with document.createElement', () => {
    const badge = makeFromTagName('mdw-badge');
    assert.equal(badge.tagName.toLowerCase(), 'mdw-badge');
  });

  it('can be created with new ()', () => {
    const badge = makeFromConstructor(Badge);
    assert.equal(badge.tagName.toLowerCase(), 'mdw-badge');
  });

  it('can be created with fragment', () => {
    const badge = makeFromString('<mdw-badge>');
    assert.equal(badge.tagName.toLowerCase(), 'mdw-badge');
  });

  describe('layout', () => {
    it('should have inline-block display', () => {
      const badge = html`<mdw-badge></mdw-badge>`;
      assert.equal(window.getComputedStyle(badge).display, 'inline-block');
    });
  });

  describe('size', () => {
    it('should have 16px x 16px bounds when empty', () => {
      /** @type {InstanceType<Badge>} */
      const badge = html`<mdw-badge></mdw-badge>`;
      const { width, height } = badge.getBoundingClientRect();
      assert.equal(width, 16);
      assert.equal(height, 16);
    });

    it('should have 16px x 16px bounds minimum', () => {
      const badge = html`<mdw-badge>x</mdw-badge>`;
      const { width, height } = badge.getBoundingClientRect();
      assert.equal(width, 16);
      assert.equal(height, 16);
    });
  });
});
