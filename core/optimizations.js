// Micro-optimized functions

let BLANK_TEXT;
let BLANK_COMMENT;
let BLANK_DIV;

/** @return {Text} */
export function createEmptyTextNode() {
  // eslint-disable-next-line no-return-assign
  return (BLANK_TEXT ??= new Text()).cloneNode();
}

/** @return {HTMLDivElement} */
export function createEmptyDiv() {
  // eslint-disable-next-line no-return-assign
  return (BLANK_DIV ??= document.createElement('div')).cloneNode();
}

/** @return {Comment} */
export function createEmptyComment() {
  // eslint-disable-next-line no-return-assign
  return (BLANK_COMMENT ??= new Comment()).cloneNode();
}
