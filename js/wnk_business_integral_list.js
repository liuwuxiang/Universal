var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    getUserIntegralBusiness();
	    // 绑定商户列表切换事件
		mui('#business_list_ul').on('tap', 'li', function(e) {
			var business_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_integral_store.html",
			   id: "business_integral_store.html",
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
			e.stopPropagation();//阻止事件冒泡
		})
		
		// 绑定积分明细按钮事件
		mui('#business_list_ul').on('tap', 'li>.li_right_div>.li_integral_balance_div>.integral_detail', function(e) {
			var business_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_integral_detail.html",
			   id: "business_integral_detail.html",
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
			e.stopPropagation();//阻止事件冒泡
		})
  	})
	
})

//获取用户的积分商家(用户在商家处有积分的)
function getUserIntegralBusiness() {
	toast(2,"开启Loading");
    $("#business_list_ul li").remove();
    publicnull_tip("暂无数据",1);
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserIntegralBusiness",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
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
				  						"<a>"+obj.store_name+"</a>"+
				  						"<a>"+obj.store_describe+"</a>"+
				  						"<div class=\"li_integral_balance_div\">"+
				  							"<a>"+obj.integral+"积分</a>"+
				  							"<a class=\"integral_detail\" id=\""+obj.business_id+"\">积分明细</a>"+
				  						"</div>"+
				  					"</div>"+
				  				"</li>";
                    $("#business_list_ul").append(html);
                }

            }
            else if(data.status == 2){
            		storage["user_id"] = "";
            		toast(1,data.msg);
            		joinLoginPage();
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
