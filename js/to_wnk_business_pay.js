var storage = window.localStorage;
var pays={};
var business_id = -1;
//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	//获取商家详情
	function getBusinessDetail() {
	    toast(2,"打开loading");
	    $.ajax({
	        url:Main.url + "/app/v1.0.0/selectBusinesssDetail",
	        type:"POST",
	        dataType : 'json',
	        data:{"user_id":storage["user_id"],"business_id":business_id},
	        success:function(data){
	            if (data.status == 0){
	                toast(3,"关闭loading");
	                document.getElementById("store_name").innerText = data.data.store_name;
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
	 *	用户支付
	 * */
	function userPay(){
		//0-通用积分支付,1-商家现金劵支付,2-微信支付
		var pay_way = -1;
	    var general_integral_radio = document.getElementById("general_integral_radio");
	    var send_integral_radio = document.getElementById("send_integral_radio");
	    var wx_pay_radio = document.getElementById("wx_pay_radio");
		var withdraw_number = document.getElementById("withdraw_number").value;
		if (general_integral_radio.checked){
	        pay_way = 1;
	    }
	    else if (send_integral_radio.checked){
	        pay_way = 1;
	    }
	    else if (wx_pay_radio.checked){
	        pay_way = 2;
	    }
	    if(business_id == -1){
	        toast(1,"商户不存在");
		}
		else if(withdraw_number == '' || withdraw_number == undefined){
	        toast(1,"请输入支付金额");
		}
		else if(withdraw_number <= 0){
			toast(1,"金额必须大于0");
		}
		else if(pay_way == -1){
			toast(1,"请选择支付方式");
		}
		else{
	        if (pay_way == 0 || pay_way == 1){
	            $.prompt({
	                text: "请填写支付密码进行验证",
	                title: "支付密码",
	                onOK: function(text) {
	                    if (text == undefined || text == ""){
	                        toast(1,"请输入支付密码");
	                    }
	                    else{
	                    		if(pay_way == 0){
	                    			integralPay(withdraw_number,pay_way,text);
	                    		}
	                    		else{
	                    			sendIntegralPay(withdraw_number,text);
	                    		}
	                    }
	                },
	                onCancel: function() {
	
	                },
	                input: ''
	            });
	        }
	        else{
	            wxPay(withdraw_number);
	        }
		}
	}
	
	//积分支付(pay_amount-支付金额,pay_type=1通用积分支付，pay_type=0消费积分支付)
	function integralPay(pay_amount,pay_type,pay_pwd){
		toast(2,"打开loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/userScanCodeToWnkBusinessIntegralPay",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"business_id":business_id,"pay_type":1,"pay_pwd":pay_pwd,"pay_amount":pay_amount},
		        success:function(data){
		            if (data.status == 0){
		                toast(3,"关闭loading");
		                plus.nativeUI.alert('支付成功,支付金额:'+pay_amount+"元", null, '支付结果');
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
	
	//赠送积分支付(pay_amount-支付金额)
	function sendIntegralPay(pay_amount,pay_pwd){
		toast(2,"打开loading");
		    $.ajax({
		        url:Main.url + "/app/v1.0.0/userScanCodeToWnkBusinessSendIntegralPay",
		        type:"POST",
		        dataType : 'json',
		        data:{"user_id":storage["user_id"],"business_id":business_id,"pay_pwd":pay_pwd,"pay_amount":pay_amount},
		        success:function(data){
		            if (data.status == 0){
		                toast(3,"关闭loading");
		                plus.nativeUI.alert('支付成功,支付金额:'+pay_amount+"元", null, '支付结果');
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
	
	//微信支付
	function wxPay(pay_amount){
		toast(2,"打开loading");
			  $.ajax({
			        url:Main.url + "/app/v1.0.0/userScanCodeWXAppPay",
			        type:"POST",
			        dataType : 'json',
			        data:{
			        		"user_id":storage["user_id"],
			        		"business_id":business_id,
			        		"pay_amount":pay_amount
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
										plus.nativeUI.alert('支付成功,支付金额:'+pay_amount+"元", null, '支付结果');
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
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    business_id = self.business_id;//获得参数
	    getBusinessDetail();
	    document.getElementById('userPay').addEventListener('tap', userPay);
	    plus.webview.close("barcode.html","none");
  	})
	
})
