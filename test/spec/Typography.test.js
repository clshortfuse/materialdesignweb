import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import '../../components/Display.js';
import '../../components/Headline.js';
import '../../components/Title.js';
import '../../components/Body.js';
import '../../components/Label.js';
import { axTree, iterateMeaningfulAXNodes } from '../plugins/axTree.js';
import { html } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('Typography Components - ARIA Roles and Levels', () => {
  describe('mdw-display', () => {
    it('should have role="heading"', async () => {
      const element = html`<mdw-display></mdw-display>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'heading');
    });

    it('should have aria-level="1" by default (size="large")', async () => {
      const element = html`<mdw-display></mdw-display>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 1);
    });

    it('should have aria-level="2" when size="medium"', async () => {
      const element = html`<mdw-display size="medium"></mdw-display>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 2);
    });

    it('should have aria-level="3" when size="small"', async () => {
      const element = html`<mdw-display size="small"></mdw-display>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 3);
    });

    it('should respect explicit aria-level attribute', async () => {
      const element = html`<mdw-display aria-level="5"></mdw-display>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 5);
    });
  });

  describe('mdw-headline', () => {
    it('should have role="heading"', async () => {
      const element = html`<mdw-headline></mdw-headline>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'heading');
    });

    it('should have aria-level="4" by default (size="large")', async () => {
      const element = html`<mdw-headline></mdw-headline>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 4);
    });

    it('should have aria-level="5" when size="medium"', async () => {
      const element = html`<mdw-headline size="medium"></mdw-headline>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 5);
    });

    it('should have aria-level="6" when size="small"', async () => {
      const element = html`<mdw-headline size="small"></mdw-headline>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 6);
    });

    it('should respect explicit aria-level attribute', async () => {
      const element = html`<mdw-headline aria-level="3"></mdw-headline>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 3);
    });
  });

  describe('mdw-title', () => {
    it('should have role="heading"', async () => {
      const element = html`<mdw-title></mdw-title>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'heading');
    });

    it('should have aria-level="7" by default (size="large")', async () => {
      const element = html`<mdw-title></mdw-title>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 7);
    });

    it('should have aria-level="8" when size="medium"', async () => {
      const element = html`<mdw-title size="medium"></mdw-title>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 8);
    });

    it('should have aria-level="9" when size="small"', async () => {
      const element = html`<mdw-title size="small"></mdw-title>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 9);
    });

    it('should respect explicit aria-level attribute', async () => {
      const element = html`<mdw-title aria-level="2"></mdw-title>`;
      const results = await axTree({ selector: element.tagName });
      const [{ level }] = iterateMeaningfulAXNodes(results);
      assert.equal(level, 2);
    });
  });

  describe('mdw-body', () => {
    it('should not have a heading role', async () => {
      const element = html`<mdw-body></mdw-body>`;
      const results = await axTree({ selector: element.tagName });
      const nodes = Array.from(iterateMeaningfulAXNodes(results));
      assert.isFalse(nodes.some((node) => node.role === 'heading'));
    });
  });

  describe('mdw-label', () => {
    it('should not have a heading role', async () => {
      const element = html`<mdw-label></mdw-label>`;
      const results = await axTree({ selector: element.tagName });
      const nodes = Array.from(iterateMeaningfulAXNodes(results));
      assert.isFalse(nodes.some((node) => node.role === 'heading'));
    });
  });
});
