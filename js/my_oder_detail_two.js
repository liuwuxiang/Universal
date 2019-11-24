var storage = window.localStorage;

var order_id = -1;
var business_id = -1;
var order_no = "";
var order_time = "";
var order_price = "";


mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    order_id = self.order_id;//获得参数
	    plus.webview.close("goods_buy_two.html","none");
	    $("#qr_code_img").hide();
        $("#make_img").hide();
	    getOrderDetail();
	    
	    // 从别个页面返回时触发
		window.addEventListener('keydownClose', function(event) {
			getOrderDetail();
		});
	    
	    // 使用记录按钮事件
		document.getElementById('make_record').addEventListener('tap', makeRecord);
		// 退款记录按钮事件
		document.getElementById('refund_record').addEventListener('tap', refundRecord);
		// 申请退款按钮事件
		document.getElementById('apply_refund').addEventListener('tap', applyRefund);
		
		//进入使用记录页面
		function makeRecord(){
			mui.openWindow({
				url: "../html/order_make_record.html",
				id: "order_make_record.html",
				extras:{
					order_id:order_id
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
		}
		
		//进入退款记录页面
		function refundRecord(){
			mui.openWindow({
				url: "../html/refund_record.html",
				id: "refund_record.html",
				extras:{
					order_id:order_id
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
		}
		
		//进入申请退款页面
		function applyRefund(){
			//订单商家名称
			var business_name = document.getElementById('business_name').innerText;
			//订单商品名称
			var goods_name = document.getElementById('commodity_number_tag').innerText;
			var order_name = business_name + goods_name;
			
			mui.openWindow({
				url: "../html/order_refund.html",
				id: "order_refund.html",
				extras:{
					order_id:order_id,
					order_name:order_name
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
		}
  })
})

//获取订单详情
function getOrderDetail() {
    toast(2,"打开loading");
    $("#commodities_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v2.0.0/wnkBuyOrderDetail",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"order_id":order_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data.commodity_list;
                var order_state = data.data.state;
                document.getElementById("business_name").innerText = data.data.business_name;
                document.getElementById("commodity_number_tag").innerText = "商品("+list.length+")";
                if(order_state == 1){
                		$("#qr_code_img").show();
                		$("#make_img").hide();
                		document.getElementById("qr_code_img").src = data.data.order_qrcode;
                }
                else if(order_state == 2){
                		$("#qr_code_img").hide();
                		$("#make_img").show();
                }
                else{
                		$("#qr_code_img").show();
                		$("#make_img").hide();
                }
                document.getElementById("order_price").innerText = "￥"+data.data.amount;
                var general_integral = data.data.general_integral;
                var send_integral = data.data.send_integral;
                var coupon = data.data.coupon;
                if(general_integral > 0.00){
                		document.getElementById("general_integral").innerText = "-"+general_integral;
                }
                else{
                		$("#general_integral_li").hide();
                }
                if(send_integral > 0.00){
                		document.getElementById("send_integral").innerText = "-"+send_integral;
                }
                else{
                		$("#send_integral_li").hide();
                }
                if(coupon > 0){
                		document.getElementById("coupon").innerText = "-"+coupon+"张";
                }
                else{
                		$("#coupon_li").hide();
                }
                if(data.data.state != 1){
                		$("#apply_refund").hide();
                }
                document.getElementById("sj_pay_amount").innerText = "￥"+data.data.cash_amount;
                document.getElementById("order_no_tag").innerText = "订单号："+data.data.order_no;
                document.getElementById("line_order_date").innerText = "下单时间："+data.data.submit_time_str;
                document.getElementById("pay_date").innerText = "付款时间："+data.data.pay_time_str;
                document.getElementById("pay_way").innerText = "支付方式："+data.data.pay_way_str;
                
                business_id = data.data.business_id;
                order_no = data.data.order_no;
                order_time = data.data.submit_time_str;
                order_price = data.data.amount;
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