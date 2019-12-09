import { names, types } from './vdom/schema'
import { Serialization, Deserialization } from './vdom/SL'
import Hex from './vdom/hex'

const vreact = (tag, attrs = {}, ...children) => {
  console.log(tag, attrs, children)
  if(typeof tag === 'function') {
    const funcStr = tag.toString()
    const id = Hex.random(8)
    const Component = components.get(funcStr) || new tag({ props: attrs, children, id })
    components.set(tag.toString(), Component)
    components.set(id, Component)
    const { child } = Component.render()
    const hexView = new Serialization('component', { id, attrs, node: child }).getHex()
    return { child: hexView }
  }
  let element = tags[tag]
  const type = typeof tag === 'string' ? 'HTMLNode' : ''
  const text = children.reduce((str, next) => typeof next === 'string' ? next + str : str , '')
  const hexView = new Serialization(type, { tag: element, text, nodes: children, attrs }).getHex()

  return { child: hexView }
  const id = `El${String(Math.random()).replace('.', '')}`
  if (typeof tag === 'function')
    return new tag({ id, children })
  console.log(tag, attrs, children)
  if(typeof tag === 'string') {
    return 
  }
  
}

const tree = ''

const allTags = ['div', 'span', 'p', 'h1']

let currentBinaryDom = ''

const tags = allTags.reduce((all, next, i) => {
  const hex = (i + 1).toString(16)
  all[next] = Hex.addZeros(hex, 4)
  return all
}, {})
const binTags = Object.entries(tags).reduce((obj, [key, value]) => ({...obj, [value]: key}), {})
window.tags = tags

class Component {
  constructor(props = {}, children = []) {
    if(props.id) this._id = props.id
    this.props = props
    this.children = children
  }
  static isClass = true
  state = {}
  setState = (obj) => {
    Object.entries(obj).forEach(entry => {
      const [ key, value ] = entry
      this.state[key] = value
      updateTree(this)      
    })
  }
}

const updateTree = component => {
  console.log(13555555, component, currentBinaryDom)
  const newNode = component.render().child
  const currentPlace = currentBinaryDom.indexOf(component._id)
  const olddata = new Deserialization('component', currentBinaryDom.slice(currentPlace - 4)).fields
  const oldNode = olddata.node

  console.log(new Deserialization(names[newNode.slice(0, 4)], newNode), new Deserialization(names[oldNode.slice(0, 4)], oldNode))
  console.log('\n\n', newNode, oldNode)
  const differences = []
  for(let i = 0; i < Math.min(newNode.length, oldNode.length); i++) {
    const newChar = newNode[i]
    const oldChar = oldNode[i]
    if(newChar !== oldChar) differences.push(i)
  }

  // console.log(differences[differences.length - 1])
  // console.log(<div></div>)

}

const initialTreeRender = tree => {
  console.log('Binary tree:', tree)
  tree = typeof tree === 'string' ? new Deserialization(names[tree.slice(0, 4)], tree).fields : tree
  const { tag, attrs = [], nodes = [], text, node } = tree
  if(node) {
    const nodeType = node.slice(0, 4)
    console.log(names[nodeType], 'component')
    const parsedNode = new Deserialization(names[nodeType], node)
    const nodeTree = initialTreeRender(parsedNode.fields)
    const Component = components.get(tree.id)
    if (Component && Component.componentDidMount) Component.componentDidMount()
    return nodeTree
  }
  if(text) return document.createTextNode(text)
  const elem = document.createElement(binTags[tag])
  if(attrs && attrs.length) attrs.forEach(({ name, value }) => elem.setAttribute(name, value))
  if(nodes && nodes.length) nodes.forEach(node => {
    const elemNode = initialTreeRender(node)
    elem.appendChild(elemNode)
  })
  return elem
}

const renderToHTML = (query, { child: item }) => {
  currentBinaryDom = item
  const renderedTree = initialTreeRender(item)
  document.querySelector(query).appendChild(renderedTree)
  // document.querySelector(query).appendChild(item.render())
}

const components = new Map()

export default vreact



export {
  Component,
  renderToHTML
}