var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    // 绑定修改按钮事件事件
		mui('.fhandle').on('tap', '.fsubmit', function() {
			emailBindAction();
		})
  	})
	/*
	* 邮箱绑定事件
	* */
	function emailBindAction() {
		var number = document.getElementById("number_input").value;
	    var code = document.getElementById("code_input").value;
	    if (number == undefined || number == ""){
	        toast(1,setType==0?"请输入手机号":"请输入邮箱号");
		}
		else if (code == undefined || code == ""){
	        toast(1,"请输入验证码");
		}
		else{
			toast(2,"开启loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/setUserEmail",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"email":number,"code":code},
		        success:function(data){
		            if (data.status == 0){
		                toast(0,"修改成功");
		                storage.setItem("email",number);
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
 *	获取邮箱验证码
 * */
function getEmailCode(){
    var email = document.getElementById("number_input").value;
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getEmailCode",
        type:"POST",
        dataType : 'json',
        data:{"email":email},
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