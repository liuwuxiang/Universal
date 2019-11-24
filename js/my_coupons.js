var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	
	mui.ready(function() {
//		var self = plus.webview.currentWebview();
	    getMyCouponsNew();
	    // 绑定优惠券列表点击事件
		mui('#my_materiel_ul').on('tap', 'li', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_list.html",
			   id: "business_list.html",
			   extras:{
				     type_id:type_id
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

//获取我的优惠券
function getMyCouponsNew() {
    toast(2,"打开loading");
    publicnull_tip("暂无数据",1);
    $("#my_materiel_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getMyCouponsNew",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                var list = data.data;
                if (list.length <= 0){
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",1);
                }
                else{
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",0);
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        var html = "<li class=\"business_type_ul_li\" id=\""+obj.business_type_id+"\">"+
						              "<div class=\"business_type_li_div\">"+
						                  "<img src=\""+obj.background_photo+"\" class=\"li_background_img\"/>"+
						                  "<div class=\"li_top_div\">"+
						                      "<img src=\""+obj.logo_photo_id+"\"/>"+
						                      "<a>"+obj.materiel_name+"</a>"+
					                      "</div>"+
					                      "<a class=\"surplus_tip2\">剩余:"+obj.surplus_number+"张</a>"+
					                  "</div>"+
				    	              "</li>";
                        $("#my_materiel_ul").append(html);
                    }
                }
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(3,"关闭Loading");
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
        publicnull_tip.style.display = "block";
    }
}