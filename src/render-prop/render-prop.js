const React = require('react');
const omit = require('lodash.omit');
const { shallow } = require('enzyme');

// A wrapper component so that we can shallow-render immediately
const Wrapper = props => props.children;
Wrapper.displayName = 'Wrapper';

module.exports = function renderProp(propName, ...args) {
  return this.single('renderProp', () => {
    if (typeof propName !== 'string')
      throw new Error(
        '@commercetools/enzyme-extensions/renderProp: first argument must be the name of a prop'
      );
    const prop = this.prop(propName);
    if (!prop)
      throw new Error(
        `@commercetools/enzyme-extensions/renderProp: no prop called "${propName}" found`
      );
    if (typeof prop !== 'function')
      throw new Error(
        `@commercetools/enzyme-extensions/renderProp: expected prop "${propName}" to contain a function, but it holds "${typeof prop}"`
      );
    const element = prop(...args);
    const wrapped = React.createElement(Wrapper, null, element);
    return this.wrap(wrapped).shallow();
  });
};
