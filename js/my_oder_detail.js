var storage = window.localStorage;

var order_id = -1;
var business_id = -1;
var type = -1;
var order_no = "";
var order_time = "";
var order_price = "";


mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    order_id = self.order_id;//获得参数
    		type = self.type;//获得参数
	    if (type == 0){
        		getOrderDetail();
	    }
	    else{
	        getWnkOrderDetail();
	    }
	    
	    // 绑定支付按钮点击事件
	mui('body').on('tap', '.pay_button', function() {
		var type_id = this.getAttribute('id');
		mui.openWindow({
		   url: "../html/my_order_pay.html",
		   id: "my_order_pay.html",
		   extras:{
			     "order_no":order_no,
			     "order_time":order_time,
			     "order_price":order_price
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

//获取订单详情
function getOrderDetail() {
    toast(2,"打开loading");
    $("#commodities_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/wnkBuyOrderDetail",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"order_id":order_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data.commodity_list;
                document.getElementById("business_name").innerText = data.data.business_name;
                document.getElementById("commodity_number_tag").innerText = "商品("+list.length+")";
                document.getElementById("qr_code_img").src = data.data.order_qrcode;
                document.getElementById("line_time_tag").innerText = "下单时间："+data.data.submit_time_str;
                document.getElementById("order_no_tag").innerText = "订单号：NO."+data.data.order_no;
                document.getElementById("count_amount_tag").innerText = "总价：￥"+data.data.amount;
                business_id = data.data.business_id;
                order_no = data.data.order_no;
                order_time = data.data.submit_time_str;
                order_price = data.data.amount;
                if(data.data.state == 0){
                		document.getElementById("pay_button").style.display = "block";
                }
                else{
                		document.getElementById("pay_button").style.display = "none";
                }
                for (var index = 0;index < list.length; index++){
                    var obj = list[index];
                    var specifications_name = obj.specifications_name;
                    if (specifications_name == undefined){
                        specifications_name = "";
                    }
                    var html = "<li>"+
                    "<a class=\"commodity_name_tag\">"+obj.commodity_name+"("+specifications_name+")</a>"+
                        "<a class=\"commodity_number_tag\">x"+obj.buy_number+"</a>"+
                        "<a class=\"price_tag\">"+obj.count_amount+"</a>"+
                        "</li>";
                    $("#commodities_ul").append(html);
                }
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

//获取万能卡权益订单详情
function getWnkOrderDetail() {
    toast(2,"打开loading");
    $("#commodities_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getWnkOrderDetail",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"order_id":order_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var guige_name = data.data.guige_name;
                if (guige_name == undefined){
                    guige_name = "";
                }
                document.getElementById("business_name").innerText = data.data.store_name;
                document.getElementById("commodity_number_tag").innerText = "商品("+data.data.make_number+")";
                document.getElementById("qr_code_img").src = data.data.qr_code;
                document.getElementById("line_time_tag").innerText = "下单时间："+data.data.line_date;
                document.getElementById("order_no_tag").innerText = "订单号：NO."+data.data.order_no;
                document.getElementById("count_amount_tag").innerText = "总价：￥0";
                business_id = data.data.business_id;
                var html = "<li>"+
                    "<a class=\"commodity_name_tag\">"+data.data.commodity_name+"("+guige_name+")</a>"+
                    "<a class=\"commodity_number_tag\">x"+data.data.make_number+"</a>"+
                    "<a class=\"price_tag\">0</a>"+
                    "</li>";
                $("#commodities_ul").append(html);
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