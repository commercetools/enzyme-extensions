const React = require('react');
const Enzyme = require('enzyme');
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

  // This test is just a sanity check to verify the orignial, unexpanded output
  describe('when not expanding', () => {
    const renderFn = ({ x }) => `Cursor is at ${x}`;
    beforeEach(() => {
      App = () => (
        <div id="app">
          <Mouse render={renderFn} />
        </div>
      );
      wrapper = shallow(<App />);
    });
    it('should render shallowly', () => {
      expect(
        wrapper.contains(
          <div id="app">
            <Mouse render={renderFn} />
          </div>
        )
      ).toBe(true);
    });
  });

  // This is the first time actually diving down the shallowly rendered wrapper
  // by using renderProp
  describe('when expanding by function', () => {
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
        .renderProp(props => props.render({ x: 2 }));
    });
    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper).toBeInstanceOf(ShallowWrapper);
      expect(wrapper.contains(<div>Cursor is at 2</div>)).toBe(true);
    });
  });

  describe('when expanding by string', () => {
    beforeEach(() => {
      App = () => (
        <div id="app">
          <Mouse render={() => <div>Cursor is there</div>} />
        </div>
      );
      // Here we call the render function defined on Mouse and we provide
      // some custom arguments to it. This means we are effectively mocking
      // the Mouse component's implementation.
      // This is great to keep test concerns separate.
      wrapper = shallow(<App />)
        .find(Mouse)
        .renderProp('render');
    });
    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper).toBeInstanceOf(ShallowWrapper);
      expect(wrapper.contains(<div>Cursor is there</div>)).toBe(true);
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
        .renderProp(props => props.render({ x: 2 }))
        .find(Mouse)
        .renderProp(props => props.render({ y: 4 }));
    });
    it('should expand them sequentially', () => {
      expect(wrapper.contains(<div>Cursor is at 2 4</div>)).toBe(true);
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
      expect(wrapper.contains(<div>What we want to render</div>)).toBe(true);
    });
  });

  describe('when context is present on the wrapper', () => {
    beforeEach(() => {
      App = props => (
        <div id="app">
          <Mouse render={() => <div>Position is 10</div>} />
        </div>
      );
      // We need to define the contextTypes so that the App has access to
      // the foo context slice
      // App.contextTypes = { position: () => ({}) };

      // Here we call the render function defined on Mouse and we provide
      // some custom arguments to it. This means we are effectively mocking
      // the Mouse component's implementation.
      // This is great to keep test concerns separate.
      wrapper = shallow(<App />)
        .find(Mouse)
        .renderProp(props => props.render());
    });
    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper.contains(<div>Position is 10</div>)).toBe(true);
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
        .renderProp(props => props.render({ x: 2 }));
    });
    it('should return a shallow wrapper containing the render prop output', () => {
      expect(wrapper).toBeInstanceOf(ShallowWrapper);
      expect(wrapper.contains('Cursor is at 2')).toBe(true);
    });
  });
});