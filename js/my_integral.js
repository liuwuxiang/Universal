var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    getUserBaseInformation();
		getIntegralDetail();
		// 绑定提现按钮事件
		mui('#buts').on('tap', '#integral_forward', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/integral_forward.html",
			   id: "integral_forward.html",
			   extras:{},
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
		
		// 绑定商家积分按钮事件
		mui('#business_integral_button').on('tap', '#business_integral', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/wnk_business_integral_list.html",
			   id: "wnk_business_integral_list.html",
			   extras:{},
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
		
		// 绑定赠送积分按钮事件
		mui('#send_integral_button').on('tap', '#send_integral', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/wnk_send_integral_list.html",
			   id: "wnk_send_integral_list.html",
			   extras:{},
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

//获取用户基础信息
function getUserBaseInformation() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserBaseInformation",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
				setUserInformation(data);
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

//获取积分明细
function getIntegralDetail() {
    $("#list li").remove();
    publicnull_tip("暂无数据",1);
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getIntegralCount",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data;
                if(list.length <= 0){
                		publicnull_tip("暂无数据",1);
                }
                else{
                		publicnull_tip("关闭提示",0);
	                	for (var index = 0;index < list.length - 1;index++){
	                    var obj = list[index];
	                    var price = obj.type === 0 ? "+"+obj.transaction_integral_number:"-"+obj.transaction_integral_number;
	                    var html = "<li class=\"item\">"+
			        "<div class=\"left\">"+
			          "<span class=\"name\">"+obj.name+"</span>"+
			          "<span class=\"time\">"+obj.transaction_date+"</span>"+
			        "</div>"+
			        "<div class=\"right\">"+
			          "<span class=\"num down\">"+price+"</span>"+
			        "</div>"+
			      "</li>";
	                    $("#list").append(html);
	                }
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
* 设置用户信息
* */
function setUserInformation(data) {
    var user_integral = data.data.user_integral;
    var send_integral = data.data.send_integral;
    var business_integral = data.data.business_integral;
    document.getElementById("user_integral").innerText = user_integral;
    document.getElementById("send_integral").innerText = send_integral;
    document.getElementById("business_integral").innerText = business_integral;

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