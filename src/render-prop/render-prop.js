const React = require('react');
const omit = require('lodash.omit');
const { shallow } = require('enzyme');

const shallowRenderProp = (wrapper, expander) =>
  typeof expander === 'string'
    ? wrapper.prop(expander)()
    : expander(wrapper.props());

module.exports = function renderProp(expander) {
  // throws an error if the current instance has a length other than one.
  return this.single('renderProp', () =>
    // create a new wrapper with the same root as the current wrapper,
    // with any nodes passed in as the first parameter automatically wrapped
    this.wrap(shallowRenderProp(this, expander))
  );
};
