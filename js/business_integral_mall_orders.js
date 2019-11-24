var storage = window.localStorage;

//使用类型(0-总订单合集,1-商家订单合集)
var make_type = 0;
//当make_type为1时的商家id
var business_id_two = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    var make_type = self.make_type;//获得参数
	    business_id_two = self.business_id;//获得参数
	   
	    if(make_type == 0){
	    		getOrders();
	    }
	    else{
	    		getUserInBusinessOrders();
	    }
	    
	    // 绑定列表切换事件
		mui('#order_in_progress_ul').on('tap', 'li', function() {
			var order_id = this.getAttribute('id');
			var business_id = this.getAttribute('name');
			mui.openWindow({
			   url: "../html/business_integral_mall_orders_detail.html",
			   id: "business_integral_mall_orders_detail.html",
			   extras:{
				     order_id:order_id,
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

//获取订单
function getOrders() {
	publicnull_tip("暂无数据",1);
    toast(2,"打开loading");
    $("#order_in_progress_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getWnkBusinessIntegralMallOrders",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
            		publicnull_tip("暂无数据",0);
                toast(3,"关闭loading");
                var img_ph = data.msg;
                var list = data.data;
                for (var index = 0;index < list.length - 1;index++){
                    var status;
                       switch (list[index].status) {
                           case 0:
                               status = "已支付";
                               break;
                           case 1:
                               status = "已完成";
                               break;
                       }
                    var html = "<li class=\"order_li\" id=\""+data.data[index].order_id+"\" name=\""+data.data[index].business_id+"\">"+
	  							"<div class=\"li_top_div\">"+
	  							"<a class=\"order_no\">下单时间：<span>"+data.data[index].creation_time_str+"</span></a>"+
	  							"<a class=\"order_status\">"+status+"</a>"+
	  							"</div>"+
	  							"<div class=\"goods_div\">"+
	  							"<img src=\""+img_ph+data.data[index].img+"\"/>"+
	  							"<div class=\"goods_information_div\">"+
	  							"<a>"+data.data[index].goods_name+"</a>"+
	  							"<a>"+data.data[index].business_name+"</a>"+
	  							"</div>"+
	  							"</div>"+
	  							"<div class=\"li_bottom_div\">"+
	  							"<a>共<span>1</span>件商品,实付<span>"+data.data[index].price+"</span>积分</a>"+
	  							"<a>订单详细</a>"+
	  							"</div>"+
	  							"</li>";
                    $("#order_in_progress_ul").append(html);
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

//获取用户在商家处的订单
function getUserInBusinessOrders() {
	publicnull_tip("暂无数据",1);
    toast(2,"打开loading");
    $("#order_in_progress_ul li").remove();
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getIntegralWnkOrderById",
        type:"POST",
        dataType : 'json',
        data:{
        		"user_id":storage["user_id"],
        		"business_id":business_id_two
        	},
        success:function(data){
            if (data.status == 0){
            		publicnull_tip("暂无数据",0);
                toast(3,"关闭loading");
                var img_ph = data.msg;
                var list = data.data;
                for (var index = 0;index < list.length - 1;index++){
                    var status;
                       switch (list[index].status) {
                           case 0:
                               status = "已支付";
                               break;
                           case 1:
                               status = "已完成";
                               break;
                       }
                    var html = "<li class=\"order_li\" id=\""+data.data[index].order_id+"\" name=\""+data.data[index].business_id+"\">"+
	  							"<div class=\"li_top_div\">"+
	  							"<a class=\"order_no\">下单时间：<span>"+data.data[index].creation_time_str+"</span></a>"+
	  							"<a class=\"order_status\">"+status+"</a>"+
	  							"</div>"+
	  							"<div class=\"goods_div\">"+
	  							"<img src=\""+data.msg+data.data[index].img+"\"/>"+
	  							"<div class=\"goods_information_div\">"+
	  							"<a>"+data.data[index].goods_name+"</a>"+
	  							"<a>"+data.data[index].business_name+"</a>"+
	  							"</div>"+
	  							"</div>"+
	  							"<div class=\"li_bottom_div\">"+
	  							"<a>共<span>1</span>件商品,实付<span>"+data.data[index].price+"</span>积分</a>"+
	  							"<a>订单详细</a>"+
	  							"</div>"+
	  							"</li>";
                    $("#order_in_progress_ul").append(html);
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