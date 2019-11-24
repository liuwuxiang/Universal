var storage = window.localStorage;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    var name = self.nick_name;//获得参数
	    document.getElementById("nick_name").value = name;
  	})
})

/*
 *	修改昵称事件
 * */
function setNickNameAction(){
	var nickName = document.getElementById("nick_name").value;
	if(nickName == '' || nickName == undefined){
        toast(1,"请输入昵称");
	}
	else{
        toast(2,"打开loading");
        $.ajax({
            url:Main.url + "/app/v1.0.0/setUserNickName",
            type:"POST",
            dataType : 'json',
            data:{"user_id":storage["user_id"],"nick_name":nickName},
            success:function(data){
                if (data.status == 0){
                    toast(0,"修改成功");
                    back();
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
}
