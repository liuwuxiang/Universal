var storage = window.localStorage;


//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		getCardAuthenticationInformation();
		// 绑定修改按钮点击事件
		mui('body').on('tap', '.set_button', function() {
			submitCardAuthentication();
		})
  })
	
	
	//获取车主认证提交
	function submitCardAuthentication() {
	    var card_number = document.getElementById("card_number").value;
	    var mobile = document.getElementById("car_owner_mobile").value;
	    var real_name = document.getElementById("car_owner_name").value;
	    if (card_number == undefined || card_number == ""){
	        toast(1,"请输入车牌号");
	    }
	    else if (mobile == undefined || mobile == ""){
	        toast(1,"请输入车主手机号");
	    }
	    else if (real_name == undefined || real_name == ""){
	        toast(1,"请输入车辆登记真实姓名");
	    }
	    else{
	        toast(2,"开启loading");
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/submitCardAuthentication",
	            type:"POST",
	            dataType : 'json',
	            data:{"card_number":card_number,"mobile":mobile,"real_name":real_name,"user_id":storage["user_id"]},
	            success:function(data){
	                if (data.status == 0){
	                    toast(0,"提交成功");
	                    back();
	
	                }
	                else{
	                    toast(1,data.msg);
	                }
	            },
	        });
	    }
	
	}
})


//获取车主认证信息
function getCardAuthenticationInformation() {
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getCardAuthenticationInformation",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭Loading");
                document.getElementById("card_number").value = data.data.card_number;
                document.getElementById("car_owner_mobile").value = data.data.mobile;
                document.getElementById("car_owner_name").value = data.data.real_name;

            }
            else{
                toast(1,data.msg);
            }
        },
    });
}