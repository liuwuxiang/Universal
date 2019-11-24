var storage = window.localStorage;
var pays={};
//商品价格
var commodity_price = 0;
var commodity_id = -1;
var guige_id = -1;
//用户万能卡开卡状态(-1-未开卡,0-已开卡)
var wnkState = -1;
//是否需要向商家开会员卡(0-不需要,1-需要)
var is_open_card = -1;
//是否执行万能卡权益(0-不执行,1-执行)
var make_wnk_state = -1;
//万能卡价格
var wnk_price = 0;
//是否调用微信支付(0-不调用,1-调用)
var wx_pay_state = 1;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    commodity_id = self.commodity_id;//获得参数
	    guige_id = self.guige_id;//获得参数
	    getOrderInformation();
	    
	    //获取订单信息
		function getOrderInformation() {
		    toast(2,"打开loading");
		    $.ajax({
		        url:Main.url +"/app/v1.0.0/getCommodityDetailAndGuige",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"commodity_id":commodity_id,"guige_id":guige_id},
		        success:function(data){
		            if (data.status == 0){
		                toast(3,"关闭loading");
		                document.getElementById("commodity_name").innerText = data.data.name+"("+data.data.guige_name+")";
		                document.getElementById("commodity_price").innerText = "￥"+data.data.price;
		                var user_open_card_state = data.data.user_open_card_state;
		                document.getElementById("member_price").innerText = "会员价:￥"+data.data.wnk_price;
		                if(user_open_card_state == 1){
		                		commodity_price = data.data.wnk_price;
		                		$("#member_price").show();
		                		document.getElementById("commodity_price").style.textDecoration="line-through";
		                }
		                else{
		                		commodity_price = data.data.price;
		                		$("#member_price").hide();
		                		document.getElementById("commodity_price").style.textDecoration="none";
		                }
		                document.getElementById("order_price").innerText = commodity_price;
		                
		                wnk_price = data.data.wnk_price;
		                is_open_card = data.data.is_open_card;
		                make_wnk_state = data.data.make_wnk_state;
		                wx_pay_state = data.data.wx_pay_state;
		                getUserBaseInformation();
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
		                wnkState = data.data.wnk_state;
		                if(wnkState == -1 && is_open_card == 0 && make_wnk_state == 1){
				           mui.confirm('开通万能卡购买只需'+wnk_price+"元",'优惠提示',['取消','去开通'],function(e){
								if(e.index == 0){
		//							mMain.back();
								}
								else{
									mui.openWindow({
									   url: "../html/open_member_card.html",
									   id: "open_member_card.html",
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
								}
							},'div');
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
	    
	    // 手机号+密码登陆事件
		document.getElementById('submit_pay').addEventListener('tap', userPayAction);
		//支付事件
		function userPayAction(){
			//0-微信支付,2-通用积分支付,3-消费积分支付,4-赠送积分支付,5-优惠券支付
		    var pay_way = -1;
		    var wx_pay_radio = document.getElementById("wx_pay_radio");
		    var general_integral_radio = document.getElementById("general_integral_radio");
//		    var consumption_integral_radio = document.getElementById("consumption_integral_radio");
		    var send_integral_radio = document.getElementById("send_integral_radio");
		    var coupons_radio = document.getElementById("coupons_radio");
		    if (wx_pay_radio.checked){
		        pay_way = 0;
		    }
		    if (general_integral_radio.checked){
		        pay_way = 2;
		    }
//		    else if (consumption_integral_radio.checked){
//		        pay_way = 3;
//		    }
		    else if(send_integral_radio.checked){
		    		pay_way = 4;
		    }
		    else if(coupons_radio.checked){
		    		pay_way = 5;
		    }
		
		    if (pay_way == -1){
		        toast(1,"请选择支付方式");
		    }
		    else if (guige_id == -1){
		        toast(1,"商品规格不存在");
		    }
		    else{
		    		if (pay_way == 2 || pay_way == 3 || pay_way == 4 || pay_way == 5){
			        $.prompt({
			        text: "请填写支付密码进行验证",
			        title: "支付密码",
			        onOK: function(text) {
			             if (text == undefined || text == ""){
			                  toast(1,"请输入支付密码");
			             }
			             else{
			             	if(pay_way == 2 || pay_way == 3){
			                   orderIntegralPay(pay_way,text);
			                }
			                else if(pay_way == 4){
			                   orderSendIntegralPay(text);
			                }
			                else{
			                   wnkCommodityCouponsPay(text);
			                }
			            }
			         },
			         onCancel: function() {
			
			         },
			         input: ''
			     });
			 }
			 else{
			 	if(wx_pay_state == 1){
			 		orderWXPayAction();
			 	}
			    else{
			    		wnkOrderWXPayNoMakeWXSystem();
			    }
			 }
		}
	}
	    
		//订单微信支付不调用微信
		function wnkOrderWXPayNoMakeWXSystem() {
		    var commodity_number = parseInt(document.getElementById("commodity_number_tag").innerText);
		    toast(2,"打开loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/wnkOrderWXPayNoMakeWXSystem",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"commodity_id":commodity_id,"guige_id":guige_id,"commodity_number":commodity_number},
		        success:function(data){
		            if (data.status == 0){
		            		toast(3,"关闭");
		            		toast(1,data.msg);
		            		var order_id = data.data.order_id;
		            		joinOrderDetail(order_id);
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
		
		//订单通用积分/消费积分支付
		function orderIntegralPay(pay_way,pay_pwd) {
		    var commodity_number = parseInt(document.getElementById("commodity_number_tag").innerText);
		    toast(2,"打开loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/wnkCommodityIntegralPay",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"commodity_id":commodity_id,"guige_id":guige_id,"pay_way":pay_way,"pay_pwd":pay_pwd,"commodity_number":commodity_number},
		        success:function(data){
		            if (data.status == 0){
		            		toast(3,"关闭");
		            		toast(1,data.msg);
		            		var order_id = data.data.order_id;
		            		joinOrderDetail(order_id);
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
		
		
		//订单赠送积分支付
		function orderSendIntegralPay(pay_pwd) {
		    var commodity_number = parseInt(document.getElementById("commodity_number_tag").innerText);
		    toast(2,"打开loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/wnkCommoditySendIntegralPay",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"commodity_id":commodity_id,"guige_id":guige_id,"pay_pwd":pay_pwd,"commodity_number":commodity_number},
		        success:function(data){
		            if (data.status == 0){
		            		toast(3,"关闭");
		            		toast(1,data.msg);
		            		var order_id = data.data.order_id;
		            		joinOrderDetail(order_id);
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
		
		//订单优惠券支付
		function wnkCommodityCouponsPay(pay_pwd) {
		    var commodity_number = parseInt(document.getElementById("commodity_number_tag").innerText);
		    toast(2,"打开loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/wnkCommodityCouponsPay",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"commodity_id":commodity_id,"guige_id":guige_id,"pay_pwd":pay_pwd,"commodity_number":commodity_number},
		        success:function(data){
		            if (data.status == 0){
		            		toast(3,"关闭");
		            		toast(1,data.msg);
		            		var order_id = data.data.order_id;
		            		joinOrderDetail(order_id);
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
		
		//万能卡订单支付
//		function wnkOrderPay() {
//		    var commodity_number = parseInt(document.getElementById("commodity_number_tag").innerText);
//		    toast(2,"打开loading");
//		    $.ajax({
//		        url:Main.url + "/app/v1.0.0/wnkCommodityQYLineOrder",
//		        type:"POST",
//		        dataType : 'json',
//		        data:{"user_id":storage["user_id"],"commodity_id":commodity_id,"guige_id":guige_id,"commodity_number":commodity_number},
//		        success:function(data){
//		            
//		            if (data.status == 0){
//		            		toast(1,data.msg);
//		            		back();
//		            }
//		            else if(data.status == 2){
//		            		storage["user_id"] = "";
//		            		toast(1,data.msg);
//		            		joinLoginPage();
//		            }
//		            else{
//		            		toast(1,data.msg);
//		            }
//		        },
//		    });
//		}
		
		//订单微信支付
		function orderWXPayAction() {
		    var commodity_number = parseInt(document.getElementById("commodity_number_tag").innerText);
		    toast(2,"打开loading");
			  $.ajax({
			        url:Main.url + "/app/v1.0.0/wnkCommodityWxPayApp",
			        type:"POST",
			        dataType : 'json',
			        data:{
			        		"user_id":storage["user_id"],
			        		"commodity_id":commodity_id,
			        		"guige_id":guige_id,
			        		"commodity_number":commodity_number
			        },
			        success:function(data){
			            if (data.status == 0){
			            		toast(3,"关闭");
			            		var config = data.data.config;
			            		var order_id = data.data.order_id;
			            		console.log(config);
			            		// 获取支付通道
							plus.payment.getChannels(function(channels){
								for(var i in channels){
									var channel=channels[i];
									if(channel.id=='wxpay'){	// 过滤掉不支持的支付通道：暂不支持360相关支付
										pays[channel.id]=channel;
									}
									
								}
								if(pays.length <= 0){
									toast(1,"暂不可支付");
								}
								else{
									plus.payment.request(pays["wxpay"],config,function(result){
										console.log("支付成功");
										toast(1,"支付成功");
										joinOrderDetail(order_id);
									},function(e){
										console.log(JSON.stringify(e));
										toast(1,"用户取消支付");
									});
								}
								
							},function(e){
								toast(1,"用户取消支付");
							});
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
		
		//进入订单详情页
		function joinOrderDetail(order_id){
			if(order_id != null){
				mui.openWindow({
					url: "../html/my_oder_detail.html",
					id: "my_oder_detail.html",
					extras:{
						order_id:order_id,
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
		}
		}
  })
})

//商品数量管理
function commodity_number(type) {
    var commodity_number_tag = parseInt(document.getElementById("commodity_number_tag").innerText);
    //减商品数量
    if (type == 0){
        if (commodity_number_tag > 1){
            commodity_number_tag = commodity_number_tag - 1;
        }
    }
    //加商品数量
    else{
        commodity_number_tag = commodity_number_tag + 1;
    }
    document.getElementById("commodity_number_tag").innerText = commodity_number_tag;
    var order_price = commodity_price * commodity_number_tag;
    order_price = order_price.toFixed(2);
    document.getElementById("order_price").innerText = order_price;
}