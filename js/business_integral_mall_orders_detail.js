var storage = window.localStorage;

var order_id = "";
var business_id = "";

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    order_id = self.order_id;//获得参数
	    business_id = self.business_id;
	    getOrderDetail();
  })
})

//获取订单详情
function getOrderDetail() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getIntegralWnkOrderByGoodsId",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"business_id":business_id,"order_id":order_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                		$('.top_div > img').attr('src', data.data.goodsImgPath+data.data.img);
                    $('#goods_price').html(data.data.price);
                    $('#order_no').html(data.data.order_id);
                    var status = "";
                    switch (data.data.status) {
                        case 0:
                            status = "已支付";
                            break;
                        case 1:
                            status = "已完成";
                            break;
                    }
                    $('#status').html(status);
                    $('#express_name').html(data.data.business_name);
                    $('#username').html(data.data.username);
                    $('#phone').html(data.data.phone);
                    $('#qr_code_img').attr('src', data.data.qrcodeShowURL+data.data.qrcode)
                    $('#line_time').html(data.data.creation_time_str);
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