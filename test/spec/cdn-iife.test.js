import { assert } from '@esm-bundle/chai';

describe('CDN IIFE global', () => {
  before(async () => {
    // Load the built IIFE bundle by creating a script tag
    if (!globalThis['@shortfuse/materialdesignweb']) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/dist/index.min.js';
        script.addEventListener('load', resolve);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  });

  it('built IIFE exposes globalThis["@shortfuse/materialdesignweb"]', () => {
    assert.isDefined(globalThis['@shortfuse/materialdesignweb'], 'Global should be defined');
  });

  it('IIFE global exposes CustomElement', () => {
    const { CustomElement } = globalThis['@shortfuse/materialdesignweb'];
    assert.isFunction(CustomElement, 'CustomElement should be a class/function');
  });

  it('IIFE global exposes Composition', () => {
    const { Composition } = globalThis['@shortfuse/materialdesignweb'];
    assert.isFunction(Composition, 'Composition should be a class/function');
  });

  it('can extend CustomElement from IIFE global with fluent API', () => {
    const { CustomElement } = globalThis['@shortfuse/materialdesignweb'];

    const MyElement = class extends CustomElement {};
    MyElement.register('my-iife-test-element');

    const element = new MyElement();
    assert.equal(element.tagName.toLowerCase(), 'my-iife-test-element');
  });
});
