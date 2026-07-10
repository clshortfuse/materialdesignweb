import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import '../../components/Details.js';
import { html, sendKeypress } from '../utils.js';

/** @typedef {InstanceType<typeof import('../../components/Details.js').default>} DetailsElement */

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * @param {TemplateStringsArray} strings
 * @param  {...(string|number|boolean)} substitutions
 * @return {DetailsElement}
 */
function detailsHtml(strings, ...substitutions) {
  return html(strings, ...substitutions);
}

/**
 * @param {string} name
 * @param {string} label
 * @param {boolean} [open=false]
 * @return {DetailsElement}
 */
function createNamedDetails(name, label, open = false) {
  const details = /** @type {DetailsElement} */ (document.createElement('mdw-details'));
  details.setAttribute('name', name);
  if (open) {
    details.setAttribute('open', '');
  }
  details.innerHTML = `
    <span slot=summary>${label}</span>
    <span>${label} content</span>
  `;
  return details;
}

describe('mdw-details', () => {
  it('uses a default Details summary when no summary content is provided', async () => {
    const details = detailsHtml`
      <mdw-details>
        <button id=content>Expanded content</button>
      </mdw-details>
    `;
    await nextTask();
    const summary = /** @type {HTMLElement} */ (details.refs.summary);
    const content = /** @type {HTMLButtonElement} */ (details.querySelector('#content'));

    assert.include(summary.textContent.trim(), 'Details');
    assert.isTrue(details._expandable);
    assert.equal(summary.getAttribute('aria-expanded'), 'false');
    assert.isTrue(content.inert);
  });

  it('uses the summary attribute as fallback summary text', async () => {
    const details = detailsHtml`
      <mdw-details summary="More information">
        <span>Expanded content</span>
      </mdw-details>
    `;
    await nextTask();

    assert.include(details.refs.summary.textContent.trim(), 'More information');
  });

  it('uses the default expand_more marker with rotation', async () => {
    const details = detailsHtml`
      <mdw-details>
        <span slot=summary>Show details</span>
        <span>Expanded content</span>
      </mdw-details>
    `;
    await nextTask();
    const marker = /** @type {HTMLElement} */ (details.refs.marker);

    assert.equal(marker.getAttribute('icon'), 'expand_more');
    assert.isTrue(marker.hasAttribute('rotating'));

    details.refs.summary.click();
    await nextTask();

    assert.equal(marker.getAttribute('icon'), 'expand_more');
    assert.isTrue(marker.hasAttribute('rotating'));
    assert.isTrue(marker.hasAttribute('expanded'));
  });

  it('swaps custom marker icons without rotation', async () => {
    const details = detailsHtml`
      <mdw-details icon=add icon-expanded=remove>
        <span slot=summary>Show details</span>
        <span>Expanded content</span>
      </mdw-details>
    `;
    await nextTask();
    const marker = /** @type {HTMLElement} */ (details.refs.marker);

    assert.equal(marker.getAttribute('icon'), 'add');
    assert.isFalse(marker.hasAttribute('rotating'));

    details.refs.summary.click();
    await nextTask();

    assert.equal(marker.getAttribute('icon'), 'remove');
    assert.isFalse(marker.hasAttribute('rotating'));
    assert.isTrue(marker.hasAttribute('expanded'));
  });

  it('uses default children as expansion content and summary slot as disclosure', async () => {
    const details = detailsHtml`
      <mdw-details>
        <span slot=summary id=summary-text>Show details</span>
        <button id=content>Expanded content</button>
      </mdw-details>
    `;
    await nextTask();
    const summary = /** @type {HTMLElement} */ (details.refs.summary);
    const summaryText = /** @type {HTMLElement} */ (details.querySelector('#summary-text'));
    const content = /** @type {HTMLButtonElement} */ (details.querySelector('#content'));

    assert.isTrue(details._expandable);
    assert.equal(details.getExpandableAriaElement(), summary);
    assert.equal(summary.getAttribute('aria-expanded'), 'false');
    assert.isFalse(summaryText.inert);
    assert.isTrue(content.inert);
    assert.equal(content.getAttribute('aria-hidden'), 'true');

    summary.click();

    assert.isTrue(details.expanded);
    assert.equal(summary.getAttribute('aria-expanded'), 'true');
    assert.isFalse(content.inert);
    assert.isFalse(content.hasAttribute('aria-hidden'));
  });

  it('treats text-only default content as expansion content', async () => {
    const details = detailsHtml`
      <mdw-details>
        <span slot=summary>Show details</span>
        Plain text details
      </mdw-details>
    `;
    await nextTask();
    const summary = /** @type {HTMLElement} */ (details.refs.summary);

    assert.isTrue(details._expandable);
    assert.equal(summary.getAttribute('aria-expanded'), 'false');
    assert.isTrue(details.refs.expansion.inert);
    assert.equal(details.refs.expansion.getAttribute('aria-hidden'), 'true');

    summary.click();

    assert.isTrue(details.expanded);
    assert.equal(summary.getAttribute('aria-expanded'), 'true');
    assert.isFalse(details.refs.expansion.inert);
    assert.isFalse(details.refs.expansion.hasAttribute('aria-hidden'));
  });

  it('does not expose disclosure aria when there is no expansion content', async () => {
    const details = detailsHtml`
      <mdw-details>
        <span slot=summary>Empty details</span>
      </mdw-details>
    `;
    await nextTask();
    const summary = /** @type {HTMLElement} */ (details.refs.summary);

    assert.isFalse(details._expandable);
    assert.isFalse(summary.hasAttribute('aria-expanded'));
  });

  it('supports open as an alias for expanded', async () => {
    const details = detailsHtml`
      <mdw-details open>
        <span slot=summary>Show details</span>
        <span id=content>Expanded content</span>
      </mdw-details>
    `;
    await nextTask();

    assert.isTrue(details.open);
    assert.isTrue(details.expanded);
    assert.equal(details.refs.summary.getAttribute('aria-expanded'), 'true');

    details.expanded = false;

    assert.isFalse(details.open);
    assert.isFalse(details.hasAttribute('open'));
  });

  it('preserves open while expansion content is added after connection', async () => {
    const details = /** @type {DetailsElement} */ (document.createElement('mdw-details'));
    details.setAttribute('open', '');
    document.body.append(details);
    await nextTask();

    const summary = document.createElement('span');
    summary.slot = 'summary';
    summary.textContent = 'Show details';
    details.append(summary);
    await nextTask();

    assert.isTrue(details.open);
    assert.isTrue(details.hasAttribute('open'));

    const content = document.createElement('span');
    content.textContent = 'Expanded content';
    details.append(content);
    await nextTask();

    assert.isTrue(details.open);
    assert.isTrue(details.expanded);
    assert.equal(details.refs.summary.getAttribute('aria-expanded'), 'true');
  });

  it('uses name groups as exclusive accordions', async () => {
    const first = detailsHtml`
      <mdw-details name=group open>
        <span slot=summary>First</span>
        <span>First content</span>
      </mdw-details>
      <mdw-details name=group>
        <span slot=summary>Second</span>
        <span>Second content</span>
      </mdw-details>
    `;
    await nextTask();
    const [, second] = /** @type {DetailsElement[]} */ ([...document.querySelectorAll('mdw-details')]);

    assert.isTrue(first.open);
    assert.isFalse(second.open);

    second.open = true;

    assert.isFalse(first.open);
    assert.isFalse(first.expanded);
    assert.isTrue(second.open);
    assert.isTrue(second.expanded);
  });

  it('groups names that need CSS string escaping', async () => {
    const first = createNamedDetails('group "quoted" \\ slash', 'First', true);
    const second = createNamedDetails('group "quoted" \\ slash', 'Second');
    document.body.append(first, second);
    await nextTask();

    second.open = true;

    assert.isFalse(first.open);
    assert.isTrue(second.open);
  });

  it('groups parsed name attributes containing quotes', async () => {
    const first = detailsHtml`
      <mdw-details name="group &quot;quoted&quot;" open>
        <span slot=summary>First</span>
        <span>First content</span>
      </mdw-details>
      <mdw-details name="group &quot;quoted&quot;">
        <span slot=summary>Second</span>
        <span>Second content</span>
      </mdw-details>
    `;
    await nextTask();
    const [, second] = /** @type {DetailsElement[]} */ ([...document.querySelectorAll('mdw-details')]);

    second.open = true;

    assert.equal(first.name, 'group "quoted"');
    assert.equal(second.name, 'group "quoted"');
    assert.isFalse(first.open);
    assert.isTrue(second.open);
  });

  it('keeps the last parsed open details in a name group', async () => {
    const first = detailsHtml`
      <mdw-details name=group open>
        <span slot=summary>First</span>
        <span>First content</span>
      </mdw-details>
      <mdw-details name=group open>
        <span slot=summary>Second</span>
        <span>Second content</span>
      </mdw-details>
    `;
    await nextTask();
    const [, second] = /** @type {DetailsElement[]} */ ([...document.querySelectorAll('mdw-details')]);

    assert.isFalse(first.open);
    assert.isTrue(second.open);
  });

  it('scopes name groups to the same DOM root', async () => {
    const lightFirst = createNamedDetails('same-root', 'Light first', true);
    const lightSecond = createNamedDetails('same-root', 'Light second');
    document.body.append(lightFirst, lightSecond);

    const shadowHost = document.createElement('div');
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
    const shadowFirst = createNamedDetails('same-root', 'Shadow first', true);
    const shadowSecond = createNamedDetails('same-root', 'Shadow second');
    shadowRoot.append(shadowFirst, shadowSecond);
    document.body.append(shadowHost);
    await nextTask();

    assert.isTrue(lightFirst.open);
    assert.isFalse(lightSecond.open);
    assert.isTrue(shadowFirst.open);
    assert.isFalse(shadowSecond.open);

    shadowSecond.open = true;

    assert.isTrue(lightFirst.open);
    assert.isFalse(lightSecond.open);
    assert.isFalse(shadowFirst.open);
    assert.isTrue(shadowSecond.open);

    lightSecond.open = true;

    assert.isFalse(lightFirst.open);
    assert.isTrue(lightSecond.open);
    assert.isFalse(shadowFirst.open);
    assert.isTrue(shadowSecond.open);
  });

  it('does not cross nested shadow root boundaries for name groups', async () => {
    const outerHost = document.createElement('div');
    const outerRoot = outerHost.attachShadow({ mode: 'open' });
    const outerDetails = createNamedDetails('nested-root', 'Outer shadow', true);
    const innerHost = document.createElement('div');
    const innerRoot = innerHost.attachShadow({ mode: 'open' });
    const innerDetails = createNamedDetails('nested-root', 'Inner shadow');

    innerRoot.append(innerDetails);
    outerRoot.append(outerDetails, innerHost);
    document.body.append(outerHost);
    await nextTask();

    innerDetails.open = true;

    assert.isTrue(outerDetails.open);
    assert.isTrue(innerDetails.open);
  });

  it('groups slotted details by light DOM root, separate from shadow internals', async () => {
    const shadowHost = document.createElement('div');
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
    const internalDetails = createNamedDetails('slot-root', 'Internal', true);
    shadowRoot.append(internalDetails, document.createElement('slot'));

    const slottedFirst = createNamedDetails('slot-root', 'Slotted first', true);
    const slottedSecond = createNamedDetails('slot-root', 'Slotted second');
    shadowHost.append(slottedFirst, slottedSecond);
    document.body.append(shadowHost);
    await nextTask();

    slottedSecond.open = true;

    assert.isTrue(internalDetails.open);
    assert.isFalse(slottedFirst.open);
    assert.isTrue(slottedSecond.open);
  });

  it('toggles from keyboard activation on the summary control', async () => {
    const details = detailsHtml`
      <mdw-details>
        <span slot=summary>Show details</span>
        <span>Expanded content</span>
      </mdw-details>
    `;
    await nextTask();
    const summary = /** @type {HTMLElement} */ (details.refs.summary);

    summary.focus();
    await sendKeypress('Enter');

    assert.isTrue(details.expanded);

    await sendKeypress(' ');

    assert.isFalse(details.expanded);
  });

  it('does not treat disabled as a disclosure state', async () => {
    const details = detailsHtml`
      <mdw-details disabled>
        <span slot=summary>Show details</span>
        <span id=content>Expanded content</span>
      </mdw-details>
    `;
    await nextTask();
    const summary = /** @type {HTMLElement} */ (details.refs.summary);

    summary.click();

    assert.isTrue(details.expanded);
    assert.equal(summary.getAttribute('aria-expanded'), 'true');
  });

  it('focuses the summary control', () => {
    const details = detailsHtml`
      <mdw-details>
        <span slot=summary>Show details</span>
        <span>Expanded content</span>
      </mdw-details>
    `;
    const summary = /** @type {HTMLElement} */ (details.refs.summary);

    details.focus();

    assert.equal(document.activeElement, details);
    assert.equal(details.shadowRoot.activeElement, summary);
  });
});
