import { types, names } from './schema'
class Hex {
  static addZeros = (hex = '', length = 2) => {
    hex = String(hex)
    while(hex.length < length) hex = '0' + hex
    return hex
  }
  static random = (length = 8) => {
    const id = []
    while(id.length !== length) id.push(Math.floor(Math.random() * 0xff))
    return id.map(item => this.addZeros(item.toString(16))).join('')
  }
  
  static fromNumber = (number = 0, length = 4) => this.addZeros(number.toString(16), length)

  static fromString = (string = '') => {
    
    string = String(string)
      .split('')
      .map(item => {
        return item
      })
      .map(item => {
        const it = this.addZeros(item.codePointAt(0).toString(16), 4)
        return it
      })
      .join('')
    const withLength = this.addLength(
      string
    )
    return withLength
  }

  static addLength = (input = '') => {
    let out = [ types[Array.isArray(input) ? 'arraylength' : 'stringlength'].id ]
    const length = input.length
    if (length <= 253) 
      out.push(length)
    else out = out.concat([254, (length & 0xFF0000) >> 16, (length & 0xFF00) >> 8, length & 0xFF ])
    const mappedOut = out.map(item => this.addZeros(item.toString(16)))
    return Array.isArray(input) ? [...mappedOut, ...input].join('') : mappedOut.join('') + input
  }
  static getWithLength = (string = '') => {
    const { length, start } = this.getLength(string)
    return { length, offset: start + length, str: string.slice(start, start + length) }
  }
  static getArrayWithLength = (string = '') => {
    const { length, start } = this.getLength(string)
    string = string.slice(start)
    let offset = 0
    const arr = []
    for(let i = 0; i < length; i++) {
      let newString = string.slice(offset)
      const { length, start } = this.getLength(newString)
      arr.push(newString.slice(start, length + start))
      offset += length + start
    }
    return arr
  }
  static getLength = (string = '') => {
    const type = names[string.slice(0, 4)]
    let offset = 4
    if(!type) offset = 0
    let length = parseInt(string.substr(offset, 2), 16)
    let start = offset + 2
    if(length === 254) {
      length = parseInt(string.slice(offset + 2, offset + 8), 16)
      start = offset + 8
    }
    return { length, start }
  }
}

export default Hex