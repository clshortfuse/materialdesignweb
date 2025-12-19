import Button from '../../components/Button.js';

export default Button
  .extend()
  .events({
    click() {
      if (this.getAttribute('aria-haspopup') === 'dialog') {
        const popup = document.getElementById(this.ariaControls);
        const fn = this.dataset.popupMethod ?? 'show';
        const [form] = popup.getElementsByTagName('form');
        if (form) {
          form.reset();
        }
        popup[fn]();
      }
    },
  }).autoRegister('demo-button');
