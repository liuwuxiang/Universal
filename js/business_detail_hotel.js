var storage = window.localStorage;

var popupState = {
	//弹窗状态(false-未打开,1-已打开)
	popup_state: false,
}

//规格id
var guige_id = 1;
var business_id = -1;
//商品所属类型id
var type_id = -1;
var mobile = "";
var commodity_id = -1;
//商家终点经度
var business_end_longt = -1;
//商家终点纬度
var business_end_lat = -1;
//商家名称
var business_name = "";
//会员价
var member_price = -1;
//会员是否已开卡(0-未开卡,1-已开卡)
var member_open_card_state = 0;
//优惠方式(0-定价,1-折扣)
var discount_type = 0;

// 商家所在分类是否执行万能卡
var make_wnk_state = -1;

//入住、离店时间
var joinTime = null;
var outTime = null;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		business_id = self.business_id; //获得参数
		type_id = self.type_id;
		getBusinessTypeIsWnk();
		getBusinessDetail();

		//		// 绑定日期选择
		//		$("#date_start").calendar();
		//		$("#date_end").calendar();
		//		// 选择完成日期的回调事件
		//		$("#date_start").change(selectDateChange)
		//		$("#date_end").change(selectDateChange);

		//酒店入住、离店日期选择
		initCalendar();

		// 绑定购买万能卡点击事件
		mui('.project_button_div').on('tap', '#wnk_buy_button', function() {
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
				createNew: true,
			});
		})

		// 绑定立即购买按钮点击事件
		mui('.project_button_div').on('tap', '#buy_button', function() {
			if(guige_id == -1) {
				$.toast("暂无商品规格", "cancel", null);
			} else {
				mui.openWindow({
					url: "../html/goods_buy_two.html",
					id: "goods_buy_two.html",
					extras: {
						guige_id: guige_id,
						commodity_id: commodity_id,
						type_id: type_id, //商品类型id(用于限制会员优惠每天使用次数)
						business_id: business_id, //商家id(用于获取会员当天在该商家消费次数)
					},
					styles: {
						top: '0px',
						bottom: '0px',
					},
					createNew: true,
				});
			}
		})

		// 绑定商户位置点击事件
		mui('.address_div').on('tap', '.left_address_div', function() {
			if('Android' === plus.os.name && navigator.userAgent.indexOf('StreamApp') > 0) {
				plus.nativeUI.toast('当前环境暂不支持地图插件');
				return;
			}
			//用户起点经度
			var user_start_longt = storage["longt"];
			//用户起点纬度
			var user_start_lat = storage["lat"];

			if(user_start_longt == undefined || user_start_longt == null || user_start_lat == undefined || user_start_lat ==
				null) {
				toast(1, "当前用户起点无法确定");
			} else if(business_end_longt == -1 || business_end_longt == undefined || business_end_longt == null ||
				business_end_lat == -1 || business_end_lat == undefined || business_end_lat == null) {
				toast(1, "当前商家无地理位置");
			} else {
				//调用第三方导航传入的坐标必须是WGS-84 坐标，所以需要将坐标转换成 wgs坐标(参考文献：https://blog.csdn.net/ren365880/article/details/53883569)
				//BD-09 to GCJ-02先将百度坐标转成中国坐标
				//				var tmp = GPS.bd_decrypt(business_end_lat,business_end_longt);
				//GCJ-02 to WGS-84再将中国坐标转成GPS坐标
				var dstarrBusiness = GPS.gcj_decrypt_exact(business_end_lat, business_end_longt);
				var business_longt = dstarrBusiness["lon"];
				var business_lat = dstarrBusiness["lat"];
				//用户坐标已在进入首页获取时转换为WPS坐标系
				//				var dstarrUser = GPS.gcj_decrypt_exact(user_start_lat,user_start_longt);
				//				user_start_lat = dstarrUser["lat"];
				//				user_start_longt = dstarrUser["lon"];
				console.log("user_lat = " + user_start_lat + ";user_long=" + user_start_longt);
				console.log("business_lat = " + business_lat + ";business_long=" + business_longt);
				var dst = new plus.maps.Point(business_longt, business_lat); // 天安门 
				var src = new plus.maps.Point(user_start_longt, user_start_lat); // 大钟寺
				// 调用系统地图显示 
				plus.maps.openSysMap(dst, business_name, src);
			}
		})

	})
})

