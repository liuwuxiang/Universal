var storage = window.localStorage;

var storage = window.localStorage;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    // 点击事件
		mui('.memmenu').on('tap', '.item', function() {
			var name = this.getAttribute('name');
			// 页面ID
			var id;
			// 页面相对路径
			var url;
			//类型(0-法律声明,1-价格声明,2-隐私政策,3-餐饮安全管理,4-用户协议)
			var look_type = 0;
			switch (name) {
				case 'legal_declaration': // 法律声明
//					url = "legal_declaration.html";
//					id = "legal_declaration.html";
					look_type = 0;
					break;
				
				case 'price_description': // 价格说明
//					url = "price_description.html";
//					id = "price_description.html";
					look_type = 1;
					break;
				
				case 'privacy_policy': // 隐私政策
//					url = "privacy_policy.html";
//					id = "privacy_policy.html";
					look_type = 2;
					break;
				
				case 'food_safety': // 餐饮安全管理办法
//					url = "food_safety.html";
//					id = "food_safety.html";
					look_type = 3;
					break;
				case 'user_agreement': // 用户协议
//					url = "food_safety.html";
//					id = "food_safety.html";
					look_type = 4;
					break;
				default:
					mui.toast('错误...');
					return;
			}
			mui.openWindow({
			   url: '../html/about_us_detail.html',
			   id: 'about_us_detail.html',
			   extras:{
			   		look_type:look_type
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
  	})
})


//数据初始化
function iniData() {
//	mui.ready(function() {
//		var self = plus.webview.currentWebview();
//		getAboutUsInformation();
//})
//getAboutUsInformation();
    
}

//获取关于我们信息
    function getAboutUsInformation(){
    		toast(2,"打开loading");
	    $.ajax({
	        url:Main.url+"/app/v1.0.0/aboutUsData",
	        type:"POST",
	        dataType : 'json',
	        data:{},
	        success:function(data){
	            if (data.status == 0){
	                toast(3,"关闭Loading");
	                var content = data.data.content;
	                $("#desc-main").html(content);
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