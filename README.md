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
  <img alt="Made with Coffee" src="https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg">
</p>

## What does this look like?

Nested Render Prop based components are hard to test when `shallow`ly rendered. Take a look at the following component setup:

```jsx
class Mouse extends React.Component {
  static propTypes = { render: PropTypes.func.isRequired };
  state = { x: 0, y: 0 };
  handleMouseMove = event => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };
  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}
```

```jsx
class App extends React.Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Mouse
          render={({ x, y }) => (
            // The render prop gives us the state we need
            // to render whatever we want here.
            <h1>
              The mouse position is ({x}, {y})
            </h1>
          )}
        />
      </div>
    );
  },
});
```

If we wanted to test the `render` prop the `<App /` component passes to `<Mouse />`, we'd traditionally have to do:

```jsx
const wrapper = shallow(<App />);
const mouseWrapper = shallow(
  wrapper.find(Mouse).prop('render')({ x: 0, y: 0 })
);

expect(mouseWrapper.text()).toEqual('The mouse position is (0, 0)');
```

This quickly gets out of hand when traversing multiple render props, and the "lines to first `it`" explode. Tests feel bloated and brittle, with a lot of noise around the actually important things. However the required setup is repetitive, which is often a good fit for a tool. This is where this package's `renderProp` function comes into play. The above can become:

```jsx
const wrapper = shallow(<App />)
  .find(Mouse)
  .renderProp(props => props.render({ x: 0, y: 0 }));

expect(wrapper.text()).toEqual('The mouse position is (0, 0)');
```

Here are some examples of how this method simplifies tests:

```diff
// less setup
-wrapper = shallow(
-  shallow(<App />)
-    .find(Mouse)
-    .prop('render')({ x: 2 })
-);
+wrapper = shallow(<App />)
+  .find(Mouse)
+  .renderProp(props => props.render({ x: 2 }));
```

```diff
// easier chaining
-wrapper = shallow(
-  shallow(
-    <div>
-      {shallow(<App />)
-        .find(Mouse)
-        .prop('render')({ x: 2 })}
-    </div>
-  )
-    .find(Mouse)
-    .prop('render')({ y: 4 })
-);
+wrapper = shallow(<App />)
+  .find(Mouse)
+  .renderProp(props => props.render({ x: 2 }))
+  .find(Mouse)
+  .renderProp(props => props.render({ y: 4 }));
```

This is more readable and easier to follow. At the same time everything is still rendered `shallow`ly and the unit under test is well scoped.

## What assumptions is this built with?

* We _like to shallow render_ and avoid mounting
  * 🤺 Shallow rendering is fast and ensures that you only interact with the _unit under test_
  * 🏙 Shallow rendering ensures that you do _not snapshot past your test's concern_
  * 🏎 Shallow rendering has shown to be _more performant_ for us than mounting
* We like _declarative components_ and _Render Props_
  * 🧠 We can _compose components_ easily while following along their interactions
  * 🔪 We like _stubbing_ to test individual pieces of logic

## Installation

### 1. Add package

`yarn add @commercetools/enzyme-extensions -D`

### 2. Add a test setup file (test runner dependent)

For Jest you would set up a [`setupTestFrameworkScriptFile`](https://facebook.github.io/jest/docs/configuration.html#setuptestframeworkscriptfile-string).
Create that file and add it to the jest configuration.

### 3. Add `renderProp` to Enzyme

In that `testFrameworkScriptFile` file, import the extensions and add them to Enzyme

```js
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-xx';
import { renderProp, until } from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';

// you likely had this part already
Enzyme.configure({ adapter: new Adapter() });

// this is the actual integration
ShallowWrapper.prototype.renderProp = renderProp;
ShallowWrapper.prototype.until = until;
```

## Usage

Once set up, you can use the extension in your test files like this:

```js
import React from 'react'
import { shallow } from 'enzyme'

describe('when rendering App', () => {
  const App = () => (
    <div id="app">
      <Mouse render={({ x }) => <div>Cursor is at {x}</div>} />
    </div>
  );

  // Here we call the render function defined on Mouse and we provide
  // some custom arguments to it. This means we are effectively mocking
  // the Mouse component's implementation.
  // This is great to keep test concerns separate.
  const wrapper = shallow(<App />)
      .find(Mouse)
      // This is where we are actually using the renderProp function
      // Since we defined it on the prototype in the Installation step,
      // it does not need to be imported into the test itself.
      .renderProp(props => props.render({ x: 2 }));
  });

  it('should render the mouse position', () => {
    expect(wrapper.contains(<div>Cursor is at 2</div>)).toBe(true);
  });
});
```

## Documentation

* [`renderProp`](docs/render-prop.md)
* [`until`](docs/until.md)
* **DEPRECATED** [`expand`](docs/expand.md)
