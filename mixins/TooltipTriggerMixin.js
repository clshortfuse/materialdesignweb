import Tooltip from '../components/Tooltip.js';
import { canAnchorPopup } from '../utils/popup.js';

import styles from './TooltipTriggerMixin.css' assert { type: 'css' };

/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function TooltipTriggerMixin(Base) {
  class TooltipTrigger extends Base {
    static {
      this.css(styles);

      this.on({
        composed({ template, html }) {
          template.append(html`
            <${Tooltip.elementName} role=tooltip id=tooltip
            ><slot id=tooltip-slot
              on-slotchange={onTooltipTriggerSlotChange} name=tooltip
              >{tooltip}</slot></${Tooltip.elementName}>
          `);
        },
      });
    }

    static TOOLTIP_MOUSE_IDLE_MS = 500;

    static TOOLTIP_TOUCH_IDLE_MS = 1500;

    /** @type {InstanceType<Tooltip>} */
    #tooltip;

    /** @type {any} */
    #idleDebounce;

    #pendingHide = false;

    /** @type {HTMLElement[]} */
    #watchedParents = [];

    #resizeObserver;

    #intersectObserver;

    onParentScroll = (event) => {
      this.updateTooltipPosition();
    };

    /** @param {any[]} args */
    constructor(...args) {
      super(...args);
      this.#tooltip = /** @type {InstanceType<Tooltip>} */ (this.refs.tooltip.cloneNode(true));
      this.#tooltip.removeAttribute('id');
      this.#tooltip.style.setProperty('position', 'fixed');
      this.#tooltip.setAttribute('aria-hidden', 'true');
      this.#resizeObserver = new ResizeObserver((entries) => {
        // console.log('RO', entries);
        if (!this.#tooltip.open) return;
        this.updateTooltipPosition();
      });
      const threshold = [0, 0.49, 0.5, 0.51, 1];
      this.#intersectObserver = new IntersectionObserver((entries) => {
        // console.log('IO', entries);
        if (!this.#tooltip.open) return;
        for (const entry of entries) {
          if (entry.intersectionRatio <= 0) {
            this.hideTooltip();
            return;
          }
          if (entry.target === this.#tooltip) {
            this.updateTooltipPosition();
            return;
          }
          if (entry.target === this) {
            if (entry.intersectionRatio <= 0.5) {
              // console.log('should hide');
              this.hideTooltip();
            } else {
              // console.log('container size given', entry);
              this.updateTooltipPosition(entry.boundingClientRect);
            }
            return;
          }
        }
        this.updateTooltipPosition();
      }, { threshold });
      // this.#tooltip.remove();
    }

    /**
     * @param {Event & {currentTarget: HTMLSlotElement}} event
     * @return {void}
     */
    onTooltipTriggerSlotChange(event) {
      const tooltip = this.tooltipClone;
      while (tooltip.lastChild) {
        tooltip.lastChild.remove();
      }
      for (const child of event.currentTarget.assignedNodes()) {
        tooltip.append(child.cloneNode(true));
      }
    }

    /**
     * @this {TooltipTrigger} this
     * @param {FocusEvent} event
     * @return {void}
     */
    onTooltipTriggerFocus(event) {
      // console.log('getting focus', event);
      if (this.disabledState) return;
      if (this.matches(':active')) {
        // console.log('abort from active');
        return;
      }
      this.showTooltip();
    }

    /**
     * @this {TooltipTrigger} this
     * @param {KeyboardEvent} event
     * @return {void}
     */
    onTooltipTriggerKeydown(event) {
      if (event.ctrlKey) this.hideTooltip();
    }

    /**
     * @this {TooltipTrigger} this
     * @return {void}
     */
    onTooltipTriggerBlur() {
      this.hideTooltip();
    }

    /**
     * @param {MouseEvent|TouchEvent} event
     * @this {TooltipTrigger} this
     * @return {void}
     */
    onTooltipTriggerPointer(event) {
      if (this.disabledState) return;
      // console.log('tooltip event', event.type);
      switch (event.type) {
        case 'touchstart':
          this.scheduleShowTooltip('touch');
          break;
        case 'touchend':
        case 'touchcancel':
          this.scheduleHideTooltip('touch');
          break;
        case 'click':
        case 'mouseout':
          this.cancelShowTooltip();
          this.hideTooltip();
          break;
        case 'mousemove':
        case 'mouseover':
          this.scheduleShowTooltip('mouse');
          break;
        default:
      }
    }

    get tooltipClone() {
      return this.#tooltip;
    }

    get clonedTooltip() {
      return this.#tooltip;
    }

    cancelShowTooltip() {
      // console.log('cancel tooltiptimer');
      clearTimeout(this.#idleDebounce);
    }

    /** @param {'mouse'|'touch'|'keyboard'} type */
    scheduleHideTooltip(type) {
      clearTimeout(this.#idleDebounce);
      if (!this.#tooltip.open) {
        // console.log('abort schedule (shown)');
        return;
      }
      let timeout = 0;
      switch (type) {
        case 'mouse':
          timeout = 0;
          break;
        case 'touch':
          timeout = 1500;
          break;
        default:
      }
      // console.log('schedule tooltiptimer');
      this.#idleDebounce = setTimeout(() => {
        // console.log('hide timeout');
        this.hideTooltip();
      }, timeout);
    }

    /** @param {'mouse'|'touch'|'keyboard'} type */
    scheduleShowTooltip(type) {
      if (this.#tooltip.open) {
        // console.log('abort schedule (shown)');
        return;
      }
      let timeout = 0;
      switch (type) {
        case 'mouse':
          timeout = this.constructor.TOOLTIP_MOUSE_IDLE_MS;
          break;
        case 'touch':
          timeout = this.constructor.TOOLTIP_TOUCH_IDLE_MS;
          break;
        default:
      }
      // console.log('schedule tooltiptimer');
      clearTimeout(this.#idleDebounce);
      this.#idleDebounce = setTimeout(() => {
        // console.log('idle');
        this.showTooltip(type === 'touch');
      }, timeout);
    }

    showTooltip(touch = false) {
      if (this.#tooltip.open) return;
      this.refs.tooltip.open = true;
      this.refs.tooltip.touch = touch;
      this.#tooltip.touch = touch;
      document.body.append(this.#tooltip);
      this.updateTooltipPosition();
      this.#resizeObserver.observe(this, { box: 'border-box' });
      this.#intersectObserver.observe(this.#tooltip);
      /** @type {HTMLElement} */
      let offsetParent = this;
      while ((offsetParent = offsetParent.offsetParent)) {
        this.#resizeObserver.observe(offsetParent, { box: 'border-box' });
        // console.log('observing', offsetParent);
        this.#watchedParents.push(offsetParent);
        this.#intersectObserver.observe(offsetParent);
        offsetParent.addEventListener('scroll', this.onParentScroll);
      }
      window.addEventListener('scroll', this.onParentScroll);

      // console.log('offsetparent', this.offsetParent);

      this.#tooltip.open = true;
    }

    hideTooltip() {
      this.#resizeObserver.disconnect();
      this.#intersectObserver.disconnect();
      let parent;
      while ((parent = this.#watchedParents.pop())) {
        parent.removeEventListener('scroll', this.onParentScroll);
      }
      window.removeEventListener('scroll', this.onParentScroll);
      this.#tooltip.open = false;
      this.#tooltip.remove();
      this.refs.tooltip.open = false;
      const hoverStyle = this.refs.tooltip.style;
      hoverStyle.removeProperty('width');
      hoverStyle.removeProperty('height');
    }

    /**
     * @param {DOMRect} [domRect]
     * @return {void}
     */
    updateTooltipPosition(domRect) {
      const offset = 8;
      // const margin = 8;
      /** @type {import('../utils/popup.js').CanAnchorPopUpOptions} */
      const anchorOptions = {
        anchor: domRect ?? this.getBoundingClientRect(),
        width: this.#tooltip.clientWidth,
        height: this.#tooltip.clientHeight,
        // margin,
      };

      const isPageRTL = (getComputedStyle(this).direction === 'rtl');
      const xStart = isPageRTL ? 'right' : 'left';
      const xEnd = isPageRTL ? 'left' : 'right';
      /** @type {import('../utils/popup.js').CanAnchorPopUpOptions[]} */
      const preferences = [
        { clientY: 'bottom', clientX: 'center', offsetY: offset },
        { clientY: 'bottom', clientX: xStart, offsetY: offset },
        { clientY: 'bottom', clientX: xEnd, offsetY: offset },
        { clientY: 'top', clientX: 'center', offsetY: -offset },
        { clientY: 'top', clientX: xStart, offsetY: -offset },
        { clientY: 'top', clientX: xEnd, offsetY: -offset },
      ];

      let anchorResult;
      for (const preference of preferences) {
        anchorResult = canAnchorPopup({
          ...anchorOptions,
          ...preference,
        });
        if (anchorResult) break;
      }

      // console.log({ anchorResult });
      if (!anchorResult) {
        anchorResult = canAnchorPopup({
          ...anchorOptions,
          ...preferences[0],
          force: true,
        });
      }

      this.#tooltip.style.setProperty('top', `${anchorResult.pageY}px`);
      this.#tooltip.style.setProperty('left', `${anchorResult.pageX}px`);
      this.#tooltip.style.setProperty('margin', '0');
      this.#tooltip.style.setProperty('transform-origin', `${anchorResult.transformOriginY} ${anchorResult.transformOriginX}`);

      const hoverStyle = this.refs.tooltip.style;
      hoverStyle.setProperty('width', `${anchorResult.width + (anchorResult.offsetX * 2)}px`);
      hoverStyle.setProperty('height', `${anchorResult.height + (anchorResult.offsetY)}px`);
      if (anchorResult.clientY === 'bottom') {
        hoverStyle.setProperty('top', '100%');
        hoverStyle.removeProperty('bottom');
      } else {
        hoverStyle.removeProperty('top');
        hoverStyle.setProperty('height', `${anchorResult.height + (anchorResult.offsetY)}px`);
        hoverStyle.setProperty('bottom', '100%');
      }
      switch (anchorResult.clientX) {
        case 'left':
          hoverStyle.setProperty('left', '0');
          hoverStyle.removeProperty('right');
          break;
        default:
        case 'center':
          hoverStyle.removeProperty('left');
          hoverStyle.removeProperty('right');
          break;
        case 'right':
          hoverStyle.removeProperty('left');
          hoverStyle.setProperty('right', '0');
      }
    }

    connectedCallback() {
      super.connectedCallback();
      for (const type of ['click', 'mousedown', 'mousemove', 'mouseout',
        'touchmove', 'touchstart', 'touchend', 'touchleave', 'touchcancel']) {
        this.addEventListener(type, this.onTooltipTriggerPointer, { passive: true });
      }
      this.addEventListener('focus', this.onTooltipTriggerFocus);
      this.addEventListener('blur', this.onTooltipTriggerBlur);
      this.addEventListener('keydown', this.onTooltipTriggerKeydown, { passive: true });
    }

    disconnectedCallback() {
      // console.log('disconnected');
      this.hideTooltip();
      super.disconnectedCallback();
    }
  }
  TooltipTrigger.prototype.tooltip = TooltipTrigger.prop('tooltip');
  return TooltipTrigger;
}
