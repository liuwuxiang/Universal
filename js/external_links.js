var storage = window.localStorage;

//type_id
var link_url = "";

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    link_url = self.links;//获得参数
		$('#divID').load(link_url);
	    
	    
  })
})