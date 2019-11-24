var storage = window.localStorage;
//协议选中事件(0-未选择,1-已选中)
var xieyi_state = 1;
//当前是否可获取验证码(0-可获取,1-不可获取)
var getCodeState = 0;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    var xieyi_width = document.getElementById("user_xieyi_div").style.width;
		var clientWidth = document.body.clientWidth;
		var xieyi_width_left_width = (clientWidth - xieyi_width) / 6;
		document.getElementById("user_xieyi_div").style.marginLeft = xieyi_width_left_width+"px";
		document.getElementById("user_xieyi_div").style.display = "block";
		// 协议选中按钮事件
		mui('.user_xieyi_div').on('tap', '#xieyi_choose_img', function() {
			var xieyi_choose_img = document.getElementById("xieyi_choose_img");
			if(xieyi_state == 0){
				xieyi_state = 1;
				xieyi_choose_img.src = "../images/choose_select.svg";
			}
			else{
				xieyi_state = 0;
				xieyi_choose_img.src = "../images/choose.svg";
			}
		})
	
		// 用户协议按钮事件
			mui('.user_xieyi_div').on('tap', '.xieyi_content_button', function() {
				mui.openWindow({
				   url: "../html/user_agreement.html",
				   id: "user_agreement.html",
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
			
			// 绑定注册按钮点击事件
		mui('.fhandle').on('tap', '.fsubmit', function() {
			registerAccount();
		})
		
		plus.key.addEventListener("keydown", function(e) {
		   if(parseInt(e.keyCode) === 4) {
		   		back();
		   }
		}, false);
  })
	
	/*
	* 注册账号
	* */
	function registerAccount() {
	    var mobile = document.getElementById("mobile").value;
	    var code = document.getElementById("code").value;
	    var login_pwd = document.getElementById("login_pwd").value;
	    var invitation_code = document.getElementById("invitation_code").value;
	    if (invitation_code == undefined || invitation_code == ''){
	        toast(1,"请输入邀请码");
	    }
	    else if (mobile == undefined || mobile == ''){
	        toast(1,"请输入手机号");
	    }
	    else if (code == undefined || code == ''){
	        toast(1,"请输入验证码");
	    }
	    else if (login_pwd == undefined || login_pwd == ''){
	        toast(1,"请输入登录密码");
	    }
	    else if(xieyi_state == 0){
	    		toast(1,"暂未同意协议内容");
	    }
	    else{
	        toast(2,"开启loading");
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/userMobileAndCodeRegisterTwo",
	            type:"POST",
	            dataType : 'json',
	            data:{"mobile":mobile,"code":code,"login_pwd":login_pwd,"invitation_mobile":invitation_code,"type":0},
	            success:function(data){
	                if (data.status == 0){
	                    toast(1,"注册成功");
	                    storage.setItem("user_id",data.data.user_id);
	                    mui.openWindow({
							url: "../html/tab_bar.html",
							id: "tab_bar.html",
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
	if(getCodeState == 0){
		var mobile = document.getElementById("mobile").value;
	    if (mobile == undefined || mobile == ''){
	        toast(1,"请输入手机号");
	    }
	    else{
	    		var time = 60;
	        toast(2,"开启loading");
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/getMobileCode",
	            type:"POST",
	            dataType : 'json',
	            data:{"mobile":mobile,"type":0},
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