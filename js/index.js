var storage = window.localStorage;

//当前是否可获取验证码(0-可获取,1-不可获取)
var getCodeState = 0;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {

	plus.key.addEventListener("keydown", function(e) {
		if(parseInt(e.keyCode) === 4) {
			if(window.confirm('是否退出应用？')) {
				plus.runtime.quit();
				return true;
			} else {
				//alert("取消");
				return false;
			}
		}
	}, false);

	mui.ready(function() {
		var self = plus.webview.currentWebview();

		// 获取记住密码状态
		var isRemember = plus.storage.getItem('remember_user');
		if(String(isRemember) === 'true') {
			document.getElementById('Remember').checked = true;
			document.getElementById("account_mobile").value = plus.storage.getItem('remember_mobile_user');
			document.getElementById("login_pwd").value = plus.storage.getItem('remember_pwd_user');
		}

		// 账号登录登录按钮点击事件
		//		mui('#account_form').on('tap', '#account_login_button', function() {
		//			accountLoginAction();
		//		})
		document.getElementById('account_login_button').addEventListener('tap', accountLoginAction);
		// 绑定注册按钮点击事件
		mui('.hadle').on('tap', '#register_button', function() {
			var business_id = this.getAttribute('id');
			mui.openWindow({
				url: "html/register.html",
				id: "register.html",
				extras: {},
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

		// 绑定忘记密码按钮点击事件
		mui('.hadle').on('tap', '#retrieve_password_button', function() {
			var business_id = this.getAttribute('id');
			mui.openWindow({
				url: "html/retrieve_password.html",
				id: "retrieve_password.html",
				extras: {},
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

		// 快捷登录登录按钮点击事件
		mui('#mobile_form').on('click', '#mobile_login_button', function() {
			quickLoginAction();
		})
	})

	/*
	 *	快捷登录事件
	 * */
	function quickLoginAction() {
		var quick_mobile = document.getElementById("quick_mobile").value;
		var quick_login_code = document.getElementById("quick_login_code").value;
		if(quick_mobile == undefined || quick_mobile == '') {
			toast(1, "请输入手机号");
		} else if(quick_login_code == undefined || quick_login_code == '') {
			toast(1, "请输入验证码");
		} else {
			toast(2, "开启loading");
			$.ajax({
				url: Main.url + "/app/v1.0.0/userMobileAndCodeLogin",
				type: "POST",
				dataType: 'json',
				data: {
					"mobile": quick_mobile,
					"code": quick_login_code
				},
				success: function(data) {
					if(data.status == 0) {
						saveUserInformation(data);
						toast(3, "关闭loading");
						mui.openWindow({
							url: "html/tab_bar.html",
							id: "tab_bar.html",
							extras: {},
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
					} else {
						toast(1, data.msg);
					}
				}
			});
		}
	}

	/*
	 *	账号密码登录事件
	 * */
	function accountLoginAction() {
		console.log(0, '账号密码登陆');
		var account = document.getElementById("account_mobile").value;
		var login_pwd = document.getElementById("login_pwd").value;
		if(account == undefined || account == '') {
			toast(1, "请输入手机号");
		} else if(login_pwd == undefined || login_pwd == '') {
			toast(1, "请输入密码");
		} else {
			// 记住密码操作
			if(document.getElementById('Remember').checked) {
				plus.storage.setItem('remember_user', String('true'));
				plus.storage.setItem('remember_mobile_user', String(account));
				plus.storage.setItem('remember_pwd_user', String(login_pwd));
			} else {
				plus.storage.clear();
			}
			toast(2, "开启loading");
			$.ajax({
				url: Main.url + "/app/v1.0.0/userAndPwdLogin",
				type: "POST",
				dataType: 'json',
				data: {
					"mobile": account,
					"login_pwd": login_pwd
				},
				success: function(data) {
					console.log(data);
					if(data.status == 0) {
						saveUserInformation(data);
						toast(3, "关闭loading");
						mui.openWindow({
							url: "html/tab_bar.html",
							id: "tab_bar.html",
							extras: {},
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
					} else if(data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
					} else {
						toast(1, data.msg);
					}
				}
			});
		}
	}
});

//登录选项点击事件(type=0-账号登录,type=1-手机快捷登录)
function loginWayChoose(type) {
	var account_login_tag = document.getElementById("account_login_tag");
	var mobile_login_tag = document.getElementById("mobile_login_tag");
	var account_form = document.getElementById("account_form");
	var mobile_form = document.getElementById("mobile_form");
	if(type == 0) {
		account_login_tag.setAttribute("class", "item sel");
		mobile_login_tag.setAttribute("class", "item");
		account_form.style.display = "block";
		mobile_form.style.display = "none";
	} else {
		account_login_tag.setAttribute("class", "item");
		mobile_login_tag.setAttribute("class", "item sel");
		account_form.style.display = "none";
		mobile_form.style.display = "block";
	}
}

/*
 *	获取短信验证码
 * */
function getMobileCode() {
	if(getCodeState == 0) {
		var quick_mobile = document.getElementById("quick_mobile").value;
		if(quick_mobile == undefined || quick_mobile == '') {
			toast(1, "请输入手机号");
		} else {
			var time = 60;
			toast(2, "开启loading");
			$.ajax({
				url: Main.url + "/app/v1.0.0/getMobileCode",
				type: "POST",
				dataType: 'json',
				data: {
					"mobile": quick_mobile,
					"type": 1
				},
				success: function(data) {
					if(data.status == 0) {
						toast(0, "获取成功");
						getCodeState = 1;
						document.getElementById("getcode").style.color = "#808080";
						var timer = setInterval(function() {
							if(time == 0) {
								getCodeState = 0;
								document.getElementById("getcode").style.color = "#0b8ffe";
								document.getElementById("getcode").innerText = "重新发送";
								clearInterval(timer);
							} else {
								document.getElementById("getcode").innerText = time + "s";
								time--;
							}
						}, 1000);
					} else if(data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
					} else {
						toast(1, data.msg);
					} 
				}
			});
		}
	}
}

/*
 * 保存用户信息
 * */
function saveUserInformation(data) {
	var user_id = data.data.user_id;
	storage.setItem("user_id", user_id);
}