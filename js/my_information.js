var storage = window.localStorage;


//是否设置了邮箱(0-设置了,1-未设置)
var isEmail = -1;
var nick_name = null;
var mobile = null;
var email = null;
var sex = 0;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    getUserBaseInformation();
		lookMyQrcode();
		
		// 绑定头像修改事件
		mui('.pubmenulist').on('tap', '#header_tag', function() {
			document.getElementById("header_file").click();
		})
		
		// 绑定用户昵称修改事件
		mui('.pubmenulist').on('tap', '#nick_name_tag', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/set_nickname.html",
			   id: "set_nickname.html",
			   extras:{
			   	nick_name:nick_name
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
		})
		
		// 绑定用户性别修改事件
		mui('.pubmenulist').on('tap', '#sex_tag', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/set_sex.html",
			   id: "set_sex.html",
			   extras:{
			   	sex:sex
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
		})
		
		// 绑定实名认证中点击事件
		mui('.pubmenulist').on('tap', '#real_name_authentication', function() {
			mui.openWindow({
			   url: "../html/real_name_authentication.html",
			   id: "real_name_authentication.html",
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
		
		// 绑定业主认证点击事件
		mui('.pubmenulist').on('tap', '#owner_authentication_led', function() {
			mui.openWindow({
			   url: "../html/owner_authentication.html",
			   id: "owner_authentication.html",
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
		
		// 绑定车主认证点击事件
		mui('.pubmenulist').on('tap', '#card_authrntication_led', function() {
			mui.openWindow({
			   url: "../html/card_authentication.html",
			   id: "card_authentication.html",
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
		
		// 绑定收货地址点击事件
		mui('.pubmenulist').on('tap', '#receiving_address_manager', function() {
			mui.openWindow({
			   url: "../html/receiving_address_manager.html",
			   id: "receiving_address_manager.html",
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
		// 绑定修改手机号验证码确定点击事件
		mui('#set_mobile_div').on('tap', '.submit', function() {
			numberCheckConfirmAction();
		})
		
		// 绑定修改邮箱验证码确定点击事件
		mui('#set_email_div').on('tap', '#set_email', function() {
			emailCodeCheck();
		})
  	})
	//获取用户基础信息
	function getUserBaseInformation() {
	    toast(2,"打开loading");
	    $.ajax({
	        url:Main.url + "/app/v1.0.0/getUserBaseInformation",
	        type:"POST",
	        dataType : 'json',
	        data:{"user_id":storage["user_id"]},
	        success:function(data){
	            if (data.status == 0){
	                toast(3,"关闭loading");
					setUserInformation(data);
					getUserAuthenticationState();
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
	
	/*
	* 设置用户信息
	* */
	function setUserInformation(data) {
	    var user_id = data.data.user_id;
	    // var login_session = data.data.login_session;
	    var level_name = data.data.level_name;
	    var level_icon = data.data.level_icon;
	    var consumption_integral = data.data.consumption_integral;
	    nick_name = data.data.nick_name;
	    sex = data.data.sex;
	    var header = data.data.header;
	    var recommend_mobile = data.data.recommend_mobile;
	    var team_members_number = data.data.team_members_number;
	    var general_integral = data.data.general_integral;
	    mobile = data.data.mobile;
	    email = data.data.email;
	    var is_microfinance = data.data.is_microfinance;
	    var member_card_name = data.data.member_card_name;
	
	    document.getElementById("header_img").src = header;
	    if (nick_name == "" || nick_name == undefined){
	        document.getElementById("nick_name").innerText = "未设置";
		}
		else{
	        document.getElementById("nick_name").innerText = nick_name;
		}
		if (mobile == "" || mobile == undefined){
	        document.getElementById("mobile").innerText = "未设置";
	    }
	    else{
	        document.getElementById("mobile").innerText = mobile;
	    }
	    if (email == "" || email == undefined){
	    		isEmail = -1;
	        document.getElementById("email").innerText = "未设置";
	    }
	    else{
	    		isEmail = 0;
	        document.getElementById("email").innerText = email;
	    }
	    if (sex == 0){
	        document.getElementById("sex").innerText = "男";
	    }
	    else if (sex == 1){
	        document.getElementById("sex").innerText = "女";
	    }
	    else{
	        document.getElementById("sex").innerText = "保密";
		}
	    if(isEmail == -1){
	    		// 绑定用户昵称修改事件
			mui('.pubmenulist').on('tap', '#mailshow', function() {
				var type_id = this.getAttribute('id');
				mui.openWindow({
				   url: "../html/set_email.html",
				   id: "set_email.html",
				   extras:{
				   	nick_name:nick_name
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
			})
	    }
	    else{
	    		// 邮箱
	    		selShow("mailshow","mailfloatbox");
	    }
	    
	}

	/*
	 *	号码验证确定事件
	 * */
	function numberCheckConfirmAction(){
		var mobile_code = document.getElementById("mobile_code").value;
		if(mobile_code == '' || mobile_code == undefined){
	        toast(1,"请输入验证码");
		}
		else{
	       var mobile = storage["mobile"];
		    toast(2,"开启loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/checkMobileCode",
		        type:"POST",
		        dataType : 'json',
		        data:{"code":mobile_code,"type":2,"mobile":storage["mobile"]},
		        success:function(data){
		            if (data.status == 0){
		            		toast(3,"关闭loading");
		                mui.openWindow({
						   url: "../html/set_mobile.html",
						   id: "set_mobile.html",
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
	
	/*
	 *	邮箱验证码校验
	 * */
	function emailCodeCheck(){
	    var code = document.getElementById("email_code_number").value;
		if(code == '' || code == undefined){
	        toast(1,"请输入验证码");
		}
		else{
			toast(2,"开启loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/checkEmailCode",
		        type:"POST",
		        dataType : 'json',
		        data:{"email":email,"code":code},
		        success:function(data){
		            if (data.status == 0){
		                toast(3,"关闭loading");
		                mui.openWindow({
							   url: "../html/set_email.html",
							   id: "set_email.html",
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
 *	查看我的二维码
 * */
function lookMyQrcode(){
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserQrcode",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
				var nick_name = data.data.nick_name;
				var sex = data.data.sex;
				var mobile = data.data.mobile;
				var user_header = data.data.user_header;
				var qrcode_url = data.data.qrcode_url;
				document.getElementById("qrcode_nick_name").innerText = nick_name;
                document.getElementById("qrcode_header").src = user_header;
                document.getElementById("qrcode_photo").src = qrcode_url;
                document.getElementById("qrcode_mobile").innerText = mobile;
                if (sex == 0){
                    document.getElementById("qrcode_nick_name").setAttribute("class","name boy");
				}
				else if (sex == 1){
                    document.getElementById("qrcode_nick_name").setAttribute("class","name girl");
				}
                toast(3,"关闭loading");
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

function chooseHeaderChangeFile() {
    toast(2,"开启loading");
    $.ajaxFileUpload({
        url : Main.url + '/images/savaimageMobile.do', // 用于文件上传的服务器端请求地址
        secureuri : false, // 是否需要安全协议，一般设置为false
        fileElementId : 'header_file', // 文件上传域的ID
        dataType : 'json', // 返回值类型 一般设置为json
        type : "post",
        data:{"fileNameStr":"ajaxFile","fileId":"header_file"},
        success : function(data, status) // 服务器成功响应处理函数
        {
            if (data.error == 0){
                toast(3,"关闭loading");
                setHeader(data.url,data.url_location);
            }
            else{
                toast(1,data.message);
            }
        },
        error : function(data, status, e)// 服务器响应失败处理函数
        {
            toast(3,"关闭loading");
            alert(e);
        }
    });
}

//头像修改
function setHeader(imageId,header_url) {
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/setUserHeader",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"imageid":imageId},
        success:function(data){
            if (data.status == 0){
                document.getElementById("header_img").src = header_url;
                toast(0,"修改完成");
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

/*
 *	获取短信验证码
 * */
function getMobileCode(){
    var mobile = storage["mobile"];
        toast(2,"开启loading");
        $.ajax({
            url:Main.url + "/app/v1.0.0/getMobileCode",
            type:"POST",
            dataType : 'json',
            data:{"mobile":storage["mobile"],"type":2},
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

/*
 *	获取邮箱验证码
 * */
function getEmailCode(){
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

//获取认证状态信息
function getUserAuthenticationState() {
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserAuthenticationState",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭Loading");
                document.getElementById("owner_authrntication").innerText = data.data.userOwner.authentication_result;
                document.getElementById("card_authrntication").innerText = data.data.userCard.authentication_result;
            }
            else{
                toast(1,data.msg);
            }
        },
    });
}