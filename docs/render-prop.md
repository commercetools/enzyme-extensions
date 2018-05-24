# `.renderProp(propName, ...args) => ShallowWrapper`

Calls the current wrapper's property with name `propName` and the `args` provided.
Returns the result in a new shallow wrapper.

NOTE: can only be called on wrapper of a single non-DOM component element node.

#### Arguments

1.  `propName` (`String`):
1.  `...args` (`Any`):

This essentially calls `wrapper.prop(propName)(...args)`.

#### Returns

`ShallowWrapper`: A new wrapper that wraps the node returned from the expander function, after it's been shallowly rendered.

#### Examples

##### Test Setup

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
  }
}
```

##### Testing with no arguments

```jsx
const wrapper = shallow(<App />)
  .find(Mouse)
  .renderProp('render');

expect(wrapper.equals(<h1>The mouse position is 0, 0</h1>)).toBe(true);
```

##### Testing with multiple arguments

```jsx
const wrapper = shallow(<App />)
  .find(Mouse)
  .renderProp('render', 10, 20);

expect(wrapper.equals(<h1>The mouse position is 10, 20</h1>)).toBe(true);
```
