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
  <br /><br />
  Why should you use this? Read: <a href="https://medium.com/@dferber90/test-a-render-prop-6a44e02f4c39">
    Test a Render Prop!
  </a><br /><br />
</p>

> **NOTE** This package used to provide a `renderProp` test helper, which [is now part of `enzyme` itself](https://github.com/airbnb/enzyme/blob/master/CHANGELOG.md#380) as of v3.8.0 🎈.
>
> We therefore dropped `renderProp` in v4.0.0 of this package. We recommend to use `renderProp` from enzyme itself instead.
>
> Be aware that [the API has changed](https://github.com/airbnb/enzyme/pull/1891#issue-228765309) while moving the function to enzyme.
>
> ```js
> // before
> wrapper.renderProp('foo', 10, 20);
> // after
> wrapper.renderProp('foo')(10, 20);
> ```
>
> <img src="https://cultofthepartyparrot.com/parrots/parrot.gif" alt="party-parrot" /> We are happy that our little helper has made it into `enzyme`.

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

### 3. Extend Enzyme with this package's helpers

In that `testFrameworkScriptFile` file, import the extensions and add them to Enzyme

```js
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-xx';
import configure from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';

// You likely had this part already
Enzyme.configure({ adapter: new Adapter() });

// This is the actual integration.
// Behind the scenes this extends the prototype of the passed in `ShallowWrapper`
configure(ShallowWrapper);
```

## Usage

Once set up, you can use the extension in your test files like this:

```js
import React from 'react';
import { shallow } from 'enzyme';

describe('when rendering `<App>`', () => {
  const App = () => (
    <div id="app">
      <Mouse
        render={(x, y) => (
          <div>
            Cursor is at {x} {y}
          </div>
        )}
      />
    </div>
  );

  // Here we call the render function defined on Mouse and we provide
  // some custom arguments to it. This means we are effectively mocking
  // the Mouse component's implementation.
  // This is great to keep test concerns separate.
  const wrapper = shallow(<App />)
    .find(Mouse)
    // This is where we are actually using the drill function
    // Since we defined it on the prototype in the Installation step,
    // it does not need to be imported into the test itself.
    // We can call any property dynamically and even derive the property to
    // call depending on the props which are passed as the arguments of the
    // function passed to `drill`.
    .drill(props => props.render(10, 20));

  it('should render the mouse position', () => {
    expect(wrapper.equals(<div>Cursor is at 10 20</div>)).toBe(true);
  });
});
```

Enzyme's `renderProp` is built as an easy to use test helper for the most common cases.
In case you need more control, you can use `drill` instead. `drill` offers more flexibility as:

* the prop-to-call can be derived from the other props
* the returned element can be set dynamically

See the [`drill`](docs/drill.md) documentation for more.

## Documentation

* [`drill`](docs/drill.md)
* [`until`](docs/until.md)
