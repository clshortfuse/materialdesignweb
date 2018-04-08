import { Button } from '../../../components/core/button/index';
import { Table } from '../../../components/complex/table/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-table');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Table(components[i]));
  }
  components = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Button(components[i]));
  }
}

initializeMdwComponents();

