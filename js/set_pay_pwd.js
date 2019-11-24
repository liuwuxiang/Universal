var storage = window.localStorage;

//当前是否可获取验证码(0-可获取,1-不可获取)
var getCodeState = 0;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    
  	})
})

/*
 *	获取短信验证码
 * clickType=0:登录密码修改,clickType=1:支付密码修改,clickType=2:密保问题修改
 * */
function getMobileCode(clickType){
	if(getCodeState == 0){
		var type = -1;
	    if (clickType == 0){
			type = 3;
		}
		else if (clickType == 1){
	        type = 4;
	    }
	    else{
			type = 5;
		}
	    var mobile = storage["mobile"];
	    toast(2,"开启loading");
	    var time = 60;
	    $.ajax({
	        url:Main.url + "/app/v1.0.0/getMobileCode",
	        type:"POST",
	        dataType : 'json',
	        data:{"mobile":mobile,"type":type},
	        success:function(data){
	            if (data.status == 0){
	                toast(0,"验证码已发送");
	                 getCodeState = 1;
	                    document.getElementById("getcode").style.color = "#808080";
	                    var timer = setInterval(function () {
			                if(time == 0){
			                		getCodeState = 0;
			                		document.getElementById("getcode").style.color = "#0b8ffe";
			                    document.getElementById("getcode").innerText = "重新发送";
			                    clearInterval(timer);
			                }else {
			                    document.getElementById("getcode").innerText = time+"s";
			                    time--;
			                }
			            },1000);
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

//修改密码
function setPayPwd() {
    var new_pay_pwd = document.getElementById("new_pay_pwd").value;
    var new_agin_pay_pwd = document.getElementById("new_agin_pay_pwd").value;
    var code = document.getElementById("code").value;
    if (new_pay_pwd == undefined || new_pay_pwd == ""){
        toast(1,"请输入新支付密码");
    }
    else if (new_agin_pay_pwd == undefined || new_agin_pay_pwd == ""){
        toast(1,"请确认新支付密码");
    }
    else if(new_pay_pwd != new_agin_pay_pwd){
        toast(1,"两次输入的密码不一致");
    }
    else if (code == undefined || code == ""){
        toast(1,"请输入验证码");
    }
    else{
        toast(2,"开启loading");
        $.ajax({
            url:Main.url + "/app/v1.0.0/setPayPwd",
            type:"POST",
            dataType : 'json',
            data:{"user_id":storage["user_id"],"new_pay_pwd":new_pay_pwd,"code":code},
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