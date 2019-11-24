var storage = window.localStorage;
//身份证认证状态(-1- 未认证,0-待审核,1-已认证,2- 认证失败)
var idCardState = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		getUserAuthenticationState();
		// 绑定身份证认证点击事件
		mui('.content_div').on('tap', '#id_card_authentication', function() {
			mui.openWindow({
			   url: "../html/id_card_authentication.html",
			   id: "id_card_authentication.html",
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
		
		// 绑定银行卡信息点击事件
		mui('.content_div').on('tap', '#user_bank_card_setting', function() {
			mui.openWindow({
			   url: "../html/user_bank_card_setting.html",
			   id: "user_bank_card_setting.html",
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
  })
	
})

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
				document.getElementById("id_card_authrntication").innerText = data.data.userIdCard.authentication_result;
                idCardState = data.data.userIdCard.state;
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