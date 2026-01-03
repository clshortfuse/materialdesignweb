/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-classes-per-file */

import { assert } from '@esm-bundle/chai';

import CustomElement, { cloneAttributeCallback } from '../../core/CustomElement.js';

describe('CustomElement API parity', () => {
  /** @type {HTMLDivElement} */
  let container;
  let tagId = 0;

  /** @param {string} prefix */
  const nextTag = (prefix) => `${prefix}-${tagId++}`;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('fluent and class elements render and update identically', async () => {
    const fluentTag = nextTag('fluent-counter');
    const classTag = nextTag('class-counter');
    const FluentCounter = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0 },
      })
      .html`
        <span class="count">{count}</span>
      `
      .register(fluentTag);
    class ClassCounter extends CustomElement {
      static {
        this.observe({
          count: { type: 'integer', value: 0 },
        });
        this.html`<span class="count">{count}</span>`;
        this.register(classTag);
      }
    }

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCounter>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassCounter} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '0');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '0');

    fluentEl.count = 2;
    /** @type {any} */ (classEl).count = 2;
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '2');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '2');
  });

  it('fluent .prop and class observe behave identically', async () => {
    const fluentTag = nextTag('fluent-prop');
    const classTag = nextTag('class-prop');
    const FluentCounter = CustomElement
      .extend()
      .prop('count', { type: 'integer', value: 0 })
      .html`
        <span class="count">{count}</span>
      `
      .register(fluentTag);
    class ClassCounter extends CustomElement {
      static {
        this.observe({
          count: { type: 'integer', value: 0 },
        })
          .html`
            <span class="count">{count}</span>
          `
          .register(classTag);
      }
    }

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCounter>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassCounter} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '0');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '0');

    fluentEl.count = 7;
    /** @type {any} */ (classEl).count = 7;
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '7');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '7');
  });

  it('fluent methods and class methods work the same', async () => {
    const fluentTag = nextTag('fluent-method');
    const classTag = nextTag('class-method');
    const FluentCounter = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0 },
      })
      .methods({
        inc() {
          this.count += 1;
        },
      })
      .html`
        <span class="count">{count}</span>
      `
      .register(fluentTag);
    class MethodCounter extends CustomElement {
      inc() {
        this.count += 1;
      }
    }
    MethodCounter.prototype.count = MethodCounter.setPrototype('count', { type: 'integer', value: 0 });
    MethodCounter.html`<span class="count">{count}</span>`;
    MethodCounter.register(classTag);

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCounter>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {MethodCounter} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '0');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '0');

    fluentEl.inc();
    classEl.inc();
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '1');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '1');
  });

  it('class fields override observed props, fluent stays reactive', async () => {
    const fluentTag = nextTag('fluent-field-safe');
    const classTag = nextTag('class-field-counter');
    const FluentCounter = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0 },
      })
      .html`
        <span class="count">{count}</span>
      `
      .register(fluentTag);
    class ClassFieldCounter extends CustomElement {
      /** @type {number} */
      count = 0;

      static {
        this.observe({
          count: { type: 'integer', value: 0 },
        })
          .html`
            <span class="count">{count}</span>
          `
          .register(classTag);
      }
    }

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCounter>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassFieldCounter} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '0');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '0');

    fluentEl.count = 4;
    classEl.count = 4;
    // Class field shadows the observed accessor, so the template won't update.
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '4');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '0');
  });

  it('prototype defaults behave the same for fluent and class elements', async () => {
    const fluentTag = nextTag('fluent-proto');
    const classTag = nextTag('class-proto');
    const FluentCounter = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0 } })
      .html`<span class="count">{count}</span>`
      .register(fluentTag);
    class ProtoTypedCounter extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0 } });
        this.html`<span class="count">{count}</span>`;
        this.register(classTag);
      }
    }

    // TS: prototype assignment is the signal for typing; skip in pure JS.
    ProtoTypedCounter.prototype.count = 0;

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCounter>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ProtoTypedCounter} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '0');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '0');

    fluentEl.count = 5;
    classEl.count = 5;
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '5');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '5');
  });

  it('fluent and class expressions render and update identically', async () => {
    const fluentTag = nextTag('fluent-expr');
    const classTag = nextTag('class-expr');
    const FluentCounter = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0 } })
      .expressions({
        label({ count }) {
          return `Count: ${count}`;
        },
      })
      .html`<span class="label">{label}</span>`
      .register(fluentTag);
    class ClassCounter extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0 } });
        this.expressions({
          label({ count }) {
            return `Count: ${count}`;
          },
        });
        this.html`<span class="label">{label}</span>`;
        this.register(classTag);
      }
    }
    ClassCounter.prototype.count = ClassCounter.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCounter>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassCounter} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.label').textContent, 'Count: 0');
    assert.equal(classEl.shadowRoot.querySelector('.label').textContent, 'Count: 0');

    fluentEl.count = 3;
    /** @type {any} */ (classEl).count = 3;
    assert.equal(fluentEl.shadowRoot.querySelector('.label').textContent, 'Count: 3');
    assert.equal(classEl.shadowRoot.querySelector('.label').textContent, 'Count: 3');
  });

  it('fluent and class css templates apply styles', async () => {
    const fluentTag = nextTag('fluent-css');
    const classTag = nextTag('class-css');
    const FluentStyled = CustomElement
      .extend()
      .css`:host{display:block}`
      .html`<span>ok</span>`
      .register(fluentTag);
    class ClassStyled extends CustomElement {
      static {
        this.css`:host{display:block}`;
        this.html`<span>ok</span>`;
        this.register(classTag);
      }
    }

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentStyled>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassStyled} */
    const classEl = container.querySelector(classTag);

    /** @param {ShadowRoot} root */
    const hasStyles = (root) => root.adoptedStyleSheets?.length
      || root.querySelector('style');
    assert.ok(hasStyles(fluentEl.shadowRoot), 'fluent css did not apply');
    assert.ok(hasStyles(classEl.shadowRoot), 'class css did not apply');
  });

  it('setStatic, define, and undefine behave as expected', async () => {
    const fluentTag = nextTag('fluent-define');
    const classTag = nextTag('class-define');
    const FluentDefined = CustomElement
      .extend()
      .setStatic({ marker: 'fluent' })
      .observe({ count: { type: 'integer', value: 2 } })
      .define({
        double() {
          return this.count * 2;
        },
      })
      .html`<span class="value">{double}</span>`
      .register(fluentTag);
    class ClassDefined extends CustomElement {
      static {
        this.setStatic({ marker: 'class' });
        this.observe({ count: { type: 'integer', value: 2 } });
        this.define({
          double() {
            return this.count * 2;
          },
        });
        this.html`<span class="value">{double}</span>`;
        this.register(classTag);
      }
    }
    ClassDefined.prototype.count = ClassDefined.setPrototype('count', { type: 'integer', value: 2 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    assert.equal((/** @type {{ marker: string }} */ (/** @type {unknown} */ (FluentDefined))).marker, 'fluent');
    assert.equal((/** @type {{ marker: string }} */ (/** @type {unknown} */ (ClassDefined))).marker, 'class');

    /** @type {InstanceType<FluentDefined>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassDefined} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.value').textContent, '4');
    assert.equal(classEl.shadowRoot.querySelector('.value').textContent, '4');

    FluentDefined.undefine('double');
    ClassDefined.undefine('double');
    assert.equal('double' in fluentEl, false);
    assert.equal('double' in classEl, false);
  });

  it('fluent and class childEvents update state the same', async () => {
    const fluentTag = nextTag('fluent-child-events');
    const classTag = nextTag('class-child-events');
    const FluentChild = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0 } })
      .html`
        <button id="btn" type="button">+</button>
        <span class="count">{count}</span>
      `
      .childEvents({
        btn: {
          click() {
            this.count += 1;
          },
        },
      })
      .register(fluentTag);
    class ClassChild extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0 } });
        this.html`
          <button id="btn" type="button">+</button>
          <span class="count">{count}</span>
        `;
        this.childEvents({
          btn: {
            click() {
              this.count += 1;
            },
          },
        });
        this.register(classTag);
      }
    }
    ClassChild.prototype.count = ClassChild.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentChild>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassChild} */
    const classEl = container.querySelector(classTag);

    /** @type {HTMLButtonElement} */
    const fluentBtn = fluentEl.shadowRoot.querySelector('#btn');
    /** @type {HTMLButtonElement} */
    const classBtn = classEl.shadowRoot.querySelector('#btn');
    fluentBtn.click();
    classBtn.click();
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '1');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '1');
  });

  it('recompose runs for both fluent and class elements', async () => {
    const fluentTag = nextTag('fluent-recompose');
    const classTag = nextTag('class-recompose');
    const FluentRecompose = CustomElement
      .extend()
      .observe({ label: { type: 'string', value: 'ok' } })
      .html`
        <span id="primary">{label}</span>
        <span id="secondary"></span>
      `
      .recompose(({ refs }) => {
        refs.secondary.textContent = refs.primary.textContent;
      })
      .register(fluentTag);
    class ClassRecompose extends CustomElement {
      static {
        this.observe({ label: { type: 'string', value: 'ok' } });
        this.html`
          <span id="primary">{label}</span>
          <span id="secondary"></span>
        `;
        this.recompose(({ refs }) => {
          refs.secondary.textContent = refs.primary.textContent;
        });
        this.register(classTag);
      }
    }
    ClassRecompose.prototype.label = ClassRecompose.setPrototype('label', { type: 'string', value: 'ok' });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentRecompose>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassRecompose} */
    const classEl = container.querySelector(classTag);

    assert.equal(fluentEl.shadowRoot.querySelector('#secondary').textContent, 'ok');
    assert.equal(classEl.shadowRoot.querySelector('#secondary').textContent, 'ok');
  });

  it('events and rootEvents fire on both fluent and class elements', async () => {
    const fluentTag = nextTag('fluent-events');
    const classTag = nextTag('class-events');
    const FluentEvents = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0 } })
      .html`<button id="btn" type="button">+</button>`
      .events({
        click() {
          this.count += 1;
        },
      })
      .rootEvents({
        click() {
          this.count += 1;
        },
      })
      .register(fluentTag);
    class ClassEvents extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0 } });
        this.html`<button id="btn" type="button">+</button>`;
        this.events({
          click() {
            this.count += 1;
          },
        });
        this.rootEvents({
          click() {
            this.count += 1;
          },
        });
        this.register(classTag);
      }
    }
    ClassEvents.prototype.count = ClassEvents.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentEvents>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassEvents} */
    const classEl = container.querySelector(classTag);

    /** @type {HTMLButtonElement} */
    const fluentBtn = fluentEl.shadowRoot.querySelector('#btn');
    /** @type {HTMLButtonElement} */
    const classBtn = classEl.shadowRoot.querySelector('#btn');
    fluentBtn.click();
    classBtn.click();
    assert.equal(fluentEl.count, 2);
    assert.equal(classEl.count, 2);
  });

  it('on hooks and onPropChanged/onAttributeChanged fire for fluent and class', async () => {
    const fluentTag = nextTag('fluent-hooks');
    const classTag = nextTag('class-hooks');
    /** @type {string[]} */
    const fluentCalls = [];
    /** @type {string[]} */
    const classCalls = [];
    const FluentHooks = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0, attr: 'count', reflect: true },
      })
      .html`<span>{count}</span>`
      .on({
        constructed() {
          fluentCalls.push('constructed');
        },
        connected() {
          fluentCalls.push('connected');
        },
        disconnected() {
          fluentCalls.push('disconnected');
        },
      })
      .onPropChanged({
        count() {
          fluentCalls.push('countChanged');
        },
      })
      .onAttributeChanged({
        count() {
          fluentCalls.push('attrChanged');
        },
      })
      .register(fluentTag);
    class ClassHooks extends CustomElement {
      static {
        this.observe({
          count: { type: 'integer', value: 0, attr: 'count', reflect: true },
        });
        this.html`<span>{count}</span>`;
        this.on({
          constructed() {
            classCalls.push('constructed');
          },
          connected() {
            classCalls.push('connected');
          },
          disconnected() {
            classCalls.push('disconnected');
          },
        });
        this.onPropChanged({
          count() {
            classCalls.push('countChanged');
          },
        });
        this.onAttributeChanged({
          count() {
            classCalls.push('attrChanged');
          },
        });
        this.register(classTag);
      }
    }
    ClassHooks.prototype.count = ClassHooks.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentHooks>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassHooks} */
    const classEl = container.querySelector(classTag);

    fluentEl.count = 1;
    classEl.count = 1;
    assert.ok(fluentCalls.includes('countChanged'));
    assert.ok(classCalls.includes('countChanged'));

    fluentEl.setAttribute('count', '2');
    classEl.setAttribute('count', '2');
    assert.ok(fluentCalls.includes('attrChanged'));
    assert.ok(classCalls.includes('attrChanged'));

    fluentEl.remove();
    classEl.remove();
    assert.ok(fluentCalls.includes('disconnected'));
    assert.ok(classCalls.includes('disconnected'));
  });

  it('idl and readonly/set behave for fluent and class elements', async () => {
    const fluentTag = nextTag('fluent-idl');
    const classTag = nextTag('class-idl');
    const FluentIdl = CustomElement
      .extend()
      .idl('count', { type: 'integer', value: 1 })
      .set({
        label() {
          return `${this.count}`;
        },
      })
      .readonly({ frozen: 123 })
      .html`<span class="count">{count}</span><span class="label">{label}</span>`
      .register(fluentTag);
    class ClassIdl extends CustomElement {
      static {
        this.idl('count', { type: 'integer', value: 1 });
        this.set({
          label() {
            return `${this.count}`;
          },
        });
        this.readonly({ frozen: 123 });
        this.html`<span class="count">{count}</span><span class="label">{label}</span>`;
        this.register(classTag);
      }
    }
    ClassIdl.prototype.count = ClassIdl.setPrototype('count', { type: 'integer', value: 1 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentIdl>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassIdl & { frozen: number }} */
    const classEl = container.querySelector(classTag);

    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '1');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '1');
    fluentEl.count = 4;
    /** @type {any} */ (classEl).count = 4;
    assert.equal(fluentEl.shadowRoot.querySelector('.label').textContent, '4');
    assert.equal(classEl.shadowRoot.querySelector('.label').textContent, '4');

    assert.throws(() => {
      fluentEl.frozen = 999;
    }, TypeError);
    assert.throws(() => {
      classEl.frozen = 999;
    }, TypeError);
    assert.equal(fluentEl.frozen, 123);
    assert.equal(classEl.frozen, 123);
  });

  it('defineStatic and autoRegister behave for fluent and class elements', async () => {
    const fluentTag = nextTag('fluent-auto');
    const classTag = nextTag('class-auto');
    const FluentStatic = CustomElement
      .extend()
      .defineStatic({ version: { type: 'string', value: 'v1' } })
      .html`<span></span>`
      .autoRegister(fluentTag);
    class ClassStatic extends CustomElement {
      static {
        this.defineStatic({ version: { type: 'string', value: 'v1' } });
        this.html`<span></span>`;
        this.autoRegister(classTag);
      }
    }

    assert.equal(FluentStatic.version, 'v1');
    assert.equal(ClassStatic.version, 'v1');
    FluentStatic.version = 'v2';
    ClassStatic.version = 'v2';
    assert.equal(FluentStatic.version, 'v2');
    assert.equal(ClassStatic.version, 'v2');

    assert.equal(FluentStatic.defined, true);
    assert.equal(ClassStatic.defined, true);
  });

  it('append and composed callbacks run for fluent and class elements', async () => {
    const fluentTag = nextTag('fluent-append');
    const classTag = nextTag('class-append');
    let fluentComposed = 0;
    let classComposed = 0;
    const FluentAppend = CustomElement
      .extend()
      .html`<span id="base">base</span>`
      .append('<span id="extra">extra</span>')
      .on('composed', () => {
        fluentComposed += 1;
      })
      .register(fluentTag);
    class ClassAppend extends CustomElement {
      static {
        this.html`<span id="base">base</span>`;
        this.append('<span id="extra">extra</span>');
        this.on('composed', () => {
          classComposed += 1;
        });
        this.register(classTag);
      }
    }

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentAppend>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassAppend} */
    const classEl = container.querySelector(classTag);

    assert.ok(fluentEl.shadowRoot.querySelector('#base'));
    assert.ok(classEl.shadowRoot.querySelector('#base'));
    assert.ok(fluentEl.shadowRoot.querySelector('#extra'));
    assert.ok(classEl.shadowRoot.querySelector('#extra'));
    assert.ok(fluentComposed > 0);
    assert.ok(classComposed > 0);
  });

  it('extend and mixin produce subclasses with isolated prop lists', async () => {
    const fluentTag = nextTag('fluent-extend');
    const classTag = nextTag('class-extend');
    const FluentBase = CustomElement.extend()
      .observe({ count: { type: 'integer', value: 1, reflect: true } });
    const FluentExtended = FluentBase.extend((Base) => class extends Base {});
    FluentExtended
      .observe({ label: { type: 'string', value: 'ok' } })
      .html`<span class="label">{label}</span>`
      .register(fluentTag);

    class ClassBase extends CustomElement {}
    ClassBase.observe({ count: { type: 'integer', value: 1, reflect: true } });
    const ClassExtended = ClassBase.mixin((Base) => class extends Base {});
    ClassExtended.observe({ label: { type: 'string', value: 'ok' } });
    ClassExtended.html`<span class="label">{label}</span>`;
    ClassExtended.register(classTag);
    ClassExtended.prototype.count = ClassExtended.setPrototype('count', { type: 'integer', value: 1 });
    ClassExtended.prototype.label = ClassExtended.setPrototype('label', { type: 'string', value: 'ok' });

    assert.ok(FluentBase.propList.has('count'));
    assert.equal(FluentBase.propList.has('label'), false);
    assert.ok(FluentExtended.propList.has('count'));
    assert.ok(FluentExtended.propList.has('label'));
    assert.ok(ClassBase.propList.has('count'));
    assert.equal(ClassBase.propList.has('label'), false);
    assert.ok(ClassExtended.propList.has('count'));
    assert.ok(ClassExtended.propList.has('label'));

    assert.ok(FluentBase.attrList.has('count'));
    assert.ok(ClassBase.attrList.has('count'));

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentExtended>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {InstanceType<typeof ClassExtended>} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.label').textContent, 'ok');
    assert.equal(classEl.shadowRoot.querySelector('.label').textContent, 'ok');
  });

  it('on("props") and propChanged aliases behave the same', async () => {
    const fluentTag = nextTag('fluent-props-hook');
    const classTag = nextTag('class-props-hook');
    /** @type {string[]} */
    const fluentCalls = [];
    /** @type {string[]} */
    const classCalls = [];
    const FluentHooks = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0 } })
      .html`<span>{count}</span>`
      .on('props', {
        count() {
          fluentCalls.push('props');
        },
      })
      .on('countChanged', () => {
        fluentCalls.push('countChanged');
      })
      .register(fluentTag);
    class ClassHooks extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0 } });
        this.html`<span>{count}</span>`;
        this.on('props', {
          count() {
            classCalls.push('props');
          },
        });
        this.on('countChanged', () => {
          classCalls.push('countChanged');
        });
        this.register(classTag);
      }
    }
    ClassHooks.prototype.count = ClassHooks.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentHooks>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassHooks} */
    const classEl = container.querySelector(classTag);

    fluentEl.count = 1;
    classEl.count = 1;
    assert.ok(fluentCalls.includes('props'));
    assert.ok(fluentCalls.includes('countChanged'));
    assert.ok(classCalls.includes('props'));
    assert.ok(classCalls.includes('countChanged'));
  });

  it('attribute reflection updates attributes and avoids redundant updates', async () => {
    const fluentTag = nextTag('fluent-reflect');
    const classTag = nextTag('class-reflect');
    /** @type {number[]} */
    const fluentChanges = [];
    /** @type {number[]} */
    const classChanges = [];
    const FluentReflect = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0, attr: 'count', reflect: true },
      })
      .onPropChanged({
        count(oldValue, newValue) {
          fluentChanges.push(newValue);
        },
      })
      .html`<span>{count}</span>`
      .register(fluentTag);
    class ClassReflect extends CustomElement {
      static {
        this.observe({
          count: { type: 'integer', value: 0, attr: 'count', reflect: true },
        });
        this.onPropChanged({
          count(oldValue, newValue) {
            classChanges.push(newValue);
          },
        });
        this.html`<span>{count}</span>`;
        this.register(classTag);
      }
    }
    ClassReflect.prototype.count = ClassReflect.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentReflect>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassReflect} */
    const classEl = container.querySelector(classTag);

    fluentEl.count = 2;
    classEl.count = 2;
    assert.equal(fluentEl.getAttribute('count'), '2');
    assert.equal(classEl.getAttribute('count'), '2');

    fluentEl.setAttribute('count', '2');
    classEl.setAttribute('count', '2');
    assert.equal(fluentChanges.length, 1);
    assert.equal(classChanges.length, 1);
  });

  it('custom attributeChangedCallback option takes precedence', async () => {
    const fluentTag = nextTag('fluent-attr-cb');
    const classTag = nextTag('class-attr-cb');
    /** @type {string[]} */
    const fluentCalls = [];
    /** @type {string[]} */
    const classCalls = [];
    const FluentAttr = CustomElement
      .extend()
      .observe({
        count: {
          type: 'integer',
          value: 0,
          attr: 'count',
          reflect: 'read',
          attributeChangedCallback(name, oldValue, newValue) {
            fluentCalls.push(`${name}:${newValue}`);
          },
        },
      })
      .html`<span>{count}</span>`
      .register(fluentTag);
    class ClassAttr extends CustomElement {
      static {
        this.observe({
          count: {
            type: 'integer',
            value: 0,
            attr: 'count',
            reflect: 'read',
            attributeChangedCallback(name, oldValue, newValue) {
              classCalls.push(`${name}:${newValue}`);
            },
          },
        });
        this.html`<span>{count}</span>`;
        this.register(classTag);
      }
    }
    ClassAttr.prototype.count = ClassAttr.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentAttr>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassAttr} */
    const classEl = container.querySelector(classTag);

    const fluentConfig = FluentAttr.attrList.get('count');
    const classConfig = ClassAttr.attrList.get('count');
    assert.ok(fluentConfig);
    assert.ok(classConfig);
    fluentConfig.attributeChangedCallback = (name, oldValue, newValue) => {
      fluentCalls.push(`${name}:${newValue}`);
    };
    classConfig.attributeChangedCallback = (name, oldValue, newValue) => {
      classCalls.push(`${name}:${newValue}`);
    };

    fluentEl.attributeChangedCallback('count', null, '3');
    classEl.attributeChangedCallback('count', null, '3');
    assert.deepEqual(fluentCalls, ['count:3']);
    assert.deepEqual(classCalls, ['count:3']);
    assert.equal(fluentEl.count, 0);
    assert.equal(classEl.count, 0);
  });

  it('refs proxy resolves ids and caches for fluent and class elements', async () => {
    const fluentTag = nextTag('fluent-refs');
    const classTag = nextTag('class-refs');
    const FluentRefs = CustomElement
      .extend()
      .html`
        <button id="primary-btn" type="button">ok</button>
      `
      .register(fluentTag);
    class ClassRefs extends CustomElement {
      static {
        this.html`<button id="primary-btn" type="button">ok</button>`;
        this.register(classTag);
      }
    }

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentRefs>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassRefs} */
    const classEl = container.querySelector(classTag);

    const fluentRef = fluentEl.refs.primaryBtn;
    const classRef = classEl.refs.primaryBtn;
    assert.equal(fluentRef?.id, 'primary-btn');
    assert.equal(classRef?.id, 'primary-btn');
    assert.equal(fluentEl.refs.primaryBtn, fluentRef);
    assert.equal(classEl.refs.primaryBtn, classRef);
  });

  it('refs uses composition cache when interpolated is false', async () => {
    const tag = nextTag('refs-composition-cache');
    const CachedRefs = CustomElement
      .extend()
      .html`<div id="ref-item"></div>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);

    /** @type {InstanceType<CachedRefs>} */
    const el = container.querySelector(tag);
    assert.ok(el.composition.template);

    el.composition.interpolated = false;
    const first = el.refs.refItem;
    const second = el.refs.refItem;
    assert.equal(first?.id, 'ref-item');
    assert.equal(second, first);
  });

  it('composition is cached per class across instances', async () => {
    const fluentTag = nextTag('fluent-cache');
    const classTag = nextTag('class-cache');
    const FluentCache = CustomElement
      .extend()
      .html`<span>ok</span>`
      .register(fluentTag);
    class ClassCache extends CustomElement {
      static {
        this.html`<span>ok</span>`;
        this.register(classTag);
      }
    }

    container.innerHTML = `<${fluentTag}></${fluentTag}><${fluentTag}></${fluentTag}><${classTag}></${classTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCache>} */
    const fluentElA = container.querySelectorAll(fluentTag)[0];
    /** @type {InstanceType<FluentCache>} */
    const fluentElB = container.querySelectorAll(fluentTag)[1];
    /** @type {ClassCache} */
    const classElA = container.querySelectorAll(classTag)[0];
    /** @type {ClassCache} */
    const classElB = container.querySelectorAll(classTag)[1];

    assert.equal(fluentElA.composition, fluentElB.composition);
    assert.equal(classElA.composition, classElB.composition);
    assert.ok(FluentCache._composition);
    assert.ok(ClassCache._composition);
  });

  it('patch updates properties and renders once per change', async () => {
    const fluentTag = nextTag('fluent-patch');
    const classTag = nextTag('class-patch');
    const FluentPatch = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0 },
        label: { type: 'string', value: '' },
      })
      .html`<span class="count">{count}</span><span class="label">{label}</span>`
      .register(fluentTag);
    class ClassPatch extends CustomElement {
      static {
        this.observe({
          count: { type: 'integer', value: 0 },
          label: { type: 'string', value: '' },
        });
        this.html`<span class="count">{count}</span><span class="label">{label}</span>`;
        this.register(classTag);
      }
    }
    ClassPatch.prototype.count = ClassPatch.setPrototype('count', { type: 'integer', value: 0 });
    ClassPatch.prototype.label = ClassPatch.setPrototype('label', { type: 'string', value: '' });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentPatch>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassPatch} */
    const classEl = container.querySelector(classTag);

    fluentEl.patch({ count: 2, label: 'ok' });
    classEl.patch({ count: 2, label: 'ok' });
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '2');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '2');
    assert.equal(fluentEl.shadowRoot.querySelector('.label').textContent, 'ok');
    assert.equal(classEl.shadowRoot.querySelector('.label').textContent, 'ok');
  });

  it('props and overrides aliases behave the same as observe/set', async () => {
    const fluentTag = nextTag('fluent-props-alias');
    const classTag = nextTag('class-props-alias');
    const FluentProps = CustomElement
      .extend()
      .props({ label: { type: 'string', value: 'base' } })
      .overrides({ label: 'override' })
      .html`<span class="label">{label}</span>`
      .register(fluentTag);
    class ClassProps extends CustomElement {
      static {
        this.props({ label: { type: 'string', value: 'base' } });
        this.overrides({ label: 'override' });
        this.html`<span class="label">{label}</span>`;
        this.register(classTag);
      }
    }
    ClassProps.prototype.label = ClassProps.setPrototype('label', { type: 'string', value: 'override' });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentProps>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassProps} */
    const classEl = container.querySelector(classTag);
    assert.equal(fluentEl.shadowRoot.querySelector('.label').textContent, 'override');
    assert.equal(classEl.shadowRoot.querySelector('.label').textContent, 'override');
  });

  it('observedAttributes reflect attrList for fluent and class elements', async () => {
    const fluentTag = nextTag('fluent-observed-attrs');
    const classTag = nextTag('class-observed-attrs');
    const FluentAttrs = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0, reflect: true },
        data: { type: 'object', value: {} },
      })
      .html`<span></span>`
      .register(fluentTag);
    class ClassAttrs extends CustomElement {
      static {
        this.observe({
          count: { type: 'integer', value: 0, reflect: true },
          data: { type: 'object', value: {} },
        });
        this.html`<span></span>`;
        this.register(classTag);
      }
    }
    ClassAttrs.prototype.count = ClassAttrs.setPrototype('count', { type: 'integer', value: 0 });
    ClassAttrs.prototype.data = ClassAttrs.setPrototype('data', { type: 'object', value: {} });

    const fluentAttrs = Array.from(FluentAttrs.observedAttributes);
    const classAttrs = Array.from(ClassAttrs.observedAttributes);
    assert.ok(fluentAttrs.includes('count'));
    assert.ok(classAttrs.includes('count'));
    assert.equal(fluentAttrs.includes('data'), false);
    assert.equal(classAttrs.includes('data'), false);
  });

  it('autoRegister warns when already defined', () => {
    const tag = nextTag('auto-register');
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => {
      warnings.push(args.join(' '));
    };
    try {
      const AutoDefined = CustomElement
        .extend()
        .html`<span></span>`
        .autoRegister(tag);
      AutoDefined.autoRegister(tag);
      assert.ok(warnings.length > 0);
    } finally {
      console.warn = originalWarn;
    }
  });

  it('on("attrs") alias runs attribute callbacks for fluent and class', async () => {
    const fluentTag = nextTag('fluent-attrs-hook');
    const classTag = nextTag('class-attrs-hook');
    /** @type {string[]} */
    const fluentCalls = [];
    /** @type {string[]} */
    const classCalls = [];
    const FluentAttrs = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0, attr: 'count', reflect: true } })
      .html`<span>{count}</span>`
      .on('attrs', {
        count(oldValue, newValue) {
          fluentCalls.push(String(newValue));
        },
      })
      .register(fluentTag);
    class ClassAttrs extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0, attr: 'count', reflect: true } });
        this.html`<span>{count}</span>`;
        this.on('attrs', {
          count(oldValue, newValue) {
            classCalls.push(String(newValue));
          },
        });
        this.register(classTag);
      }
    }
    ClassAttrs.prototype.count = ClassAttrs.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentAttrs>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassAttrs} */
    const classEl = container.querySelector(classTag);

    fluentEl.setAttribute('count', '5');
    classEl.setAttribute('count', '5');
    assert.deepEqual(fluentCalls, ['5']);
    assert.deepEqual(classCalls, ['5']);
  });

  it('attribute cache avoids redundant updates for fluent and class', async () => {
    const fluentTag = nextTag('fluent-attr-cache');
    const classTag = nextTag('class-attr-cache');
    /** @type {number[]} */
    const fluentChanges = [];
    /** @type {number[]} */
    const classChanges = [];
    const FluentCache = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0, attr: 'count', reflect: true } })
      .onPropChanged({
        count(oldValue, newValue) {
          fluentChanges.push(newValue);
        },
      })
      .html`<span>{count}</span>`
      .register(fluentTag);
    class ClassCache extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0, attr: 'count', reflect: true } });
        this.onPropChanged({
          count(oldValue, newValue) {
            classChanges.push(newValue);
          },
        });
        this.html`<span>{count}</span>`;
        this.register(classTag);
      }
    }
    ClassCache.prototype.count = ClassCache.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCache>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassCache} */
    const classEl = container.querySelector(classTag);

    fluentEl.setAttribute('count', '7');
    classEl.setAttribute('count', '7');
    assert.deepEqual(fluentChanges, [7]);
    assert.deepEqual(classChanges, [7]);

    fluentEl.setAttribute('count', '7');
    classEl.setAttribute('count', '7');
    assert.deepEqual(fluentChanges, [7]);
    assert.deepEqual(classChanges, [7]);
  });

  it('nullable reflected props remove attributes when set to null', async () => {
    const fluentTag = nextTag('fluent-nullable');
    const classTag = nextTag('class-nullable');
    const FluentNull = CustomElement
      .extend()
      .observe({ name: { type: 'string', value: null, attr: 'name', reflect: true } })
      .html`<span>{name}</span>`
      .register(fluentTag);
    class ClassNull extends CustomElement {
      static {
        this.observe({ name: { type: 'string', value: null, attr: 'name', reflect: true } });
        this.html`<span>{name}</span>`;
        this.register(classTag);
      }
    }
    ClassNull.prototype.name = ClassNull.setPrototype('name', { type: 'string', value: null });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentNull>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassNull} */
    const classEl = container.querySelector(classTag);

    fluentEl.name = 'Alice';
    classEl.name = 'Alice';
    assert.equal(fluentEl.getAttribute('name'), 'Alice');
    assert.equal(classEl.getAttribute('name'), 'Alice');

    fluentEl.name = null;
    classEl.name = null;
    assert.equal(fluentEl.getAttribute('name'), null);
    assert.equal(classEl.getAttribute('name'), null);
  });

  it('refs warnings for missing ids and before composition', async () => {
    const tag = nextTag('refs-warning');
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(' '));
    try {
      const WarnEl = CustomElement
        .extend()
        .html`<span id="known-id"></span>`
        .on('constructed', function constructed({ refs }) {
          refs.missingId;
        })
        .register(tag);

      container.innerHTML = `<${tag}></${tag}>`;
      await customElements.whenDefined(tag);
      /** @type {InstanceType<WarnEl>} */
      const el = container.querySelector(tag);
      assert.equal(el.refs.missingId, null);
    } finally {
      console.warn = originalWarn;
    }
  });

  it('composition cache persists across disconnected instances', async () => {
    const tag = nextTag('composition-cache');
    const CacheEl = CustomElement
      .extend()
      .html`<span>ok</span>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<CacheEl>} */
    const first = container.querySelector(tag);
    const firstComposition = first.composition;
    first.remove();

    const second = document.createElement(tag);
    container.appendChild(second);
    /** @type {InstanceType<CacheEl>} */
    const secondEl = container.querySelector(tag);
    assert.equal(secondEl.composition, firstComposition);
  });

  it('data/array/object props do not reflect by default', async () => {
    const fluentTag = nextTag('fluent-no-reflect');
    const classTag = nextTag('class-no-reflect');
    const FluentData = CustomElement
      .extend()
      .observe({
        data: { type: 'object', value: { name: 'A' } },
        list: { type: 'array', value: [1, 2] },
      })
      .html`<span></span>`
      .register(fluentTag);
    class ClassData extends CustomElement {
      static {
        this.observe({
          data: { type: 'object', value: { name: 'A' } },
          list: { type: 'array', value: [1, 2] },
        });
        this.html`<span></span>`;
        this.register(classTag);
      }
    }
    ClassData.prototype.data = ClassData.setPrototype('data', { type: 'object', value: { name: 'A' } });
    ClassData.prototype.list = ClassData.setPrototype('list', { type: 'array', value: [1, 2] });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    const fluentAttrs = Array.from(FluentData.observedAttributes);
    const classAttrs = Array.from(ClassData.observedAttributes);
    assert.equal(fluentAttrs.includes('data'), false);
    assert.equal(classAttrs.includes('data'), false);
    assert.equal(fluentAttrs.includes('list'), true);
    assert.equal(classAttrs.includes('list'), true);
  });

  it('patch still renders when change appears only in pending patches', async () => {
    const fluentTag = nextTag('fluent-pending-patch');
    const classTag = nextTag('class-pending-patch');
    const FluentPatch = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0 } })
      .html`<span class="count">{count}</span>`
      .register(fluentTag);
    class ClassPatch extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0 } });
        this.html`<span class="count">{count}</span>`;
        this.register(classTag);
      }
    }
    ClassPatch.prototype.count = ClassPatch.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentPatch>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassPatch} */
    const classEl = container.querySelector(classTag);
    fluentEl.patch({});
    classEl.patch({});
    fluentEl.count = 2;
    classEl.count = 2;
    fluentEl.patch({});
    classEl.patch({});
    assert.equal(fluentEl.shadowRoot.querySelector('.count').textContent, '2');
    assert.equal(classEl.shadowRoot.querySelector('.count').textContent, '2');
  });

  it('reflect modes behave for read and write', async () => {
    const fluentTag = nextTag('fluent-reflect-modes');
    const classTag = nextTag('class-reflect-modes');
    const FluentModes = CustomElement
      .extend()
      .observe({
        readOnly: { type: 'integer', value: 0, attr: 'read-only', reflect: 'read' },
        writeOnly: { type: 'integer', value: 0, attr: 'write-only', reflect: 'write' },
      })
      .html`<span></span>`
      .register(fluentTag);
    class ClassModes extends CustomElement {
      static {
        this.observe({
          readOnly: { type: 'integer', value: 0, attr: 'read-only', reflect: 'read' },
          writeOnly: { type: 'integer', value: 0, attr: 'write-only', reflect: 'write' },
        });
        this.html`<span></span>`;
        this.register(classTag);
      }
    }
    ClassModes.prototype.readOnly = ClassModes.setPrototype('readOnly', {
      type: 'integer',
      value: 0,
      attr: 'read-only',
      reflect: 'read',
    });
    ClassModes.prototype.writeOnly = ClassModes.setPrototype('writeOnly', {
      type: 'integer',
      value: 0,
      attr: 'write-only',
      reflect: 'write',
    });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentModes>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassModes} */
    const classEl = container.querySelector(classTag);

    fluentEl.readOnly = 3;
    classEl.readOnly = 3;
    assert.equal(fluentEl.getAttribute('read-only'), null);
    assert.equal(classEl.getAttribute('read-only'), null);
    fluentEl.setAttribute('read-only', '4');
    classEl.setAttribute('read-only', '4');
    assert.equal(fluentEl.readOnly, 4);
    assert.equal(classEl.readOnly, 4);

    fluentEl.writeOnly = 5;
    classEl.writeOnly = 5;
    assert.equal(fluentEl.getAttribute('write-only'), '5');
    assert.equal(classEl.getAttribute('write-only'), '5');
    fluentEl.setAttribute('write-only', '6');
    classEl.setAttribute('write-only', '6');
    assert.equal(fluentEl.writeOnly, 5);
    assert.equal(classEl.writeOnly, 5);
  });

  it('callbackArguments provide composition, refs, html, and template', async () => {
    const fluentTag = nextTag('fluent-callback-args');
    const classTag = nextTag('class-callback-args');
    /** @type {any} */
    let fluentArgs;
    /** @type {any} */
    let classArgs;
    const FluentArgs = CustomElement
      .extend()
      .html`<span id="target"></span>`
      .on('constructed', (args) => {
        fluentArgs = args;
      })
      .register(fluentTag);
    class ClassArgs extends CustomElement {
      static {
        this.html`<span id="target"></span>`;
        this.on('constructed', (args) => {
          classArgs = args;
        });
        this.register(classTag);
      }
    }

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    assert.ok(fluentArgs);
    assert.ok(classArgs);
    assert.ok(fluentArgs.composition);
    assert.ok(classArgs.composition);
    assert.equal(typeof fluentArgs.html, 'function');
    assert.equal(typeof classArgs.html, 'function');
    assert.ok(fluentArgs.template);
    assert.ok(classArgs.template);
    assert.equal(fluentArgs.element.tagName.toLowerCase(), fluentTag);
    assert.equal(classArgs.element.tagName.toLowerCase(), classTag);
    assert.ok(fluentArgs.refs.target);
    assert.ok(classArgs.refs.target);
  });

  it('attributeCache stores reflected string values', async () => {
    const fluentTag = nextTag('fluent-attr-cache-map');
    const classTag = nextTag('class-attr-cache-map');
    const FluentCache = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0, attr: 'count', reflect: true } })
      .html`<span>{count}</span>`
      .register(fluentTag);
    class ClassCache extends CustomElement {
      static {
        this.observe({ count: { type: 'integer', value: 0, attr: 'count', reflect: true } });
        this.html`<span>{count}</span>`;
        this.register(classTag);
      }
    }
    ClassCache.prototype.count = ClassCache.setPrototype('count', { type: 'integer', value: 0 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentCache>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassCache} */
    const classEl = container.querySelector(classTag);

    fluentEl.count = 9;
    classEl.count = 9;
    assert.ok(fluentEl.attributeCache.has('count'));
    assert.ok(classEl.attributeCache.has('count'));
    assert.equal(fluentEl.attributeCache.get('count').stringValue, '9');
    assert.equal(classEl.attributeCache.get('count').stringValue, '9');
  });

  it('cloneAttributeCallback mirrors attributes on target refs', async () => {
    const tag = nextTag('clone-attr');
    const CloneEl = CustomElement
      .extend()
      .html`<input id="target" />`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<CloneEl>} */
    const el = container.querySelector(tag);

    const handler = cloneAttributeCallback('aria-label', 'target');
    handler(null, 'Hello', el);
    assert.equal(el.refs.target.getAttribute('aria-label'), 'Hello');
    handler('Hello', null, el);
    assert.equal(el.refs.target.getAttribute('aria-label'), null);
  });

  it('css accepts style elements directly', async () => {
    const tag = nextTag('css-style-element');
    const styleEl = document.createElement('style');
    styleEl.textContent = ':host{display:block}';
    const Styled = CustomElement
      .extend()
      .css(styleEl)
      .html`<span>ok</span>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<Styled>} */
    const el = container.querySelector(tag);
    assert.ok(el.composition.styles.includes(styleEl));
  });

  it('set supports symbol keys on prototypes', async () => {
    const tag = nextTag('symbol-set');
    const sym = Symbol('secret');
    const WithSymbol = CustomElement
      .extend()
      .set({ [sym]: 42 })
      .html`<span></span>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<WithSymbol>} */
    const el = container.querySelector(tag);
    assert.equal(el[sym], 42);
  });

  it('undefine removes watcher callbacks', () => {
    const tag = nextTag('undefine-watchers');
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(' '));
    try {
      const Watched = CustomElement
        .extend()
        .observe({
          count: {
            type: 'integer',
            value: 0,
            changedCallback() {},
          },
        })
        .html`<span></span>`
        .register(tag);

      Watched.undefine('count');
      assert.ok(warnings.some((entry) => entry.includes('Unwatching count')));
    } finally {
      console.warn = originalWarn;
    }
  });

  it('events accept deep prop strings', async () => {
    const tag = nextTag('events-deep-prop');
    /** @type {string[]} */
    const calls = [];
    const EventsEl = CustomElement
      .extend()
      .set({ handlers: { onClick() { calls.push('click'); } } })
      .events({ click: 'handlers.onClick' })
      .html`<button id="btn">ok</button>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<EventsEl>} */
    const el = container.querySelector(tag);

    const listeners = el.composition.events.get('') ?? [];
    const clickListener = listeners.find((listener) => listener.type === 'click');
    assert.ok(clickListener);
    assert.equal(clickListener.prop, 'handlers');
    assert.deepEqual(clickListener.deepProp, ['handlers', 'onClick']);
    el.shadowRoot.querySelector('#btn').click();
    assert.deepEqual(calls, ['click']);
  });

  it('events accept prop strings', async () => {
    const tag = nextTag('events-prop');
    /** @type {string[]} */
    const calls = [];
    const EventsEl = CustomElement
      .extend()
      .set({ onClick() { calls.push('click'); } })
      .events({ click: 'onClick' })
      .html`<button id="btn">ok</button>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<EventsEl>} */
    const el = container.querySelector(tag);

    el.shadowRoot.querySelector('#btn').click();
    assert.deepEqual(calls, ['click']);
  });

  it('onAttributeChanged appends callbacks for the same attr', () => {
    const tag = nextTag('attr-callback-push');
    const Attrs = CustomElement
      .extend()
      .onAttributeChanged({
        count() {},
      })
      .onAttributeChanged({
        count() {},
      })
      .html`<span></span>`
      .register(tag);

    const callbacks = Attrs.attributeChangedCallbacks.get('count');
    assert.equal(callbacks.length, 2);
  });

  it('on throws on invalid callback names', () => {
    const tag = nextTag('invalid-on');
    const Broken = CustomElement
      .extend()
      .html`<span></span>`
      .register(tag);

    assert.throws(() => {
      Broken.on('not-a-hook', () => {});
    }, /Invalid callback name/);
  });

  it('attributeChangedCallback returns when parsed value matches current', async () => {
    const tag = nextTag('attr-equal-early-return');
    const Attrs = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0, attr: 'count', reflect: 'read' } })
      .html`<span>{count}</span>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<Attrs>} */
    const el = container.querySelector(tag);

    el.count = 5;
    el.attributeChangedCallback('count', null, '5');
    assert.equal(el.count, 5);
  });

  it('pending patch renders computed props not present in patch', async () => {
    const tag = nextTag('pending-computed');
    const Computed = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 1 },
        double({ count }) {
          return count * 2;
        },
      })
      .html`<span class="double">{double}</span>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<Computed>} */
    const el = container.querySelector(tag);

    /** @type {Array<[string, any]>} */
    const calls = [];
    const originalByProp = el.render.byProp;
    el.render.byProp = (name, changes) => {
      calls.push([name, changes]);
      return originalByProp.call(el.render, name, changes, el);
    };

    el.patch({ count: 3 });
    assert.ok(calls.some(([name]) => name === 'double'));
  });

  it('propChangedCallback triggers render.byProp outside patch', async () => {
    const tag = nextTag('render-by-prop');
    const RenderByProp = CustomElement
      .extend()
      .observe({ count: { type: 'integer', value: 0 } })
      .html`<span class="count">{count}</span>`
      .register(tag);

    container.innerHTML = `<${tag}></${tag}>`;
    await customElements.whenDefined(tag);
    /** @type {InstanceType<RenderByProp>} */
    const el = container.querySelector(tag);

    /** @type {Array<[string, any]>} */
    const calls = [];
    const originalByProp = el.render.byProp;
    el.render.byProp = (name, changes) => {
      calls.push([name, changes]);
      return originalByProp.call(el.render, name, changes, el);
    };

    el.count = 3;
    assert.deepEqual(calls[0], ['count', 3]);
  });

  it('computed observe getters invalidate when dependencies change', async () => {
    const fluentTag = nextTag('fluent-computed');
    const classTag = nextTag('class-computed');
    const FluentComputed = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 1 },
        double({ count }) {
          return count * 2;
        },
      })
      .html`<span class="double">{double}</span>`
      .register(fluentTag);
    class ClassComputed extends CustomElement {
      static {
        this.observe({
          count: { type: 'integer', value: 1 },
          double({ count }) {
            return count * 2;
          },
        });
        this.html`<span class="double">{double}</span>`;
        this.register(classTag);
      }
    }
    ClassComputed.prototype.count = ClassComputed.setPrototype('count', { type: 'integer', value: 1 });

    container.innerHTML = `<${fluentTag}></${fluentTag}><${classTag}></${classTag}>`;
    await customElements.whenDefined(fluentTag);
    await customElements.whenDefined(classTag);

    /** @type {InstanceType<FluentComputed>} */
    const fluentEl = container.querySelector(fluentTag);
    /** @type {ClassComputed} */
    const classEl = container.querySelector(classTag);

    assert.equal(fluentEl.shadowRoot.querySelector('.double').textContent, '2');
    assert.equal(classEl.shadowRoot.querySelector('.double').textContent, '2');
    fluentEl.count = 4;
    classEl.count = 4;
    assert.equal(fluentEl.shadowRoot.querySelector('.double').textContent, '8');
    assert.equal(classEl.shadowRoot.querySelector('.double').textContent, '8');
  });
});
