/**
 * @param {KeyboardEvent} event
 * @this {HTMLElement}
 * @return {void}
 */
export function handleTabKeyPress(event) {
  const focusableElements = this.querySelectorAll([
    'button:not(:disabled):not([tabindex="-1"])',
    '[href]:not(:disabled):not([tabindex="-1"])',
    'input:not(:disabled):not([tabindex="-1"])',
    'select:not(:disabled):not([tabindex="-1"])',
    'textarea:not(:disabled):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])'].join(', '));
  let foundTarget = false;
  let candidate = null;
  for (const el of focusableElements) {
    if (el === event.target) {
      foundTarget = true;
      if (event.shiftKey) {
        break;
      }
    } else if (event.shiftKey) {
      candidate = el;
    } else if (foundTarget) {
      candidate = el;
      break;
    }
  }
  if (!candidate) {
    candidate = event.shiftKey ? focusableElements[focusableElements.length - 1] : focusableElements[0];
  }
  event.stopPropagation();
  event.preventDefault();
  if (candidate && candidate instanceof HTMLElement) {
    try {
      candidate.focus();
    } catch {
    // Failed to focus
    }
  }
}
