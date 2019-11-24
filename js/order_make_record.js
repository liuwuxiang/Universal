var storage = window.localStorage;
var order_id = -1;
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    order_id = self.order_id;//获得参数
	    getOrderMakeRecord();
  })
})

//获取订单使用记录
function getOrderMakeRecord() {
    toast(2,"打开loading");
    $(".commodities_ul li").remove();
    publicnull_tip("暂无数据",1);
    $.ajax({
        url:Main.url + "/app/v2.0.0/wnkOrderMakeRecord",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"order_id":order_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                publicnull_tip("关闭提示",0);
                var list = data.data;
                for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        var html = "<li>"+
					  					"<a>使用时间:</a>"+
					  					"<span>"+obj.make_date_str+"</span>"+
					  					"<a>使用数量:</a>"+
					  					"<span>"+obj.make_number+"件</span>"+
					  				"</li>";
                        $(".commodities_ul").append(html);
                }
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	            publicnull_tip(data.msg,1);
	        }
            else{
                toast(1,data.msg);
                publicnull_tip(data.msg,1);
            }
        },
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