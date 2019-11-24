var storage = window.localStorage;
var message_id = -1;
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    message_id = self.message_id;//获得参数
	    getMessageDetail();
  })
	//获取消息信息
	function getMessageDetail(){
		toast(2,"打开loading");
        $.ajax({
            url:Main.url + "/app/v1.0.0/getSystemMessageByMessageId",
            type:"POST",
            dataType : 'json',
            data:{"user_id":storage["user_id"],"message_id":message_id},
            success:function(data){
                if (data.status == 0){
                    toast(3,"关闭Loading");
                    document.getElementById("message_title").innerHTML = data.data.title;
                    document.getElementById("message_center").innerHTML = data.data.content;
                }
                else if(data.status == 2){
		            storage["user_id"] = "";
		            toast(1,data.msg);
		            joinLoginPage();
		        }
                else{
                    toast(1,data.msg);
                }
            },
        });
	}
})
