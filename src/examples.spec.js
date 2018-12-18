const React = require('react');
const Enzyme = require('enzyme');
const PropTypes = require('prop-types');
const { shallow } = Enzyme;
const Adapter = require('enzyme-adapter-react-16');
const ShallowWrapper = require('enzyme/ShallowWrapper');

// This is a test suite to ensure the examples are working
beforeAll(() => {
  Enzyme.configure({ adapter: new Adapter() });
  ShallowWrapper.prototype.drill = require('../src/drill');
});

describe('drill', () => {
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

  class App extends React.Component {
    render() {
      return (
        <div style={{ height: '100%' }}>
          <Mouse
            render={(x = 0, y = 0) => (
              <h1>
                The mouse position is {x}, {y}
              </h1>
            )}
          />
        </div>
      );
    }
  }

  it('should work with multiple arguments', () => {
    const wrapper = shallow(<App />)
      .find(Mouse)
      .drill(props => props.render(10, 20));

    expect(wrapper.equals(<h1>The mouse position is 10, 20</h1>)).toBe(true);
  });

  it('should work when returning a custom wrapper', () => {
    const wrapper = shallow(<App />)
      .find(Mouse)
      .drill(props => <div>{props.render(10, 20)}</div>);

    expect(
      wrapper.equals(
        <div>
          <h1>The mouse position is 10, 20</h1>
        </div>
      )
    ).toBe(true);
  });

  it('should work when rendering component with render-prop at top-level', () => {
    const wrapper = shallow(
      <div>
        <Mouse
          render={(x = 0, y = 0) => (
            <form>
              <div>
                The mouse position is {x}, {y}
              </div>
            </form>
          )}
        />
      </div>
    )
      .find(Mouse)
      .drill(props => props.render(10, 20))
      .shallow();

    expect(
      wrapper.shallow().equals(
        <form>
          <div>The mouse position is 10, 20</div>
        </form>
      )
    ).toBe(true);
  });
});
