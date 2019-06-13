const shallowRenderProp = (wrapper, expander) =>
  typeof expander === 'string'
    ? wrapper.prop(expander)()
    : expander(wrapper.props());

export default function drill(expander) {
  // throws an error if the current instance has a length other than one.
  return this.single('drill', () =>
    // create a new wrapper with the same root as the current wrapper,
    // with any nodes passed in as the first parameter automatically wrapped
    this.wrap(shallowRenderProp(this, expander))
  );
}
