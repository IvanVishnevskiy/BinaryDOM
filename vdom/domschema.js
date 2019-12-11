export default `
length#0001
arrayLength#0002
attrcode#0007
stringLength#0008
attribute#0003 name:string value:string
HTMLNode#0004 tag:int16 id:int64 attrcode:schema attrs:Array<attribute> nodes:Array<HTMLNode|TextNode|Component>
TextNode#0005 id:int64 text:string
Component#0006 id:int64 attrs<attribute> node:string
`