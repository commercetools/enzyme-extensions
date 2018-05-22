<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="http://cdn.rawgit.com/commercetools/press-kit/master/PNG/72DPI/CT%20logo%20chrom%20black%20horizontal%20RGB%2072dpi.png">
  </a>
  <b>@commercetools/enzyme-extensions</b><br /><br />

  <img height="100" alt="Logo" src="https://raw.githubusercontent.com/commercetools/enzyme-extensions/master/logo.jpeg" />
</p>

<p align="center">
  <a href="https://circleci.com/gh/commercetools/enzyme-extensions">
    <img alt="CircleCI Status" src="https://circleci.com/gh/commercetools/enzyme-extensions.svg?style=shield&circle-token=e58fc71dcfcab717a3ab1e529da76ab127d33a5e">
  </a>
  <a href="https://codecov.io/gh/commercetools/enzyme-extensions">
    <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/commercetools/enzyme-extensions.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@commercetools/enzyme-extensions">
    <img src="https://img.shields.io/npm/dw/@commercetools/enzyme-extensions.svg?style=flat-square"" alt="Downloads per Week" />
  </a>
  <img alt="Made with Coffee" src="https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg">
</p>

## What does this look like?

Often nested Render Prop based components when `shallow`ly rendered are harder to test than they need to be. Take a look at the following example:

```js
let wrapper1;
let wrapper2;
let wrapper3;

beforeEach(() => {
  wrapper1 = shallow(<Component1 {...props} />);
  wrapper2 = shallow(
    <div>
      {wrapper1.find(RenderPropComponent1).prop('render')({
        // Assume that these props are defined somewhere
        propsForRenderPropComponent1,
      })}
    </div>
  );
  wrapper3 = shallow(
    <div>
      {wrapper2.find(RenderPropComponent2).prop('children')({
        propsForRenderPropComponent2,
      })}
    </div>
  );
});

it('should match snapshot', () => {
  expect(wrapper3).toMatchSnapshot();
});
```

This quickly gets out of hand and the "lines to first `it`" becames too many. Tests feel bloated and brittle with a lot of noise around the actual important things. However, this logic feels repetitive which is often a good fit for a tool. This is where `expand` comes into play. The above can become:

```js
let wrapper;

beforeEach(() => {
  wrapper = shallow(<Component1 {...props} />)
    .expand(RenderPropComponent1, {
      propName: 'render',
      props: propsForRenderPropComponent1,
    })
    .expand(RenderPropComponent2, {
      // The `propName` `children` is the default
      props: propsForRenderPropComponent2,
    });
});

it('should match snapshot', () => {
  expect(wrapper3).toMatchSnapshot();
});
```

This is way more readable and easier to follow along. At the same time everything is still rendered `shallow`ly and the unit under test is well scoped.

## What assumptions is this built with?

* We _like to shallow render_ and avoid mounting
  * 🤺 Shallow rendering is fast and ensures that you only interact with the _unit under test_
  * 🏙 Shallow rendering ensures that you do _not snapshot past your test's concern_
  * 🏎 Shallow rendering has shown to be _more performant_ for us than mounting
* We like _declarative components_ and _Render Props_
  * 🧠 We can _compose components_ easily while following along their interactions
  * 🔪 We like _stubbing_ to test individual pieces of logic

## Installation

1.  Add package

`yarn add @commercetools/enzyme-extensions -D`

2.  Add a test setup file (test runner dependent)

For Jest you would set up a [`setupTestFrameworkScriptFile`](https://facebook.github.io/jest/docs/configuration.html#setuptestframeworkscriptfile-string).
Create that file and add it to the jest configuration.

3.  Add expand to Enzyme

In that `testFrameworkScriptFile` file, import the extensions and add them to Enzyme

```js
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-xx';
import { expand } from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';

Enzyme.configure({ adapter: new Adapter() });
ShallowWrapper.prototype.expand = expand;
```

## Usage

#### `expand(selector, { propName?: string, props?: Object })`

Expand a `ShallowWrapper` through the passed `node` and `propName` with the passed `props`. The `options` can have:

1.  `propName`: the prop being the Render Prop - so `children`, `render` or any other `renderThatThingy`
2.  `props`: the props you want to pass into the Render Prop based component
3.  `wrapper`: defaults to `div` used to wrap the component. Often it's `null` when wanting to take a snapshot after a sequence of chained `expand`s

_Note_: that any other properties on `options` than listed above are automatially forwarded to `shallow(node, options)`. This allows you to e.g. pass on a stubbed `context`.

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

#### `until(selector, { maxDepth?: number })`

Dives into a `ShallowWrapper` until is finds the passed `node` while being restricted by the `maxDepth`. The `options` can have:

1.  `maxDepth`: something you may want to not dive too deep into a component's children

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

_Note_: to get the `toRenderElementTimes` and an `toRender` matcher checkout our [@commercetools/jest-enzyme-matchers](https://github.com/commercetools/jest-enzyme-matchers).

The interesting thing is that you can mix both `until` and `expend`:

```js
import RenderPropComponent from 'somewhere';

describe('Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Component />)
      .until(SomeComponent)
      .expand(RenderPropComponent, { propName: 'render' });
  });

  it('should render two `<buttons>`', () => {
    expect(wrapper).toRenderElementTimes('button', 2);
  });
});
```
