import setupImageTargets from '../targetHandler';
import { ProgressCircle } from '../../../components/index';

/** @return {void} */
function setupProgressCircleInterval() {
  const sampleProgressCircle = new ProgressCircle(document.querySelector('.mdw-progress-circle[mdw-determinate]'));
  setInterval(() => {
    sampleProgressCircle.setValue(Math.random() * 100);
  }, 2500);
}

setupImageTargets();
setupProgressCircleInterval();
