/* eslint-disable react/react-in-jsx-scope */
import vreact, { Component, renderToHTML } from './vreact'

class App extends Component {
  state = {
    color: 'green'
  }
  componentDidMount = () => {
    setTimeout(() => {
      this.setState({
        color: 'red'
      })
    }, 3000)
  }
  render() {
    return (
      <div vrid="1">
        <p vrid="2" style={`transition: 2s ease; color: ${this.state.color}`}>5~|Hello!</p>
        <p vrid="3" style={`color: ${this.state.color}`} >4~|Hello World!</p>
      </div>
      // <div vrid="1" style={`transition: 2s ease; color: ${this.state.color}`}>
      //   5~|Hello!
        
      // </div>
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