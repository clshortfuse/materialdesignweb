import Button from '../../components/Button.js';

export default class DemoSection extends Button {
  static { this.autoRegister('demo-button'); }

  onClick() {
    if (this.getAttribute('aria-haspopup') === 'dialog') {
      const popup = document.getElementById(this.ariaControls);
      const fn = this.dataset.popupMethod ?? 'show';
      const [form] = popup.getElementsByTagName('form');
      if (form) {
        form.reset();
      }
      popup[fn]();
    }
  }

  connectedCallback() {
    this.addEventListener('click', this.onClick);
  }
}
