import setupImageTargets from '../targetHandler';
import { Tab } from '../../../components/tab/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function initializeMdwComponents() {
  const tabs = document.querySelectorAll('.js .mdw-tab');
  for (let i = 0; i < tabs.length; i += 1) {
    Tab.attach(tabs.item(i));
  }
}

initializeMdwComponents();
setupMenuOptions();
setupImageTargets();
