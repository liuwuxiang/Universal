var storage = window.localStorage;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    var sex = self.sex;//获得参数
	    if(sex == 0){
	    		document.getElementById("man").checked = true;
	    }
	    else if(sex == 1){
	    		document.getElementById("woman").checked = true;
	    }
	    else if(sex == 2){
	    		document.getElementById("baomi").checked = true;
	    }
  })
})

/*
* 修改用户性别事件
* */
function setUseSex() {
	var sex = 0;
	if(document.getElementById("man").checked == true){
		sex = 0;
	}
	else if(document.getElementById("woman").checked == true){
		sex = 1;
	}
	else{
		sex = 2;
	}
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/setUserSex",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"sex":sex},
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