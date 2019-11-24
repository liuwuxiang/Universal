var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    selShow("telshow","telfloatbox");
		// 绑定登录密码设置事件
		mui('.pubmenulist').on('tap', '#set_login_pwd', function() {
			var order_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/set_login_pwd.html",
			   id: "set_login_pwd.html",
			   extras:{},
			   styles: {
			    top: '0px',
			    bottom: '0px',
			   },
			   createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			   show: {
			    autoShow: true, //页面loaded事件发生后自动显示，默认为true
			    aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
			    duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			   },
			   waiting: {
			    autoShow: true, //自动显示等待框，默认为true
			    title: '正在加载...', //等待对话框上显示的提示内容
			   }
			});
		})
		
		// 绑定提现按钮事件
		mui('.pubmenulist').on('tap', '#set_pay_pwd', function() {
			var order_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/set_pay_pwd.html",
			   id: "set_pay_pwd.html",
			   extras:{},
			   styles: {
			    top: '0px',
			    bottom: '0px',
			   },
			   createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			   show: {
			    autoShow: true, //页面loaded事件发生后自动显示，默认为true
			    aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
			    duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			   },
			   waiting: {
			    autoShow: true, //自动显示等待框，默认为true
			    title: '正在加载...', //等待对话框上显示的提示内容
			   }
			});
		})
		
		// 绑定验证码确定按钮事件
		mui('.handle').on('tap', '#submit_button', function() {
			submitAction();
		})
  	})
	
	
	//验证码提交
	function submitAction(){
		var code = document.getElementById("code").value;
		if(code == undefined || code == ""){
			toast(1,"请输入验证码");
		}
		else if(code.length != 6){
			toast(1,"验证码不正确");
		}
		else{
			mobileCodeCheck(code,3);
		}
	}
	
	/*
	 *	短信验证码校验
	 * */
	function mobileCodeCheck(code,clickType){
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
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/checkMobileCode",
	            type:"POST",
	            dataType : 'json',
	            data:{"code":code,"type":type,"mobile":mobile},
	            success:function(data){
	                if (data.status == 0){
	                		toast(3,"关闭");
	                    document.getElementById("code").value = "";
	                    var _wrap = $("#telfloatbox");
						_wrap.removeClass('sel');
						mui.openWindow({
						   url: "../html/security_question.html",
						   id: "security_question.html",
						   extras:{
						   		code:code
						   },
						   styles: {
						    top: '0px',
						    bottom: '0px',
						   },
						   createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
						   show: {
						    autoShow: true, //页面loaded事件发生后自动显示，默认为true
						    aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
						    duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
						   },
						   waiting: {
						    autoShow: true, //自动显示等待框，默认为true
						    title: '正在加载...', //等待对话框上显示的提示内容
						   }
						});
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

/*
 *	获取短信验证码
 * clickType=0:登录密码修改,clickType=1:支付密码修改,clickType=2:密保问题修改
 * */
function getMobileCode(clickType){
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
    console.log("mobile="+mobile);
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getMobileCode",
        type:"POST",
        dataType : 'json',
        data:{"mobile":mobile,"type":type},
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

