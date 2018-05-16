const shallowRecursively = (wrapper, selector) => {
  // Do not try to shallow render empty nodes and host elements
  // (a.k.a primitives). Simply return the wrapper in that case.
  if (
    wrapper.isEmptyRender() ||
    typeof wrapper.getElement().type === 'string'
  ) {
    return wrapper;
  }

  return selector && wrapper.is(selector)
    ? wrapper
    : shallowRecursively(wrapper.dive(), selector);
};

export default function until(selector) {
  return this.single('until', () => shallowRecursively(this, selector));
}
