import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShallowWrapper from 'enzyme/ShallowWrapper';
import until from './until';

const Div = () => <div />;
const Foo = () => <Div />;
const hoc = Component => () => <Component />;

describe('until', () => {
  let wrapper;
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    ShallowWrapper.prototype.until = until;
  });

  describe('when selector is found at first level', () => {
    beforeEach(() => {
      const EnhancedFoo = hoc(Foo);
      wrapper = shallow(<EnhancedFoo />).until(Foo);
    });

    it('should render (dives to) the wrapper', () => {
      expect(wrapper.contains(<Foo />)).toBe(true);
      expect(wrapper.dive().contains(<Div />)).toBe(true);
    });
  });

  describe('when selector is found at second level', () => {
    beforeEach(() => {
      const EnhancedFoo = hoc(hoc(hoc(Foo)));
      wrapper = shallow(<EnhancedFoo />).until(Foo);
    });

    it('should render (dives to) the wrapper', () => {
      expect(wrapper.contains(<Foo />)).toBe(true);
      expect(wrapper.dive().contains(<Div />)).toBe(true);
    });
  });

  describe('with empty wrapper', () => {
    beforeEach(() => {
      const NullComponent = () => null;
      wrapper = shallow(<NullComponent />).until();
    });

    it('should stop shallow rendering', () => {
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('with string selector', () => {
    beforeEach(() => {
      const EnhancedFoo = hoc(Foo);
      wrapper = shallow(<EnhancedFoo />).until('Foo');
    });

    it('should render the wrapper', () => {
      expect(wrapper.contains(<Foo />)).toBe(true);
      expect(wrapper.dive().contains(<Div />)).toBe(true);
    });
  });

  describe('with `maxDepth`', () => {
    let EnhancedFoo;

    describe('when exceeding `maxDepth`', () => {
      beforeEach(() => {
        EnhancedFoo = hoc(hoc(hoc(Foo)));
      });

      it('should throw', () => {
        expect(() => {
          shallow(<EnhancedFoo />).until(Foo, { maxDepth: 1 });
        }).toThrow();
      });
    });
  });
});
