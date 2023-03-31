import { assert } from '@esm-bundle/chai';

import Box from '../components/Box.js';
import '../theming/loader.js';

Box.register();

beforeEach(() => {
  document.body.replaceChildren();
});

describe('new ()', () => {
  const box = new Box();
  assert.isOk(box);
});

describe('document.createElement', () => {
  const element = document.createElement('mdw-box');
  assert.equal(element.constructor.elementName, 'mdw-box');
});

describe('content', () => {
  const element = document.createRange().createContextualFragment('<mdw-box>foo</mdw-box>').firstElementChild;
  document.body.append(element);
  assert.equal(element.textContent, 'foo');
});

describe('default display', () => {
  const element = document.createRange().createContextualFragment('<mdw-box>foo</mdw-box>').firstElementChild;
  document.body.append(element);
  assert.equal(window.getComputedStyle(element).display, 'block');
});

describe('[inline]', () => {
  const element = document.createRange().createContextualFragment('<mdw-box inline>foo</mdw-box>').firstElementChild;
  document.body.append(element);
  assert.equal(window.getComputedStyle(element).display, 'inline-block');
});

describe('[ink=primary]', () => {
  const element = document.createRange().createContextualFragment('<mdw-box ink=primary>foo</mdw-box>').firstElementChild;
  document.body.append(element);
  assert.equal(window.getComputedStyle(element).color, 'rgb(103, 80, 164)');
});

describe('[color=primary]', () => {
  const element = document.createRange().createContextualFragment('<mdw-box color=primary>foo</mdw-box>').firstElementChild;
  document.body.append(element);
  const style = window.getComputedStyle(element);
  assert.equal(style.color, 'rgb(255, 255, 255)');
  assert.equal(style.backgroundColor, 'rgb(103, 80, 164)');
});
