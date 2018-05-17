const React = require('react');
const omit = require('lodash.omit');
const { shallow } = require('enzyme');

const shallowExpand = (wrapper, throughNode, options) => {
  const defaultedOptions = {
    propName: 'children',
    props: {},
    wrapper: 'div',
    ...options,
  };
  const hostWrapper = wrapper.find(throughNode);
  const render = hostWrapper.prop(defaultedOptions.propName);

  if (hostWrapper.length === 0)
    throw new Error(
      `@commercetools/enzyme-extensions/expand: the specified 'node' was not found on the wrapper.`
    );
  if (typeof render !== 'function')
    throw new Error(
      `@commercetools/enzyme-extensions/expand: the specified 'propName' "${propName}" is not a function on the wrapper.`
    );
  const nextWrapper = shallow(
    // NOTE: We need to wrap the node in a `div`
    // to allow chaining.
    defaultedOptions.wrapper
      ? React.createElement(
          defaultedOptions.wrapper,
          {},
          render(defaultedOptions.props)
        )
      : render(defaultedOptions.props),
    // NOTE: We pass down options to `shallow` (e.g. for context)
    // by omitting our own. For now we hope them to not
    // cause nameclashes.
    omit(options, ['propName', 'props'])
  );

  return nextWrapper;
};

module.exports = function(throughNode, options = {}) {
  return this.single('expand', () => shallowExpand(this, throughNode, options));
};
