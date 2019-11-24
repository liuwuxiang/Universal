//进入登录页面
function joinLoginPage(){
	mui.openWindow({
		   url: "../index.html",
		   id: "index.html",
		   extras:{},
		   styles: {
		    top: '0px',
		    bottom: '0px',
		   },
		   createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		   show: {
		    autoShow: true, //页面loaded事件发生后自动显示，默认为true
		    aniShow: 'slide-in-left', //页面显示动画，默认为”slide-in-right“；
		    duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		   },
		   waiting: {
		    autoShow: true, //自动显示等待框，默认为true
		    title: '正在加载...', //等待对话框上显示的提示内容
		   }
		});
}
