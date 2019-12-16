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
      <div vrid="1">
        <h1 vrid="2" style={`color: ${this.state.color}`}>5~|Hello!</h1>
        <p vrid="3">4~|Hello World!</p>
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