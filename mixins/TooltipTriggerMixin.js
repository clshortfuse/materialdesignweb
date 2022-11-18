import Tooltip from '../components/Tooltip.js';

/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function TooltipTriggerMixin(Base) {
  class TooltipTrigger extends Base {
    static fragments = [
      ...super.fragments,
      /* html */ `
        <${Tooltip.elementName} role=tooltip id=tooltip style="position:fixed;margin:8px"><slot id=tooltip-slot onslotchange={static.onTooltipTriggerSlotChange} name=tooltip>{tooltip}</slot></${Tooltip.elementName}>
      `,
    ];

    static TOOLTIP_MOUSE_IDLE_MS = 500;

    static TOOLTIP_TOUCH_IDLE_MS = 1500;

    /**
     * @this {HTMLSlotElement}
     * @param {Event} event
     * @return {void}
     */
    static onTooltipTriggerSlotChange(event) {
      console.log('slot changed');
      const instance = /** @type {TooltipTrigger} */ (this.getRootNode().host);
      const tooltip = instance.tooltipClone;
      while (tooltip.lastChild) {
        tooltip.lastChild.remove();
      }
      for (const child of this.assignedNodes()) {
        console.log(child);
        tooltip.append(child.cloneNode(true));
      }
    }

    /**
     * @this {TooltipTrigger} this
     * @param {FocusEvent} event
     * @return {void}
     */
    static onTooltipTriggerFocus(event) {
      console.log('getting focus', event);
      if (this.disabled) return;
      if (this.matches(':active')) {
        console.log('abort from active');
        return;
      }
      this.showTooltip();
    }

    /**
     * @this {TooltipTrigger} this
     * @param {KeyboardEvent} event
     * @return {void}
     */
    static onTooltipTriggerKeydown(event) {
      if (event.ctrlKey) this.hideTooltip();
    }

    /**
     * @param event
     * @this {TooltipTrigger} this
     * @return {void}
     */
    static onTooltipTriggerBlur(event) {
      console.log('blur (hide)', event);
      if (this.matches(':focus')) {
        console.log('fake blur?');
        return;
      }
      if (this.matches(':focus-within')) {
        console.log('fake blur2?');
        return;
      }
      this.hideTooltip();
    }

    /**
     * @param {MouseEvent|TouchEvent} event
     * @this {TooltipTrigger} this
     * @return {void}
     */
    static onTooltipTriggerPointer(event) {
      if (this.disabled) return;
      console.log('tooltip event', event.type);
      switch (event.type) {
        case 'touchstart':
          this.scheduleShowTooltip('touch');
          break;
        case 'touchend':
        case 'touchcancel':
          this.scheduleHideTooltip('touch');
          break;
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

    /** @type {Tooltip} */
    #tooltip;

    /** @type {any} */
    #idleDebounce;

    #pendingHide = false;

    #watchedParents = [];

    #resizeObserver;

    #intersectObserver;

    onParentScroll = (event) => {
      this.updateTooltipPosition();
    };

    constructor() {
      super();
      this.#tooltip = /** @type {Tooltip} */ (this.refs.tooltip.cloneNode(true));
      this.#tooltip.id = '';
      this.#tooltip.setAttribute('aria-hidden', 'true');
      this.#resizeObserver = new ResizeObserver((entries) => {
        console.log('RO', entries);
        if (!this.#tooltip.open) return;
        this.updateTooltipPosition();
      });
      const threshold = [];
      for (let i = 0; i <= 1; i += 0.01) {
        threshold.push(i);
      }
      this.#intersectObserver = new IntersectionObserver((entries) => {
        console.log('IO', entries);
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
              console.log('should hide');
              this.hideTooltip();
            } else {
              console.log('tooltip rect', entry);
              this.updateTooltipPosition(entry.boundingClientRect);
            }
            return;
          }
        }
        this.updateTooltipPosition();
      }, { threshold });
      // this.#tooltip.remove();
    }

    get tooltipClone() {
      return this.#tooltip;
    }

    get clonedTooltip() {
      return this.#tooltip;
    }

    cancelShowTooltip() {
      console.log('cancel tooltiptimer');
      clearTimeout(this.#idleDebounce);
    }

    /** @param {'mouse'|'touch'|'keyboard'} type */
    scheduleHideTooltip(type) {
      clearTimeout(this.#idleDebounce);
      if (!this.#tooltip.open) {
        console.log('abort schedule (shown)');
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
      console.log('schedule tooltiptimer');
      this.#idleDebounce = setTimeout(() => {
        console.log('hide timeout');
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
          timeout = this.static.TOOLTIP_MOUSE_IDLE_MS;
          break;
        case 'touch':
          timeout = this.static.TOOLTIP_TOUCH_IDLE_MS;
          break;
        default:
      }
      // console.log('schedule tooltiptimer');
      clearTimeout(this.#idleDebounce);
      this.#idleDebounce = setTimeout(() => {
        // console.log('idle');
        this.showTooltip();
      }, timeout);
    }

    showTooltip() {
      if (this.#tooltip.open) return;
      document.body.append(this.#tooltip);
      this.updateTooltipPosition();
      this.#resizeObserver.observe(this, { box: 'border-box' });
      this.#intersectObserver.observe(this.#tooltip);
      /** @type {HTMLElement} */
      let offsetParent = this;
      while ((offsetParent = offsetParent.offsetParent)) {
        this.#resizeObserver.observe(offsetParent, { box: 'border-box' });
        console.log('observing', offsetParent);
        this.#watchedParents.push(offsetParent);
        this.#intersectObserver.observe(offsetParent);
        offsetParent.addEventListener('scroll', this.onParentScroll);
      }
      window.addEventListener('scroll', this.onParentScroll);

      console.log('offsetparent', this.offsetParent);

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
    }

    /**
     * @param {DOMRect} [domRect]
     * @return {void}
     */
    updateTooltipPosition(domRect) {
    // console.log('updateMenuPosition', source);
      let top = 'auto';
      let left = 'auto';
      let transformOrigin = '';
      const margin = 0;
      const mdwPosition = this.tooltipPosition || '';
      const mdwDirection = this.tooltipDirection || '';
      let alignTop = mdwPosition.includes('top');
      let alignBottom = mdwPosition.includes('bottom');
      let alignVCenter = mdwPosition.includes('vcenter');

      const alignStart = mdwPosition.includes('start');
      const alignEnd = mdwPosition.includes('end');
      let alignLeft = mdwPosition.includes('left');
      let alignRight = mdwPosition.includes('right');
      const alignHCenter = mdwPosition.includes('hcenter');

      let openUp = mdwDirection.includes('up');
      let openDown = mdwDirection.includes('down');
      const openNormal = mdwDirection.includes('normal');
      const openReverse = mdwDirection.includes('reverse');
      const openVCenter = mdwDirection.includes('vcenter');
      let openHCenter = mdwDirection.includes('hcenter');
      let openLtr = mdwDirection.includes('ltr');
      let openRtl = mdwDirection.includes('rtl');

      let isPageRTL = null;
      if (alignStart || alignEnd || openNormal || openReverse) {
        // Using page-direction based values
        isPageRTL = (getComputedStyle(this).direction === 'rtl');
        if (alignStart || alignEnd) {
          if (alignStart) {
            if (isPageRTL) {
              alignRight = true;
            } else {
              alignLeft = true;
            }
          } else if (isPageRTL) {
            alignLeft = true;
          } else {
            alignRight = true;
          }
        }
        if (openNormal || openReverse) {
          if (openNormal) {
            if (isPageRTL) {
              openRtl = true;
            } else {
              openLtr = true;
            }
          } else if (isPageRTL) {
            openLtr = true;
          } else {
            openRtl = true;
          }
        }
      }
      const offsetTop = 0;
      const offsetBottom = this.clientHeight;
      const offsetLeft = 0;
      const offsetRight = this.clientWidth;
      const rect = domRect ?? this.getBoundingClientRect();
      console.log(rect);
      const pageX = rect.left;
      const pageY = rect.top;

      /* Automatic Positioning
    *
    * Positions:
    *   3      7      4
    *     ┌─────────┐
    *     │         │
    *   5 │    9    │ 6
    *     │         │
    *     └─────────┘
    *   1      8      2
    *
    * 1: Bottom Left
    * 2: Bottom Right
    * 3: Top Left
    * 4: Top Right
    * 5: VCenter Left
    * 6: VCenter Right
    * 7: HCenter Top
    * 8: HCenter Bottom
    * 9: VCenter HCenter
    *
    * Directions:
    * a - Down LTR
    * b - Down RTL
    * c - Up LTR
    * d - Up RTL
    * e - LTR
    * f - RTL
    * g - Down
    * h - Up
    * i - Center
    *
    *
    *
    * Preference Order:
    * - Show below                 8g ┷↓  8a ┷↘ 8b ┷↙
    * - Show above                 7h ┯↑  7a ┯↗ 7b ┯↖
    * - Show after                 6e │→
    * - Show before                5f ←│
    */

      const popupElement = this.#tooltip;
      const popupElementHeight = popupElement.clientHeight;
      const popupElementWidth = popupElement.clientWidth;
      const canOpenDownwardsFromBottom = !alignTop && !alignVCenter
      && !openUp && !openVCenter
      && popupElementHeight + (pageY + offsetBottom) <= window.innerHeight;
      const canOpenDownwardsFromTop = !alignBottom && !alignVCenter
      && !openUp && !openVCenter
      && popupElementHeight + (pageY + offsetTop) <= window.innerHeight;
      const canOpenUpwardsFromTop = !alignBottom && !alignVCenter && !openDown
      && !openVCenter
      && pageY + offsetTop >= popupElementHeight;
      const canOpenUpwardsFromBottom = !alignTop && !alignVCenter && !openDown
      && !openVCenter
      && pageY + offsetBottom >= popupElementHeight;
      const canOpenRightwardsFromLeft = !alignRight && !alignHCenter
      && !openRtl && !openHCenter
      && popupElementWidth + (pageX + offsetLeft) <= window.innerWidth;
      const canOpenRightwardsFromRight = !alignLeft && !alignHCenter
      && !openRtl && !openHCenter
      && popupElementWidth + (pageX + offsetRight) <= window.innerWidth;
      const canOpenLeftwardsFromRight = !alignLeft && !alignHCenter
      && !openLtr && !openHCenter
      && pageX + offsetRight >= popupElementWidth;
      const canOpenLeftwardsFromLeft = !alignRight && !alignHCenter
      && !openLtr && !openHCenter
      && pageX + offsetLeft >= popupElementWidth;
      const canOpenFromCenter = !alignLeft && !alignRight && !alignTop && !alignBottom
      && !openUp && !openDown
      && ((pageX + offsetLeft) / 2) >= (popupElementWidth / 2)
      && (popupElementWidth / 2) + ((pageX + offsetLeft) / 2) <= window.innerWidth;
      popupElement.style.removeProperty('max-height');
      const candidates = [
        canOpenDownwardsFromBottom && canOpenRightwardsFromLeft && canOpenLeftwardsFromRight, // 8g ┷↓
        canOpenDownwardsFromBottom && canOpenRightwardsFromLeft, // 8a ┷↘
        canOpenDownwardsFromBottom && canOpenLeftwardsFromRight, // 8b ┷↙
        canOpenUpwardsFromTop && canOpenRightwardsFromLeft && canOpenLeftwardsFromRight, // 7h ┯↑
        canOpenUpwardsFromTop && canOpenRightwardsFromLeft, // 7a ┯↗
        canOpenUpwardsFromTop && canOpenLeftwardsFromRight, // 7b ┯↖
        canOpenLeftwardsFromRight, // 6e │→
        canOpenRightwardsFromLeft, // 5f ←│
      ].map((value, index) => {
        if (value) {
          return index + 1;
        }
        return 0;
      }).filter((value) => value !== 0);
      if (candidates.length) {
        let candidateNumber;
        if (isPageRTL === null) {
          isPageRTL = (getComputedStyle(this).direction === 'rtl');
        }
        if (isPageRTL) {
          candidateNumber = [1, 3, 2, 4, 6, 5, 8, 7]
            .find((number) => candidates.includes(number));
        } else {
          candidateNumber = [1, 2, 3, 4, 5, 6, 7, 8]
            .find((number) => candidates.includes(number));
        }
        if (candidateNumber == null) {
          candidateNumber = isPageRTL ? 2 : 1;
        }
        console.log({ candidateNumber });
        switch (candidateNumber) {
          // Position
          default:
          case 1:
            alignBottom = true;
            openHCenter = true;
            openDown = true;
            break;
          case 2:
            alignBottom = true; alignLeft = true;
            openDown = true; openLtr = true;
            break;
          case 3:
            alignBottom = true; alignRight = true;
            openDown = true; openRtl = true;
            break;
          case 4:
            alignTop = true; openHCenter = true;
            openUp = true;
            break;
          case 5:
            alignTop = true; alignLeft = true;
            openUp = true; openLtr = true;
            break;
          case 6:
            alignTop = true; alignRight = true;
            openUp = true; openRtl = true;
            break;
          case 7:
            alignVCenter = true; alignRight = true;
            openLtr = true;
            break;
          case 8:
            alignVCenter = true; alignLeft = true;
            openRtl = true;
        }
      }

      if (openLtr) {
        if (alignRight) {
          left = `${pageX + offsetRight}px`;
        } else if (alignHCenter) {
          left = `${pageX + ((offsetLeft + offsetRight) / 2)}px`;
        } else {
          left = `${pageX + offsetLeft}px`;
        }
        transformOrigin = 'left';
      } else if (openHCenter) {
        if (alignLeft) {
          left = `${(pageX + offsetLeft) - (popupElementWidth / 2)}px`;
        } else if (alignRight) {
          left = `${(pageX + offsetRight) - (popupElementWidth / 2)}px`;
        } else {
          left = `${(pageX + ((offsetLeft + offsetRight) / 2)) - (popupElementWidth / 2)}px`;
        }
        transformOrigin = 'center';
      } else {
        if (alignLeft) {
          left = `${(pageX + offsetLeft) - popupElementWidth}px`;
        } else if (alignHCenter) {
          left = `${(pageX + ((offsetLeft + offsetRight) / 2)) - popupElementWidth}px`;
        } else {
          left = `${(pageX + offsetRight) - popupElementWidth}px`;
        }
        transformOrigin = 'right';
      }

      if (openUp) {
        if (alignBottom) {
          top = `${(pageY + offsetBottom) - popupElement.clientHeight}px`;
        } else if (alignVCenter) {
          top = `${(pageY + ((offsetTop + offsetBottom) / 2)) - popupElement.clientHeight}px`;
        } else {
          top = `${(pageY + offsetTop) - popupElement.clientHeight}px`;
        }
        transformOrigin += ' bottom';
      } else if (openVCenter) {
        if (alignBottom) {
          top = `${(pageY + offsetBottom) - (popupElement.clientHeight / 2)}px`;
        } else if (alignTop) {
          top = `${(pageY + offsetTop) - (popupElement.clientHeight / 2)}px`;
        } else {
          top = `${(pageY + ((offsetTop + offsetBottom) / 2)) - (popupElement.clientHeight / 2)}px`;
        }
        transformOrigin += ' center';
      } else {
        if (alignTop) {
          top = `${pageY + offsetTop}px`;
        } else if (alignVCenter) {
          top = `${pageY + ((offsetTop + offsetBottom) / 2)}px`;
        } else {
          top = `${pageY + offsetBottom}px`;
        }
        transformOrigin += ' top';
      }

      popupElement.style.setProperty('--top', top);
      popupElement.style.setProperty('--left', left);
      popupElement.style.setProperty('--margin', '0');
      popupElement.style.setProperty('top', top);
      popupElement.style.setProperty('left', left);
      popupElement.style.setProperty('right', 'auto');
      popupElement.style.setProperty('bottom', 'auto');
      popupElement.style.setProperty('margin', '0');
      popupElement.style.setProperty('transform-origin', transformOrigin);
      // Keeps on screen when resizing with showModal
      // popupElement.scrollIntoView();
    }

    /** @return {typeof TooltipTrigger} */
    get static() { return /** @type {typeof TooltipTrigger} */ (super.static); }

    connectedCallback() {
      super.connectedCallback();

      for (const type of ['mousedown', 'mousemove', 'mouseout',
        'touchmove', 'touchstart', 'touchend', 'touchleave', 'touchcancel']) {
        this.addEventListener(type, TooltipTrigger.onTooltipTriggerPointer, { passive: true });
      }
      this.addEventListener('focus', TooltipTrigger.onTooltipTriggerFocus);
      this.addEventListener('blur', TooltipTrigger.onTooltipTriggerBlur);
      this.addEventListener('keydown', TooltipTrigger.onTooltipTriggerKeydown, { passive: true });
    }

    disconnectedCallback() {
      console.log('disconnected');
      this.hideTooltip();
      super.disconnectedCallback();
    }
  }
  TooltipTrigger.prototype.tooltip = TooltipTrigger.idl('tooltip');
  return TooltipTrigger;
}
