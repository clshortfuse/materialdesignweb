/** @type {Element['replaceChildren']} */
function replaceChildren(...nodes) {
  let child;
  while ((child = this.lastChild)) {
    child.remove();
  }
  this.append(...nodes);
}

Document.prototype.replaceChildren ??= replaceChildren;
DocumentFragment.prototype.replaceChildren ??= replaceChildren;
Element.prototype.replaceChildren ??= replaceChildren;
