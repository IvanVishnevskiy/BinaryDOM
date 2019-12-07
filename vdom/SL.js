import { types, names } from './schema'
import Hex from './hex'
import { parse } from 'path'

class TypesIn {
  static int = (data = 0, length = 64) => {
    data = typeof data === 'string' ? data : Hex.fromNumber(data, length / 8)
    return data
  }
  static string = (str = '') => Hex.fromString(str)
  static array = (items = [], { arrayType }) => {
    items = items ? items : []
    // TODO: Bad code
    if(items.__proto__.constructor.assign) {
      items = Object.entries(items).map(([name, value]) => String(types[arrayType[0]].id) + new Serialization(arrayType[0], { name, value }).getHex())
    }
    else items = items.map(item => {
      const type = typeof item === 'object' ? 'HTMLNode' : 'TextNode'
      if(type === 'HTMLNode') return Hex.addLength(types.htmlnode.id + item.child)
      else return Hex.addLength(types.textnode.id + new Serialization(type, { text: item }).getHex())
    })
    return Array.isArray(items) && items.length ? Hex.addLength(Hex.addLength(items)) : '00000000'
  }
}

class TypesOut {
  static int = (data = '', type) => {
    let { length = 128 } = type
    length = length / 4
    return { item: data.slice(0, length), res: data.slice(length)}
  }
  static bytes = (data = []) => ({ res: [], item: data })
  static string = (data = '') => {
    if(data.length === 0) return ''
    let offset = 0
    let start = 0
    let length = parseInt(data.slice(0, 2), 16)
    if(length > 254) {
      length = parseInt(data.slice(0, 8), 16)
      offset = 8
      start = 8
    }
    else {
      offset = 2
      start = 2
    }
    offset += length
    const str = []
    for(let i = 0; i < length; i += 2) str.push(String.fromCharCode(parseInt(data[i] + data[i + 1], 16)))
    const res = str.filter(item => item).join('')
    return { item: res, res: data.slice(offset)}
  }
  static array = (data = [], type) => {
    if(!data || !data.length) return console.error('No data to parse long from.')
    if(data.slice(0, 8) === '00000000') return { item: null, res: data.slice(8) }
    const { arrayType } = type
    const arrayTypes = arrayType.reduce((t, n) => {
      const id = types[n.toLowerCase()].id
      t[id] = names[id]
      return t
    }, {})
    const parsedData = Hex.getWithLength(data)
    const items = Hex.getArrayWithLength(parsedData.str).map(item => {
      const type = item.slice(0, 4)
      const actualType = arrayTypes[type]
      if (!actualType) throw new Error('Unknown array type!')
      console.log(actualType, item)
      const data = new Deserialization(actualType, item.slice(4))
      console.log(data)
    })
    // const itemtype = str.slice(0, 4)
    // console.log(str, itemtype, length)
    return { item: [], res: '' }    
  }
  static long = data => {
    if(!data || !data.length) return console.error('No data to parse long from.')
    const item = Bytes.toHex(data.slice(0, 8))
    return { item, res: data.slice(8)}
  }
  static name = data => {
    if(!data || !data.length) return console.error('No data to parse long from.')
    return { item: Bytes.toHex(data.slice(0, 4)), res: data.slice(4) }
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
    const { params, output = '' } = object
    params.forEach(param => {
      const { name, type } = param
      const ser = String(TypesIn[type.fieldType](inputParams[name], type))
      this.hex = this.hex + ser || '00000000'
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
    console.log(object)
    if(!object) throw new Error('No object for: ' + name)
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