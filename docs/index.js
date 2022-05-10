import * as Button from '../components/button/index.js';

document.addEventListener('DOMContentLoaded', () => {
  for (const el of document.getElementsByClassName('mdw-button')) {
    Button.attach(el);
  }
});
