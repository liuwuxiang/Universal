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
		initViewWebViewData();
		
		// 帮助说明点击事件
		mui('.head').on('tap', '#help_icon', function() {
			toast(2, "开启loading");
			jQuery.support.cors = true;
			$.ajax({
				url: Main.url + '/app/v1.0.0/getIntegralHelpContent',
				type: "POST",
				dataType: 'json',
				data: {
					"type": 7
				},
				success: function(data) {
					toast(3, "关闭loading");
					if(data.status == 0) {
						var open_type = data.data.open_type;
						if(open_type == 0){
							mui.openWindow({
							   url: "../html/integral_help.html",
							   id: "integral_help.html",
							   extras: {
									'title': '通用积分说明帮助',
									'type' : 7
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
						}
						else{
							showWithWaiting(data.data.content);
						}
					} else if(data.status == 2) {
						mMain.gotoLogin();
					} else {
						mui.openWindow({
						   url: "../html/integral_help.html",
						   id: "integral_help.html",
						   extras: {
								'title': '通用积分帮助说明',
								'type' : 7
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
					}
				},
			});
		});
		
		// 绑定充值按钮事件
		mui('#buts').on('tap', '#integral_recharge', function() {
			var order_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/integral_recharge.html",
			   id: "integral_recharge.html",
			   extras:{
				     type:1
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
	//		
	//		window.event.cancelBubble = true; //停止冒泡
	//		window.event.returnValue = false; //阻止事件的默认行为
	//		var order_id = this.getAttribute('id');
	//		mui.openWindow({
	//		   url: "../html/integral_exchange.html",
	//		   id: "integral_exchange.html",
	//		   extras:{
	//			     type:1
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
		
	//	document.getElementById("general_integral_forward").addEventListener("click",function (){
	//		mui.openWindow({
	//		   url: "../html/general_integral_forward.html",
	//		   id: "general_integral_forward.html",
	//		   extras:{},
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
	//	});
		// 绑定提现按钮事件
		mui('#buts').on('tap', '#general_integral_forward', function() {
			window.event.cancelBubble = true; //停止冒泡
			window.event.returnValue = false; //阻止事件的默认行为
			mui.openWindow({
			   url: "../html/general_integral_forward.html",
			   id: "general_integral_forward.html",
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

/*
 *	列表项初始化
 * type=0:消费明细，type=1：充值明细，type=2：提现明细
 * */
function listOptionInit(type){
	if(type == 0){
		document.getElementById("xf_item").setAttribute("class","item sel"); 
		document.getElementById("cz_item").setAttribute("class","item"); 
		document.getElementById("tx_item").setAttribute("class","item");
		getGeneralConsumptionDetail();
	}
	else if(type == 1){
		document.getElementById("xf_item").setAttribute("class","item"); 
		document.getElementById("cz_item").setAttribute("class","item sel"); 
		document.getElementById("tx_item").setAttribute("class","item");
		getGeneralRechargeDetail();
	}
	else{
		document.getElementById("xf_item").setAttribute("class","item"); 
		document.getElementById("cz_item").setAttribute("class","item"); 
		document.getElementById("tx_item").setAttribute("class","item sel");
		getGeneralWitharthDetail();
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
                var general_integral = data.data.general_integral;
				document.getElementById("general_integral_balance").innerText = general_integral;
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


//获取通用积分消费明细
function getGeneralConsumptionDetail() {
    toast(2,"打开loading");
    publicnull_tip("暂无数据",1);
    $("#list li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserGenerallntegralExpenditureByUser",
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
            		storage["user_id"] = "";
            		toast(1,data.msg);
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

//获取通用积分充值明细
function getGeneralRechargeDetail() {
    toast(2,"打开loading");
    publicnull_tip("暂无数据",1);
    $("#list li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserGenerallntegralRechargeIncome",
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
            		storage["user_id"] = "";
            		toast(1,data.msg);
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

//获取通用积分提现明细
function getGeneralWitharthDetail() {
    toast(2,"打开loading");
    publicnull_tip("暂无数据",1);
    $("#list li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserGenerallntegralWithdrawByUser",
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
            		storage["user_id"] = "";
            		toast(1,data.msg);
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
