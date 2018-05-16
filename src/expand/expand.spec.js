import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShallowWrapper from 'enzyme/ShallowWrapper';
import expand from './expand';

beforeAll(() => {
  Enzyme.configure({ adapter: new Adapter() });
  ShallowWrapper.prototype.expand = expand;
});

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
  const childProps = { onChange: jest.fn() };

  test('expand through the node', () => {
    const wrapper = shallow(<Host />).expand(Child, {
      propName: 'render',
      props: childProps,
    });
    expect(wrapper.contains('button')).toBe(true);
  });

  test('passes props to node', () => {
    const wrapper = shallow(<Host />).expand(Child, {
      propName: 'render',
      props: childProps,
    });
    wrapper.prop('onClick')();

    expect(childProps.onChange).toHaveBeenCalled();
  });
});
