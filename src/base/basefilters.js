import global_ from '@/base/baseParam';
//图片加服务器前缀地址
var imgfilter = (value) => {
  if (!value) {
    return ''
  }
  value = value.toString()
   return  global_.imgurl+value
}
//去除空格
var trim=(value)=>{
	if (!value) {
    return ''
  }
   value = value.toString()
   return  value.trim()
}
//状态切换
var statusFilter=(value)=>{
		if (!value) {
	    return ''
	  }
		value = value.toString()
		const statusMap = {
			  	"created":'已创建',
			    'normal':'正常',
			    'unpublish':'未上架',
			    'published':'已上架',
			    'closed': '已停用'
			}
		return statusMap[value]
}
export { imgfilter, trim ,statusFilter}