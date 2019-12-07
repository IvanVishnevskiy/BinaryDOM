class Hex {
  static addZeros = (hex = '', length = 2) => {
    hex = String(hex)
    while(hex.length < length) hex = '0' + hex
    return hex
  }
  static random = (length = 8) => {
    const id = []
    while(id.length !== length) id.push(Math.floor(Math.random() * 0xff))
    return id.map(item => addHexZero(item.toString(16))).join('')
  }
  static fromNumber = (number = 0, length = 4) => this.addZeros(number.toString(16), length)
  static fromString = (string = '') => {
    string = unescape(encodeURIComponent(string))
    const out = []
    for(let i = 0; i < string.length; i++) out.push(string.charCodeAt(i).toString(16))
    return this.addLength(out.map(item => this.addZeros(item)).join(''))
  }
  static addLength = (input = '') => {
    let out = []
    const length = input.length
    if (length <= 253) 
      out.push(length)
    else out = out.concat([254, length & 0xFF, (length & 0xFF00) >> 8, (length & 0xFF0000) >> 16])
    const mappedOut = out.map(item => this.addZeros(item.toString(16)))
    return Array.isArray(input) ? [...mappedOut, ...input].join('') : mappedOut.join('') + input
  }
  static getWithLength = (string = '') => {
    const { length, start } = this.getLength(string)
    return { length, offset: start + length, str: string.slice(start, length) }
  }
  static getArrayWithLength = (string = '') => {
    const { length, start } = this.getLength(string)
    string = string.slice(start)
    let offset = 0
    const arr = []
    for(let i = 0; i < length; i++) {
      const { length, start } = this.getLength(string.slice(offset))
      offset += length + start
      arr.push(string.slice(start, length))
    }
    return arr
  }
  static getLength = (string = '') => {
    let length = parseInt(string.slice(0, 2), 16)
    let start = 2
    if(length > 254) {
      length = parseInt(string.slice(0, 8), 16)
      start = 8
    }
    return { length, start }
  }
}

export default Hex