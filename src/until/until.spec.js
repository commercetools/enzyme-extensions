import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShallowWrapper from 'enzyme/ShallowWrapper';
import until from './until';

beforeAll(() => {
  Enzyme.configure({ adapter: new Adapter() });
  ShallowWrapper.prototype.until = until;
});

const Div = () => <div />;
const Foo = () => <Div />;
const hoc = Component => () => <Component />;

describe('until', () => {
  it('renders the current wrapper one level deep', () => {
    const EnhancedFoo = hoc(Foo);
    const wrapper = shallow(<EnhancedFoo />).until(Foo);
    expect(wrapper.contains(<Foo />)).toBe(true);
    expect(wrapper.dive().contains(<Div />)).toBe(true);
  });

  it('renders the current wrapper several levels deep', () => {
    const EnhancedFoo = hoc(hoc(hoc(Foo)));
    const wrapper = shallow(<EnhancedFoo />).until(Foo);
    expect(wrapper.contains(<Foo />)).toBe(true);
    expect(wrapper.dive().contains(<Div />)).toBe(true);
  });
});