//酒店入住日历初始化
function initCalendar() {
	$(function() {
		$('#firstSelect').on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$('.mask_calendar').show();
		});
		$('.mask_calendar').on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			if(e.target.className == "mask_calendar") {
				$('.calendar').slideUp(200);
				$('.mask_calendar').fadeOut(200);
			}
		})
		$('#firstSelect').calendarSwitch({
			selectors: {
				sections: ".calendar"
			},
			index: 7, //展示的月份个数
			animateFunction: "slideToggle", //动画效果
			controlDay: true, //知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
			daysnumber: "180", //控制天数
			comeColor: "#0D91FE", //入住颜色
			outColor: "#0D91FE", //离店颜色
			comeoutColor: "#A2D7FF", //入住和离店之间的颜色
			callback: function() { //回调函数
				$('.mask_calendar').fadeOut(200);
				var startDate = $('#startDate').val(); //入住的天数
				var endDate = $('#endDate').val(); //离店的天数
				var NumDate = $('.NumDate').text(); //共多少晚
				//				console.log(startDate);
				//				console.log(endDate);
				//				console.log(NumDate);
				/*************************
				 *******下面做ajax请求******
				 * ***********************/
				//选择完入住和离店日期(请求数据)
				joinTime = new Date(startDate.replace(/-/g,"/"));
				outTime = new Date(endDate.replace(/-/g,"/"));
				console.log("格式化时间："+joinTime+";"+outTime);
				//计算所选日期的星期数
				var weekDays = "日一二三四五六";
				var joinWeekDay = weekDays.charAt(joinTime.getDay());
				var outWeekDay = weekDays.charAt(outTime.getDay());
				$('#startWeekDay').text("周" + joinWeekDay + "入住");
				$('#endWeekDay').text("周" + outWeekDay + "离店");
				// 重新获取分类和商品详情
				getGoodsType();

			},
			comfireBtn: '.comfire' //确定按钮的class或者id
		});
		var b = new Date();
		var ye = b.getFullYear();
		var mo = b.getMonth() + 1;
		mo = mo < 10 ? "0" + mo : mo;
		var da = b.getDate();
		da = da < 10 ? "0" + da : da;
		$('#startDate').val(ye + '-' + mo + '-' + da);
		b = new Date(b.getTime() + 24 * 3600 * 1000);
		var ye = b.getFullYear();
		var mo = b.getMonth() + 1;
		mo = mo < 10 ? "0" + mo : mo;
		var da = b.getDate();
		da = da < 10 ? "0" + da : da;
		$('#endDate').val(ye + '-' + mo + '-' + da);
	});
}

function selectDateChange() {
	var startDateStr = $("#date_start").val();
	console.log(startDateStr);
	var endDateStr = $("#date_end").val();
	// 如果都选择了则计算时间差
	if(String(startDateStr) !== '' && startDateStr != undefined && String(endDateStr) !== '' && endDateStr != undefined) {
		var startDateObj = new Date(startDateStr);
		var endDateObj = new Date(endDateStr);
		var days = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (24 * 3600 * 1000));
		if(parseInt(days) <= 0) {
			plus.nativeUI.toast('结束时间大于开始时间');
			document.getElementById('time_difference').innerHTML = '共0晚';
		} else {
			document.getElementById('time_difference').innerHTML = '共***' + days + '晚';
			// TODO 处理选择时间后获取商家信息
			joinTime = startDateObj;
			outTime = endDateObj;
			console.log("酒店日期：" + joinTime + ";" + outTime);
			// 重新获取分类和商品详情
			getGoodsType();
		}
	}
}

//获取商家分类每一项宽度并设置ul宽度
function getBusinessTypeWidthSet() {
	var width = 0;
	var business_type_ul = document.getElementById("business_type_ul");
	var lis = business_type_ul.getElementsByTagName("li");
	for(var index = 0; index < lis.length; index++) {
		var li = lis[index];
		width = width + li.offsetWidth;
	}
	business_type_ul.style.width = 100 * lis.length + "px";
}

//商家分类li点击事件
function businessTypeClick(li_id) {
	var business_type_ul = document.getElementById("business_type_ul");
	var lis = business_type_ul.getElementsByTagName("li");
	for(var index = 0; index < lis.length; index++) {
		var li = lis[index];
		var liId = li.id;
		if(liId == li_id) {
			li.setAttribute("class", "li_type sel");
		} else {
			li.setAttribute("class", "li_type");
		}
	}
	getGoodsTypeGoods(li_id);
}

//商品详情
function goodsDetail(goods_id) {
	commodity_id = goods_id;
	getCommodityDetail(goods_id);
}

//拨打电话
function callMobile() {
	window.location.href = "tel://" + mobile;
}

