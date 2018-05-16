<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="http://cdn.rawgit.com/commercetools/press-kit/master/PNG/72DPI/CT%20logo%20chrom%20black%20horizontal%20RGB%2072dpi.png">
  </a>
  <b>@commercetools/enzyme-extensions</b>
</p>

<p align="center">
  <a href="https://circleci.com/gh/commercetools/enzyme-extensions">
    <img alt="CircleCI Status" src="https://circleci.com/gh/commercetools/enzyme-extensions.svg?style=shield&circle-token=e58fc71dcfcab717a3ab1e529da76ab127d33a5e">
  </a>
</p>

## Installation

1.  Add package

`yarn add @commercetools/enzyme-extensions --D`

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

#### `expand(node, { propName: string, props: Object })`

Expand a `ShallowWrapper` through the passed `node` and `propName` with the passed `props`.

```js
import FunctionAsAChildComponent from 'somewhere';

describe('Component', () => {
  const createfunctionAsAChildComponentProps = props => ({
    onChange: jest.fn(),
    ...props,
  });
  const wrapper = shallow(<Component />);
  let nestedWrapper;
  let nestedWrapperProps;

  beforeEach(() => {
    nestedWrapperProps = createfunctionAsAChildComponentProps();
    nestedWrapper = wrapper.expand(FunctionAsAChildComponent, {
      propName: 'render',
      props: nestedWrapperProps,
    });
  });

  it('should match snapshot', () => {
    expect(nestedWrapper).toMatchSnapshot();
  });
});
```

#### `until(node, maxDepth)`

Dives into a `ShallowWrapper` until is finds the passed `node` while being restricted by the `maxDepth`.

```js
import Icon from 'somewhere';

describe('Component', () => {
  const wrapper = shallow(<Component />).until(Icon);

  it('should render one Icon', () => {
    expect(wrapper).toRenderElementTimes(Icon, 1);
  });
  it('should render two Buttons', () => {
    expect(wrapper).toRenderElementTimes('Button', 2);
  });
});
```
