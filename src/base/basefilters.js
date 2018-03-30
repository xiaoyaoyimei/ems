import global_ from '@/base/baseParam';
var imgfilter = (value) => {
  if (!value) {
    return ''
  }
  value = value.toString()
   return  global_.imgurl+value
}
var trim=(value)=>{
	if (!value) {
    return ''
  }
   value = value.toString()
   return  value.trim()
}

export { imgfilter, trim }