//获取商家详情
function getBusinessDetail() {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/selectBusinesssDetail",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"business_id": business_id
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				var banners = data.data.banners;
				business_name = data.data.store_name;
				//商家终点经度
				business_end_longt = data.data.longt;
				//商家终点纬度
				business_end_lat = data.data.lat;
				document.getElementById("business_name").innerText = data.data.store_name;
				document.getElementById("address").innerText = data.data.address;
				document.getElementById("tese_content").innerText = data.data.tese_label;
				document.getElementById("fuwu_content").innerText = data.data.fuwu_label;
				document.getElementById("kaiye_state").innerText = data.data.store_kaiye_state;
				document.getElementById("yingye_date").innerText = "营业时间:" + data.data.business_hours;
				mobile = data.data.contact_mobile;
				var collection_state = data.data.collection_state;
				if(collection_state == 0) {
					document.getElementById("shouchang_img").src = "../images/icon/shouchang.svg";
				} else {
					document.getElementById("shouchang_img").src = "../images/icon/shouchang_sel.svg";
				}
				initBanner(banners);
				getGoodsType();
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

//初始化banner
function initBanner(banners) {
	$("#swiper-wrapper div").remove();
	for(var index = 0; index < banners.length; index++) {
		var photoUrl = banners[index];
		var html = "<div class=\"swiper-slide\"><img src=\"" + photoUrl + "\"  style=\"height: 200px;\"/></div>";
		$("#swiper-wrapper").append(html);
	}
	$(".swiper-container").swiper({
		loop: true,
		autoplay: 2000
	});
}

//获取商品分类
function getGoodsType() {
	toast(2, "打开loading");
	$("#business_type_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkCommodityAllType",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"business_id": business_id
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				var type_id = -1;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					var html = "";
					if(index == 0) {
						type_id = obj.id;
						html = "<li class=\"li_type sel\" id=\"" + obj.id + "\" onclick=\"businessTypeClick(this.id)\">" +
							"<a>" + obj.type_name + "</a>" +
							"</li>";
					} else {
						html = "<li class=\"li_type\" id=\"" + obj.id + "\" onclick=\"businessTypeClick(this.id)\">" +
							"<a>" + obj.type_name + "</a>" +
							"</li>";
					}
					$("#business_type_ul").append(html);
				}
				getBusinessTypeWidthSet();
				if(type_id != -1) {
					getGoodsTypeGoods(type_id);
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

//获取分类商品
function getGoodsTypeGoods(type_id) {
	var joinTimeStr, outTimeStr;

	joinTime = new Date($('#startDate').val());
	outTime = new Date($('#endDate').val());

	if(joinTime == null) {
		joinTimeStr = '';
	} else {
		joinTimeStr = Date.parse(joinTime)
	}

	if(outTime == null) {
		outTimeStr = '';
	} else {
		outTimeStr = Date.parse(outTime)
	}
	toast(2, "打开loading");
	$("#goods_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkCommodityTypeGoodsByHotel",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"business_id": business_id,
			"goods_type_id": type_id,
			'joinTime': joinTimeStr,
			'outTime': outTimeStr
		},
		success: function(data) {
			//			console.log(JSON.stringify(data));
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				var type_id = -1;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					if(isNaN(obj.goods_tag_str) || obj.goods_tag_str == null) {
						obj.goods_tag_str = ' ';
					}
					if(isNaN(obj.commodity_describe)) {
						obj.commodity_describe = ' ';
					}
					var html = "<li onclick=\"goodsDetail(" + obj.id + ")\">" +
						"<div class=\"li_left_div\">" +
						"<img src=\"" + obj.photo + "\"  onerror=\"this.src='../images/logo.jpg'\"/>" +
						"</div>" +
						"<div class=\"li_right_div\">" +
						"<a class=\"goods_name\">" + obj.name + "</a>";
					//  剩余房间数量
					if(obj.inventory != undefined && obj.inventory != null && obj.inventory != '-1' && obj.inventory < 10) {
						html += "<a class=\"goods_surplus\">仅剩余" + obj.inventory + "间</a>";
					}

					html += "<a class=\"goods_guige\">" + obj.breakfast + '&nbsp;' + obj.type_bed + '&nbsp;' + obj.windows + "</a>" +
						"<a class=\"goods_guige\">" + obj.cancel_reserve + "</a>";

					if(obj.gift_noun != undefined && obj.gift_noun != null && obj.gift_noun != '') {
						html += "<a class=\"donation_ratio\"><span>送</span>消费即赠<span>" + obj.gift_noun + "%</span></a>";
					} else {
						html += "<a class=\"donation_ratio\"></a>";
					}

					html += "<a class=\"goods_price\">￥<span  class=\"routine_price\">" + obj.price +
						"</span><span  class=\"member_price\" id=\"member_price\">" + "" + "</span></a>" +
						"</div>" +
						"</li>";

					$("#goods_ul").append(html);
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

// 进入商品详情页
function getCommodityDetail(commodity_id) {
	mui.openWindow({
		url: "../html/business_goods_detail_hotel.html",
		id: "business_goods_detail_hotel.html",
		extras: {
			commodity_id: commodity_id,
			//商家id(用于获取会员当天在该商家消费次数)
			business_id: business_id,
			joinTime: joinTime,
			outTime: outTime
		},
		styles: {
			top: '0px',
			bottom: '0px',
		},
		createNew: true,
	});

}

//收藏/取消收藏
function collectionOrCancelBusiness() {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/collectionOrCancelBusiness",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"business_id": business_id
		},
		success: function(data) {
			if(data.status == 0) {
				toast(1, data.msg);
				var collection_state = data.data.collection_state;
				if(collection_state == 0) {
					document.getElementById("shouchang_img").src = "../images/icon/shouchang_sel.svg";
				} else {
					document.getElementById("shouchang_img").src = "../images/icon/shouchang.svg";
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

function getBusinessTypeIsWnk() {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/getBusinessTypeIsWnk",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"business_id": business_id,
		},
		success: function(data) {
			if(parseInt(data.status) === 0) {
				make_wnk_state = data.data;
			}
		}
	});
}