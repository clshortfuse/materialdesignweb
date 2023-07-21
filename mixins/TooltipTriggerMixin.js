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
      /** @type {InstanceType<Tooltip>} */
      _tooltipClone: null,
      /** @type {any} */
      _idleDebounce: null,
      /** @type {HTMLElement[]} */
      _watchedParents: null,
      /** @type {ResizeObserver} */
      _resizeObserver: null,
      /** @type {IntersectionObserver} */
      _intersectObserver: null,
      _parentScrollListener: null,
    })
    .observe({
      tooltip: 'string',
    })
    .css`
      #tooltip {
        position:absolute;
      
        overflow: hidden;
      
        box-sizing: content-box;
      
        block-size: 0;
        inline-size: 0;
        margin: 0;
        padding: 0;
      
        transform: none;
      }
      
      #tooltip[open] {
        display: block;
      
        block-size: auto;
        inline-size: auto;
      
        cursor: default;
        pointer-events:auto;
      
        opacity: 0;
        transform: none;
      }
    `
    .recompose(({ template, html }) => {
      template.append(html`
        <mdw-tooltip role=tooltip id=tooltip>
          <slot id=tooltip-slot name=tooltip>{tooltip}</slot>
        </mdw-tooltip>
      `);
    })
    .methods({
      cancelShowTooltip() {
        // console.log('cancel tooltiptimer');
        clearTimeout(this._idleDebounce);
      },
      /** @param {'mouse'|'touch'|'keyboard'} type */
      scheduleHideTooltip(type) {
        this.cancelShowTooltip();
        if (!this._tooltipClone.open) {
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
        if (this._tooltipClone.open) {
        // console.log('abort schedule (shown)');
          return;
        }
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
        // console.log('schedule tooltiptimer');
        clearTimeout(this._idleDebounce);
        this._idleDebounce = setTimeout(() => {
        // console.log('idle');
          this.showTooltip(type === 'touch');
        }, timeout);
      },

      showTooltip(touch = false) {
        if (this._tooltipClone.open) return;
        this.refs.tooltip.open = true;
        this.refs.tooltip.touch = touch;
        this._tooltipClone.touch = touch;
        document.body.append(this._tooltipClone);
        this.updateTooltipPosition();
        this._resizeObserver.observe(this, { box: 'border-box' });
        this._resizeObserver.observe(this._tooltipClone, { box: 'border-box' });
        this._intersectObserver.observe(this);
        this._intersectObserver.observe(this._tooltipClone);
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

        this._tooltipClone.open = true;
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
        this._tooltipClone.open = false;
        this._tooltipClone.remove();
        this.refs.tooltip.open = false;
        const hoverStyle = this.refs.tooltip.style;
        hoverStyle.removeProperty('width');
        hoverStyle.removeProperty('height');
      },
      /**
       * TODO: Throttle multiple calls
       * @param {DOMRect} [domRect]
       * @return {void}
       */
      updateTooltipPosition(domRect) {
        const offset = 8;
        // const margin = 8;
        /** @type {import('../utils/popup.js').CanAnchorPopUpOptions} */
        const anchorOptions = {
          anchor: domRect ?? this.getBoundingClientRect(),
          width: this._tooltipClone.clientWidth,
          height: this._tooltipClone.clientHeight,
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

        Object.assign(this._tooltipClone.style, {
          top: `${anchorResult.top}px`,
          left: `${anchorResult.left}px`,
          margin: '0',
          transformOrigin: `${anchorResult.transformOriginY} ${anchorResult.transformOriginX} 0`,
        });

        Object.assign(this.refs.tooltip.style, {
          width: `${anchorResult.width + (anchorResult.offsetX * 2)}px`,
          height: `${anchorResult.height + (anchorResult.offsetY)}px`,
          top: anchorResult.clientY === 'bottom' ? '100%' : null,
          bottom: anchorResult.clientY === 'top' ? '100%' : null,
          left: anchorResult.clientX === 'left' ? 0 : null,
          right: anchorResult.clientX === 'right' ? 0 : null,
        });
      },
      recloneTooltip() {
        const slot = /** @type {HTMLSlotElement} */ (this.refs.tooltipSlot);
        this._tooltipClone.replaceChildren(
          ...slot.assignedNodes()
            .map((child) => child.cloneNode(true)),
        );
      },
    })
    .childEvents({
      tooltipSlot: {
        slotchange: 'recloneTooltip',
      },
    })
    .events({
      '~mousemove'() {
        if (!this.disabledState) {
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
        this._tooltipClone = /** @type {InstanceType<Tooltip>} */ (this.refs.tooltip.cloneNode(true));
        this._tooltipClone.removeAttribute('id');
        this._tooltipClone.style.setProperty('position', 'fixed');
        this._tooltipClone.setAttribute('aria-hidden', 'true');
        this._parentScrollListener = this.updateTooltipPosition.bind(this, null);
        this._resizeObserver = new ResizeObserver(() => {
          if (this._tooltipClone.open) {
            this.updateTooltipPosition();
          }
        });
        const threshold = [0, 0.49, 0.5, 0.51, 1];
        this._intersectObserver = new IntersectionObserver((entries) => {
          // console.log('IO', entries);
          if (!this._tooltipClone.open) return;
          for (const entry of entries) {
            if (entry.intersectionRatio <= 0) {
              // console.debug('Hide tooltip due to tooltip occlusion');
              this.hideTooltip();
              return;
            }
            if (entry.target === this._tooltipClone) {
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
          if (!this._pointerPressed && !this._focusedSynthetic) {
            this.showTooltip();
          }
        } else {
          this.hideTooltip(true);
        }
      },
      _hoveredChanged(previous, current) {
        if (current) {
          if (!this.disabledState) {
            this.scheduleShowTooltip('mouse');
          }
        } else {
          this.hideTooltip(true);
        }
      },
      _pointerPressedChanged(previous, current) {
        if (this._lastInteraction !== 'touch') return;
        if (current) {
          if (!this.disabledState) {
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
