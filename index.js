import vreact, { Component, renderToHTML } from './vreact'

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello!</h1>
        <div>Ivan</div>
        <p>What are going on here?</p>
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

renderToHTML('#App', (
  <div style="font-size: 20px">
    <h1>Привет!</h1>
    <p style="color: yellow">
      Как дела?
    </p>
    <p style="color: blue">
      Говори
    </p>
    <p style="color: green">
      Отвечай
    </p>
  </div>
))