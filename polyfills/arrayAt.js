// eslint-disable-next-line no-extend-native
Array.prototype.at ??= function at(index) {
  if (index < 0) return this[this.length + index];
  return this[index];
};
