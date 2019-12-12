import vreact, { Component, renderToHTML } from './vreact'

class App extends Component {
  state = {
    color: 'green'
  }
  componentDidMount = () => {
    this.setState({
      color: 'red'
    })
  }
  render() {
    return (
      <div>
        <h1 style={`color: ${this.state.color}`}>Hello!</h1>
        <p>Hello</p>
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