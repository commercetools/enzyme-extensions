# `until(selector, options)`

Dives into a `ShallowWrapper` until it finds the passed `node` while being restricted by the `maxDepth`.

NOTE: can only be called on wrapper of a single non-DOM component element node.

#### Arguments

1.  `selector` ([`EnzymeSelector`](../selector.md)): The selector to match.
2.  `options` (`Object` [optional]):
    - `maxDepth`: Restricts how deep the function dives into a component's children

#### Returns

`ShallowWrapper`: A new wrapper that wraps the found node, after it's been shallow rendered.

#### Examples

```js
import Icon from 'somewhere';

describe('Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Component />).until(Icon);
  });

  it('should render one `<Icon>`', () => {
    expect(wrapper).toRenderElementTimes(Icon, 1);
  });

  it('should render two `<buttons>`', () => {
    expect(wrapper).toRenderElementTimes('button', 2);
  });
});
```

_Note_: to get the `toRenderElementTimes` and an `toRender` matcher check out our [@commercetools/jest-enzyme-matchers](https://github.com/commercetools/jest-enzyme-matchers).

The interesting thing is that you can mix both, `until` and Enzyme's `renderProp`:

```js
import RenderPropComponent from 'somewhere';

describe('Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Component />)
      .until(SomeComponent)
      .renderProp('render')(10, 20);
  });

  it('should render two `<buttons>`', () => {
    expect(wrapper).toRenderElementTimes('button', 2);
  });
});
```
