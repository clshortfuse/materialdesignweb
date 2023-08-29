import Box from '../../components/Box.js';

export default Box
  .extend()
  .css`
    :host{
      align-items: center;
      justify-content: center;

      isolation: isolate;

      background:
        repeating-conic-gradient(rgba(var(--mdw-ink), 0.0333) 0% 25%, transparent 0% 50%)
        50% / 16px 16px;
    }
  `
  .autoRegister('demo-preview');
