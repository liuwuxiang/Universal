var storage = window.localStorage;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    var img_link = self.img_link;//获得参数
	    document.getElementById("changtu_img").src = img_link;
  })
})