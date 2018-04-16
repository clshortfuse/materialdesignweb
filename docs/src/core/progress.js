import { ProgressCircle } from '../../../components/core/progress/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function setupProgressCircleInterval() {
  const sampleProgressCircle = new ProgressCircle(document.querySelector('.mdw-progress-circle[mdw-determinate]'));
  setInterval(() => {
    sampleProgressCircle.setValue(Math.random() * 100);
  }, 2500);
}

setupMenuOptions();
setupProgressCircleInterval();
