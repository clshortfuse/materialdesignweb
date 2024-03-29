import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import Box from '../../components/Box.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-box', () => {
  it('can be created with document.createElement', () => {
    const box = makeFromTagName('mdw-box');
    assert.equal(box.tagName.toLowerCase(), 'mdw-box');
  });

  it('can be created with new ()', () => {
    const box = makeFromConstructor(Box);
    assert.equal(box.tagName.toLowerCase(), 'mdw-box');
  });

  it('can be created with fragment', () => {
    const box = makeFromString('<mdw-box>');
    assert.equal(box.tagName.toLowerCase(), 'mdw-box');
  });

  it('should slot content', () => {
    const box = html`<mdw-box>foo</mdw-box>`;
    assert.equal(box.textContent, 'foo');
  });

  describe('layout', () => {
    it('default flex column', () => {
      const element = html`<mdw-box>foo</mdw-box>`;
      const { display, flexDirection } = window.getComputedStyle(element);
      assert.equal(display, 'flex');
      assert.equal(flexDirection, 'column');
    });

    it('[inline]', () => {
      const element = html`<mdw-box inline>foo</mdw-box>`;
      assert.equal(window.getComputedStyle(element).display, 'inline-flex');
    });

    it('[block]', () => {
      const element = html`<mdw-box block>foo</mdw-box>`;
      const { display } = window.getComputedStyle(element);
      assert.equal(display, 'block');
    });

    it('[row]', () => {
      const element = html`<mdw-box row>foo</mdw-box>`;
      const { display, flexDirection } = window.getComputedStyle(element);
      assert.equal(display, 'flex');
      assert.equal(flexDirection, 'row');
    });
  });

  describe('theming', () => {
    it('[ink=primary]', () => {
      const element = html`<mdw-box ink=primary>foo</mdw-box>`;
      const { color } = window.getComputedStyle(element);
      assert.equal(color, 'rgb(103, 80, 164)');
    });

    it('[color=primary]', () => {
      const element = html`<mdw-box color=primary>foo</mdw-box>`;
      const { color, backgroundColor } = window.getComputedStyle(element);
      assert.equal(color, 'rgb(255, 255, 255)');
      assert.equal(backgroundColor, 'rgb(103, 80, 164)');
    });
  });
});
