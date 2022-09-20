import tap, { test } from 'tap';

import E2ETester from '../../setup/E2ETester.js';

const e2e = new E2ETester();
e2e.setupTap(tap);

test('create', async (t) => {
  const [element] = await e2e.addHTML('<mdw-text></mdw-text>');
  t.ok(element);
});

test('prototype', async (t) => {
  const [element] = await e2e.addHTML('<mdw-text></mdw-text>');
  const result = await e2e.js((el) => el.constructor.name, element);
  t.not(result, 'HTMLElement');
  // Minified code may modify class name slightly (_MDWText)
  t.match(result, 'MDWText');
});

test('content', async (t) => {
  const [element] = await e2e.addHTML('<mdw-text>foo</mdw-text>');
  const text = await element.getText();
  t.equal(text, 'foo');
});

test('styles', async (t) => {
  const [element] = await e2e.addHTML('<mdw-text>foo</mdw-text>');
  t.equal('inline', await e2e.getStyle(element, 'display'));
});

test('[ink=primary]', async (t) => {
  const [element] = await e2e.addHTML('<mdw-text ink=primary>foo</mdw-text>');
  t.equal('rgb(103,80,164)', await e2e.getStyle(element, 'color'));
});

test('[block]', async (t) => {
  const [element] = await e2e.addHTML('<mdw-text block>hello</mdw-text>');
  t.equal('block', await e2e.getStyle(element, 'display'));
});
