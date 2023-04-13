// Micro-optimized functions

const BLANK_TEXT = new Text();
const BLANK_COMMENT = new Comment();
const BLANK_DIV = document.createElement('div');

/** @return {Text} */
export function createEmptyTextNode() {
  // @ts-ignore
  return BLANK_TEXT.cloneNode();
}

/** @return {HTMLDivElement} */
export function createEmptyDiv() {
  // @ts-ignore
  return BLANK_DIV.cloneNode();
}

/** @return {Comment} */
export function createEmptyComment() {
  // @ts-ignore
  return BLANK_COMMENT.cloneNode();
}
