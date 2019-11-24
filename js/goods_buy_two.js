var storage = window.localStorage;
var pays = {};
//商品价格
var commodity_price = 10;
var commodity_id = -1;
var guige_id = -1;
//商品类型id(电影院、美发...)
var type_id = -1;
//商家id(哪家电影院)
var business_id = 0;
//商品原价
var commodity_original_price = 0;

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
//今天第几次消费(电影类有限制)
var time_consume_today = 0;
//万能卡每天限制优惠次数
var time_discount_member = 0;

//是否选中微信支付(0-未选择,1-已选择)
var wx_pay_choose_state = 0;
//通用积分开关状态(0-关闭,1-打开)
var genergal_swith_state = 0;
//现金劵开关状态(0-关闭,1-打开)
var cash_coupon_swith_state = 0;
//优惠券开关状态(0-关闭,1-打开)
var coupon_swith_state = 0;
//通用积分使用金额
var general_integral_make_amount = 0;
//现金劵积分使用金额
var cash_coupon_make_amount = 0;
//优惠劵积分使用金额
var coupon_make_amount = 0;
//订单价格
var order_price = 0;
//优惠券余额
var coupon_balance = 0;
//现金券余额
var cash_coupon_balance = 0;
//通用积分余额
var general_integral_balance = 0;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		commodity_id = self.commodity_id; //获得参数
		guige_id = self.guige_id; //获得参数
		type_id = self.type_id;
		business_id = self.business_id;
		console.log('规格：' + guige_id + ";商品：" + commodity_id + ";商家：" + business_id);
		getOrderInformation();
		initShowBalance();

		//获取订单信息
		function getOrderInformation() {
			toast(2, "打开loading");
			$.ajax({
				url: Main.url + "/app/v1.0.0/getCommodityDetailAndGuige",
				type: "POST",
				dataType: 'json',
				data: {
					"user_id": storage["user_id"],
					"commodity_id": commodity_id,
					"guige_id": guige_id
				},
				success: function(data) {
					if(data.status == 0) {
						toast(3, "关闭loading");
						document.getElementById("commodity_name").innerText = data.data.name + "(" + data.data.guige_name + ")";
						//当前规格比例(如果启用了万能卡权益则不显示)
						if(data.data.gift_noun != undefined && data.data.gift_noun != null && data.data.gift_noun != '') {
							document.getElementById("commodity_donation_ratio_div").style.display = 'block';
							document.getElementById("commodity_donation_ratio").innerText = data.data.gift_noun + '%';

						} else {
							document.getElementById("commodity_donation_ratio_div").style.display = 'none';

						}
						document.getElementById("commodity_price").innerText = "￥" + data.data.price;
						document.getElementById("member_price").innerText = "会员价:￥" + data.data.wnk_price;
						var user_open_card_state = data.data.user_open_card_state;
						if(user_open_card_state == 1) {
							commodity_price = data.data.wnk_price; //会员价
							$("#member_price").show();
							//电影类id商品类型id为1
							if(type_id == 1) {
								// 								time_discount_member = 1; //电影会员卡每天限制优惠次数
								// 								time_consume_today = 0; //账号当天消费次数
								getTimeLimitAndUsed();
								document.getElementById('limit_type').innerHTML = '电影万能卡'; //限制消费类型
								document.getElementById('limit_time').innerText = time_discount_member; //限制消费次数提示
								$('.limit_tip').show(); //显示优惠提示
								//电影类会员为限制消费
								if(time_consume_today < time_discount_member) {
									//今天消费次数未达到限制次数
									commodity_price = data.data.wnk_price; //会员价
								} else {
									//今天消费次数达到限制
									commodity_price = data.data.price; //恢复正常价
									toast(0, '您今天在该影院消费已达优惠次数，将恢复正常价格。')
								}
							} else {
								$('.limit_tip').hide(); //隐藏优惠提示
								//非电影类未限制
								commodity_price = data.data.wnk_price;
							}
							document.getElementById("commodity_price").style.textDecoration = "line-through";
						} else {
							commodity_price = data.data.price;
							$("#member_price").hide();
							$('.limit_tip').hide(); //隐藏优惠提示
							document.getElementById("commodity_price").style.textDecoration = "none";
						}
						order_price = commodity_price;
						document.getElementById("order_price").innerText = order_price;
						document.getElementById("pay_amount").innerText = "￥" + order_price + "元";
						wnk_price = data.data.wnk_price; //万能卡价格
						commodity_original_price = data.data.price; //商品原价
						is_open_card = data.data.is_open_card;
						make_wnk_state = data.data.make_wnk_state;
						wx_pay_state = data.data.wx_pay_state;
						getUserBaseInformation();
						if(order_price > 0.00) {
							$("#wx_pay_div").show();
						} else {
							$("#wx_pay_div").hide();
						}
					} else if(data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
						joinLoginPage();
					} else {
						toast(1, data.msg);
					}
				},
			});
		}

		//获取用户基础信息
		function getUserBaseInformation() {
			toast(2, "打开loading");
			$.ajax({
				url: Main.url + "/app/v2.0.0/getUserBaseInformation",
				type: "POST",
				dataType: 'json',
				data: {
					"user_id": storage["user_id"],
					"commodity_id": commodity_id
				},
				success: function(data) {
					if(data.status == 0) {
						toast(3, "关闭loading");
						wnkState = data.data.wnk_state;
						initShowBalance();
						//优惠券余额
						coupon_balance = data.data.coupon_number;
						//现金券余额
						cash_coupon_balance = data.data.send_integral_balance;
						//通用积分余额
						general_integral_balance = data.data.general_integral;

						document.getElementById("general_integral_balance").innerText = general_integral_balance;
						document.getElementById("cash_coupon_balance").innerText = cash_coupon_balance;
						document.getElementById("coupon_balance").innerText = coupon_balance;

						if(wnkState == -1 && is_open_card == 0 && make_wnk_state == 1) {
							mui.confirm('开通万能卡购买只需' + wnk_price + "元", '优惠提示', ['取消', '去开通'], function(e) {
								if(e.index == 0) {
									//							mMain.back();
								} else {
									mui.openWindow({
										url: "../html/open_member_card.html",
										id: "open_member_card.html",
										extras: {
											type: 1
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
							}, 'div');
						}
					} else if(data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
						joinLoginPage();
					} else {
						toast(1, data.msg);
					}
				},
			});
		}

		//获取万能卡用户每天限制消费次数、万能卡用户当天消费次数
		function getTimeLimitAndUsed() {
			toast(2, "打开loading");
			$.ajax({
				url: Main.url + "/app/v1.0.0/getTimeLimitAndUsed",
				type: "POST",
				dataType: 'json',
				async: false,
				data: {
					"user_id": storage["user_id"],
					"business_id": business_id
				},
				success: function(data) {
					console.log(JSON.stringify(data));
					toast(3, "关闭loading");
					if(data.status == 0) {
						toast(3, "关闭loading");
						//获取限制优惠次数
						time_discount_member = data.data.time_discount_member;
						//获取用户当天消费次数
						time_consume_today = data.data.time_consume_today;
					} else if(data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
						joinLoginPage();
					} else {
						toast(1, data.msg);
					}
				},
			});
		}

		//初始化账户显示余额
		function initShowBalance() {
			document.getElementById('general_integral_balance').innerText = general_integral_balance;
			document.getElementById('cash_coupon_balance').innerText = cash_coupon_balance;
			document.getElementById('coupon_balance').innerText = coupon_balance;
		}

		// 支付按钮点击事件
		document.getElementById('submit_pay').addEventListener('tap', userPayAction);
		
		//支付事件
		function userPayAction() {
			var couponAmount = coupon_make_amount * 9.9;
			couponAmount = couponAmount.toFixed(2);
			//现金应支付
			var cashPayAmount = order_price - general_integral_make_amount - cash_coupon_make_amount - couponAmount;
			cashPayAmount = cashPayAmount.toFixed(2);
			if(cashPayAmount > 0.00 && wx_pay_choose_state == 0) {
				toast(1, "请选择支付方式");
			} else {
				if(cashPayAmount > 0.00) {
					//使用微信支付下单
					if(general_integral_make_amount > 0.00 || cash_coupon_make_amount > 0 || coupon_make_amount > 0) {
						$.prompt({
							text: "请填写支付密码进行验证",
							title: "支付密码",
							onOK: function(text) {
								if(text == undefined || text == "") {
									toast(1, "请输入支付密码");
								} else {
									orderWXPayAction(text);
								}
							},
							onCancel: function() {

							},
							input: ''
						});
					} else {
						orderWXPayAction("");
					}
				} else {
					//不使用微信支付下单
					$.prompt({
						text: "请填写支付密码进行验证",
						title: "支付密码",
						onOK: function(text) {
							if(text == undefined || text == "") {
								toast(1, "请输入支付密码");
							} else {
								orderIntegralPay(text);
							}
						},
						onCancel: function() {

						},
						input: ''
					});
				}
			}
		}

		//订单微信支付
		function orderWXPayAction(pay_pwd) {
			var commodity_number = parseInt(document.getElementById("commodity_number_tag").innerText);
			toast(2, "打开loading");
			$.ajax({
				url: Main.url + "/app/v2.0.0/wnkCommodityWXlPay",
				type: "POST",
				dataType: 'json',
				data: {
					"user_id": storage["user_id"],
					"commodity_id": commodity_id,
					"guige_id": guige_id,
					"commodity_number": commodity_number,
					"general_integral": general_integral_make_amount,
					"send_integral": cash_coupon_make_amount,
					"coupon": coupon_make_amount,
					"pay_pwd": pay_pwd
				},
				success: function(data) {
					if(data.status == 0) {
						toast(3, "关闭");
						var config = data.data.config;
						var order_id = data.data.order_id;
						console.log(config);
						// 获取支付通道
						plus.payment.getChannels(function(channels) {
							for(var i in channels) {
								var channel = channels[i];
								if(channel.id == 'wxpay') { // 过滤掉不支持的支付通道：暂不支持360相关支付
									pays[channel.id] = channel;
								}

							}
							if(pays.length <= 0) {
								toast(1, "暂不可支付");
							} else {
								plus.payment.request(pays["wxpay"], config, function(result) {
									console.log("支付成功");
									toast(1, "支付成功");
									joinOrderDetail(order_id);
								}, function(e) {
									console.log(JSON.stringify(e));
									toast(1, "用户取消支付");
								});
							}

						}, function(e) {
							toast(1, "用户取消支付");
						});
					} else if(data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
						joinLoginPage();
					} else {
						toast(1, data.msg);
					}
				},
			});
		}

		//订单积分支付
		function orderIntegralPay(pay_pwd) {
			var commodity_number = parseInt(document.getElementById("commodity_number_tag").innerText);
			toast(2, "打开loading");
			$.ajax({
				url: Main.url + "/app/v2.0.0/wnkCommodityIntegralPay",
				type: "POST",
				dataType: 'json',
				data: {
					"user_id": storage["user_id"],
					"commodity_id": commodity_id,
					"guige_id": guige_id,
					"pay_pwd": pay_pwd,
					"commodity_number": commodity_number,
					"general_integral": general_integral_make_amount,
					"send_integral": cash_coupon_make_amount,
					"coupon": coupon_make_amount
				},
				success: function(data) {
					console.log(JSON.stringify(data));
					if(data.status == 0) {
						toast(3, "关闭");
						toast(1, data.msg);
						var order_id = data.data.order_id;
						joinOrderDetail(order_id);
					} else if(data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
						joinLoginPage();
					} else {
						toast(1, data.msg);
					}
				},
			});
		}

		//进入订单详情页
		function joinOrderDetail(order_id) {
			if(order_id != null) {
				mui.openWindow({
					url: "../html/my_order_detail_two.html",
					id: "my_order_detail_two.html",
					extras: {
						order_id: order_id
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
	if(type == 0) {
		if(commodity_number_tag > 1) {
			commodity_number_tag = commodity_number_tag - 1;
		}
	}
	//加商品数量
	else {
		commodity_number_tag = commodity_number_tag + 1;
	}
	console.log("购买数量：" + commodity_number_tag);

	//限制优惠次数的商品类别
	if(type_id == 1) {
		//如果用户当天在该商家消费次数未达到剩余的优惠次数
		var time_surplus_discount = time_discount_member - time_consume_today; //(剩余优惠次数=当天优惠次数-已经消费次数)
		time_surplus_discount = (time_surplus_discount > 0) ? time_surplus_discount : 0;
		if(commodity_number_tag <= time_surplus_discount) {
			//购买数量<=剩余优惠次数
			commodity_price = wnk_price; //会员价 
			//应付金额 = 价格 * 购买量
			order_price = commodity_price * commodity_number_tag;
		} else {
			//购买数量>剩余优惠次数
			commodity_price = commodity_original_price;
			//应付金额 = 优惠价 * 剩余优惠次数 + (购买数量 - 剩余优惠次数) * 价格
			order_price = wnk_price * time_surplus_discount + (commodity_number_tag - time_surplus_discount) * commodity_price;
		}
	} else {
		//未限制优惠次数的商品类别
		order_price = commodity_price * commodity_number_tag;
	}

	document.getElementById("commodity_number_tag").innerText = commodity_number_tag;
	order_price = order_price.toFixed(2);
	document.getElementById("order_price").innerText = order_price;
	automatic_calculation_pay_amount();
}

//支付选择事件(0-微信支付)
function pay_choose(choose_pay_type) {
	if(choose_pay_type == 0) {
		if(wx_pay_choose_state == 0) {
			wx_pay_choose_state = 1;
		} else {
			wx_pay_choose_state = 0;
		}
		if(wx_pay_choose_state == 0) {
			$("#wx_pay_div").removeClass("pay_sel");
			document.getElementById("wx_pay").src = "../images/choose.svg";
		} else {
			$("#wx_pay_div").addClass("pay_sel");
			document.getElementById("wx_pay").src = "../images/choose_select.svg";
		}
	}
}

//积分使用开关打开状态,swith_type-0通用积分,swith_type-1现金劵,swith_type-2优惠券
function integral_make_swith(swith_type) {
	if(swith_type == 0) {
		if(genergal_swith_state == 0) {
			genergal_swith_state = 1;
			$("#gengeral_integral_div").show();
		} else {
			genergal_swith_state = 0;
			general_integral_make_amount = 0;
			$("#gengeral_integral_div").hide();
		}
	} else if(swith_type == 1) {
		if(cash_coupon_swith_state == 0) {
			cash_coupon_swith_state = 1;
			$("#cash_coupon_div").show();
		} else {
			cash_coupon_swith_state = 0;
			cash_coupon_make_amount = 0;
			$("#cash_coupon_div").hide();
		}
	} else {
		if(coupon_swith_state == 0) {
			coupon_swith_state = 1;
			$("#coupon_div").show();
		} else {
			coupon_swith_state = 0;
			coupon_make_amount = 0;
			$("#coupon_div").hide();
		}
	}
	automatic_calculation_pay_amount();
}

//自动计算使用金额及应支付金额
function automatic_calculation_pay_amount() {
	//已打开的开关数量
	var open_swith_number = 0;
	if(genergal_swith_state == 1) {
		open_swith_number = open_swith_number + 1;
	}
	if(cash_coupon_swith_state == 1) {
		open_swith_number = open_swith_number + 1;
	}
	if(coupon_swith_state == 1) {
		open_swith_number = open_swith_number + 1;
	}
	if(open_swith_number > 0) {
		automatic_input_amount(open_swith_number, order_price);
	} else {
		$("#wx_pay_div").show();
		document.getElementById("pay_amount").innerText = "￥" + order_price + "元";
	}
}

//自动填充积分支付数据,open_number-开关打开数量,surplus_pay_amount-剩余支付金额
function automatic_input_amount(open_number, surplus_pay_amount) {
	//平均每项支付
	var averageItemPay = surplus_pay_amount / open_number;
	if(coupon_swith_state == 1) {
		//优惠券可支付金额
		var couponCanAmount = coupon_balance * 9.9;
		couponCanAmount = couponCanAmount.toFixed(2);
		if(couponCanAmount > Math.floor(averageItemPay)) {
			coupon_make_amount = Math.floor(averageItemPay) / 9.9;
			coupon_make_amount = Math.floor(coupon_make_amount);
			if(coupon_make_amount <= 0) {
				coupon_make_amount = 1;
			}
		} else {
			coupon_make_amount = coupon_balance;
		}
		couponCanAmount = coupon_make_amount * 9.9;
		couponCanAmount = couponCanAmount.toFixed(2);
		surplus_pay_amount = surplus_pay_amount - couponCanAmount;
		surplus_pay_amount = surplus_pay_amount.toFixed(2);
		open_number = open_number - 1;
	}
	if(cash_coupon_swith_state == 1) {
		averageItemPay = surplus_pay_amount / open_number;
		if(cash_coupon_balance > Math.floor(averageItemPay)) {
			cash_coupon_make_amount = Math.floor(averageItemPay);
		} else {
			//			cash_coupon_make_amount = coupon_balance;
			cash_coupon_make_amount = cash_coupon_balance;
		}
		surplus_pay_amount = surplus_pay_amount - cash_coupon_make_amount;
		surplus_pay_amount = surplus_pay_amount.toFixed(2);
		open_number = open_number - 1;
	}
	if(genergal_swith_state == 1) {
		averageItemPay = surplus_pay_amount / open_number;
		if(general_integral_balance > averageItemPay) {
			general_integral_make_amount = averageItemPay;
		} else {
			general_integral_make_amount = general_integral_balance;
		}
		general_integral_make_amount = general_integral_make_amount.toFixed(2);
		surplus_pay_amount = surplus_pay_amount - general_integral_make_amount;
		surplus_pay_amount = surplus_pay_amount.toFixed(2);
	}

	//优惠券抵扣金额
	var couponDeductionAmount = coupon_make_amount * 9.9;
	couponDeductionAmount = couponDeductionAmount.toFixed(2);
	surplus_pay_amount = order_price - couponDeductionAmount - cash_coupon_make_amount - general_integral_make_amount;
	surplus_pay_amount = surplus_pay_amount.toFixed(2);
	if(surplus_pay_amount > 0.00) {
		$("#wx_pay_div").show();
	} else {
		$("#wx_pay_div").hide();
	}
	document.getElementById("pay_amount").innerText = "￥" + surplus_pay_amount + "元";
	document.getElementById("general_integral_pay_amount").value = general_integral_make_amount;
	document.getElementById("cash_coupon_pay_number").value = cash_coupon_make_amount;
	document.getElementById("coupon_pay_number").value = coupon_make_amount;
	document.getElementById("coupon_deduction_amount").innerText = couponDeductionAmount;
	document.getElementById("general_integral_deduction_amount").innerText = general_integral_make_amount;
	document.getElementById("cash_coupon_deduction_amount").innerText = cash_coupon_make_amount;
}