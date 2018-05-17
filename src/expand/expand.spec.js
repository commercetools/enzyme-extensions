import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShallowWrapper from 'enzyme/ShallowWrapper';
import expand from './expand';

const TestComponent = () => <div />;

class Child extends React.Component {
  handleChange = () => {};

  render() {
    return (
      <div>
        <h3>Child Component</h3>
        {this.props.render({ onChange: this.handleChange })}
      </div>
    );
  }
}

class Host extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h3>Host Component</h3>
        <Child
          render={({ onChange }) => <button onClick={onChange}>button</button>}
        />
      </React.Fragment>
    );
  }
}

describe('expand', () => {
  const createChildProps = props => ({ onChange: jest.fn(), ...props });
  let wrapper;
  let childProps;

  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    ShallowWrapper.prototype.expand = expand;
  });

  beforeEach(() => {
    childProps = createChildProps();

    wrapper = shallow(<Host />).expand(Child, {
      propName: 'render',
      props: childProps,
    });
  });

  it('should expand through to the node', () => {
    expect(wrapper.contains('button')).toBe(true);
  });

  describe('with props', () => {
    beforeEach(() => {
      wrapper.prop('onClick')();
    });

    it('should pass props to node', () => {
      expect(childProps.onChange).toHaveBeenCalled();
    });
  });

  describe('when node to expand is not found', () => {
    it('should throw', () => {
      expect(() => {
        shallow(<Host />).expand(TestComponent, {
          propName: 'render',
          props: childProps,
        });
      }).toThrow();
    });
  });

  describe('when render prop is not a function', () => {
    it('should throw', () => {
      expect(() => {
        shallow(<Host />).expand(Child, {
          propName: 'nonDefinedrenderProp',
          props: childProps,
        });
      }).toThrow();
    });
  });
});
