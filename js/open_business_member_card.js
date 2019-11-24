var storage = window.localStorage;
var pays = {};
var business_id = -1;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		business_id = self.business_id; //获得参数
		getBusinessOpenCardInformation();
		// 绑定兑换按钮点击事件
		mui('.fhandle').on('tap', 'a', function() {
			arrgenHandelMemberCard();
		});
		
		// 绑定会员卡办理和使用说明按钮点击事件
		document.getElementById('direction_card').addEventListener('tap',function(){
			console.log(1)
			mui.openWindow({
				url: "../html/business_open_card_protocol.html",
				id: "business_open_card_protocol.html",
				extras: {
					business_id: business_id
				},
				styles: {
					top: '0px',
					bottom: '0px',
				}
			});
		});
		
	})

	//同意办理会员卡
	function arrgenHandelMemberCard() {
		//0-通用积分支付,1-消费积分支付,2-微信支付
		var pay_way = -1;
		var general_integral_radio = document.getElementById("general_integral_radio");
		//	    var consumption_integral_radio = document.getElementById("consumption_integral_radio");
		var wx_pay_radio = document.getElementById("wx_pay_radio");
		
		var price = document.getElementById('pay_amount').innerText;
		
		if (general_integral_radio.checked) {
			pay_way = 0;
		}
		//	    else if (consumption_integral_radio.checked){
		//	        pay_way = 1;
		//	    }
		else if (wx_pay_radio.checked) {
			pay_way = 2;
		}
		if (pay_way == -1) {
			toast(1, "请选择支付方式");
		} else {
			if (pay_way == 0 || pay_way == 1) {
				$.prompt({
					text: "请填写支付密码进行验证",
					title: "支付密码(需支付"+price + ')',
					onOK: function(text) {
						if (text == undefined || text == "") {
							toast(1, "请输入支付密码");
						} else {
							userHandelCardIntegralPay(text, pay_way,price);
						}
					},
					onCancel: function() {

					},
					input: ''
				});
			} else {
				wxOpenBusinessMemberCard(price);
			}
		}
	}

	/*
	 *	用户办卡积分支付
	 * */
	function userHandelCardIntegralPay(pay_pwd, pay_way,pay_price) {
		toast(2, "打开loading");
		$.ajax({
			url: Main.url + "/app/v1.0.0/userOpenBusinessMemberCardIntegralPay",
			type: "POST",
			dataType: 'json',
			data: {
				"user_id": storage["user_id"],
				"business_id": business_id,
				"pay_way"    : pay_way,
				"pay_pwd"    : pay_pwd,
				'pay_price'  : pay_price
			},
			success: function(data) {
				console.log(JSON.stringify(data));
				if (data.status == 0) {
					toast(1, data.msg);
					// 重新加载父页面
					var view = plus.webview.all();
					view[view.length - 2].reload(true);
					// 关闭当前页面
					plus.webview.close(plus.webview.getTopWebview().id, 'slide-out-right', 200);
				} 
			},
		});
	}

	function wxOpenBusinessMemberCard(pay_price) {
		toast(2, "打开loading");
		$.ajax({
			url: Main.url + "/app/v1.0.0/userBuyBusinessMemberCardWXPay",
			type: "POST",
			dataType: 'json',
			data: {
				"user_id": storage["user_id"],
				"business_id": business_id,
				"pay_price"  : pay_price
			},
			success: function(data) {
				if (data.status == 0) {
					toast(3, "关闭");
					var config = data.data;
					console.log(config);
					// 获取支付通道
					plus.payment.getChannels(function(channels) {
						for (var i in channels) {
							var channel = channels[i];
							if (channel.id == 'wxpay') { // 过滤掉不支持的支付通道：暂不支持360相关支付
								pays[channel.id] = channel;
							}

						}
						if (pays.length <= 0) {
							toast(1, "暂不可支付");
						} else {
							plus.payment.request(pays["wxpay"], config, function(result) {
								console.log("支付成功");
								toast(1, "支付成功");
								back();
							}, function(e) {
								console.log(JSON.stringify(e));
								toast(1, "错误：" + e.message);
							});
						}

					}, function(e) {
						toast(1, "错误：" + e.message);
					});
				} else if (data.status == 2) {
					storage["user_id"] = "";
					toast(1, data.msg);
					joinLoginPage();
				} else {
					toast(1, data.msg);
				}
			},
		});
	}

})

/*
 *	获取商家开卡信息
 * */
function getBusinessOpenCardInformation() {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/getBusinessOpenCardInformation",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"business_id": business_id
		},
		success: function(data) {
			if (data.status == 0) {
				toast(3, "关闭loading");
				document.getElementById("business_name").innerHTML = data.data.business_name;
				document.getElementById("pay_amount").innerHTML = data.data.pay_amount;
				if(data.data.price_annual_card != null){
					document.getElementById("price_annual_card").innerHTML = data.data.price_annual_card + '元';
				} else {
					document.getElementById("price_annual_card").innerHTML = '1999元';
				}
				// 获取用户是否是万能卡用户
				selectUserIsWnkInfoByUserId(data.data.price_annual_card);
			} else if (data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				joinLoginPage();
			} else {
				toast(1, data.msg);
			}
			
			
		},
	});
}

// 获取用户是否是万能卡用户
function selectUserIsWnkInfoByUserId(price){
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/getUserMemberCardInformation",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"business_id": business_id
		},
		success: function(data) {
			toast(3, "关闭loading");
			if (data.status == 0) {
				if(parseInt(data.data.card_level) > -1){
					document.getElementById('pay_amount').innerText = '39.9';
					document.getElementById('no_wnk').style.display = 'none';
				}
			} else {
				document.getElementById('pay_amount').innerText = price;
				document.getElementById('no_wnk').style.display = 'inline';
			}
		},
	});
}