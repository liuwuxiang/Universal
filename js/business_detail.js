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

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		business_id = self.business_id; //获得参数
		type_id = self.type_id;
		getBusinessTypeIsWnk();

		getBusinessDetail();

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

//关闭商品详情弹出视图
function closePop() {
	//	$("#full").popup('hide');
}

//规格信息选择(is_wnk-是否执行万能卡价格,0-执行,1-不执行)
function guigeChoose(record_id, index_tag, price, is_wnk) {
	guige_id = record_id;
	var lis = $("#guige_ul li");
	document.getElementById("goods_price").innerText = price;
	for(var index = 0; index < lis.length; index++) {
		var li = lis[index];
		if(index == index_tag) {
			li.setAttribute("class", "no_choose_li choose_li");
		} else {
			li.setAttribute("class", "no_choose_li");
		}
	}
	if(is_wnk == 0) {
		if(member_price != -1) {
			console.log("member_price=" + member_price);
			$("#member_price_tk").show();
			//  			console.log("discount_type="+discount_type);
			if(discount_type == 0) {
				document.getElementById("member_price_tk").innerText = "会员价:￥" + member_price;
			} else {
				var price_current = price * (member_price / 100);
				price_current = price_current.toFixed(2);
				document.getElementById("member_price_tk").innerText = "会员价:￥" + price_current;
			}
		} else {
			$("#member_price_tk").hide();
		}

		if(member_open_card_state == 0) {
			document.getElementById("goods_price_tk").style.textDecoration = "none";
		} else {
			document.getElementById("goods_price_tk").style.textDecoration = "line-through";
		}
	} else {
		$("#member_price_tk").hide();
		document.getElementById("goods_price_tk").style.textDecoration = "none";
	}
}

//商品购买
function buy_shop(pay_way, html_id) {
	if(guige_id == -1) {
		$.toast("暂无商品规格", "cancel", function(toast) {
			console.log(toast);
		});
	} else {
		mui.openWindow({
			url: html_id,
			id: html_id,
			extras: {
				guige_id: guige_id,
				commodity_id: commodity_id
			}
		});
	}
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
	toast(2, "打开loading");
	$("#goods_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkCommodityTypeGoods",
		type: "POST",
		dataType: 'json', 
		data: {
			"user_id": storage["user_id"],
			"business_id": business_id,
			"goods_type_id": type_id
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				var type_id = -1;
				console.log("商品分类："+JSON.stringify(data));
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					console.log(JSON.stringify(obj));
					var html = "<li onclick=\"goodsDetail(" + obj.id + ")\">" +
						"<div class=\"li_left_div\">" +
						"<img src=\"" + obj.photo + "\"  onerror=\"this.src='../images/logo.jpg'\"/>" +
						"</div>" +
						"<div class=\"li_right_div\">" +
						"<a class=\"goods_name\">" + obj.name + "</a>" +
						"<a class=\"goods_guige\">" + obj.commodity_describe + "</a>" +
						"<a class=\"goods_guige\">" + obj.goods_tag_str + "</a>";
					if(obj.gift_noun != undefined && obj.gift_noun != null && obj.gift_noun != '') {
						html += "<a class=\"donation_ratio\"><span>送</span>消费即赠<span>" +  obj.gift_noun + "%</span></a>";
					} else {
						html += "<a class=\"donation_ratio\"></a>";
					}

					html += "<a class=\"goods_price\">￥<span  class=\"routine_price\">" + obj.price +
						"</span><span  class=\"member_price\" id=\"member_price\">" + obj.wnk_price + "</span></a>" +
						//						"<a class=\"member_price\" id=\"member_price\">"+obj.wnk_price+"</a>"+
						//						"<div class=\"li_number_div\">"+
						//							"<input type=\"button\" value=\"购买\"/>"+
						//						"</div>"+
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

//获取商品信息
function getCommodityDetail(commodity_id) {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/getCommodityDetail",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"commodity_id": commodity_id
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.status == 0) {
				toast(3, "关闭loading");
				document.getElementById("goods_name").innerText = data.data.name;
				//该商品所有规格中最高的赠送比例(如果没有则不显示)
				if(data.data.gift_noun != undefined && data.data.gift_noun != null && data.data.gift_noun != ''){
					document.getElementById("goods_donation_ratio_div").style.display = 'block';
					document.getElementById("goods_donation_ratio").innerText = data.data.gift_noun + '%';
				}else{
					document.getElementById("goods_donation_ratio_div").style.display = 'none';
				}
				document.getElementById("goods_price").innerText = data.data.price;
				document.getElementById("project_detail").innerText = data.data.commodity_describe;
				var banners = data.data.banners;
				document.getElementById("goods_img").src = data.data.photo;
				member_price = data.data.member_price;
				member_open_card_state = data.data.member_open_card_state;
				discount_type = data.data.discount_type;
				if(member_open_card_state == 0 && make_wnk_state === 1) {
					document.getElementById("goods_price_tk").style.textDecoration = "none";
					$("#wnk_buy_button").show();
					document.getElementById("wnk_buy_button").style.width = "50%";
					document.getElementById("buy_button").style.width = "50%";
				} else {
					document.getElementById("goods_price_tk").style.textDecoration = "line-through";
					$("#wnk_buy_button").hide();
					document.getElementById("buy_button").style.width = "100%";
				}
				//              if (data.data.is_make_wnk == 1){
				//                  document.getElementById("wnk_buy_button").style.display = "block";
				//              }
				//              else{
				//              		document.getElementById("wnk_buy_button").style.display = "none";
				//              }
				getCommoditySpecification(commodity_id);
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

//获取商品规格信息
function getCommoditySpecification(commodity_id) {
	toast(2, "打开loading");
	$("#guige_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkCommoditySpecification",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"commodity_id": commodity_id
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					var html = "";
					if(index == 0) {
						guige_id = obj.id;
						html = "<li class=\"no_choose_li choose_li\" onclick=\"guigeChoose(" + obj.id + "," + index + "," + obj.price +
							"," + obj.is_wnk + ")\">" + obj.specifications_name + "</li>";
						document.getElementById("goods_price").innerText = obj.price;
						if(obj.is_wnk == 0) {
							$("#member_price_tk").show();
							if(discount_type == 0) {
								document.getElementById("member_price_tk").innerText = "会员价:￥" + member_price;
								if(member_open_card_state == 0) {
									document.getElementById("goods_price_tk").style.textDecoration = "none";
								} else {
									document.getElementById("goods_price_tk").style.textDecoration = "line-through";
								}
							} else {
								var price = obj.price * (member_price / 100);
								price = price.toFixed(2);
								document.getElementById("member_price_tk").innerText = "会员价:￥" + price;
								if(member_open_card_state == 0) {
									document.getElementById("goods_price_tk").style.textDecoration = "none";
								} else {
									document.getElementById("goods_price_tk").style.textDecoration = "line-through";
								}
							}
						} else {
							$("#member_price_tk").hide();
							document.getElementById("goods_price_tk").style.textDecoration = "none";
						}
					} else {
						html = "<li class=\"no_choose_li\" onclick=\"guigeChoose(" + obj.id + "," + index + "," + obj.price + "," +
							obj.is_wnk + ")\">" + obj.specifications_name + "</li>";
					}
					$("#guige_ul").append(html);
				}
				popupState.popup_state = true;
				$("#full").popup('open');
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

function closeView() {
	if(popupState.popup_state == true) {
		$.closePopup();
		popupState.popup_state = false;
	}

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