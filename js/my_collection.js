var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	// 防止手机弹出输入法是tar跟着跑
 	plus.webview.currentWebview().setStyle({height:'d'});
 	mui.ready(function() {
		var self = plus.webview.currentWebview();
		getUserCollectionRecord();
	   	// 绑定商户列表切换事件
		mui('.goods_ul').on('tap', 'li', function() {
			var business_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_detail.html",
			   id: "business_detail.html",
			   extras:{
				     business_id:business_id
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

//获取用户的关注记录
	function getUserCollectionRecord() {
	  toast(2,"打开loading");
	    $(".goods_ul li").remove();
	    publicnull_tip("暂无数据",1);
	    $.ajax({
	        url:Main.url + "/app/v1.0.0/getUserCollectionRecord",
	        type:"POST",
	        dataType : 'json',
	        data:{"user_id":storage["user_id"],"lat":storage["lat"],"longt":storage["longt"]},
	        success:function(data){
	            if (data.status == 0){
	                toast(3,"关闭loading");
	                publicnull_tip("关闭提示",0);
	                var list = data.data;
	                for (var index = 0;index < list.length;index++){
	                    var obj = list[index];
	  					var html = "<li id=\""+obj.business_id+"\">"+
										"<div class=\"li_left_div\">"+
													"<img src=\""+obj.fm_photo+"\"/>"+
												"</div>"+
												"<div class=\"li_right_div\">"+
													"<div class=\"content_left_div\">"+
														"<a class=\"goods_name\">"+obj.store_name+"</a>"+
														"<div class=\"xx_div\">"+
															"<img src=\"../images/xingji.png\"/>"+
														    "<img src=\"../images/xingji.png\"/>"+
														    "<img src=\"../images/xingji.png\"/>"+
														    "<img src=\"../images/xingji.png\"/>"+
														    "<img src=\"../images/xingji.png\"/>"+
														"</div>"+
														"<a class=\"address\">"+obj.store_address+"</a>"+
													"</div>"+
													"<a class=\"juli_tag\">"+obj.juli+"</a>"+
												"</div>"+
									"</li>";
	                    $(".goods_ul").append(html);
	                }
	
	            }
	            else if(data.status == 2){
	            		storage["user_id"] = "";
	            		toast(1,data.msg);
	            		joinLoginPage();
	            		publicnull_tip(data.msg,1);
	            }
	            else{
	                toast(1,data.msg);
	                publicnull_tip(data.msg,1);
	            }
	        }
	    });
	}
	
/*
* 提示修改
* */
function publicnull_tip(content,state) {
    var publicnull_tip = document.getElementById("publicnull_tip");
    if (state == 0){
        publicnull_tip.style.display = "none";
    }
    else{
        document.getElementById("request_tip").innerText = content;
        publicnull_tip.style.display = "block";
    }
}
