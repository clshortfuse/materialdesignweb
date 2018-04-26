import { ProgressCircle } from '../../../components/progress/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function setupProgressCircleInterval() {
  const progressCircleElement = document.querySelector('.mdw-progress-circle[mdw-determinate]');
  ProgressCircle.setValue(progressCircleElement, Math.random() * 100);
  setInterval(() => {
    ProgressCircle.setValue(progressCircleElement, Math.random() * 100);
  }, 2500);
}

setupMenuOptions();
setupProgressCircleInterval();
