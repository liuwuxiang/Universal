//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    plus.key.addEventListener("keydown", function(e) {
		   if(parseInt(e.keyCode) === 4) {
		   		// 获取应用显示栈顶的WebviewObject窗口对象
				var h = plus.webview.getTopWebview();
				if(String(h.id) == 'my_oder_detail.html') {
					back();
				}else if(String(h.id) == 'business_detail.html') {
					if(popupState.popup_state == true){
						$.closePopup();
						popupState.popup_state = false;
					}
					else{
						back();
						// 重新加载父页面
//					  var view = plus.webview.all();
//					  view[view.length - 2].reload(true);
//					  // 关闭当前页面
//					  plus.webview.close(plus.webview.getTopWebview().id, 'slide-out-right', 200);
					}
				}else {
					back();
//					// 重新加载父页面
//				  var view = plus.webview.all();
//				  view[view.length - 2].reload(true);
//				  // 关闭当前页面
//				  plus.webview.close(plus.webview.getTopWebview().id, 'slide-out-right', 200);
				}
		   		
		   }
		}, false);
  	})
	
})
