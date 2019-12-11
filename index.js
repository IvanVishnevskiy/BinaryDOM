import vreact, { Component, renderToHTML } from './vreact'

class App extends Component {
  state = {
    counter: 1
  }
  componentDidMount = () => {
    this.setState({
      counter: 2
    })
  }
  render() {
    return (
      <div>
        <h1 fontSize="20px">Hello!</h1>
        <p>Counter: {this.state.counter}</p>
      </div>
    )
  }
}

// renderToHTML('#App', (
//   <div>
//     <h1>Hello,</h1><p>Test</p>
//     <div style="color: red">
//       <p>Hi</p>
//       <p>Me</p>
//     </div>
//   </div>
// ))

renderToHTML('#App', <App />)