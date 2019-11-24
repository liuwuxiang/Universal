var storage = window.localStorage;

var order_no = "";

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    order_no = self.order_no;//获得参数
	    var order_time = self.order_time;
	    var order_price = self.order_price;
	    document.getElementById("commodity_name").innerText = "订单号："+order_no;
	    document.getElementById("line_order_time").innerText = "下单时间："+order_time;
	    document.getElementById("order_price").innerText = order_price;
	    // 支付事件
		document.getElementById('submit_pay').addEventListener('tap', userPayAction);
		//支付事件
		function userPayAction(){
			//0-微信支付,2-通用积分支付,3-消费积分支付,4-赠送积分支付
		    var pay_way = -1;
		    var wx_pay_radio = document.getElementById("wx_pay_radio");
		    var general_integral_radio = document.getElementById("general_integral_radio");
//		    var consumption_integral_radio = document.getElementById("consumption_integral_radio");
		    var send_integral_radio = document.getElementById("send_integral_radio");
		    if (wx_pay_radio.checked){
		        pay_way = 0;
		    }
		    else if (general_integral_radio.checked){
		        pay_way = 2;
		    }
//		    else if (consumption_integral_radio.checked){
//		        pay_way = 3;
//		    }
		    else if(send_integral_radio.checked){
		    		pay_way = 4;
		    }
		
		    if (pay_way == -1){
		        toast(1,"请选择支付方式");
		    }
		    else{
			    if (pay_way == 2 || pay_way == 3 || pay_way == 4){
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
					            else{
					            		orderSendIntegralPay(text);
					            }
					        }
				        },
				        onCancel: function() {
				
				        },
				            input: ''
			        });
			    }
			    else{
			        orderWXPayAction();
			    }
		    }
		}
	    
		
		//订单通用积分/消费积分支付
		function orderIntegralPay(pay_way,pay_pwd) {
		    toast(2,"打开loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/wnkCommodityIntegralTwoPay",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"order_no":order_no,"pay_way":pay_way,"pay_pwd":pay_pwd},
		        success:function(data){
		            if (data.status == 0){
		            		toast(3,"关闭");
		            		toast(1,"支付成功");
		            		// 重新加载父页面
						  var view = plus.webview.all();
						  view[view.length - 2].reload(true);
						  // 关闭当前页面
						  plus.webview.close(plus.webview.getTopWebview().id, 'slide-out-right', 500);
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
		    toast(2,"打开loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/wnkCommoditySendIntegralTwoPay",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"order_no":order_no,"pay_pwd":pay_pwd},
		        success:function(data){
		            if (data.status == 0){
		            		toast(3,"关闭");
		            		toast(1,"支付成功");
		            		// 重新加载父页面
						  var view = plus.webview.all();
						  view[view.length - 2].reload(true);
						  // 关闭当前页面
						  plus.webview.close(plus.webview.getTopWebview().id, 'slide-out-right', 500);
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
		
		//订单微信支付
		function orderWXPayAction() {
			toast(2,"打开loading");
				  $.ajax({
				        url:Main.url + "/wx/v1.0.0/wnkCommodityWxTwoPayApp",
				        type:"POST",
				        dataType : 'json',
				        data:{
				        		"user_id":storage["user_id"],
				        		"order_no":order_no
				        },
				        success:function(data){
				        	
				            if (data.status == 0){
				            		toast(3,"关闭");
				            		console.log("111");
				            		var config = data.data;
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
											back();
										},function(e){
											console.log(JSON.stringify(e));
											toast(1,"用户取消支付");
											back();
										});
									}
									
								},function(e){
									toast(1,"用户取消支付");
									back();
								});
				            }
				            else if(data.status == 2){
				            	console.log("33");
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
  })
})