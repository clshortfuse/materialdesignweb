import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import Grid from '../../components/Grid.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-grid', () => {
  it('can be created with document.createElement', () => {
    const grid = makeFromTagName('mdw-grid');
    assert.equal(grid.tagName.toLowerCase(), 'mdw-grid');
  });

  it('can be created with new ()', () => {
    const grid = makeFromConstructor(Grid);
    assert.equal(grid.tagName.toLowerCase(), 'mdw-grid');
  });

  it('can be created with fragment', () => {
    const grid = makeFromString('<mdw-grid>');
    assert.equal(grid.tagName.toLowerCase(), 'mdw-grid');
  });

  it('should slot content', () => {
    const grid = html`<mdw-grid>foo</mdw-grid>`;
    assert.equal(grid.textContent, 'foo');
  });

  describe('layout', () => {
    it('default grid', () => {
      const element = html`<mdw-grid>foo</mdw-grid>`;
      const { display } = window.getComputedStyle(element);
      assert.equal(display, 'grid');
    });
  });

  describe('grid columns 4', () => {
    const element = html`<mdw-grid style="max-width:360px"><span>foo</span></mdw-grid>`;
    const { firstElementChild: fooElement } = element;
    const { gridColumnStart, gridColumnEnd } = window.getComputedStyle(fooElement);
    assert.equal(gridColumnStart, 'auto');
    assert.equal(gridColumnEnd, 'span 4');
  });

  describe('grid columns 8', () => {
    const element = html`<mdw-grid style="min-width:600px;max-width:600px"><span>foo</span></mdw-grid>`;
    const { firstElementChild: fooElement } = element;
    const { gridColumnStart, gridColumnEnd } = window.getComputedStyle(fooElement);
    assert.equal(gridColumnStart, 'auto');
    assert.equal(gridColumnEnd, 'span 8');
  });
  describe('grid columns 12', () => {
    const element = html`<mdw-grid style="min-width:840px"><span>foo</span></mdw-grid>`;
    const { firstElementChild: fooElement } = element;
    const { gridColumnStart, gridColumnEnd } = window.getComputedStyle(fooElement);
    assert.equal(gridColumnStart, 'auto');
    assert.equal(gridColumnEnd, 'span 12');
  });

  describe('theming', () => {
    it('[ink=primary]', () => {
      const element = html`<mdw-grid ink=primary>foo</mdw-grid>`;
      const { color } = window.getComputedStyle(element);
      assert.equal(color, 'rgb(103, 80, 164)');
    });

    it('[color=primary]', () => {
      const element = html`<mdw-grid color=primary>foo</mdw-grid>`;
      const { color, backgroundColor } = window.getComputedStyle(element);
      assert.equal(color, 'rgb(255, 255, 255)');
      assert.equal(backgroundColor, 'rgb(103, 80, 164)');
    });
  });
});
