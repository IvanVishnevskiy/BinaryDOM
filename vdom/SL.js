import { types, names } from './schema'
import Hex from './hex'

class TypesIn {
  static int = (data = 0, { length }) => {
    data = typeof data === 'string' ? data : Hex.fromNumber(data, length / 8)
    while(data.length < parseInt(length) / 8) data = '0' + data
    
    return data
  }
  static string = (str = '') => Hex.fromString(str)
  static schema = (...[,, name]) => types[name] ? types[name].id : console.error(`No type ${name}`)
  static array = (items = [], { arrayType }) => {
    if(!items || !items.length && !items.__proto__.constructor.assign) return '0000'
    // TODO: Bad code
    if(items.__proto__.constructor.assign) {
      items = Object.entries(items).map(([name, value]) => Hex.addLength(new Serialization(arrayType[0], { name, value }).getHex()))
    }
    else items = items.map(item => {
      const type = !item.text ? 'HTMLNode' : 'TextNode'
      const id = Hex.random(8)
      if(type === 'HTMLNode') return Hex.addLength(types.htmlnode.id + item.child)
      else return Hex.addLength(new Serialization(type, { id, text: item.text, vrid: item.vrid }).getHex())
    })
    return Array.isArray(items) && items.length ? Hex.addLength(Hex.addLength(items)) : '0000'
  }
}

class TypesOut {
  static int = (data = '', type) => {
    let { length = 128 } = type
    length = length / 8
    return { item: data.slice(0, length), res: data.slice(length)}
  }
  static bytes = (data = []) => ({ res: [], item: data })
  static string = (data = '') => {
    if(data.length === 0) return ''
    const { str, offset } = Hex.getWithLength(data)
    const decoded = []
    for(let i = 0; i < str.length / 4; i++) {
      decoded.push(String.fromCodePoint(parseInt(str.substr(i * 4, 4), 16)))
    }
    const res = decoded.join('')
    return { item: res, res: data.slice(offset)}
  }
  static schema = (data = '') => ({ item: data.slice(0, 4), res: data.slice(4) })
  static array = (data = [], type) => {
    if (!data || data.slice(0, 4) === '0000') return { item: null, res: data.slice(4) }
    const { str, offset } = Hex.getWithLength(data)
    
    const { arrayType } = type
    const arrayTypes = arrayType.reduce((t, n) => {
      const id = types[n.toLowerCase()].id
      t[id] = names[id]
      return t
    }, {})
    const items = Hex.getArrayWithLength(str).filter(item => item).map(item => {
      const type = item.slice(0, 4)
      const actualType = arrayTypes[type]
      if (!actualType) throw new Error('Unknown array type: ' + type)
      const data = new Deserialization(actualType, item.slice(4)).fields
      return data  
    })
    // const itemtype = str.slice(0, 4)
    // console.log(str, itemtype, length)
    return { item: items, res: data.slice(offset) }    
  }
}

class Serialization {
  constructor(name, params) {
    if(name && params) this.serialize(name, params)
  }
  hex = ''
  serialize = (inputName = '', inputParams = {}) => {
    if(!inputName) throw new Error('Nothing to serialize')
    const object = types[inputName.toLowerCase()]
    if(!object) throw new Error('Unknown name: ' + inputName)
    this.hex = this.hex + object.id
    const { params, output = '' } = object
    params.forEach(param => {
      const { name, type } = param
      const ser = String(TypesIn[type.fieldType](inputParams[name], type, name))
      this.hex = this.hex + ser || '0000'
    })
    return output
  }

  getHex = () => this.hex
}

class Deserialization {
  constructor(name, data) {
    if(name && data) this.deserialize(name, data)
  }
  
  fields = {}
  deserialize = (name = '', data = []) => {
    if(!name) throw new Error('No name')
    if(!data) throw new Error('Nothing to deserialize')
    const object = types[name.toLowerCase()]
    if(!object) throw new Error('No object for: ' + name)
    const id = data.slice(0, 4)
    data = data.slice(4)
    object.params.forEach(field => {
      const { name, type } = field
      const { res, item } = TypesOut[type.fieldType](data || [], type)
      data = res
      this.fields[name] = item
    })
    this.name = names[this.fields.name]
  }
}

export { Serialization, Deserialization }