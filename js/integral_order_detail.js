var storage = window.localStorage;

var order_no = "";

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    order_no = self.order_id;//获得参数
	    console.log("-----"+order_no);
	    getOrderDetail();
  })
})

//获取订单详情
function getOrderDetail() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getOrderInfoById",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"id":order_no},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                		$('.top_div > img').attr('src', data.data.img);
                    $('#goods_price').html(data.data.price);
                    $('#order_no').html(data.data.order_id);
                    switch (data.data.status) {
                        case 0:
                            $('#status').html("已付款");
                            break;
                        case 1:
                            $('#status').html("已发货");
                            break;
                        case 2:
                            $('#status').html("交易完成");
                            break;
                    }
                    $('#express_name').html(data.data.express_name);
                    $('#express_id').html(data.data.express_id);
                    $('#username').html(data.data.username);
                    $('#phone').html(data.data.phone);
                    $('#address').html(data.data.address);
                    $('#line_time').html(data.data.startTime_str);
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(1,data.msg);
            }
        }
    });
}