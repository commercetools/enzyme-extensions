const shallowRecursively = (wrapper, selector, options, depthMemo = 0) => {
  if (options.maxDepth && depthMemo >= options.maxDepth)
    throw new Error(
      `@commercetools/enzyme-extensions/until: the specified 'node' was not found before diving ${
        options.maxDepth
      } levels deep.`
    );
  if (
    wrapper.isEmptyRender() ||
    typeof wrapper.getElement().type === 'string'
  ) {
    return wrapper;
  }

  return selector && wrapper.is(selector)
    ? wrapper
    : shallowRecursively(wrapper.dive(), selector, options, ++depthMemo);
};

module.exports = function until(selector, options = {}) {
  return this.single('until', () =>
    shallowRecursively(this, selector, options)
  );
};
