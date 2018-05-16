import { shallow } from 'enzyme';

const shallowExpand = (
  wrapper,
  throughNode,
  { propName = 'children', props = {} }
) => {
  const hostWrapper = wrapper.find(throughNode);
  const render = hostWrapper.prop(propName);

  if (hostWrapper.length === 0)
    throw new Error(
      `@commercetools/enzyme-extensions/expand: the specified 'node' was not found on the wrapper.`
    );
  if (typeof render !== 'function')
    throw new Error(
      `@commercetools/enzyme-extensions/expand: the specified 'propName' "${propName}" is not a function on the wrapper.`
    );
  const nextWrapper = shallow(render(props));

  return nextWrapper;
};

export default function expand(throughNode, options = {}) {
  return this.single('expand', () => shallowExpand(this, throughNode, options));
}
