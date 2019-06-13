/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// This is a test suite to ensure some enzyme behavior these extensions assume
const Mouse = props => (
  // eslint-disable-next-line react/prop-types
  <div id="mouse">{props.render({ x: Math.random() })}</div>
);
let App;
let wrapper;

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

describe('when not expanding', () => {
  it('should render shallowly', () => {
    const renderFn = ({ x }) => `Cursor is at ${x}`;
    App = () => (
      <div id="app">
        <Mouse render={renderFn} />
      </div>
    );
    wrapper = shallow(<App />);
    expect(
      wrapper.equals(
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
    App = () => (
      <form>
        <Foo />
      </form>
    );
    wrapper = shallow(<App />);
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
    wrapper = shallow(<Foo />);
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
      App = (props, context) => (
        <div id="app">
          <div>Position is {context.position}</div>
        </div>
      );
      // We need to define the contextTypes so that the App has access to
      // the foo context slice
      App.contextTypes = { position: PropTypes.number.isRequired };

      const context = { position: 10 };
      wrapper = shallow(<App />, { context });
      expect(
        wrapper.equals(
          <div id="app">
            <div>Position is 10</div>
          </div>
        )
      ).toBe(true);
    });
  });
});
