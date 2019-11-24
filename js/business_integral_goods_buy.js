var storage = window.localStorage;

var goods_id = -1;
var business_id = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    goods_id = self.goods_id;//获得参数
	    business_id = self.business_id;
	    getCommodityInformation();
	    // 绑定确认订单按钮点击事件
		mui('.pay-bar-cell1').on('tap', 'div', function() {
			document.activeElement.blur(); 
			dataSubmit();
		})
	})
})

//获取商品信息
function getCommodityInformation() {
    toast(2,"打开loading");
    $("#recommrnd_div a").remove();
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getIntegralByIdAndWnk",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"business_id":business_id,"goods_id":goods_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                $('#top_img').attr("src", data.data.imgPath + data.data.img);
                $('#goods_price').html(data.data.price);

                $('input[name=userId]').val(storage["user_id"]);
                $('input[name=goodsId]').val(data.data.id);
                $('input[name=price]').val(data.data.price);
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

//数据判断
function dataCheck(){
		var userName = $('input[name=username]').val();
        var phone    = $('input[name=phone]').val();
        if (userName === undefined || userName === '') {
            mui.alert('联系人不能为空', '提示');
            return false;
        }
        if (!(/^1[34578]\d{9}$/.test(phone))){
            mui.alert('请输入正确的手机号码', '提示');
            return false;
        }
        if (phone === undefined || phone === '') {
            mui.alert('联系人手机号不能为空', '提示');
            return false;
        }
        return true;
}


//数据提交
function dataSubmit(){
	if (!dataCheck()) {
        return;
    }
	toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/wx/v1.0.0/addGoodsOrderWnk",
        type:"POST",
        dataType : 'json',
        data:{
			"user_id":storage["user_id"],
        	"goods_id": $('input[name=goodsId]').val(),
            "price"   : $('input[name=price]').val(),
            "username": $('input[name=username]').val(),
            "phone"   : $('input[name=phone]').val(),
            "business_id" : business_id,
        },
        success:function(data){
			console.log(JSON.stringify(data));
            if (data.status == 0){
                toast(3,"关闭");
                mui.alert('下单成功', '提示');
                //back();
				plus.webview.close("business_integral_goods_buy.html",'none');
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(1,data.msg);
                mui.alert(data.msg, '提示');
            }
        }
    });
}
