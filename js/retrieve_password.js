//当前是否可获取验证码(0-可获取,1-不可获取)
var getCodeState = 0;
//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {	
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    plus.key.addEventListener("keydown", function(e) {
		   if(parseInt(e.keyCode) === 4) {
		   		back();
		   }
		}, false);
  	})
})
/*
 *	获取短信验证码
 * */
function getMobileCode(){
	if(getCodeState == 0){
		var mobile = document.getElementById("mobile").value;
	    if (mobile == undefined || mobile == ''){
	        toast(1,"请输入手机号");
	    }
	    else{
	        toast(2,"开启loading");
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/getMobileCode",
	            type:"POST",
	            dataType : 'json',
	            data:{"mobile":mobile,"type":7},
	            success:function(data){
	                if (data.status == 0){
	                    toast(0,"获取成功");
	                    getCodeState = 1;
	                    document.getElementById("getcode").style.color = "#808080";
	                    var timer = setInterval(function () {
			                if(time == 0){
			                		getCodeState = 0;
			                		document.getElementById("getcode").style.color = "#0b8ffe";
			                    document.getElementById("getcode").disabled = true;
			                    document.getElementById("getcode").innerText = "重新发送";
			                    clearInterval(timer);
			                }else {
			                    document.getElementById("getcode").innerText = time+"s";
			                    time--;
			                }
			            },1000);
	                }
	                else{
	                    toast(1,data.msg);
	                }
	            },
	        });
	    }
	}
}

/*
* 修改登录密码
* */
function setLoginPWD() {
    var mobile = document.getElementById("mobile").value;
    var code = document.getElementById("code").value;
    var login_pwd = document.getElementById("login_pwd").value;
    if (mobile == undefined || mobile == ''){
        toast(1,"请输入手机号");
    }
    else if (code == undefined || code == ''){
        toast(1,"请输入验证码");
    }
    else if (login_pwd == undefined || login_pwd == ''){
        toast(1,"请输入新的登录密码");
    }
    else{
        toast(2,"开启loading");
        $.ajax({
            url:Main.url + "/app/v1.0.0/retrieveLoginPWD",
            type:"POST",
            dataType : 'json',
            data:{"mobile":mobile,"code":code,"new_login_pwd":login_pwd},
            success:function(data){
                if (data.status == 0){
                    toast(0,"修改成功");
                    back();
                }
                else{
                    toast(1,data.msg);
                }
            },
        });
    }
}