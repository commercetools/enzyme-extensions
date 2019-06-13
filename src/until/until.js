const shallowRecursively = (wrapper, selector, options, depthMemo = 0) => {
  const defaultedOptions = {
    maxDepth: null,
    ...options,
  };

  if (defaultedOptions.maxDepth && depthMemo >= defaultedOptions.maxDepth)
    throw new Error(
      `@commercetools/enzyme-extensions/until: the specified 'node' was not found before diving ${defaultedOptions.maxDepth} levels deep.`
    );
  if (
    wrapper.isEmptyRender() ||
    typeof wrapper.getElement().type === 'string'
  ) {
    return wrapper;
  }

  if (selector && wrapper.is(selector)) {
    return wrapper;
  }

  const newDepthMemo = depthMemo + 1;
  return shallowRecursively(
    wrapper.dive(),
    selector,
    defaultedOptions,
    newDepthMemo
  );
};

export default function until(selector, options = {}) {
  return this.single('until', () =>
    shallowRecursively(this, selector, options)
  );
}
