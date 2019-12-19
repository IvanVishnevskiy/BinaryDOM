import { names, types } from './vdom/schema'
import { Serialization, Deserialization } from './vdom/SL'
import Hex from './vdom/hex'

const TREENODES = {}

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
  console.log('start', performance.now())
  const newNode = component.render().child
  const currentPlace = currentBinaryDom.indexOf(component._id)
  const olddata = new Deserialization('component', currentBinaryDom.slice(currentPlace - 4)).fields
  const oldNode = olddata.node

  let diffIndex = 0
  let oldIndex = 0
  let newIndex = 0
  let shouldDiff = true
  let last2OldBytes = 'ffff'
  let currentId
  let last2NewBytes = 'ffff'
  const current = {

  }
  let changedAttr = false
  while(shouldDiff) {
    if(diffIndex > 10000) {
      shouldDiff = false
      continue
    }
    // console.log('newBytes', newNode.slice(newIndex))
    const newByte = newNode[newIndex] + newNode[newIndex + 1]
    const oldByte = oldNode[oldIndex] + oldNode[oldIndex + 1]
    if(!oldByte || !newByte) {
      shouldDiff = false
      continue
    }
    last2NewBytes = last2NewBytes.slice(2) + newByte
    last2OldBytes = last2OldBytes.slice(2) + oldByte
    let lastName = names[last2OldBytes]
    lastName = lastName ? lastName.toLowerCase() : ''
    let newName = names[last2NewBytes]
    newName = newName ? newName.toLowerCase() : ''
    if(lastName === 'id') {
      currentId = oldNode.slice(oldIndex, oldIndex + 8)
    }
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
    console.log(newName)
    let shouldContinue = false
    if(lastName.includes('length')) {
      if(oldNextByte === 'fe') oldIndex += 16
      else oldIndex += 4
      diffIndex += 4
      shouldContinue = true
    }
    if(newName.includes('length')) {
      if(newNextByte === 'fe') newIndex += 16
      else newIndex += 4
      diffIndex += 4
      shouldContinue = true
    }
    if(newName.includes('skipvrid')) {
      current.vrid = newNode.substr(newIndex + 2, 4)
      newIndex += 4
      shouldContinue = true
    }
    if(lastName.includes('skipvrid')) {
      current.vrid = oldNode.substr(oldIndex + 2, 4)
      oldIndex += 4
      shouldContinue = true
    }
    if(shouldContinue) continue
    if(oldByte !== newByte) {
      console.log(123, current, oldByte, newByte, newIndex, newNode.slice(newIndex))
      const { type = {} } = current
      const { name, position } = type
      if(name === 'attrcode') {
        const newAttrs = newNode.slice(position - 2)
        const oldAttrs = oldNode.slice(position - 2)
        const oldNodeAttrsFirstLengthByte = oldNode.substr(position + 6, 2)
        const newNodeAttrsFirstLengthByte = newNode.substr(position + 6, 2)
        let oldNodeAttrsLength = oldNodeAttrsFirstLengthByte === 'fe' ? parseInt(oldNode.substr(position - 10, 6), 16) : parseInt(oldNodeAttrsFirstLengthByte, 16)
        let newNodeAttrsLength = newNodeAttrsFirstLengthByte === 'fe' ? parseInt(newNode.substr(position - 10, 6), 16) : parseInt(newNodeAttrsFirstLengthByte, 16)
        console.log(newNode.slice(position))
        console.log(oldNodeAttrsLength, newNodeAttrsLength)

        const newAttrsData = new Deserialization('attributes', newAttrs).fields.attrs
        const oldAttrsData = new Deserialization('attributes', oldAttrs).fields.attrs
        let updateAttrs = []
        let deleteAttrs = []
        if(newAttrsData.length === 0) deleteAttrs = oldAttrsData
        else {
          newAttrsData.forEach(attr => {
            const { name, value } = attr
            const oldAttrsIndex = oldAttrsData.findIndex((attr) => attr.name === name)
            if(oldAttrsIndex !== -1) {
              const { value: oldValue } = oldAttrsData[oldAttrsIndex]
              if(value !== oldValue) updateAttrs.push(attr)
              delete oldAttrsData[oldAttrsIndex]
            }
            oldAttrsData.forEach(attr => deleteAttrs.push(attr))
          })
        }
        const node = TREENODES[current.vrid]
        if(updateAttrs.length) updateAttrs.forEach(attr => {
          if(!node) throw new Error('vreact error: no node to change')
          node.setAttribute(attr.name, attr.value)
        })
        if(deleteAttrs.length) deleteAttrs.forEach(attr => {
          if(!node) throw new Error('vreact error: no node to change')
          node.removeAttribute(attr.name)
        })
        console.log('end', performance.now(), newIndex)
        diffIndex += newNodeAttrsLength || 500
        newIndex = position + newNodeAttrsLength + 6
        oldIndex += position + oldNodeAttrsLength + 6
        current.type = {}
        changedAttr = true
        console.log('changedAttr', changedAttr)
        continue        
        // console.log(newAttrsData, oldAttrsData)
      }
      
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
  const { tag, attrs = [], nodes = [], text, node, vrid } = tree
  if(node) {
    const nodeType = node.slice(0, 4)
    const parsedNode = new Deserialization(names[nodeType], node)
    console.log('init', parsedNode.fields)
    const nodeTree = initialTreeRender(parsedNode.fields)
    const Component = components.get(tree.id)
    if (Component && Component.componentDidMount) Component.componentDidMount()
    return nodeTree
  }
  let elem
  if(text) elem = document.createTextNode(text)
  else {
    elem = document.createElement(binTags[tag])
    if(attrs && attrs.length) attrs.forEach(({ name, value }) => elem.setAttribute(name, value))
    if(nodes && nodes.length) nodes.forEach(node => {
      const elemNode = initialTreeRender(node)
      elem.appendChild(elemNode)
    })
  }
  TREENODES[vrid] = elem
  console.log(elem)
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