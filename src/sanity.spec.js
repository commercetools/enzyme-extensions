const React = require('react');
const Enzyme = require('enzyme');
const PropTypes = require('prop-types');
const { shallow } = Enzyme;
const Adapter = require('enzyme-adapter-react-16');
const ShallowWrapper = require('enzyme/ShallowWrapper');

// This is a test suite to ensure some enzyme behavior these extensions assume
const Mouse = props => (
  <div id="mouse">{props.render({ x: Math.random() })}</div>
);
let App;
let wrapper;

beforeAll(() => {
  Enzyme.configure({ adapter: new Adapter() });
});

describe('when not expanding', () => {
  it('should render shallowly', () => {
    const renderFn = ({ x }) => `Cursor is at ${x}`;
    const App = () => (
      <div id="app">
        <Mouse render={renderFn} />
      </div>
    );
    const wrapper = shallow(<App />);
    expect(
      wrapper.contains(
        <div id="app">
          <Mouse render={renderFn} />
        </div>
      )
    ).toBe(true);
  });
});

describe('when expanding a regular component with children', () => {
  it('should return a shallow wrapper containing the render prop output', () => {
    const Foo = () => <div>Wow</div>;
    const App = () => (
      <form>
        <Foo />
      </form>
    );
    const wrapper = shallow(<App />);
    expect(wrapper.find(Foo)).toHaveLength(1);
    expect(
      wrapper.contains(
        <form>
          <Foo />
        </form>
      )
    ).toBe(true);
  });
});

describe('shallow-rendering', () => {
  it('renders', () => {
    const Bar = () => (
      <div>
        <div className="in-bar" />
      </div>
    );
    const Foo = () => (
      <div>
        <Bar />
      </div>
    );
    const wrapper = shallow(<Foo />);
    expect(wrapper.find('.in-bar')).toHaveLength(0);
    expect(wrapper.find(Bar)).toHaveLength(1);
    expect(
      wrapper
        .find(Bar)
        .shallow()
        .find('.in-bar')
    ).toHaveLength(1);
  });
});

describe('context', () => {
  describe('when top-level component requires context', () => {
    it('should render from context', () => {
      const App = (props, context) => (
        <div id="app">
          <div>Position is {context.position}</div>
        </div>
      );
      // We need to define the contextTypes so that the App has access to
      // the foo context slice
      App.contextTypes = { position: PropTypes.number.isRequired };

      const context = { position: 10 };
      const wrapper = shallow(<App />, { context });
      expect(
        wrapper.contains(
          <div id="app">
            <div>Position is 10</div>
          </div>
        )
      ).toBe(true);
    });
  });

  describe('when nested component requires context', () => {
    it('should render from context', () => {
      const App = (props, context) => (
        <div id="app">
          <div>Position is {context.position}</div>
        </div>
      );
      // We need to define the contextTypes so that the App has access to
      // the foo context slice
      App.contextTypes = { position: PropTypes.number.isRequired };

      // we are nesting so we don't need to pass the context of App
      const wrapper = shallow(
        <div>
          <App>
            <div id="some-app-child" />
          </App>
        </div>
      );
      expect(
        wrapper.contains(
          <App>
            <div id="some-app-child" />
          </App>
        )
      ).toBe(true);
    });
  });
});
