# `.drill(expander) => ShallowWrapper`

Shallow render the result of calling a property, defined by the expander function.

NOTE: can only be called on wrapper of a single non-DOM component element node.

#### Arguments

1.  `expander` (`Function => ShallowWrapper`): This function gets called with the `props` of the current wrapper. The expander function should call one of the properties and return the resulting element.

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
              The mouse position is {x}, {y}
            </h1>
          )}
        />
      </div>
    );
  }
}
```

##### Test with multiple arguments

```jsx
const wrapper = shallow(<App />)
  .find(Mouse)
  .drill(props => props.render(10, 20));

expect(wrapper.equals(<h1>The mouse position is 10, 20</h1>)).toBe(true);
```

##### Test returning custom wrapper

```jsx
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
```

##### Test when explicit shallow rendering is necessary

```jsx
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
  // explicit shallow() call is required here, otherwise the wrapper
  // would only contain <form />
  .shallow();

expect(
  wrapper.shallow().equals(
    <form>
      <div>The mouse position is 10, 20</div>
    </form>
  )
).toBe(true);
```
