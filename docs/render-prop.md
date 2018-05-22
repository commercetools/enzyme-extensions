# `.renderProp(expander) => ShallowWrapper`

Shallow render the result of calling a property, defined by the expander function.

NOTE: can only be called on wrapper of a single non-DOM component element node.

#### Arguments

1.  `expander` (`Function => ShallowWrapper` | `String`):

* when a `String` is passed: The `prop` with that name is called and its return value is used. It is not possible to pass any arguments when using a string.
* when a `Function` is passed: This function gets called with the `props` of the current wrapper. The expander function should call one of the properties and return the result.

#### Returns

`ShallowWrapper`: A new wrapper that wraps the node returned from the expander function, after it's been shallowly rendered.

#### Examples

```jsx
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
```

```jsx
class App extends React.Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Mouse
          render={(x = 0, y = 0) => (
            <h1>
              The mouse position is ({x}, {y})
            </h1>
          )}
        />
      </div>
    );
  },
});
```

```jsx
const wrapper = shallow(<App />)
  .find(Mouse)
  .renderProp(props => props.render(10, 20));

expect(wrapper.text()).toEqual('The mouse position is (10, 20)');
```

```jsx
const wrapper = shallow(<App />)
  .find(Mouse)
  .renderProp('render');

expect(wrapper.text()).toEqual('The mouse position is (0, 0)');
```
