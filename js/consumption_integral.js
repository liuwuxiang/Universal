var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    // tab菜单顶部固定
		pubtabmenu("pubtabmenu",0.88);
		listOptionInit(0);
		// 绑定充值按钮事件
		mui('#buts').on('tap', '#integral_recharge', function() {
			var order_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/integral_recharge.html",
			   id: "integral_recharge.html",
			   extras:{
				     type:0
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
		
		// 绑定兑换按钮事件
	//	mui('#buts').on('tap', '#integral_exchange', function() {
	//		var order_id = this.getAttribute('id');
	//		mui.openWindow({
	//		   url: "../html/integral_exchange.html",
	//		   id: "integral_exchange.html",
	//		   extras:{
	//			     type:0
	//			},
	//		   styles: {
	//		    top: '0px',
	//		    bottom: '0px',
	//		   },
	//		   createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	//		   show: {
	//		    autoShow: true, //页面loaded事件发生后自动显示，默认为true
	//		    aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
	//		    duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
	//		   },
	//		   waiting: {
	//		    autoShow: true, //自动显示等待框，默认为true
	//		    title: '正在加载...', //等待对话框上显示的提示内容
	//		   }
	//		});
	//	})
  	})
	
})

/*
 *	列表项初始化
 * type=0:消费明细，type=1：充值明细
 * */
function listOptionInit(type){
	if(type == 0){
		document.getElementById("xfmx_item").setAttribute("class","item sel"); 
		document.getElementById("czmx_item").setAttribute("class","item");
		getConsumptionDetail();
	}
	else{
		document.getElementById("xfmx_item").setAttribute("class","item"); 
		document.getElementById("czmx_item").setAttribute("class","item sel");
		getRechargeDetail();
	}
}

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
                var consumption_integral = data.data.consumption_integral;
				document.getElementById("consumption_integral_balance").innerText = consumption_integral;
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

/*
* 获取消费明细
* */
function getConsumptionDetail() {
    toast(2,"打开loading");
    publicnull_tip("暂无数据",1);
    $("#list li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserConsumptionIntegeralExpenditure",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                var list = data.data.list;
                if (list.length <= 0){
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",1);
				}
				else{
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",0);
                    for (var index = 0;index < list.length; index++){
                    	var obj = list[index];
                            var html = "<li class=\"item\">"+
	        								"<div class=\"left\">"+
	          							"<span class=\"name\">"+obj.name+"</span>"+
	          							"<span class=\"time\">"+obj.expenditure_date+"</span>"+
	        								"</div>"+
	        								"<div class=\"right\">"+
	          							"<span class=\"num down\">-"+obj.expenditure_amount+"</span>"+
	        								"</div>"+
	      								"</li>";
                        $("#list").append(html);
					}
				}
				getUserBaseInformation();
            }
            else if(data.status == 2){
            		toast(3,"关闭Loading");
            		storage["user_id"] = "";
            		joinLoginPage();
            }
            else{
                toast(3,"关闭Loading");
                publicnull_tip(data.msg,1);
				getUserBaseInformation();
            }
        },
    });
}


//获取充值明细
function getRechargeDetail() {
    toast(2,"打开loading");
    publicnull_tip("暂无数据",1);
    $("#list li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserConsumptionIntegeralRechargeIncome",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                var list = data.data.list;
                if (list.length <= 0){
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",1);
                }
                else{
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",0);
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                            var html = "<li class=\"item\">"+
	        								"<div class=\"left\">"+
	          							"<span class=\"name\">"+obj.name+"</span>"+
	          							"<span class=\"time\">"+obj.income_date+"</span>"+
	        								"</div>"+
	        								"<div class=\"right\">"+
	          							"<span class=\"num down\">+"+obj.income_amount+"</span>"+
	        								"</div>"+
	      								"</li>";
                        $("#list").append(html);
                    }
                }
				getUserBaseInformation();
            }
            else if(data.status == 2){
            		toast(3,"关闭Loading");
            		storage["user_id"] = "";
            		joinLoginPage();
            }
            else{
                toast(3,"关闭Loading");
                publicnull_tip(data.msg,1);
				getUserBaseInformation();
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

