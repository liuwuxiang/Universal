var storage = window.localStorage;

/**房间选择状态 0-收起 1-打开*/
var rommSelectStatus = 0;

/**入住人数 默认一间*/
var roomNumber = 1;

/**商品价格(单价)*/
var goodsPrice = 0;

/**商品总价*/
var goodsTotalPrice = -1;

/**入住天数*/
var registerDay = 1;

/**入住开始日期(2019-01-02)*/
var registerStartTime = null;


/**入住结束日期(2019-01-02)*/
var registerEndTime = null;



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

//
var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

// 获取商品所需信息
// 入住时间时间戳
var registerStartTimeStamp = -1;
// 入住结束时间时间戳
var registerEndTimeStamp = -1;
// 商品ID
var commodity_id = -1;
// 商家ID
var business_id = -1;

mui.init();

mui.plusReady(function() {
	mui.ready(initDate)
});

function initDate() {
	var value = plus.webview.currentWebview();
	// 保存商品ID和商家ID
	business_id = value.business_id;
	commodity_id = value.commodity_id;

	if (value.joinTime == undefined || value.outTime == undefined) {
		var date = new Date();
		registerStartTime = date.Format("yyyy-MM-dd");
		date.setDate(date.getDate() + 1);
		registerEndTime = date.Format("yyyy-MM-dd");
	} else {
		registerStartTime = new Date(value.joinTime).Format("yyyy-MM-dd");
		registerEndTime   = new Date(value.outTime).Format("yyyy-MM-dd");
	}

	var joinTime = value.joinTime;
	var endTime = value.outTime;
	if (joinTime == undefined || endTime == undefined) {
		var joinDate = new Date();
		var endDate = new Date();
		endDate.setDate(joinDate.getDate() + 1);
	} else {
		var joinDate = new Date(joinTime);
		var endDate  = new Date(endTime);
	}

	// 保存时间戳,获取商品详情时使用
	registerStartTimeStamp = Date.parse(joinDate);
	registerEndTimeStamp = Date.parse(endDate);
	

	// 计算入住时常
	countRegisterNumber(registerStartTime, registerEndTime);
	
	$('.order_title_str > p')[0].innerHTML = (joinDate.getMonth() + 1) + '月' + joinDate.getDate() + '日(' + weekday[
			joinDate.getDay()] + ')-' + (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日(' + weekday[endDate.getDay()] +
		') 共' + registerDay + '晚';
	
	// 计算商品价格
	// countGoodsPrice();
	// 获取商品详情
	selectCommoditiesInfoById();
	// 获取用户基础信息
	getUserBaseInformation();


	// 选择房间数被点击
	mui('.room_number_select').on('click', 'li', selectRomm);
	// 房间数量选择被单机
	document.getElementById('room_number_icon').addEventListener('click', rommSelectIcon, false);
	// 预计到店时间被点击
	document.getElementById('register_time').addEventListener('click', registerTimeClick, false);
	// 预计到店时间列表被点击
	mui('.register_time').on('click', 'li', registerTimeSelect);
	// 联系手机输入监控
	document.getElementById('register_tel').addEventListener('blur', registerTelInput, false);
	// 放心详情被点击
	document.getElementById('goods_info_btn').addEventListener('click', showGoodsInfo, false);
	// 发票拨打电话被点击
	document.getElementsByClassName('invoice_div')[0].addEventListener('click', function() {
		window.location.href = "tel://" + plus.webview.currentWebview().phone;
	}, false);
	// 支付按钮点击事件
	document.getElementById('submit_pay').addEventListener('tap', userPayAction);
	// 显示/关闭更多房型设施
	mui('.goods_info_facility').on('tap', 'a', showGoodsConfig);
	
	
	
	
}

//支付事件
function userPayAction() {
	// 参数检查
	// 循环获取入住人信息 
	var registerPeopleArr =  $('#checkInPeople input');
	var registerPeopleStr = '';
	for (var i = 0; i < registerPeopleArr.length; i++) {
		registerPeopleStr += registerPeopleArr[i].value + ',';
	}
	if(registerPeopleStr == ','){
		plus.nativeUI.toast("请输入入住人信息");
		return;
	}
	if(document.getElementById('register_tel').value == undefined || document.getElementById('register_tel').value == null ||document.getElementById('register_tel').value == ''){
		plus.nativeUI.toast("请输入联系电话");
		return;
	}
	if(document.getElementById('register_time').value == undefined || document.getElementById('register_time').value == null ||document.getElementById('register_time').value == ''){
		plus.nativeUI.toast("请选择到店时间");
		return;
	}
	
	var couponAmount = coupon_make_amount * 9.9;
	couponAmount = couponAmount.toFixed(2);
	//现金应支付
	var cashPayAmount = goodsTotalPrice - general_integral_make_amount - cash_coupon_make_amount - couponAmount;
	cashPayAmount = cashPayAmount.toFixed(2);
	if (cashPayAmount > 0.00 && wx_pay_choose_state == 0) {
		toast(1, "请选择支付方式");
	} else {
		if (cashPayAmount > 0.00) {
			//使用微信支付下单
			if (general_integral_make_amount > 0.00 || cash_coupon_make_amount > 0 || coupon_make_amount > 0) {
				$.prompt({
					text: "请填写支付密码进行验证",
					title: "支付密码",
					onOK: function(text) {
						if (text == undefined || text == "") {
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
					if (text == undefined || text == "") {
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
	var commodity_number = roomNumber;
	// 循环获取入住人信息 
	var registerPeopleArr =  $('#checkInPeople input');
	console.log(registerPeopleArr.length);
	var registerPeopleStr = '';
	for (var i = 0; i < registerPeopleArr.length; i++) {
		registerPeopleStr += registerPeopleArr[i].value + ',';
	}

	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v2.0.0/wnkCommodityWXlPayByHotel",
		type: "POST",
		dataType: 'json',
		data: {
			"userId"         : storage["user_id"],           // 用户ID
			"commodityId"    : commodity_id,                 // 商品ID
			'businessId'     : business_id,                  // 商家ID
			"payPwd"         : pay_pwd,                      // 支付密码
			"commodityNumber": commodity_number,             // 购买数量 - 入住多少天
			"generalIntegral": general_integral_make_amount, // 通用积分使用金额
			"sendIntegral"   : cash_coupon_make_amount,      // 现金劵积分使用金额
			"coupon"         : coupon_make_amount,           // 优惠劵积分使用金额
			'mobile'         : $('#register_tel').val(),     // 联系手机
			'registerTime'   : $('#register_time').val(),    // 预计到店时间
			'registerPeople' : registerPeopleStr.substring(0,registerPeopleStr.length - 1), //入住人信息
			'registerStartTimeStamp' : registerStartTimeStamp , // 入住时间时间戳
			'registerEndTimeStamp'   : registerEndTimeStamp     // 离店时间时间戳
		},
		success: function(data) {
			if (data.status == 0) {
				toast(3, "关闭");
				var config = data.data.config;
				var order_id = data.data.order_id;
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
						}, function(e) {
							console.log(JSON.stringify(e));
							toast(1, "用户取消支付");
						});
					}

				}, function(e) {
					toast(1, "用户取消支付");
				});
			} else if (data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
			} else {
				toast(1, data.msg);
			}
		},
	});
}

//订单积分支付
function orderIntegralPay(pay_pwd) {
	console.log(storage["user_id"]);
	var commodity_number = roomNumber;
	// 循环获取入住人信息 
	var registerPeopleArr =  $('#checkInPeople > .mui-input-row > input');
	var registerPeopleStr = '';
	for (var i = 0; i < registerPeopleArr.length; i++) {
		registerPeopleStr += registerPeopleArr[i].value + ',';
	}
	console.log( '入住日:' + new Date(registerStartTimeStamp).Format('yyyy-MM-dd'));
	console.log( '离店日:' + new Date(registerEndTimeStamp).Format('yyyy-MM-dd'));
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v2.0.0/wnkCommodityIntegralPayByHotel",
		type: "POST",
		dataType: 'json',
		data: {
			"userId"         : storage["user_id"],           // 用户ID
			"commodityId"    : commodity_id,                 // 商品ID
			'businessId'     : business_id,                  // 商家ID
			"payPwd"         : pay_pwd,                      // 支付密码
			"commodityNumber": commodity_number,             // 购买数量 - 入住多少天
			"generalIntegral": general_integral_make_amount, // 通用积分使用金额
			"sendIntegral"   : cash_coupon_make_amount,      // 现金劵积分使用金额
			"coupon"         : coupon_make_amount,           // 优惠劵积分使用金额
			'mobile'         : $('#register_tel').val(),     // 联系手机
			'registerTime'   : $('#register_time').val(),    // 预计到店时间
			'registerPeople' : registerPeopleStr.substring(0,registerPeopleStr.length - 1), //入住人信息
			'registerStartTimeStamp' : registerStartTimeStamp , // 入住时间时间戳
			'registerEndTimeStamp'   : registerEndTimeStamp     // 离店时间时间戳
		},
		success: function(data) {
			toast(3, "关闭Loding");
			plus.nativeUI.toast(data.msg);
			if (data.status == 0) {
				plus.webview.close('goods_buy_two_hotel.html');
			}
		},
	});
}


/**选择入住人数列表点击事件*/
function selectRomm() {
	// 选择的房间数量
	var roomNum = parseInt(this.innerText);
	// 设置显示的房间数量
	document.getElementById('room_number').innerHTML = roomNum + '间';
	// 隐藏房间数量选择列表
	document.getElementsByClassName('room_select_div')[0].style.display = 'none';
	// 切换图标为向下
	document.getElementById('room_number_icon').setAttribute('src', '../images/arrow_under.png');
	// 切换房间数量选择列表为收起
	rommSelectStatus = 0;
	// 设置房间数量
	roomNumber = roomNum;
	// 重新添加入住人数量
	var checkInPeopleDiv = $('#checkInPeople');
	checkInPeopleDiv.empty();
	for (var i = 0; i < roomNum; i++) {
		var html = '' +
			'<div class="mui-input-row">' +
			'	<label>入&nbsp;&nbsp;住&nbsp;人</label>' +
			'	<input type="text" class="mui-input-clear" placeholder="每间填一位入住人姓名">' +
			'</div>';
		checkInPeopleDiv.append(html);
	}
	// 重新计算房间价格
	countGoodsPrice();
}

/**选择房间div 打开和收起*/
function rommSelectIcon() {
	if (parseInt(rommSelectStatus) === 0) {
		this.setAttribute('src', '../images/arrow_under.png');
		document.getElementsByClassName('room_select_div')[0].style.display = 'inline';
		rommSelectStatus = 1;
	} else {
		this.setAttribute('src', '../images/arrow_up.png');
		document.getElementsByClassName('room_select_div')[0].style.display = 'none';
		rommSelectStatus = 0;
	}
}

//四舍五入保留2位小数（不够位数，则用0替补）
function keepTwoDecimalFull(num) {
	var result = parseFloat(num);
	if (isNaN(result)) {
		alert('传递参数错误，请检查！');
		return false;
	}
	result = Math.round(num * 100) / 100;
	var s_x = result.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + 2) {
		s_x += '0';
	}
	return s_x;
}

