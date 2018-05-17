const shallowRecursively = (wrapper, selector, options, depthMemo = 0) => {
  const defaultedOptions = {
    maxDepth: null,
    ...options,
  };

  if (defaultedOptions.maxDepth && depthMemo >= defaultedOptions.maxDepth)
    throw new Error(
      `@commercetools/enzyme-extensions/until: the specified 'node' was not found before diving ${
        defaultedOptions.maxDepth
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
    : shallowRecursively(
        wrapper.dive(),
        selector,
        defaultedOptions,
        ++depthMemo
      );
};

module.exports = function until(selector, options = {}) {
  return this.single('until', () =>
    shallowRecursively(this, selector, options)
  );
};
