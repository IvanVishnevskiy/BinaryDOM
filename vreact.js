import { names, types } from './vdom/schema'
import { Serialization, Deserialization } from './vdom/SL'
import Hex from './vdom/hex'

const vreact = (tag, attrs = {}, ...children) => {
  const id = Hex.random(8)
  let vrid
  if(attrs) {
    vrid = attrs.vrid
    delete attrs.vrid
  }
  if(typeof tag === 'function') {
    const funcStr = tag.toString()
    const Component = components.get(funcStr) || new tag({ props: attrs, children, id })
    components.set(tag.toString(), Component)
    components.set(id, Component)
    const { child } = Component.render()
    const hexView = new Serialization('component', { id, attrs, node: child }).getHex()
    return { child: hexView }
  }
  let element = tags[tag]
  const type = typeof tag === 'string' ? 'HTMLNode' : ''
  const text = children.map(c => typeof c === 'string' ? ({
    text: c.split('~|').slice(1).join(''),
    vrid: c.split('~|')[0]
  }) : c)
  const hexView = new Serialization(type, { tag: element, vrid, text, nodes: text || children, attrs, id }).getHex()

  return { child: hexView }
}

const tree = ''

const allTags = ['div', 'span', 'p', 'h1']

let currentBinaryDom = ''

const tags = allTags.reduce((all, next, i) => {
  const hex = Hex.random(4)
  all[next] = hex
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
  const newNode = component.render().child
  const currentPlace = currentBinaryDom.indexOf(component._id)
  const olddata = new Deserialization('component', currentBinaryDom.slice(currentPlace - 4)).fields
  const oldNode = olddata.node

  console.log(new Deserialization(names[newNode.slice(0, 4)], newNode), new Deserialization(names[oldNode.slice(0, 4)], oldNode))
  console.log('\n\n', newNode, oldNode)
  const differences = []
  let currentId
  let diffIndex = 0
  let oldIndex = 0
  let newIndex = 0
  let shouldDiff = true
  let last2OldBytes = 'ffff'
  let last2NewBytes = 'ffff'
  const current = {

  }
  while(shouldDiff) {
    if(diffIndex > 600) {
      shouldDiff = false
      continue
    }
    
    const newByte = newNode[newIndex] + newNode[newIndex + 1]
    const oldByte = oldNode[oldIndex] + oldNode[oldIndex + 1]
    last2NewBytes = last2NewBytes.slice(2) + newByte
    last2OldBytes = last2OldBytes.slice(2) + oldByte
    let lastName = names[last2OldBytes]
    lastName = lastName ? lastName.toLowerCase() : ''
    let newName = names[last2NewBytes]
    newName = newName ? newName.toLowerCase() : ''
    if(lastName === 'id') {
      currentId = oldNode.slice(oldIndex, oldIndex + 8)
    }
    console.log(1, newName)
    if(newName === 'htmlnode' || newName === 'attrcode' || newName === 'textNode' || newName === 'nodescodeFco') {
      current.type = {
        name: lastName,
        position: newIndex
      }
    }
    if(newName === 'stringlength') {
      current.object = {
        name: 'string',
        position: newIndex
      }
    }
    if(newName === 'arraylength') current.object = {
      name: 'array',
      position: newIndex
    }
    
    const oldNextByte = oldNode.substr(oldIndex + 2, 2)
    const newNextByte = newNode.substr(newIndex + 2, 2)

    let shouldContinue = false
    if(lastName.includes('length')) {
      console.log('old', oldByte, lastName)
      if(oldNextByte === 'fe') oldIndex += 16
      else oldIndex += 4
      diffIndex += 4
      shouldContinue = true
    }
    if(newName.includes('length')) {
      console.log('new', newByte, newName)
      if(newNextByte === 'fe') newIndex += 16
      else newIndex += 4
      diffIndex += 4
      shouldContinue = true
    }
    if(newName.includes('skipvrid')) {
      newIndex += 4
      shouldContinue = true
    }
    if(lastName.includes('skipvrid')) {
      oldIndex += 4
      shouldContinue = true
    }
    if(shouldContinue) continue
    if(oldByte !== newByte) {
      const { type = {} } = current
      const { name, position } = type
      if(name === 'attrcode') {
        const newAttrs = newNode.slice(position - 2)
        const oldAttrs = oldNode.slice(position - 2)
        const nA2 = newAttrs.slice(4)
        if(nA2.slice(0, 4) === types.stringlength.id) {
          console.log(nA2.slice(4))
          console.log(new Deserialization('string', nA2.slice(0)))
        }
        const newAttrsData = new Deserialization('attributes', newAttrs)
        const oldAttrsData = new Deserialization('attributes', oldAttrs)
        // console.log(newAttrsData, oldAttrsData)
      }
      return console.log(oldByte, newByte, newIndex)
    }
    diffIndex += 2
    oldIndex += 2
    newIndex += 2
  }

  // console.log(differences[differences.length - 1])
  // console.log(<div></div>)

}

const initialTreeRender = tree => {
  // console.log('Binary tree:', tree)
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