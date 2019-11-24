var storage = window.localStorage;

var type_id = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    type_id = self.type_id;//获得参数
	    getGoodsInfo();
	    
	    // 绑定积分商品列表点击事件
		mui('#recommrnd_div').on('tap', 'a', function() {
			var goods_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/integral_goods_detail.html",
			   id: "integral_goods_detail.html",
			   extras:{
				     goods_id:goods_id
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

//获取商品
function getGoodsInfo() {
    toast(2,"打开loading");
    $("#recommrnd_div a").remove();
    publicnull_tip("暂无数据",1);
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getGoodsByTypeId",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"type_id":type_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                publicnull_tip("关闭",0);
                var list = data.data;
                for (var index = 0;index < list.length;index++){
                    var obj = list[index];
                    var html = "<a id=\""+obj.id+"\" class=\"item\">"+
						        "<span class=\"img\"><img src=\""+obj.img+"\" alt=\"\"  onerror=\"this.src='../images/img_goods.jpg'\"></span>"+
						        "<p class=\"name\">"+obj.name+"</p>"+
						        "<p class=\"price\" style=\"color: #fc9153;\">"+obj.price+"<span style=\"color: black;text-decoration:none;\">积分</span></p>"+
						      "</a>";
                    $("#recommrnd_div").append(html);
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
