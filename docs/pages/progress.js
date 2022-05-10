import * as ProgressCircle from '../../components/progress/index.js';

/** @return {void} */
function setupProgressCircleInterval() {
  const progressCircleElement = document.querySelector('.mdw-progress__circle[mdw-determinate]');
  ProgressCircle.setValue(progressCircleElement, Math.random() * 100);
  setInterval(() => {
    ProgressCircle.setValue(progressCircleElement, Math.random() * 100);
  }, 2500);
}

setupProgressCircleInterval();
