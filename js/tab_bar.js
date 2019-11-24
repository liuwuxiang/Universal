var storage = window.localStorage;
var clientid = "";
mui.init()
mui.plusReady(function(){
	mui.ready(function() {
		if(storage["user_id"] == undefined || storage["user_id"] == "" || storage["user_id"] == null){
			mui.openWindow({
				url: "../index.html",
				id: "index.html",
				extras:{},
				styles: {
					top: '0px',
					bottom: '0px',
				},
				createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
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
			getPushInfo();
			// 添加点击事件
			mui('.mui-bar').on('tap', '.mui-tab-item', function() {
				var id = this.getAttribute('id');
				var urls;
				switch(String(id)) {
					case 'home':
						urls = '../html/home.html';
						break;
					case 'nearby':
						urls = '../html/nearby.html';
						break;
					case 'my_orders':
						urls = '../html/my_orders.html';
						break;
					case 'integral_mall':
						urls = '../html/integral_mall.html';
						break;
					case 'my':
						urls = '../html/my.html';
						break;
					default:
						urls = '123456'
						break;
				}
				mui.openWindow({
					url: urls,
					id: id + '.html',
					styles: {
						top: '0px',
						bottom: '51px',
					},
					extras: {},
					createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
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
			// 模拟点击订单页面
			var home = document.getElementById('home');
			mui.trigger(home, 'tap');
	//		// 重写退出方法 (安卓平台退出键 键值为4)
	//		function onBack(event) {
	//			console.log("退出键");
	//			alert(event.keyCode);
	//		}
	//		plus.key.addEventListener('backbutton', onBack);
	//		// 重写退出方法(IOS 平台右滑事件)
	//		mui.swipeBack = onBack;
	
			//处理逻辑：1秒内，连续两次按返回键，则退出应用；
			var first = null;
			// 重写返回按钮事件 (天坑)
			plus.key.addEventListener('keydown', function(e) {
				if(e.keyCode == 4) {
	
					// 获取应用显示栈顶的WebviewObject窗口对象
					var h = plus.webview.getTopWebview();
					if(String(h.id) == 'home.html' ||
						String(h.id) == 'nearby.html' ||
						String(h.id) == 'my_orders.html' ||
						String(h.id) == 'integral_mall.html' ||
						String(h.id) == 'index.html' ||
						String(h.id) == 'my.html') {
						//首次按键，提示‘再按一次退出应用’
						if(!first) {
							first = new Date().getTime();
							mui.toast('再按一次退出应用');
							setTimeout(function() {
								first = null;
							}, 1000);
						} else {
							if(new Date().getTime() - first < 1000) {
								plus.runtime.quit();
							}
						}
	
					} else {
						var view = plus.webview.all();
						// 重点
						mui.fire(view[view.length - 2], 'keydownClose');
						// 关闭当前页面
						plus.webview.close(plus.webview.getTopWebview().id, 'slide-out-right');
					}
	
				}
			}, false);
		}
	})
	
	/*
	 *	获取个推客户端推送标识
	 * */
	function getPushInfo(){
	    var info = plus.push.getClientInfo();
	    var token = info.token;
	    clientid = info.clientid;
	    var appid = info.appid;
	    var appkey = info.appkey;
	    console.log("token="+token+",clientid="+clientid+",appid="+appid+",appkey="+appkey);
//	    toast(1,"token="+token+",clientid="+clientid+",appid="+appid+",appkey="+appkey);
		loadUserGetuiTag();
	}
})

//上传用户个推标识
function loadUserGetuiTag(){
	if(storage["user_id"] == undefined || storage["user_id"] == "" || storage["user_id"] == null){
	
	}
	else{
		$.ajax({
	            url:Main.url +"/app/v1.0.0/updateUserGeTuiAppId",
	            type:"POST",
	            dataType : 'json',
	            data:{"user_id":storage["user_id"],"getui_app_id":clientid},
	            success:function(data){
	            	
	            }
	        });
	}
}
