import './Icon.js';
import './Ripple.js';
import './Badge.js';
import './Shape.js';

import CustomElement from '../core/CustomElement.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import HyperlinkMixin from '../mixins/HyperlinkMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */

/**
 * A navigation item represents a single destination used by navigation bars,
 * navigation drawers, and navigation rails. It provides an icon, optional
 * label, and optional badge to help users move between app sections.
 * @see https://m3.material.io/components/navigation-bar/specs
 * @see https://m3.material.io/components/navigation-drawer/specs
 * @see https://m3.material.io/components/navigation-rail/specs
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(HyperlinkMixin)
  .mixin(DelegatesFocusMixin)
  .set({
    stateLayer: true,
  })
  .observe({
    /** Whether the label slot is visible. When true the label is shown. */
    showLabel: 'string',
    /** Whether the item is active/selected; affects styling and aria-current. */
    active: 'boolean',
    /** Name of the icon to display (e.g. 'home'); ignored when `src` is provided. */
    icon: 'string',
    /** URL of an icon image; takes precedence over `icon` when present. */
    src: 'string',
    /** Badge content to display on the item (e.g. notification count). */
    badge: 'string',
    /** Accessible label for the anchor; when present it is used instead of the slot text. */
    ariaLabel: 'string', // watch attribute and emit callback
  })
  .methods({
    /** Focus the internal anchor element. */
    /** @type {HTMLElement['focus']} */
    focus(...args) {
      this.refs.anchor.focus(...args);
    },
  })
  .expressions({
    _anchorAriaCurrent({ active }) {
      return active ? 'page' : null;
    },
    _anchorAriaLabelledby({ ariaLabel }) {
      return ariaLabel ? null : 'slot';
    },
    _anchorHref({ href }) { return href ?? '#'; },
    iconVariation({ active }) {
      return active ? 'filled' : null;
    },
  })
  .html`
    <mdw-icon id=icon aria-hidden=true src={src} active={active} icon={icon} variation={iconVariation}></mdw-icon>
    <slot id=slot active={active} show-label={showLabel} aria-hidden=true></slot>
    <mdw-badge part=badge id=badge badge={badge} show-label={showLabel} aria-hidden=true>{badge}</mdw-badge>
  `
  .recompose(({ html, refs: { anchor, state, rippleContainer } }) => {
    anchor.setAttribute('aria-current', '{_anchorAriaCurrent}');
    anchor.setAttribute('aria-describedby', 'badge');
    anchor.setAttribute('aria-label', '{ariaLabel}');
    anchor.setAttribute('aria-labelledby', '{_anchorAriaLabelledby}');
    anchor.setAttribute('href', '{_anchorHref}');
    anchor.before(html`
      <mdw-shape id=shape active={active} shape-style=full>
        <mdw-ripple id=ripple ripple-origin=center keep-alive hold-ripple ripple-state=${({ active }) => ((active) ? null : 'complete')}></mdw-ripple>
        ${state}
        ${rippleContainer}
      </mdw-shape>
    `);
  })
  .css`
    /* https://m3.material.io/components/navigation-bar/specs */
    /* https://m3.material.io/components/navigation-drawer/specs */
    /* https://m3.material.io/components/navigation-rail/specs */

    :host {
      --mdw-badge__scale: 0;
      --mdw-shape__size: var(--mdw-shape__full);
      --mdw-nav-item__offset-y: 0;
      position: relative;

      display: grid;
      align-content: center;
      align-items: flex-start;
      grid-auto-flow: row;
      grid-auto-rows: minmax(20px, min-content);
      grid-template-rows: [icon] minmax(32px, 1fr);
      grid-template-columns: [icon] minmax(56px, 1fr);

      justify-items: center;
      row-gap: 4px;

      box-sizing: border-box;

      padding-inline: 0;

      cursor: pointer;

      user-select: none;

      font: var(--mdw-typescale__label-large__font);
      letter-spacing: var(--mdw-typescale__label-large__letter-spacing);

      text-align: center;
    }

    :host(:not([color])) {
      --mdw-ink: var(--mdw-color__on-secondary-container);
      --mdw-bg: var(--mdw-color__secondary-container);
    }

    :host([color]) {
      background-color: transparent;
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    #slot {
      display: contents;
      align-items: center;
      flex-direction: column;
      grid-area: label;
      justify-content: center;

      grid-column: 1 /4;

      grid-row: 2;

      flex: 1;

      cursor: inherit;
      outline: none;

      transform: translateY(var(--mdw-nav-item__offset-y));

      color: rgb(var(--mdw-color__on-surface-variant));

      transition: opacity, color, transform 200ms;
      will-change: opacity, transform;
    }

    #anchor {
      position: absolute;
      inset: 0;

      outline: none;

      z-index: 5;
    }

    #shape {
      position: absolute;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      top: 50%;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      right: auto;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      bottom: auto;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      left: 50%;

      overflow: hidden;

      block-size: 100%;
      inline-size: 100%;
      max-inline-size: 56px;

      grid-column: icon;
      grid-row: 1 / 1;

      transform: translateX(-50%) translateY(-50%) translateY(var(--mdw-nav-item__offset-y));

      background-color: transparent;

      transition: transform 200ms;
      will-change: transform;
    }

    #icon {
      position: relative;
      align-self: center;

      grid-area: icon;

      transform: translateY(var(--mdw-nav-item__offset-y));
      z-index: 3;

      color: rgb(var(--mdw-color__on-surface-variant));

      font-size: 24px;

      transition: transform 200ms;
      will-change: transform;
    }

    #state {
      z-index: 2;
    }

    #badge {
      --mdw-badge__scale: 0;
      position: absolute;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      top: 50%;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      left: 50%;

      overflow: hidden;

      max-inline-size: 50%;
      grid-column: 1 / 4;

      grid-row: 1 / 2;

      transform: translateY(-100%) translateY(var(--mdw-nav-item__offset-y)) scale(var(--mdw-badge__scale));
      z-index: 4;

      text-align: start;
      text-overflow: ellipsis;
      text-transform: none;
      white-space: nowrap;
      word-break: normal;

      transition: transform 200ms;
      will-change: transform;
    }

    #badge[badge] {
      --mdw-badge__scale: 1;
    }

    #ripple {
      opacity: 1;

      color: rgb(var(--mdw-bg));
    }

    #ripple-container {
      z-index:1;
    }

    #shape[active] {
      color: rgb(var(--mdw-ink));
    }

    #icon[active] {
      color: rgb(var(--mdw-ink));
    }

    #slot[active] {
      color: inherit;
    }

    :host([show-label]) {
      --mdw-nav-item__offset-y: 12px;
    }

    :host([show-label="active"][active]) {
      --mdw-nav-item__offset-y: 0;
    }
  `
  .childEvents({
    anchor: {
      click() {
        /* Prevent Default (false) if no href */
        return this.href != null;
      },
      keydown({ key, repeat }) {
        if (key !== ' ') return true;
        if (!repeat) {
          this.click();
        }
        return false;
      },
    },
  })
  .extend((Base) => class NavItem extends Base {
    /**
     * Add a ripple effect only when the item is active.
     * @type {InstanceType<ReturnType<RippleMixin>>['addRipple']}
     */
    addRipple(...args) {
      if (!this.active) return null;
      return super.addRipple(...args);
    }
  })
  .autoRegister('mdw-nav-item');
