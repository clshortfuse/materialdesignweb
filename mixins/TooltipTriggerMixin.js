import '../components/Tooltip.js';
import { canAnchorPopup } from '../utils/popup.js';

/** @typedef {import('../components/Tooltip.js').default} Tooltip */

/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function TooltipTriggerMixin(Base) {
  return Base
    .set({
      TOOLTIP_MOUSE_IDLE_MS: 500,
      TOOLTIP_TOUCH_IDLE_MS: 1500,
      /** @type {any} */
      _idleDebounce: null,
      /** @type {HTMLElement[]} */
      _watchedParents: null,
      /** @type {ResizeObserver} */
      _resizeObserver: null,
      /** @type {IntersectionObserver} */
      _intersectObserver: null,
      _parentScrollListener: null,
      tooltipSlotId: 'slot',
    })
    .observe({
      tooltip: 'string',
      autoTooltip: 'boolean',
    })
    .html`<mdw-tooltip id=tooltip></mdw-tooltip>`
    .css`
      #tooltip {
        display:none;
      }
    `
    .methods({
      cancelShowTooltip() {
        // console.log('cancel tooltiptimer');
        clearTimeout(this._idleDebounce);
      },
      /** @param {'mouse'|'touch'|'keyboard'} type */
      scheduleHideTooltip(type) {
        this.cancelShowTooltip();
        if (!this.refs.tooltip.open) {
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
        this._idleDebounce = setTimeout(() => {
        // console.log('hide timeout');
          this.hideTooltip();
        }, timeout);
      },

      /** @param {'mouse'|'touch'|'keyboard'} type */
      scheduleShowTooltip(type) {
        if (this.refs.tooltip.open) return;
        let timeout = 0;
        switch (type) {
          case 'mouse':
            timeout = this.TOOLTIP_MOUSE_IDLE_MS;
            break;
          case 'touch':
            timeout = this.TOOLTIP_TOUCH_IDLE_MS;
            break;
          default:
        }

        clearTimeout(this._idleDebounce);
        if (timeout) {
          this._idleDebounce = setTimeout(this.showTooltip.bind(this), timeout);
        } else {
          this.showTooltip();
        }
      },

      showTooltip() {
        const tooltip = /** @type {InstanceType<Tooltip>} */ (this.refs.tooltip);
        if (tooltip.open) return;
        document.body.append(this.refs.tooltip);
        this.recloneTooltip();
        this.updateTooltipPosition();
        this._resizeObserver.observe(this, { box: 'border-box' });
        this._resizeObserver.observe(tooltip, { box: 'border-box' });
        this._intersectObserver.observe(this);
        this._intersectObserver.observe(tooltip);
        /** @type {HTMLElement} */
        let offsetParent = this;
        while ((offsetParent = offsetParent.offsetParent)) {
          this._resizeObserver.observe(offsetParent, { box: 'border-box' });
          // console.log('observing', offsetParent);
          this._watchedParents.push(offsetParent);
          this._intersectObserver.observe(offsetParent);
          offsetParent.addEventListener('scroll', this._parentScrollListener);
        }
        window.addEventListener('scroll', this._parentScrollListener);

        // console.log('offsetparent', this.offsetParent);

        tooltip.open = true;
      },

      hideTooltip(cancelSchedule = false) {
        if (cancelSchedule) {
          this.cancelShowTooltip();
        }
        this._resizeObserver.disconnect();
        this._intersectObserver.disconnect();
        let parent;
        while ((parent = this._watchedParents.pop())) {
          parent.removeEventListener('scroll', this._parentScrollListener);
        }
        window.removeEventListener('scroll', this._parentScrollListener);
        const tooltip = /** @type {InstanceType<Tooltip>} */ (this.refs.tooltip);
        tooltip.open = false;
        // TODO: Self-remove on close (hide animation)
        tooltip.remove();
      },
      /**
       * TODO: Throttle multiple calls
       * @param {DOMRect} [domRect]
       * @return {void}
       */
      updateTooltipPosition(domRect) {
        const offset = 8;
        const tooltip = /** @type {InstanceType<Tooltip>} */ (this.refs.tooltip);
        // const margin = 8;
        /** @type {import('../utils/popup.js').CanAnchorPopUpOptions} */

        Object.assign(tooltip.style, {
          top: '0',
          left: '0',
          right: 'auto',
          bottom: 'auto',
          position: 'fixed',
          maxWidth: null,
          maxHeight: null,
        });

        const anchorOptions = {
          anchor: domRect ?? this.getBoundingClientRect(),
          width: tooltip.clientWidth,
          height: tooltip.clientHeight,
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
          const result = canAnchorPopup({
            ...anchorOptions,
            ...preference,
          });
          if (!anchorResult || anchorResult.visibility < result.visibility) {
            anchorResult = result;
          }
          if (result.visibility === 1) break;
        }

        Object.assign(tooltip.style, {
          position: 'fixed',
          ...anchorResult.styles,
        });
      },
      recloneTooltip() {
        let args;
        const tooltip = this.tooltip;
        if (tooltip) {
          args = [tooltip];
        } else {
          args = /** @type {HTMLSlotElement} */ (this.refs[this.tooltipSlotId])
            .assignedNodes()
            .map((child) => child.cloneNode(true));
        }

        this.refs.tooltip.replaceChildren(...args);
      },
      closeIfNotHovered() {
        if (this.matches(':hover')) return;
        if (this.refs.tooltip.matches(':hover')) return;
        this.hideTooltip(true);
      },
    })
    .childEvents({
      slot: {
        slotchange: 'recloneTooltip',
      },
      tooltip: {
        pointerleave: 'closeIfNotHovered',
      },
    })
    .events({
      '~pointermove'(event) {
        if (event.pointerType === 'touch') return;
        if (this.autoTooltip && !this.disabledState) {
          this.scheduleShowTooltip('mouse');
        }
      },
      '~keydown'({ ctrlKey }) {
        if (ctrlKey) {
          this.hideTooltip(true);
        }
      },
      '~click'() {
        this.hideTooltip(true);
      },

    })
    .on({
      constructed() {
        this._watchedParents = [];
        this._parentScrollListener = this.updateTooltipPosition.bind(this, null);
        this._resizeObserver = new ResizeObserver(() => {
          const tooltip = /** @type {InstanceType<Tooltip>} */ (this.refs.tooltip);
          if (tooltip.open) {
            this.updateTooltipPosition();
          }
        });
        const threshold = [0, 0.49, 0.5, 0.51, 1];
        this._intersectObserver = new IntersectionObserver((entries) => {
          const tooltip = /** @type {InstanceType<Tooltip>} */ (this.refs.tooltip);
          // console.log('IO', entries);
          if (!tooltip.open) return;
          for (const entry of entries) {
            if (entry.intersectionRatio <= 0) {
              // console.debug('Hide tooltip due to tooltip occlusion');
              this.hideTooltip();
              return;
            }
            if (entry.target === tooltip) {
              // console.debug('Reposition tooltip due to possible tooltip occlusion');
              this.updateTooltipPosition();
              return;
            }
            if (entry.target === this) {
              if (entry.intersectionRatio <= 0.5) {
                // console.debug('Hiding tooltip because target is occluded');
                this.hideTooltip();
              } else {
                // console.debug('Using InsectionObserver rect to update tooltip');
                this.updateTooltipPosition(entry.boundingClientRect);
              }
              return;
            }
          }
          // console.debug('Updating tooltip position because offsetParent change.');
          this.updateTooltipPosition();
        }, { threshold });
        // this.#tooltip.remove();
      },
      _focusedChanged(previous, current) {
        if (current) {
          if (!this._pointerPressed && !this._focusedSynthetic && this.autoTooltip) {
            this.showTooltip();
          }
        } else {
          this.closeIfNotHovered();
        }
      },
      _hoveredChanged(previous, current) {
        if (current) {
          if (this.autoTooltip && !this.disabledState) {
            this.scheduleShowTooltip('mouse');
          }
        } else {
          this.closeIfNotHovered();
        }
      },
      _pointerPressedChanged(previous, current) {
        if (this._lastInteraction !== 'touch') return;
        if (current) {
          if (this.autoTooltip && !this.disabledState) {
            this.scheduleShowTooltip('touch');
          }
        } else {
          this.scheduleHideTooltip('touch');
        }
      },
      disconnected() {
        this.hideTooltip(true);
      },
      tooltipChanged() {
        this.recloneTooltip();
      },
    });
}
