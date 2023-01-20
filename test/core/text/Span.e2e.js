import tap, { test } from 'tap';

import E2ETester from '../../setup/E2ETester.js';

const e2e = new E2ETester();
e2e.setupTap(tap);

test('create', async (t) => {
  const [element] = await e2e.addHTML('<mdw-span></mdw-span>');
  t.ok(element);
});

test('prototype', async (t) => {
  const [element] = await e2e.addHTML('<mdw-span></mdw-span>');
  const result = await e2e.js((el) => el.constructor.name, element);
  t.not(result, 'HTMLElement');
  // Minified code may modify class name slightly (_MDWSpan)
  t.match(result, 'MDWSpan');
});

test('content', async (t) => {
  const [element] = await e2e.addHTML('<mdw-span>foo</mdw-span>');
  const text = await element.getText();
  t.equal(text, 'foo');
});

test('styles', async (t) => {
  const [element] = await e2e.addHTML('<mdw-span>foo</mdw-span>');
  t.equal('inline', await e2e.getStyle(element, 'display'));
});

test('[ink=primary]', async (t) => {
  const [element] = await e2e.addHTML('<mdw-span ink=primary>foo</mdw-span>');
  t.equal('rgb(103,80,164)', await e2e.getStyle(element, 'color'));
});

test('[block]', async (t) => {
  const [element] = await e2e.addHTML('<mdw-span block>hello</mdw-span>');
  t.equal('block', await e2e.getStyle(element, 'display'));
});
