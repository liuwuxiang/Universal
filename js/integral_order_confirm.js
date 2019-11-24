var storage = window.localStorage;

var goods_id = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    goods_id = self.goods_id;//获得参数
	    getCommodityInformation();
	})
})

//获取商品信息
function getCommodityInformation() {
    toast(2,"打开loading");
    $("#recommrnd_div a").remove();
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getGoodsAndUserById",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"id":goods_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                if (data.data.user_integral < data.data.goods.price) {
                		toast(1,"积分不足");
                		back();
                }
                else{
	                	$('#top_img').attr("src", data.data.goods.img);
	                $('#goods_price').html(data.data.goods.price);
	                $('input[name=userId]').val(data.data.user_id);
	                $('input[name=goodsId]').val(data.data.goods.id);
	                $('input[name=count]').val("1");
	                $('input[name=price]').val(data.data.goods.price);
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
        }
    });
}

//数据判断
function dataCheck(){
		var userName = $('input[name=username]').val();
        var phone    = $('input[name=phone]').val();
        var address  = $('input[name=address]').val();

        console.log(/^(86)*0*13\d{9} /.test(phone));

        if (userName === undefined || userName === '') {
        		mui.alert('收件人不能为空', '提示');
            return false;
        }

        if (!(/^1[34578]\d{9}$/.test(phone))){
        		mui.alert('请输入正确的手机号码', '提示');
            return false;
        }

        if (phone === undefined || phone === '') {
        		mui.alert('收件人手机号不能为空', '提示');
            return false;
        }

        if (address === undefined || address === '') {
            mui.alert('收件地址不能为空', '提示');
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
        url:Main.url + "/wx/v1.0.0/addGoodsOrder",
        type:"POST",
        dataType : 'json',
        data:{
        		"user_id":storage["user_id"],
        		"goodsId": $('input[name=goodsId]').val(),
            "count"   : $('input[name=count]').val(),
             "price"   : $('input[name=price]').val(),
             "username": $('input[name=username]').val(),
             "phone"   : $('input[name=phone]').val(),
             "address" : $('input[name=address]').val(),
        },
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭");
                mui.alert('下单成功', '提示');
                back();
                
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
