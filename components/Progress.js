/* https://m3.material.io/components/progress-indicators/specs */

import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

// https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element

export default CustomElement
  .mixin(ThemableMixin)
  .extend()
  .observe({
    circle: 'boolean',
    value: 'float',
    max: 'float',
    autoHide: 'boolean',
    _determinateStyle: 'string',
  })
  .observe({
    _valueAsFraction: {
      type: 'float',
      get({ value, max }) {
        return (value / (max || 100));
      },
      changedCallback(oldValue, newValue) {
        this._determinateStyle = `
        --previous:${oldValue ?? newValue ?? 0};
        --value:${newValue ?? 0};
      `;
      },
    },
  })
  .define({
    position() {
      return /** @type {HTMLProgressElement} */ (this.refs.progress).position;
    },
    labels() {
      return /** @type {HTMLProgressElement} */ (this.refs.progress).labels;
    },
  })
  .html/* html */`
    <div id=determinate style="{_determinateStyle}">
      <progress id=progress value={value} max={max} circle={circle}></progress>
      <div _if={circle} id=circle>
        <div id=semi1 class=semi></div>
        <div id=semi2 class=semi></div>
      </div>
    </div>
    <div _if={!value} id=indeterminate>
      <div _if={!circle} id=indeterminate-line>
        <div id=line1 class=line value={value}></div>
        <div id=line2 class=line value={value}></div>
      </div>
      <div _if={circle} id=indeterminate-circle>
        <div id=arc2 class=arc></div>
        <div id=arc3 class=arc></div>
        <div id=arc4 class=arc></div>
      </div>
    </div>
  `
  .css`
    /* Base Styles */

    :host {
      --mdw-bg: var(--mdw-color__surface-variant);
      --mdw-ink: var(--mdw-color__primary);
      --mdw-progress__opacity__duration: 500ms;
      position: relative;

      display: inline-block;
      overflow: hidden;
      vertical-align: middle;

      min-block-size: 4px;
      inline-size: 100%;

      opacity: 1;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

      transition: opacity 500ms 275ms;
    }

    :host([auto-hide]) {
      will-change: opacity;
    }

    :host([auto-hide][value="100"]) {
      opacity:0;

      transition: opacity 1s 1s;
    }

    #determinate {
      --previous: 0;
      --value: 0;
    }

    #progress {
      position: absolute;
      inset: 0;

      box-sizing: border-box;
      block-size: 100%;
      inline-size: 100%;
      border: none; /* FireFox */

      -moz-appearance: none;
      appearance: none;

      opacity:0;
      transform: scaleX(var(--value, 0));
      transform-origin: 0 0;

      background-color: currentColor;
      color: inherit;

      transition: transform 275ms, opacity var(--mdw-progress__opacity__duration);
      will-change: transform, opacity;
    }

    #progress::-webkit-progress-bar {
      display: none;
    }

    #progress::-moz-progress-bar  {
      display: none; /* Doesn't always work */

      block-size: 0;
    }

    #progress[value] {
      opacity:1;
      transform: scaleX(var(--value, 0));
    }
  `
  .css`
    /* Line Styles */

    /* https://github.com/material-components/material-components-android/blob/ed77ab36ccac98df24e55060d58406c5981a9062/lib/java/com/google/android/material/progressindicator/ */

    :host {
      --mdw-progress__line1-head__timing: cubic-bezier(0.2, 0.8, 0, 1.0);
      --mdw-progress__line1-tail__timing: cubic-bezier(0.4, 0.0, 1.0, 1.0);
      --mdw-progress__line2-head__timing: cubic-bezier(0.0, 0.65, 0, 1.0);
      --mdw-progress__line2-tail__timing: cubic-bezier(0.1, 0.45, 0, 1.0);
      --mdw-progress__line__duration: 1800ms;
    }

    @media (prefers-reduced-motion) {
      :host {
        --mdw-progress__line__duration: 18000ms
      }
    }

    .line {
      opacity: 1;

      transition: opacity var(--mdw-progress__opacity__duration);
      will-change: opacity;
    }

    .line,
    .line::after {
      position: absolute;
      inset: 0;

      overflow: hidden;

      animation-duration: var(--mdw-progress__line__duration);
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-fill-mode: forwards;
    }

    .line::after {
      content: '';

      background-color: currentColor;

      animation: inherit;
      will-change: transform;
    }

    #line1 {
      animation-name: l1h;
    }

    #line2 {
      animation-name: l2h;
    }

    #line1::after {
      animation-name: l1t;
    }

    #line2::after {
      animation-name: l2t;
    }

    .line[value] {
      opacity: 0;
      visibility: hidden;

      transition: opacity var(--mdw-progress__opacity__duration), visibility 1ms var(--mdw-progress__opacity__duration);
    }

    /**
      * L1H = 1267 / +533 = 70.39% - 100%
      * L1T = 1000 / +567 = 55.56% - 87.05%
      * L2H = 0333 / +850 = 18.50% - 65.72%
      * L2T = 0000 / +750 = 0% - 41.67%
      * Total = 1800ms
      *
      *    t      l1h    l1t      l2h     l2t
      * --------------------------------------
      * 0.0000  0.0000  0.0000  0.0000  0.0000
      * 0.1850  0.0000  0.0000  0.0000  0.5899
      * 0.4167  0.0000  0.0000  0.7374  1.0000
      * 0.5556  0.0000  0.0000  0.9072  1.0000
      * 0.6572  0.0000  0.1544  1.0000  1.0000
      * 0.7039  0.0000  0.2939  1.0000  1.0000
      * 0.8706  0.7918  1.0000  1.0000  1.0000
      * 1.0000  1.0000  1.0000  1.0000  1.0000
    */

    @keyframes l1h {
      0% {
        transform: translateX(0%);
      }

      70.4% {
        transform: translateX(0%);

        animation-timing-function: var(--mdw-progress__line1-head__timing);
      }

      100% {
        transform: translateX(100%);
      }
    }
    @keyframes l1t {
      0% {
        transform: translateX(-100%);
      }

      55.6% {
        transform: translateX(-100%);

        animation-timing-function: var(--mdw-progress__line1-tail__timing);
      }

      87.1% {
        transform: translateX(0%);
      }

      100% {
        transform: translateX(0%);
      }
    }
    @keyframes l2h {
      0% {
        transform: translateX(0%);
      }

      18.5% {
        transform: translateX(0%);

        animation-timing-function: var(--mdw-progress__line2-head__timing);
      }

      65.72% {
        transform: translateX(100%);
      }

      to {
        transform: translateX(100%);
      }
    }
    @keyframes l2t {
      0% {
        transform: translateX(-100%);

        animation-timing-function: var(--mdw-progress__line2-tail__timing);
      }

      41.67% {
        transform: translateX(0%);
      }

      to {
        transform: translateX(0%);
      }
    }

  `
  .css`
    /* Circle Styles */
    /** https://github.com/material-components/material-components-android/blob/ed77ab36ccac98df24e55060d58406c5981a9062/lib/java/com/google/android/material/progressindicator/CircularIndeterminateAnimatorDelegate.java */

    :host {
      --mdw-progress__circle__timing: cubic-bezier(0.4, 0.0, 0.2, 1);
      --mdw-progress__circle__margin: 4px;
      --mdw-progress__circle__duration: 5400ms;
      --mdw-progress__circle__duration__expand: 667ms;
      --mdw-progress__circle__duration__collapse: 667ms;
      --mdw-progress__circle__duration__fade-in: 333ms;
      --mdw-progress__circle__duration__complete-end: 333ms;
    }

    @media (prefers-reduced-motion) {
      :host {
        --mdw-progress__circle__duration: 54000ms;
      }
    }

    #circle {
      --startA: min(0.5, var(--previous));
      --endA: min(0.5, var(--value));
      --travelA: max(
          calc(var(--startA) - var(--endA)),
          calc(var(--endA) - var(--startA))
        );
      --delayA: max(0, calc(var(--previous) - 0.5));
      --startB: max(0, calc(var(--previous) - 0.5));
      --endB: max(0, calc(var(--value) - 0.5));
      --travelB: max(
          calc(var(--startB) - var(--endB)),
          calc(var(--endB) - var(--startB))
        );
      --delayB: max(0, 0.5 - calc(var(--previous)));

      position: absolute;
      inset: 0;
    }

    :host([circle]) {
      block-size: 48px;
      inline-size: 48px;
    }

    :host([circle]:not([color])) {
      background-color: transparent;
    }

    #progress[circle] {
      visibility: hidden;
    }

    .semi {
      position: absolute;
      inset: var(--mdw-progress__circle__margin);

      overflow: hidden;

      box-sizing: border-box;
    }

    #semi1 {
      inset-inline-start: 50%;
    }

    #semi2 {
      inset-inline-end: 50%;
    }

    .semi::after {
      content: "";

      position: absolute;
      inset: 0;

      box-sizing: border-box;
      border: solid currentcolor 4px;

      transform: rotate(var(--rotation));

      background-color: transparent;
      border-radius: 50%;

      transition: transform 400ms;
      transition-timing-function: linear;
    }

    #semi1::after {
      --rotation: min(180deg, calc(var(--value) * 360deg));
      inset-inline-start: -100%;

      clip-path: inset(0 50% 0 0);

      transition-delay: calc(var(--delayA) * var(--mdw-progress__circle__duration__expand));
      transition-duration: calc(var(--travelA) * var(--mdw-progress__circle__duration__expand));
    }

    #semi2::after {
      --rotation: max(0deg, calc(var(--value) * 360deg - 180deg));
      inset-inline-end: -100%;

      clip-path: inset(0 0 0 50%);

      transition-delay: calc(var(--delayB) * var(--mdw-progress__circle__duration__expand));
      transition-duration: calc(var(--travelB) * var(--mdw-progress__circle__duration__expand));
    }

    #indeterminate-circle {
      position: absolute;
      inset: 0;

      display: block;

      animation: rotate-cw calc(var(--mdw-progress__circle__duration) / 4) linear infinite;
    }

    .arc {
      position: absolute;
      inset: var(--mdw-progress__circle__margin);

      overflow: hidden;

      box-sizing: border-box;

      animation: rotate-jump var(--mdw-progress__circle__duration) steps(1,end) infinite;
    }

    .arc::after {
      content: "";

      position: absolute;
      inset: 0;

      box-sizing: border-box;
      border: solid currentcolor 4px;

      background-color: transparent;
      border-radius: 50%;

      animation: grow-shrink calc(var(--mdw-progress__circle__duration) / 4) var(--mdw-progress__circle__timing) infinite;
    }

    #arc2 {
      inset-block-end: 50%;
      inset-inline-start: 50%;

      transform-origin: 0 100%;
    }

    #arc3 {
      inset-block-start: 50%;
      inset-inline-end: 50%;

      transform-origin: 100% 0;
    }

    #arc4 {
      inset-block-start: 50%;
      inset-inline-start: 50%;

      transform-origin: 0 0;
    }

    #arc2:after {
      inset-block-end: -100%;
      inset-inline-start: -100%;

      clip-path: polygon(0% 0%, 50% 0%, 50% 50%, 100% 50%, 100% 100%, 0% 100%);
    }

    #arc3:after {
      inset-block-start: -100%;
      inset-inline-end: -100%;

      clip-path: inset(0 50% 50% 0);
    }

    #arc4:after {
      inset-block-start: -100%;
      inset-inline-start: -100%;

      clip-path: inset(0 50% 0 0);
    }

    @keyframes rotate-cw {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    @keyframes rotate-jump {
      0% { transform: scaleX(1) rotate(0deg); }

      12.5% { transform: scaleX(-1) rotate(-270deg); }

      25% { transform: scaleX(1) rotate(270deg); }

      37.5% {transform: scaleX(-1) rotate(-180deg);}

      50% { transform: scaleX(1) rotate(180deg); }

      62.5% { transform: scaleX(-1) rotate(-90deg); }

      75% { transform: scaleX(1) rotate(90deg); }

      87.5% { transform: scaleX(-1) rotate(0deg); }

      to { transform: scaleX(1) rotate(0deg); }
    }

    @keyframes grow-shrink {
      from {
        transform: rotate(calc(0.01 * 360deg));
      }

      50% {
        transform: rotate(calc(0.73 * 360deg));
      }

      to {
        transform: rotate(calc(0.01 * 360deg));
      }
    }
  `
  .autoRegister('mdw-progress');
