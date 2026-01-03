/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('CustomElement docs parity', () => {
  it('matches documented static API', () => {
    const staticFunctions = [
      'extend',
      'mixin',
      'setStatic',
      'register',
      'autoRegister',
      'define',
      'set',
      'readonly',
      'undefine',
      'observe',
      'prop',
      'props',
      'idl',
      'setPrototype',
      'defineStatic',
      'append',
      'recompose',
      'css',
      'html',
      'methods',
      'expressions',
      'overrides',
      'events',
      'childEvents',
      'rootEvents',
      'on',
      'onPropChanged',
      'onAttributeChanged',
    ];
    for (const name of staticFunctions) {
      assert.equal(typeof (/** @type {any} */ (CustomElement))[name], 'function', `static ${name} is missing`);
    }

    const staticGetters = [
      'observedAttributes',
      'propList',
      'attrList',
    ];
    for (const name of staticGetters) {
      const descriptor = Object.getOwnPropertyDescriptor(CustomElement, name);
      assert.equal(typeof descriptor?.get, 'function', `static getter ${name} is missing`);
    }

    const staticProps = [
      'elementName',
      'interpolatesTemplate',
      'defined',
      'registrations',
      'supportsElementInternals',
      'supportsElementInternalsRole',
    ];
    for (const name of staticProps) {
      assert.equal(name in CustomElement, true, `static ${name} is missing`);
    }
  });

  it('matches documented instance API', async () => {
    const tag = `custom-element-docs-${Math.random().toString(36).slice(2)}`;
    const DocElement = CustomElement
      .extend()
      .html`<span></span>`
      .register(tag);

    document.body.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);

    /** @type {InstanceType<DocElement>} */
    const el = document.querySelector(tag);

    const protoMethods = [
      'compose',
      'propChangedCallback',
      'attributeChangedCallback',
      'connectedCallback',
      'disconnectedCallback',
    ];
    for (const name of protoMethods) {
      assert.equal(typeof (/** @type {any} */ (el))[name], 'function', `instance method ${name} is missing`);
    }

    assert.equal(typeof el.render, 'function', 'instance render is missing');
    assert.equal(typeof el.render.byProp, 'function', 'render.byProp is missing');
    assert.equal(typeof el.patch, 'function', 'instance patch is missing');

    const instanceGetters = [
      'composition',
      'refs',
      'attributeCache',
    ];
    for (const name of instanceGetters) {
      let proto = Object.getPrototypeOf(el);
      let descriptor;
      while (proto && !descriptor) {
        descriptor = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      assert.equal(typeof descriptor?.get, 'function', `instance getter ${name} is missing`);
    }
  });
});
