var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    // 绑定修改按钮事件事件
		mui('.fhandle').on('tap', '.fsubmit', function() {
			bindAction();
		})
  	})
	/*
	* 绑定事件
	* */
	function bindAction() {
	    var number = document.getElementById("number_input").value;
	    var code = document.getElementById("code_input").value;
	    if (number == undefined || number == ""){
	        toast(1,"请输入手机号");
		}
		else if (code == undefined || code == ""){
	        toast(1,"请输入验证码");
		}
		else{
	        toast(2,"开启loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/setUserMobile",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"mobile":number,"code":code},
		        success:function(data){
		            if (data.status == 0){
		                toast(0,"修改成功");
		                storage.setItem("mobile",number);
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
})

/*
 *	获取短信验证码
 * */
function getMobileCode(){
    var mobile = document.getElementById("number_input").value;
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getMobileCode",
        type:"POST",
        dataType : 'json',
        data:{"mobile":mobile,"type":2},
        success:function(data){
            if (data.status == 0){
                toast(0,"验证码已发送");
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