var storage = window.localStorage;
var search_content = "";

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    search_content = self.search_content;//获得参数
	    console.log("内容："+search_content);
	    publicnull_tip("暂无数据",1);
	    //模糊查询商家
		function fuzzyQueryBusiness() {
		    $("#business_list_ul li").remove();
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/fuzzyQueryBusiness",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"content":search_content,"lat":storage["lat"],"longt":storage["longt"]},
		        success:function(data){
		            if (data.status == 0){
		                toast(3,"关闭loading");
		                publicnull_tip("暂无数据",0);
		                var list = data.data;
		                for (var index = 0;index < list.length;index++){
		                    var obj = list[index];
		                    var html = "<li id=\""+obj.business_id+"\">"+
		  					"<div class=\"li_left_div\">"+
		  						"<img src=\""+obj.fm_photo+"\"  onerror=\"this.src='../images/logo.jpg'\"/>"+
		  					"</div>"+
		  					"<div class=\"li_right_div\">"+
		  						"<a>"+obj.store_name+"</a>"+
		  						"<a>"+obj.juli+"</a>"+
		  						"<a>"+obj.store_describe+"</a>"+
		  						"<a>￥"+obj.min_price+"</a>"+
  								"<a>已售"+obj.sale+"</a>"+
		  					"</div>"+
		  				"</li>";
		                    $("#business_list_ul").append(html);
		                }
		
		            }
		            else if(data.status == 2){
		            		storage["user_id"] = "";
		            		toast(1,data.msg);
		            		publicnull_tip(data.msg,1);
		            		joinLoginPage();
		            }
		            else{
		                toast(1,data.msg);
		                publicnull_tip(data.msg,1);
		            }
		        }
		    });
		}
		
		fuzzyQueryBusiness();
		
		 // 绑定商户列表点击事件
		mui('#business_list_ul').on('tap', 'li', function() {
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