/**计算商品价格*/
function countGoodsPrice() {
	goodsTotalPrice = roomNumber * registerDay * goodsPrice;
	var goodsTotalPriceLi = $('#goodsTotalPriceLi');
	goodsTotalPriceLi.empty();
	// 获取开始入住时间
	var startDate = new Date(registerStartTime);
	for (var i = 0; i < registerDay; i++) {
		var dateStr = startDate.Format("yyyy-MM-dd");
		let html = '' +
			'<li>' +
			'	<span class="fee-title">' + dateStr + '</span>' +
			'	<span class="fee-price">' + roomNumber + ' × ￥' + keepTwoDecimalFull(goodsPrice) + '</span>' +
			'</li>';
		goodsTotalPriceLi.append(html);
		// 天数加1
		startDate.setDate(startDate.getDate() + 1);
	}
	goodsTotalPriceLi.append('<p>总价:<span>￥' + keepTwoDecimalFull(goodsTotalPrice) + '元</span></p>')
	automatic_calculation_pay_amount();
}

/**
 * 计算入住时长
 * @param {Object} sDate1 入住时间
 * @param {Object} sDate2 退房时间
 */
function countRegisterNumber(sDate1, sDate2) {
	var dateSpan, tempDate, iDays;
	sDate1 = Date.parse(sDate1);
	sDate2 = Date.parse(sDate2);
	dateSpan = sDate2 - sDate1;
	dateSpan = Math.abs(dateSpan);
	registerDay = Math.floor(dateSpan / (24 * 3600 * 1000));
}

