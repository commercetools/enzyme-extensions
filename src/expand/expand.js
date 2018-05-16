import { shallow } from 'enzyme';

export default ({ propName = 'children', props = {} } = {}) => {
  const render = wrapper.prop(propName);

  if (typeof render !== 'function')
    throw new Error(
      `@commercetools/enzyme-extensions/expand: the specified 'propName' "${propName}" is not a function on the wrapper.`
    );
  const nextWrapper = shallow(render(props));

  return nextWrapper;
};
