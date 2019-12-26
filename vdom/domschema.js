export default `
length#0001
arrayLength#0002
attrcode#0007
nodescode#000f
stringLength#0008
id#000b
skipvrid#000c
attrname#000d
attrvalue#000e

attribute#0003 attrname:schema name:string attrvalue:schema value:string
HTMLNode#0004 tag:int64 skipvrid:schema vrid:int32 attrcode:schema attrs:Array<attribute> nodescode:schema nodes:Array<HTMLNode|TextNode|Component>
TextNode#0005 id:schema vrid:int32 text:string
Component#0006 id:int128 attrs<attribute> node:string

Attributes#9000 attrs:Array<attribute>
string#9001 value:string
`