/**预计到店时间框被点击*/
function registerTimeClick() {
	maskShow();
	document.getElementsByClassName('register_time')[0].style.display = 'inline';
}

function registerTimeSelect() {
	maskClose();
	document.getElementById('register_time').value = this.innerText;
	document.getElementsByClassName('register_time')[0].style.display = 'none';
}

/**遮罩层*/
var mask = null;

/**打开遮罩层*/
function maskShow() {
	mask = mui.createMask(maskClose);
	mask.show(); //显示遮罩
}

/**关闭遮罩层*/
function maskClose() {
	mask._remove();
	// 关闭到店
	document.getElementsByClassName('register_time')[0].style.display = 'none';
	document.getElementsByClassName('goods_info_div')[0].style.display = 'none';
}

/**检查手机号码输入是否正确*/
function registerTelInput() {
	if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(this.value)) {
		plus.nativeUI.toast('你输入的手机号码不正确');
	}
}

/**显示商品详情*/
function showGoodsInfo() {
	maskShow();
	document.getElementById('goods_popUp_info').style.display = 'inline';
}

/**
 * 查询商品信息
 */
function selectCommoditiesInfoById() {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/selectCommodityInfoAndHotelExpandInfoById",
		type: "POST",
		dataType: 'json',
		data: {
			user_id: storage["user_id"],
			commodity_id: commodity_id,
			business_id: business_id,
		},
		success: function(data) {
			toast(3, "关闭loading");
			if (parseInt(data.status) === 0 && data.data != null) {
				// 扩展信息
				var expand = data.data.expand
				// 设置头部信息
				spliceTitleStr(data.data.name, expand);
				// 设置标题为商家名称
				$('.head > h1')[0].innerHTML = data.data.business_name;
				
				// 计算预计到店时间需要添加那个时间段
				// 先判断入住日是不是今天
				// 入住日时间 
				var registerDate = new Date(registerStartTimeStamp);
				var newDate = new Date();
				var registerTimeUl = $('#registerTimeUl');
				registerTimeUl.empty();
				if (registerDate.getDate() == newDate.getDate()) {
					//  距离24点的时间差
					var timeDifference = 24 - (newDate.getHours() + 1);
					for (var i = 0; i <= timeDifference; i++) {
						var html = '<li>' + ((newDate.getHours() + 1) + i) + ':00</li>';
						registerTimeUl.append(html);
					}
					var html = '<li>00:00</li>';
					registerTimeUl.append(html);
					// 添加次日到6点的
					for (var i = 1; i <= 6; i++) {
						var html = '<li>次日0' + i + ':00</li>';
						registerTimeUl.append(html);
					}
				} else {
					for (var i = 12; i <= 23; i++) {
						var html = '<li> ' + i + ':00</li>';
						registerTimeUl.append(html);
					}
					var html = '<li>00:00</li>';
					registerTimeUl.append(html);
					// 添加次日到6点的
					for (var i = 1; i <= 6; i++) {
						var html = '<li>次日0' + i + ':00</li>';
						registerTimeUl.append(html);
					}
				}
				
				// 判断是否能取消
				if (expand.cancel_reserve == 0) {
					var time_cancel = expand.time_cancel_reserve;
					var timeArr = time_cancel.split(':');
					registerDate = new Date(registerStartTime);
					registerDate.setHours(timeArr[0]);
					// 如果还没到退房时间
					if (new Date().getTime() < registerDate.getTime()) {
						$('#cancel_type_1 > span')[0].innerHTML = '放心订!&nbsp;&nbsp;' + registerStartTime + '  ' + timeArr[0] +
							'点前免费取消!';
						$('#pay_tip_div_contont').html('订单支付后, ' + registerStartTime + '  ' + timeArr[0] +'时 前可免费取消,逾期不可取消/变更;如未入住,酒店将扣除全额房费;房间整晚保留,请及时入住')
						document.getElementById('cancel_type_1').style.display = 'inline';
					} else {
						document.getElementById('cancel_type_2').style.display = 'inline';
						$('#pay_tip_div_contont').html('不可取消,现已过取消时间');
					}
				} else {
					document.getElementById('cancel_type_3').style.display = 'inline';
					$('#pay_tip_div_contont').html('不可取消,该房间预定后不可取消');
				}

				// 设置弹窗商品详情相关内容
				fillGoodsInfo(data.data);

				// 设置入住人数:默认1人
				roomNumber = 1;
				// 设置单价
				goodsPrice = data.data.price;
				// 计算商品价格
				countGoodsPrice();
			}
		}
	});
}

