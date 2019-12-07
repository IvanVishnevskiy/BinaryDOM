import domschema from './domschema'

let retrievedSchema
let retrievedNames = {}

const getSchema = () => {
  if(retrievedSchema) return retrievedSchema
  const data = domschema
  .trim()
  .split('\n')
  .filter(row => 
    row && 
    !row.includes('---functions---')
  )
  .reduce((res, next) => {
    const [ input, output ] = next.trim().split(' = ')
    const hasFlags = input.includes('flags')
    const [ nameAndId, ...params ] = input.replace('Array ', 'Array_').split(' ')
    const [ name, id ] = nameAndId.split('#')
    const paramsParsed = params.map(param => {
      param = param.replace(/[{}]/).split(':')
      if(!param.length || param.length === 1) return
      let [ name, type ] = param
      if(type.includes('flags')) {
        const [ , flag, fieldType ] = type.split(/[.?]/)
        type = { flag, fieldType }
      }
      else if (type.includes('int')) {
        type = { fieldType: 'int', length: type.substr(3) }
      }
      else if (type.includes('Array')) {
        type = { fieldType: 'array', arrayType: type.split('<')[1].replace('>', '').split('|') }
      }
      else type = { fieldType: type }
      return { name, type }
    }).filter(item => item)
    res.schema[name.toLowerCase()] = {
      id,
      params: paramsParsed,
      hasFlags,
      output
    }
    res.names[id] = name.toLowerCase()
    return res
  }, { schema: {}, names: {} })

  const { schema, names } = data
  retrievedSchema = schema
  retrievedNames = names
  return schema
}

getSchema() 

window.types = retrievedSchema
window.names = retrievedNames

export {
  retrievedSchema as types,
  retrievedNames as names
}