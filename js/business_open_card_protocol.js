var storage = window.localStorage;

var business_id = -1;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		business_id = self.business_id; //获得参数

		selectBusinessOpenCardProtocolByBusinessId(business_id);

		document.getElementById('my_ok').addEventListener('tap', function() {
			plus.webview.close('business_open_card_protocol.html');
		})

	})

})

function selectBusinessOpenCardProtocolByBusinessId(business_id) {
	toast(2, "打开loading");
	jQuery.support.cors = true;
	$.ajax({
		url: Main.url + "/app/v1.0.0/selectBusinessOpenCardProtocolByBusinessId",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id"    : storage["user_id"],
			"business_id": business_id,
		},
		success: function(data) {
			toast(3, "关闭loading");
			if (parseInt(data.status) === 0 && data.data != null) {
				document.getElementById('content').innerHTML = data.data.content;
			} else {
				plus.nativeUI.toast('此商家未设置开卡协议');
				plus.webview.close('business_open_card_protocol.html');
			}
		}
	});
}