/**
 * 设置头部信息
 * 参数一: 商家名称
 * 参数二: 商品扩展信息json
 */
function spliceTitleStr(name, date) {
	var titleStr = name + ':';
	if (date.type_bed != '-') {
		titleStr += date.type_bed;
	}
	if (date.breakfast != '-') {
		if (date.breakfast == 0) {
			titleStr += '·不含早';
		}
		if (date.breakfast > 0) {
			titleStr += '·含' + date.breakfast + '份早';
		}
	}
	if (date.windows != '-') {
		titleStr += '·' + date.windows + '窗';
	}
	$('.order_title_str > p')[1].innerText = titleStr;
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
			if (data.status == 0) {
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

				if (wnkState == -1 && is_open_card == 0 && make_wnk_state == 1) {
					mui.confirm('开通万能卡购买只需' + wnk_price + "元", '优惠提示', ['取消', '去开通'], function(e) {
						if (e.index == 0) {
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

//初始化账户显示余额
function initShowBalance() {
	document.getElementById('general_integral_balance').innerText = general_integral_balance;
	document.getElementById('cash_coupon_balance').innerText = cash_coupon_balance;
	document.getElementById('coupon_balance').innerText = coupon_balance;
}


//积分使用开关打开状态,swith_type-0通用积分,swith_type-1现金劵,swith_type-2优惠券
function integral_make_swith(swith_type) {
	if (swith_type == 0) {
		if (genergal_swith_state == 0) {
			genergal_swith_state = 1;
			$("#gengeral_integral_div").show();
		} else {
			genergal_swith_state = 0;
			general_integral_make_amount = 0;
			$("#gengeral_integral_div").hide();
		}
	} else if (swith_type == 1) {
		if (cash_coupon_swith_state == 0) {
			cash_coupon_swith_state = 1;
			$("#cash_coupon_div").show();
		} else {
			cash_coupon_swith_state = 0;
			cash_coupon_make_amount = 0;
			$("#cash_coupon_div").hide();
		}
	} else {
		if (coupon_swith_state == 0) {
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
	if (genergal_swith_state == 1) {
		open_swith_number = open_swith_number + 1;
	}
	if (cash_coupon_swith_state == 1) {
		open_swith_number = open_swith_number + 1;
	}
	if (coupon_swith_state == 1) {
		open_swith_number = open_swith_number + 1;
	}
	if (open_swith_number > 0) {
		automatic_input_amount(open_swith_number, goodsTotalPrice);
	} else {
		$("#wx_pay_div").show();
		document.getElementById("pay_amount").innerText = "￥" + goodsTotalPrice + "元";
	}
}

//自动填充积分支付数据,open_number-开关打开数量,surplus_pay_amount-剩余支付金额
function automatic_input_amount(open_number, surplus_pay_amount) {
	//平均每项支付
	var averageItemPay = surplus_pay_amount / open_number;
	if (coupon_swith_state == 1) {
		//优惠券可支付金额
		var couponCanAmount = coupon_balance * 9.9;
		couponCanAmount = couponCanAmount.toFixed(2);
		if (couponCanAmount > Math.floor(averageItemPay)) {
			coupon_make_amount = Math.floor(averageItemPay) / 9.9;
			coupon_make_amount = Math.floor(coupon_make_amount);
			if (coupon_make_amount <= 0) {
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
	if (cash_coupon_swith_state == 1) {
		averageItemPay = surplus_pay_amount / open_number;
		if (cash_coupon_balance > Math.floor(averageItemPay)) {
			cash_coupon_make_amount = Math.floor(averageItemPay);
		} else {
			//			cash_coupon_make_amount = coupon_balance;
			cash_coupon_make_amount = cash_coupon_balance;
		}
		surplus_pay_amount = surplus_pay_amount - cash_coupon_make_amount;
		surplus_pay_amount = surplus_pay_amount.toFixed(2);
		open_number = open_number - 1;
	}
	if (genergal_swith_state == 1) {
		averageItemPay = surplus_pay_amount / open_number;
		if (general_integral_balance > averageItemPay) {
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
	if (surplus_pay_amount > 0.00) {
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

//支付选择事件(0-微信支付)
function pay_choose(choose_pay_type) {
	if (choose_pay_type == 0) {
		if (wx_pay_choose_state == 0) {
			wx_pay_choose_state = 1;
		} else {
			wx_pay_choose_state = 0;
		}
		if (wx_pay_choose_state == 0) {
			$("#wx_pay_div").removeClass("pay_sel");
			document.getElementById("wx_pay").src = "../images/choose.svg";
		} else {
			$("#wx_pay_div").addClass("pay_sel");
			document.getElementById("wx_pay").src = "../images/choose_select.svg";
		}
	}
}

function fillGoodsInfo(data) {
	$('.goods_info_title > span')[0].innerHTML = data.name;
	var photoArr = data.photo.split('|');
	var slider = $('.mui-slider-loop');
	slider.empty();
	// 插入循环节点最后一张
	var html = '' +
		'<div class="mui-slider-item mui-slider-item-duplicate">' +
		'		<a href="#"><img src="' + data.photo_prefix + photoArr[photoArr.length - 2] + '" /></a>' +
		'</div>';
	slider.append(html);
	for (var i = 0; i < photoArr.length - 1; i++) {
		var html = '' +
			'<div class="mui-slider-item">' +
			'		<a href="#"><img src="' + data.photo_prefix + photoArr[i] + '" /></a>' +
			'</div>';
		slider.append(html);
	}
	var html = '' +
		'<div class="mui-slider-item mui-slider-item-duplicate">' +
		'		<a href="#"><img src="' + data.photo_prefix + photoArr[0] + '" /></a>' +
		'</div>';
	slider.append(html);

	mui('.mui-slider').slider({
		interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
	});

	// 房间设施
	var ul = $('#facilities_ul');
	ul.empty();
	var expand = data.expand;
	if (expand.area != undefined && expand.area != null && expand.area != '-') {
		ul.append('<li>' +
			'	<span>面积</span>' +
			'	<span class="goods_info_facility_content">' + expand.area + '</span>' +
			'</li>');
	}

	if (expand.breakfast != undefined && expand.breakfast != null && expand.breakfast != '-') {
		if (expand.breakfast == 0) {
			ul.append('<li>' +
				'	<span>早餐</span>' +
				'	<span class="goods_info_facility_content">无早餐</span>' +
				'</li>');
		} else {
			ul.append('<li>' +
				'	<span>早餐</span>' +
				'	<span class="goods_info_facility_content">' + expand.breakfast + '份早餐</span>' +
				'</li>');
		}

	}

	if (expand.floor != undefined && expand.floor != null && expand.floor != '-') {
		ul.append('<li>' +
			'	<span>楼层</span>' +
			'	<span class="goods_info_facility_content">' + expand.floor + '楼</span>' +
			'</li>');
	}

	if (expand.windows != undefined && expand.windows != null && expand.windows != '-') {
		ul.append('<li>' +
			'	<span>窗户</span>' +
			'	<span class="goods_info_facility_content">' + expand.windows + '</span>' +
			'</li>');
	}

	if (expand.lives != undefined && expand.lives != null && expand.lives != '-') {
		ul.append('<li>' +
			'	<span>可住</span>' +
			'	<span class="goods_info_facility_content">' + expand.lives + '人</span>' +
			'</li>');
	}

	if (expand.air_conditioner != undefined && expand.air_conditioner != null && expand.air_conditioner != '-') {
		ul.append('<li>' +
			'	<span>空调</span>' +
			'	<span class="goods_info_facility_content">' + expand.air_conditioner + '</span>' +
			'</li>');
	}

	if (expand.bathroom != undefined && expand.bathroom != null && expand.bathroom != '-') {
		ul.append('<li>' +
			'	<span>卫浴</span>' +
			'	<span class="goods_info_facility_content">' + expand.bathroom + '</span>' +
			'</li>');
	}

	if (expand.broadband != undefined && expand.broadband != null && expand.broadband != '-') {
		ul.append('<li>' +
			'	<span>宽带</span>' +
			'	<span class="goods_info_facility_content">' + expand.broadband + '</span>' +
			'</li>');
	}

	if (expand.type_bed != undefined && expand.type_bed != null && expand.type_bed != '-') {
		ul.append('<li>' +
			'	<span>床型</span>' +
			'	<span class="goods_info_facility_content">' + expand.type_bed + '</span>' +
			'</li>');
	}

	if (expand.size_bed != undefined && expand.size_bed != null && expand.size_bed != '-') {
		ul.append('<li>' +
			'	<span>床尺寸</span>' +
			'	<span class="goods_info_facility_content">' + expand.size_bed + '</span>' +
			'</li>');
	}

	if (expand.num_bed != undefined && expand.num_bed != null && expand.num_bed != '-') {
		ul.append('<li>' +
			'	<span>床数量</span>' +
			'	<span class="goods_info_facility_content">' + expand.num_bed + '张</span>' +
			'</li>');
	}

	if (expand.bathroom_matching != undefined && expand.bathroom_matching != null && expand.bathroom_matching != '-') {
		ul.append('<li>' +
			'	<span>浴室配套</span>' +
			'	<span class="goods_info_facility_content">' + expand.bathroom_matching + '</span>' +
			'</li>');
	}

	if (expand.electric != undefined && expand.electric != null && expand.electric != '-') {
		ul.append('<li>' +
			'	<span>生活电器</span>' +
			'	<span class="goods_info_facility_content">' + expand.electric + '</span>' +
			'</li>');
	}

	if (expand.media != undefined && expand.media != null && expand.media != '-') {
		ul.append('<li>' +
			'	<span>媒体设施</span>' +
			'	<span class="goods_info_facility_content">' + expand.media + '</span>' +
			'</li>');
	}

	if (expand.window_description != undefined && expand.window_description != null && expand.window_description !=
		'-') {
		ul.append('<li>' +
			'	<span>窗户说明</span>' +
			'	<span class="goods_info_facility_content">' + expand.window_description + '</span>' +
			'</li>');
	}

	if (expand.room_features != undefined && expand.room_features != null && expand.room_features != '-') {
		ul.append('<li>' +
			'	<span>房间特色</span>' +
			'	<span class="goods_info_facility_content">' + expand.room_features + '</span>' +
			'</li>');
	}

	if (expand.others != undefined && expand.others != null && expand.others != '-') {
		ul.append('<li>' +
			'	<span>其他</span>' +
			'	<span class="goods_info_facility_content">' + expand.others + '</span>' +
			'</li>');
	}

	// 隐藏6项目以外的
	var li = $('#facilities_ul > li');
	if (li.length >= 5) {
		for (var i = 1; i < li.length - 5; i++) {
			li[i + 5].style.display = "none";
		}
	} else {
		$('.goods_info_facility > a').remove();
	}

	// 使用规则
	$('.goods_info_rule  li > span')[0].innerHTML = data.expand.time_enter;
	$('.goods_info_rule  li > span')[1].innerHTML = data.expand.time_check_out;

}

/**显示更多房型设施*/
function showGoodsConfig() {
	var str = this.innerHTML.split('<');
	if (String(str[0]) === '查看更多房型设置 ') {
		var li = $('#facilities_ul > li');
		for (var i = 0; i < li.length; i++) {
			li[i].style.display = "inline";
		}
		this.innerHTML = '收起 <img src="../images/arrow_up.png" alt="" />';
	} else {

		var li = $('#facilities_ul > li');
		for (var i = 1; i < li.length - 5; i++) {
			li[i + 5].style.display = "none";
		}
		this.innerHTML = '查看更多房型设置 <img src="../images/arrow_under.png" alt="" />';
	}

}
