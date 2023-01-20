import tap, { test } from 'tap';

import E2ETester from '../../setup/E2ETester.js';

const e2e = new E2ETester();
e2e.setupTap(tap);

test('create', async (t) => {
  const [element] = await e2e.addHTML('<mdw-container></mdw-container>');
  t.ok(element);
});

test('prototype', async (t) => {
  const [element] = await e2e.addHTML('<mdw-container></mdw-container>');
  const result = await e2e.js((el) => el.constructor.name, element);
  t.not(result, 'HTMLElement');
  // Minified code may modify class name slightly (_MDWSpan)
  t.match(result, 'MDWContainer');
});

test('content', async (t) => {
  const [element] = await e2e.addHTML('<mdw-container>foo</mdw-container>');
  const text = await element.getText();
  t.equal(text, 'foo');
});

test('styles', async (t) => {
  const [element] = await e2e.addHTML('<mdw-container>foo</mdw-container>');
  t.equal('block', await e2e.getStyle(element, 'display'));
});

test('[ink=primary]', async (t) => {
  const [element] = await e2e.addHTML('<mdw-container ink=primary>foo</mdw-container>');
  t.equal('rgb(103,80,164)', await e2e.getStyle(element, 'color'));
});

test('[color=primary]', async (t) => {
  const [element] = await e2e.addHTML('<mdw-container color=primary>foo</mdw-container>');
  t.equal('rgb(103,80,164)', await e2e.getStyle(element, 'backgroundColor'));
  t.equal('rgb(255,255,255)', await e2e.getStyle(element, 'color'));
});
