var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    // 绑定关于我们点击事件
		mui('.pubmenulist').on('tap', '#about_us', function() {
			mui.openWindow({
			   url: "../html/about_us.html",
			   id: "about_us.html",
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
		
		// 绑定投诉建议点击事件
		mui('.pubmenulist').on('tap', '#suggestion_feedback', function() {
			mui.openWindow({
			   url: "../html/suggestion_feedback.html",
			   id: "suggestion_feedback.html",
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
		
		// 绑定退出按钮点击事件
		mui('.pubhandle').on('tap', '.defualt', function() {
			exitLogin();
		})
  	})
	/*
	 *	退出登录
	 * */
	function exitLogin(){
	    if(window.confirm('确认退出登录？')){
	        exitLoginNetwork();
	        return true;
	    }else{
	        //alert("取消");
	        return false;
	    }
	}
	
	//退出登录网络事件
	function exitLoginNetwork() {
		toast(2,"打开loading");
	    $.ajax({
	        url:Main.url + "/wx/v1.0.0/exitLogin",
	        type:"POST",
	        dataType : 'json',
	        data:{"user_id":storage["user_id"]},
	        success:function(data){
	            toast(3,"关闭");
	            window.localStorage.clear();
	            if (mui.os.ios || mui.os.ipad || mui.os.iphone) {
					// 获取所有Webview窗口
					var curr = plus.webview.currentWebview();
					var wvs = plus.webview.all();
					for (var i = 0, len = wvs.length; i < len; i++) {
                        //关闭除主页页面外的其他页面
						if (wvs[i].getURL() == curr.getURL()){
							continue;
						}
						plus.webview.close(wvs[i]);
					}
                    //打开login页面后再关闭主页面
					plus.webview.open('../index.html');
					curr.close();
				} else{
					// 获取所有Webview窗口
					var curr = plus.webview.currentWebview();
					var wvs = plus.webview.all();
					for (var i = 0, len = wvs.length; i < len; i++) {
                        //关闭除主页页面外的其他页面
						if (wvs[i].getURL() == curr.getURL()){
							continue;
						}
						plus.webview.close(wvs[i]);
					}
					//打开login页面后再关闭主页面
					plus.webview.open('../index.html');
					curr.close();								
				}
	        },
	    });
	}
	
})