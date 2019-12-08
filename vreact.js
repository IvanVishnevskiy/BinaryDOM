import { names, types } from './vdom/schema'
import { Serialization, Deserialization } from './vdom/SL'
import Hex from './vdom/hex'
console.log(types)

const vreact = {}

const tree = ''

const allTags = ['div', 'span', 'p', 'h1']

const tags = allTags.reduce((all, next, i) => {
  const hex = (i + 1).toString(16)
  all[next] = Hex.addZeros(hex, 4)
  return all
}, {})
const binTags = Object.entries(tags).reduce((obj, [key, value]) => ({...obj, [value]: key}), {})
window.tags = tags
console.log(tags, binTags)

class Component {
  constructor(props = {}, children = []) {
    if(props.id) this._id = props.id
    this.children = children
  }
  static isClass = true
  state = {}
  setState = (obj) => {
    Object.entries(obj).forEach(entry => {
      const [ key, value ] = entry
      this.state[key] = value
      updateElement(this._id, this.render())
    })
  }
}

const initialTreeRender = tree => {
  console.log('Binary tree:', tree)
  tree = typeof tree === 'string' ? new Deserialization('HTMLNode', tree).fields : tree
  const { tag, attrs = [], nodes = [], text } = tree
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
  const renderedTree = initialTreeRender(item)
  document.querySelector(query).appendChild(renderedTree)
  // document.querySelector(query).appendChild(item.render())
}

export default (tag, attrs = {}, ...children) => {
  console.log(tag, attrs, children)
  let element = tags[tag]
  const type = typeof tag === 'string' ? 'HTMLNode' : ''
  const text = children.reduce((str, next) => typeof next === 'string' ? next + str : str , '')
  const hexView = new Serialization(type, { tag: element, text, nodes: children, attrs }).getHex()

  console.log(hexView)
  return { child: hexView }
  const id = `El${String(Math.random()).replace('.', '')}`
  if (typeof tag === 'function')
    return new tag({ id, children })
  console.log(tag, attrs, children)
  if(typeof tag === 'string') {
    return 
  }
  
}



export {
  Component,
  renderToHTML
}