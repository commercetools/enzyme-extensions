# `expand(selector, options) => ShallowWrapper`

> **DEPRECATED** You're usually better of using [`renderProp`](../render-prop/render-prop.md). It has a more flexible API and works with `react-native` as well.

Expand a `ShallowWrapper` through the passed `node` and `propName` with the passed `props`.

NOTE: can only be called on wrapper of a single non-DOM component element node.

#### Arguments

1.  `selector` ([`EnzymeSelector`](../selector.md)): The selector to match.
2.  `options` (`Object` [optional]):
    * `options.propName`: the prop being the Render Prop - so `children`, `render` or any other `renderThatThingy`
    * `options.props`: the props you want to pass into the Render Prop based component
    * `options.wrapper`: defaults to `div` used to wrap the component. Often it's `null` when wanting to take a snapshot after a sequence of chained `expand`s

_Note_: that any other properties on `options`, than listed above, are automatially forwarded to `shallow(node, options)`. This allows you to pass a stubbed `context`.

```js
import FunctionAsAChildComponent from 'somewhere';

describe('Component', () => {
  const wrapper = shallow(<Component />);
  const nestedWrapperProps = {
    onChange: jest.fn(),
    ...props,
  };
  let nestedWrapper;

  beforeEach(() => {
    nestedWrapper = wrapper.expand(FunctionAsAChildComponent, {
      propName: 'render',
      props: nestedWrapperProps,
    });
  });

  it('should match snapshot', () => {
    expect(nestedWrapper).toMatchSnapshot();
  });

  it('should pass `onClick` to `<button>`', () => {
    nestedWrapper.find('button').prop('onClick')();

    expect(nestedWrapperProps.onChange).toHaveBeenCalled();
  });
});
```

_Note_: that when chaining `expand`s you might want to pass options with `{ wrapper: null }` to the last call. This unwraps the rendered componeont automatically for you.
