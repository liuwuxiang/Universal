var storage = window.localStorage;

//积分类型(0-平台积分,1-兑换积分,2-赠送积分)
var helpIntegralType = 0;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    getUserBaseInformation(0);
	    initViewWebViewData();
	    
	    // 帮助说明点击事件
		mui('.head').on('tap', '#help_icon', function() {
			var helpType = 0;
			var helpTitle = "";
			if(helpIntegralType == 0){
				helpTitle = "平台积分说明帮助";
				helpType = 0;
			}
			else if(helpIntegralType == 1){
				helpTitle = "兑换积分说明帮助";
				helpType = 1;
			}
			else if(helpIntegralType == 2){
				helpTitle = "赠送积分说明帮助";
				helpType = 2;
			}
			toast(2, "开启loading");
			jQuery.support.cors = true;
			$.ajax({
				url: Main.url + '/app/v1.0.0/getIntegralHelpContent',
				type: "POST",
				dataType: 'json',
				data: {
					"type": helpType
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
									'title': helpTitle,
									'type' : helpType
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
								'title': helpTitle,
								'type' : helpType
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
	    
	    // 绑定平台积分商城按钮事件
		mui('.platform_integral_btns').on('tap', '#platform_integral_mall', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/integral_mall.html",
			   id: "integral_mall.html",
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
	    
	    // 绑定平台积分兑换按钮事件
		mui('.platform_integral_btns').on('tap', '#integral_exchage', function() {
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
		
		
		// 绑定商家积分商城兑换按钮事件
		mui('.exchange_integral_bnts').on('tap', '#business_integral_mall', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_integral_mall.html",
			   id: "business_integral_mall.html",
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
	    
	    // 绑定顶部选项卡点击事件
		mui('.mui-segmented-control').on('tap', 'a', function() {
			var name = this.getAttribute('name');
			if(name == 'platform_integral'){
				$("#platform_integral_div").show();
				$("#exchange_integral_div").hide();
				$("#send_integral_div").hide();
				helpIntegralType = 0;
				setTimeout(function(){ 
			    		getUserBaseInformation(0);
			    }, 100);
			}
			else if(name == 'exchange_integral'){
				$("#platform_integral_div").hide();
				$("#exchange_integral_div").show();
				$("#send_integral_div").hide();
				helpIntegralType = 1;
				setTimeout(function(){ 
			    		getUserBaseInformation(1);
			    }, 100);
			}
			else{
				$("#platform_integral_div").hide();
				$("#exchange_integral_div").hide();
				$("#send_integral_div").show();
				helpIntegralType = 2;
				setTimeout(function(){ 
			    		getUserBaseInformation(2);
			    }, 100);
			}
		})
		
		// 绑定赠送积分商户列表切换事件
		mui('#send_integral_business_list_ul').on('tap', 'li', function(e) {
			var business_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_detail.html",
			   id: "business_detail.html",
			   extras:{
				     business_id:business_id
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
			e.stopPropagation();//阻止事件冒泡
		})
		
		// 绑定赠送积分明细按钮事件
		mui('#send_integral_business_list_ul').on('tap', 'li>.li_right_div>.li_integral_balance_div>.integral_detail', function(e) {
			var business_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/wnk_send_integral_detail.html",
			   id: "wnk_send_integral_detail.html",
			   extras:{
				     business_id:business_id
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
			e.stopPropagation();//阻止事件冒泡
		})
		
		// 绑定兑换积分商户列表切换事件
		mui('#exchange_integral_business_list_ul').on('tap', 'li', function(e) {
			var business_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_integral_store.html",
			   id: "business_integral_store.html",
			   extras:{
				     business_id:business_id
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
			e.stopPropagation();//阻止事件冒泡
		})
		
		// 绑定兑换积分明细按钮事件
		mui('#exchange_integral_business_list_ul').on('tap', 'li>.li_right_div>.li_integral_balance_div>.integral_detail', function(e) {
			var business_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_integral_detail.html",
			   id: "business_integral_detail.html",
			   extras:{
				     business_id:business_id
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
			e.stopPropagation();//阻止事件冒泡
		})
  	})
})


/*
 *	平台积分列表项初始化
 * type=0:收入明细，type=1：支出明细
 * */
function listOptionInit(type){
	if(type == 0){
		$("#income_item").addClass("sel");
		$("#zc_item").removeClass("sel");
		getPlatformIntegralDetail(0);
	}
	else{
		$("#income_item").removeClass("sel");
		$("#zc_item").addClass("sel");
		getPlatformIntegralDetail(1);
	}
}

//获取平台积分详细记录明细
function getPlatformIntegralDetail(type) {
	toast(2,"打开loading");
    $("#platform_list li").remove();
    publicnull_tip("暂无数据",1);
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getIntegralCountByUserIdAndType",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"type":type},
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
	                    $("#platform_list").append(html);
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



//获取用户基础信息(type=0:平台积分,type=1:兑换积分,type=2:赠送积分)
function getUserBaseInformation(type) {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserBaseInformation",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                if(type == 0){
                		document.getElementById("platform_integral_balance").innerText = data.data.user_integral;
                		listOptionInit(0);
                }
				else if(type == 1){
					document.getElementById("exchange_integral_balance").innerText = data.data.business_integral;
					getUserExchangeIntegralBusiness();
				}
				else if(type == 2){
					document.getElementById("send_integral_balance").innerText = data.data.send_integral;
					getUserSendIntegralBusiness();
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
        },
    });
}

//获取用户的积分商家(用户在商家处有积分的)
function getUserExchangeIntegralBusiness() {
	toast(2,"开启Loading");
    $("#exchange_integral_business_list_ul li").remove();
    publicnull_tip("暂无数据",1);
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserIntegralBusiness",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                publicnull_tip("关闭提示",0);
                var list = data.data;
                for (var index = 0;index < list.length;index++){
                    var obj = list[index];
                    var html = "<li id=\""+obj.business_id+"\">"+
				  					"<div class=\"li_left_div\">"+
				  						"<img src=\""+obj.fm_photo+"\"/>"+
				  					"</div>"+
				  					"<div class=\"li_right_div\">"+
				  						"<a>"+obj.store_name+"</a>"+
				  						"<a>"+obj.store_describe+"</a>"+
				  						"<div class=\"li_integral_balance_div\">"+
				  							"<a>"+obj.integral+"积分</a>"+
				  							"<a class=\"integral_detail\" id=\""+obj.business_id+"\">积分明细</a>"+
				  						"</div>"+
				  					"</div>"+
				  				"</li>";
                    $("#exchange_integral_business_list_ul").append(html);
                }

            }
            else if(data.status == 2){
            		storage["user_id"] = "";
            		toast(1,data.msg);
            		joinLoginPage();
            }
            else{
                toast(1,data.msg);
                publicnull_tip(data.msg,1);
            }
        }
    });
}

//获取用户的赠送积分商家(用户在商家处有赠送积分的)
function getUserSendIntegralBusiness() {
	toast(2,"开启Loading");
    $("#send_integral_business_list_ul li").remove();
    publicnull_tip("暂无数据",1);
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserSendIntegralBusiness",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                publicnull_tip("关闭提示",0);
                var list = data.data;
                for (var index = 0;index < list.length;index++){
                    var obj = list[index];
                    var html = "<li id=\""+obj.business_id+"\">"+
				  					"<div class=\"li_left_div\">"+
				  						"<img src=\""+obj.fm_photo+"\"/>"+
				  					"</div>"+
				  					"<div class=\"li_right_div\">"+
				  						"<a>"+obj.store_name+"</a>"+
				  						"<a>"+obj.store_describe+"</a>"+
				  						"<div class=\"li_integral_balance_div\">"+
				  							"<a>"+obj.integral+"现金劵</a>"+
				  							"<a class=\"integral_detail\" id=\""+obj.business_id+"\">明细</a>"+
				  						"</div>"+
				  					"</div>"+
				  				"</li>";
                    $("#send_integral_business_list_ul").append(html);
                }

            }
            else if(data.status == 2){
            		storage["user_id"] = "";
            		toast(1,data.msg);
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