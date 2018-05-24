const React = require('react');
const Enzyme = require('enzyme');
const PropTypes = require('prop-types');
const { shallow } = Enzyme;
const Adapter = require('enzyme-adapter-react-16');
const ShallowWrapper = require('enzyme/ShallowWrapper');
const renderProp = require('./render-prop');

describe('renderProp', () => {
  const Mouse = props => (
    // The render call gets mocked by the parents in the tests
    // The implementation of the Mouse component does not matter.
    // Using renderProp in tests is a way to "mock" the prop itself.
    // This allows to keep testing render function passed by the parent, without
    // having to worry about the implementation of Mouse at all.
    //
    // The Math.random() signals that this implementation does not matter when
    // testing shallowly with renderProp as it will not be used by tests a
    // user of renderProp would write.
    <div id="mouse">{props.render({ x: Math.random() })}</div>
  );
  let App;
  let wrapper;

  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    ShallowWrapper.prototype.renderProp = renderProp;
  });

  afterEach(() => {
    App = undefined;
    wrapper = undefined;
  });

  describe('API variations', () => {
    // This is the first time actually diving down the shallowly rendered wrapper
    // by using renderProp
    describe('when expanding', () => {
      beforeEach(() => {
        App = () => (
          <div id="app">
            <Mouse render={({ x }) => <div>Cursor is at {x}</div>} />
          </div>
        );
        // Here we call the render function defined on Mouse and we provide
        // some custom arguments to it. This means we are effectively mocking
        // the Mouse component's implementation.
        // This is great to keep test concerns separate.
        wrapper = shallow(<App />)
          .find(Mouse)
          .renderProp('render', { x: 2 });
      });

      it('should return a shallow wrapper containing the render prop output', () => {
        expect(wrapper).toBeInstanceOf(ShallowWrapper);
        expect(wrapper.equals(<div>Cursor is at 2</div>)).toBe(true);
      });
    });

    describe('when expanding with multiple arguments', () => {
      beforeEach(() => {
        App = () => (
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

        wrapper = shallow(<App />)
          .find(Mouse)
          .renderProp('render', 2, 3);
      });

      it('should return a shallow wrapper containing the render prop output', () => {
        expect(wrapper).toBeInstanceOf(ShallowWrapper);
        expect(wrapper.equals(<div>Cursor is at 2 3</div>)).toBe(true);
      });
    });

    describe('when the first argument is not a string', () => {
      it('should throw', () => {
        expect(() => shallow(<div />).renderProp()).toThrow(
          '@commercetools/enzyme-extensions/renderProp: first argument must be the name of a prop'
        );
      });
    });
    describe('when the prop does not exist', () => {
      it('should throw', () => {
        expect(() => shallow(<div />).renderProp('bar')).toThrow(
          '@commercetools/enzyme-extensions/renderProp: no prop called "bar" found'
        );
      });
    });
    describe('when the prop does not contain a function', () => {
      it('should throw', () => {
        expect(() => shallow(<div id="foo" />).renderProp('id')).toThrow(
          '@commercetools/enzyme-extensions/renderProp: expected prop "id" to contain a function, but it holds "string"'
        );
      });
    });
  });

  // It should be possible to chaing renderProp functions.
  // This basically asserts that we're not expanding all Mouse components at once
  describe('when chaining expansions', () => {
    beforeEach(() => {
      App = () => (
        <div id="app">
          <Mouse
            render={({ x }) => (
              <Mouse
                render={({ y }) => (
                  <div>
                    Cursor is at {x} {y}
                  </div>
                )}
              />
            )}
          />
        </div>
      );

      wrapper = shallow(<App />)
        .find(Mouse)
        .renderProp('render', { x: 2 })
        .find(Mouse)
        .renderProp('render', { y: 4 });
    });

    it('should expand them sequentially', () => {
      expect(wrapper.equals(<div>Cursor is at 2 4</div>)).toBe(true);
    });
  });

  // This is technically not a test of renderProp itself, however it shows that
  // the API is flexible enough to run expansions on a specific node
  describe('when multiple nodes are present', () => {
    beforeEach(() => {
      App = () => (
        <div id="app">
          <Mouse render={() => <div>Uninteresting stuff</div>} />
          <Mouse>{() => <div>What we want to render</div>}</Mouse>
        </div>
      );
      wrapper = shallow(<App />)
        .find(Mouse)
        .at(1)
        .renderProp('children');
    });

    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper).toBeInstanceOf(ShallowWrapper);
      expect(wrapper.equals(<div>What we want to render</div>)).toBe(true);
    });
  });

  describe('when context is present on the wrapper', () => {
    beforeEach(() => {
      App = (props, context) => (
        <div id="app">
          <Mouse render={() => <div>Position is {context.position}</div>} />
        </div>
      );
      // We need to define the contextTypes so that the App has access to
      // the foo context slice
      App.contextTypes = { position: PropTypes.number.isRequired };

      const context = { position: 10 };
      wrapper = shallow(<App />, { context })
        .find(Mouse)
        .renderProp('render');
    });

    it('should render from context', () => {
      expect(wrapper.equals(<div>Position is 10</div>)).toBe(true);
    });
  });

  // This is the first time actually diving down the shallowly rendered wrapper
  // by using renderProp
  describe('when the wrapped function returns a string', () => {
    beforeEach(() => {
      App = () => (
        <div id="app">
          <Mouse render={({ x }) => `Cursor is at ${x}`} />
        </div>
      );
      // Here we call the render function defined on Mouse and we provide
      // some custom arguments to it. This means we are effectively mocking
      // the Mouse component's implementation.
      // This is great to keep test concerns separate.
      wrapper = shallow(<App />)
        .find(Mouse)
        .renderProp('render', { x: 2 });
    });

    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper).toBeInstanceOf(ShallowWrapper);
      expect(wrapper.equals('Cursor is at 2')).toBe(true);
    });
  });

  describe('when the wrapper starts with the component which has a render prop', () => {
    let Foo;
    beforeEach(() => {
      Foo = () => <div>Wow</div>;
      App = () => <Mouse render={({ x }) => <Foo x={x} />} />;
      wrapper = shallow(<App />).renderProp('render', { x: 2 });
    });

    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper).toBeInstanceOf(ShallowWrapper);
      expect(wrapper.find(Foo)).toHaveLength(1);
      expect(wrapper.equals(<Foo x={2} />)).toBe(true);
    });
  });

  describe('when expanding a component with children', () => {
    let Foo;
    beforeEach(() => {
      Foo = () => <div>Wow</div>;
      App = () => (
        <div id="app">
          <Mouse
            render={({ x }) => (
              <form>
                <Foo />
              </form>
            )}
          />
        </div>
      );
      wrapper = shallow(<App />)
        .find(Mouse)
        .renderProp('render', { x: 2 });
    });

    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper).toBeInstanceOf(ShallowWrapper);
      expect(wrapper.find(Foo)).toHaveLength(1);
      expect(
        wrapper.equals(
          <form>
            <Foo />
          </form>
        )
      ).toBe(true);
    });
  });

  describe('when expanding a plain component', () => {
    let Foo;
    beforeEach(() => {
      Foo = () => <div>Wow</div>;
      App = () => (
        <div id="app">
          <Mouse render={({ x }) => <Foo someX={x} />} />
        </div>
      );
      wrapper = shallow(<App />)
        .find(Mouse)
        .renderProp('render', { x: 2 });
    });

    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper).toBeInstanceOf(ShallowWrapper);
      expect(wrapper.find(Foo)).toHaveLength(1);
      expect(wrapper.equals(<Foo someX={2} />)).toBe(true);
      expect(wrapper.equals(<div>Wow</div>)).toBe(false);
      expect(
        wrapper
          .find(Foo)
          .shallow()
          .equals(<div>Wow</div>)
      ).toBe(true);
    });
  });
});
