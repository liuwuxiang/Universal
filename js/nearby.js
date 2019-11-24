var storage = window.localStorage;
//商户一级标签id
var one_tag_id = -1;
//商户二级标签id
var two_tag_id = -1;
//以及标签类别(0-分类,1-一级标签)
var one_tag_type = 1;
//用户是否已开通万能卡(-1未开通)
var wnk_state = -1;

mui.init({
	pullRefresh: {
		container: '#slider',
		down: {
			style: 'circle',
			callback: pullupRefresh,
			height: '0', //可选,默认50px.下拉刷新控件的高度,
			range: '100px', //可选 默认100px,控件可下拉拖拽的范围
			offset: '0.5px', //可选 默认0px,下拉刷新控件的起始位置
			auto: false, //可选,默认false.首次加载自动上拉刷新一次
		},
	}
});
// 下拉刷新操作事件
function pullupRefresh() {
	setTimeout(function() {
		//		initCurrentCityName();
		getUserBaseInformation();
		getBusinessOneTag();
		userSelectImgDoingsSpread();
		mui('#slider').pullRefresh().endPulldown();
	}, 1000)
}

//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	// 防止手机弹出输入法是tar跟着跑
	plus.webview.currentWebview().setStyle({
		height: 'd'
	});
	mui.ready(function() {
		//		initCurrentCityName();
		getUserBaseInformation();
		getBusinessOneTag();
		userSelectImgDoingsSpread();

		// 搜索框点击事件
		mui('.serch').on('tap', 'input', function() {
			mui.openWindow({
				url: "../html/search_two.html",
				id: "search_two.html",
				extras: {

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

		// 绑定消息中心点击事件
		mui('.head').on('tap', '#message_center', function() {
			mui.openWindow({
				url: "../html/message_center.html",
				id: "message_center.html",
				extras: {},
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

		// 绑定商户一级标签列表切换事件
		mui('#business_type_ul').on('tap', 'li', function() {
			var li_id = this.getAttribute('id');
			var li_type = this.getAttribute('name');
			var business_type_ul = document.getElementById("business_type_ul");
			var lis = business_type_ul.getElementsByTagName("li");
			for(var index = 0; index < lis.length; index++) {
				var li = lis[index];
				var liId = li.id;
				var liType = li.getAttribute('name');
				if(liId == li_id && li_type == liType) {
					li.setAttribute("class", "li_type sel");
				} else {
					li.setAttribute("class", "li_type");
				}
			}
			one_tag_id = li_id;
			two_tag_id = -1;
			one_tag_type = this.getAttribute('name');
			getBusinessTwoTagList();
		})

		// 绑定商户二级标签列表切换事件
		mui('#business_two_tag_ul').on('tap', 'li', function() {
			var li_id = this.getAttribute('id');
			var business_type_ul = document.getElementById("business_two_tag_ul");
			var lis = business_type_ul.getElementsByTagName("li");
			for(var index = 0; index < lis.length; index++) {
				var li = lis[index];
				var liId = li.id;
				if(liId == li_id) {
					li.setAttribute("class", "two_li_type sel");
				} else {
					li.setAttribute("class", "two_li_type");
				}
			}
			two_tag_id = li_id;
			getBusinessByTagId();
		})

		// 绑定商户列表点击事件
		mui('#business_list_ul').on('tap', 'li', function() {
			var business_id = this.getAttribute('id');
			var data_card = this.getAttribute('data-card');
			if(data_card == 1) {
				if(wnk_state == -1) {
					mui.confirm('开通万能卡可全年享受免费健身,只需门店开通费39.9元/家/年', '优惠提示', ['不开通', '去开通'], function(e) {
						if(e.index == 0) {
							jumpBusinessDetail(business_id);
						} else {
							jumpWnkOpenCard();
						}
					}, 'div');
				} else {
					mui.confirm('尊敬的万能卡会员,您可以享受全年免费健身;您可以选择适合您的健身房开通门店后,即可免费健身一年,门店开通费39.9元/家/年', '优惠提示', ['不开通', '去开通'], function(e) {
						if(e.index == 0) {
							jumpBusinessDetail(business_id);
						} else {
							jumpMemberOpenCard(business_id);
						}
					}, 'div');
				}
			} else {
				jumpBusinessDetail(business_id);
			}
		})

		//跳转万能卡开卡页面
		function jumpWnkOpenCard() {
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

		//跳转会员卡开卡页面
		function jumpMemberOpenCard(business_id) {
			mui.openWindow({
				url: "../html/open_business_member_card.html",
				id: "open_business_member_card.html",
				extras: {
					business_id: business_id
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

		//跳转商家详情页
		function jumpBusinessDetail(business_id) {
			toast(2, "打开loading");
			$.ajax({
				url: Main.url + "/app/v1.0.0/getWnkBusinessTypeByBusinessId",
				type: "POST",
				dataType: 'json',
				data: {
					user_id: storage["user_id"],
					business_id: business_id
				},
				success: function(data) {
					toast(3, "关闭loading");
					if(parseInt(data.status) === 0 && data.data != null) {
						var url = '';
						var id = '';
						switch(String(data.data.name)) {
							case '酒店':
								url = '../html/business_detail_hotel.html';
								id = 'business_detail_hotel.html';
								break;
							default:
								url = '../html/business_detail.html';
								id = 'business_detail.html';
								break;
						}
						mui.openWindow({
							url: url,
							id: id,
							extras: {
								business_id: business_id,
							},
							styles: {
								top: '0px',
								bottom: '0px',
							},
							createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
						});

					}
				}
			});
		}

		//		// 绑定位置选择事件
		//		mui('.head').on('tap', '.address', function() {
		//			var business_id = this.getAttribute('id');
		//			mui.openWindow({
		//			   url: "../html/location_choose.html",
		//			   id: "location_choose.html",
		//			   extras:{},
		//			   styles: {
		//			    top: '0px',
		//			    bottom: '0px',
		//			   },
		//			   createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		//			   show: {
		//			    autoShow: true, //页面loaded事件发生后自动显示，默认为true
		//			    aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
		//			    duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		//			   },
		//			   waiting: {
		//			    autoShow: true, //自动显示等待框，默认为true
		//			    title: '正在加载...', //等待对话框上显示的提示内容
		//			   }
		//			});
		//		})

		// 绑定扫一扫按钮事件
		mui('.head').on('tap', '#scan_button', function() {
			var business_id = this.getAttribute('id');
			mui.openWindow({
				url: "../html/barcode.html",
				id: "barcode.html",
				extras: {},
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

		// 绑定搜索按钮事件
		//		mui('.head').on('tap', '.searchsubmit', function() {
		//			var search_content = document.getElementById('search_content').value;
		//			if(search_content != undefined && search_content != ""){
		//				mui.openWindow({
		//				   url: "../html/search.html",
		//				   id: "search.html",
		//				   extras:{
		//				   		search_content:search_content
		//				   },
		//				   styles: {
		//				    top: '0px',
		//				    bottom: '0px',
		//				   },
		//				   createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		//				   show: {
		//				    autoShow: true, //页面loaded事件发生后自动显示，默认为true
		//				    aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
		//				    duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		//				   },
		//				   waiting: {
		//				    autoShow: true, //自动显示等待框，默认为true
		//				    title: '正在加载...', //等待对话框上显示的提示内容
		//				   }
		//				});
		//			}
		//		})

		// 绑定banner第一张轮播图点击事件
		mui('.swiper-wrapper').on('tap', 'div', function() {
			//当data-type=1时id值为长图链接,当data-type=0时id值为商家id
			var banner_ids = this.getAttribute('id');
			//data-type=0:跳转到商家主页的轮播图,data-type=1跳转到内容页的轮播图,data-type=2:系统轮播图
			var type = this.getAttribute('data-type');
			console.log("type=" + type);
			var links = "";
			if(type == 2) {
				if(banner_ids == "banner1") {
					links = "https://mp.weixin.qq.com/s/J-uQldolUidTAWCTi52QTw";
				} else {
					links = "https://mp.weixin.qq.com/s/chOQvb5wNrfQj-w8beu9MA";
				}
				mui.openWindow({
					url: "../html/external_links.html",
					id: "external_links.html",
					extras: {
						links: links
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
			} else if(type == 0) {
				mui.openWindow({
					url: "../html/business_detail.html",
					id: "business_detail.html",
					extras: {
						business_id: banner_ids
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
			} else if(type == 1) {
				mui.openWindow({
					url: "../html/advertisement_chart.html",
					id: "advertisement_chart.html",
					extras: {
						img_link: banner_ids
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
	})

})

//获取用户基础信息(消息)
function getUserBaseInformation() {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/getUserBaseInformation",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				//设置消息按钮的提示状态
				var no_read_message_count = data.data.no_read_message_count;
				if(no_read_message_count > 0) {
					document.getElementById("message_center").setAttribute("class", "message_center sel");
				} else {
					document.getElementById("message_center").setAttribute("class", "message_center");
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

//获取商家一级标签
function getBusinessOneTag() {
	toast(2, "打开loading");
	$("#business_type_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkBusinessOneTagNearby",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					var html = "";
					if(index == 0) {
						one_tag_id = obj.id;
						one_tag_type = obj.type;
						html = "<li class=\"li_type sel\" id=\"" + obj.id + "\" name=\"" + obj.type + "\">" +
							"<a>" + obj.name + "</a>" +
							"<div></div>" +
							"</li>";
					} else {
						html = "<li class=\"li_type\" id=\"" + obj.id + "\" name=\"" + obj.type + "\">" +
							"<a>" + obj.name + "</a>" +
							"<div></div>" +
							"</li>";
					}
					$("#business_type_ul").append(html);
				}
				getBusinessOneTagWidthSet();
				getBusinessTwoTagList();
			} else if(data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				joinLoginPage();
			} else {
				toast(1, data.msg);
			}
		}
	});
}

//获取一级标签下的所有二级标签
function getBusinessTwoTagList() {
	$("#business_two_tag_ul li").remove();
	if(one_tag_type == 0) {
		getNearbyBusiness();
		$("#business_two_tag_div").hide();
	} else {
		$("#business_two_tag_div").show();
		$.ajax({
			url: Main.url + "/app/v1.0.0/getWnkBusinessTwoTag",
			type: "POST",
			dataType: 'json',
			data: {
				"user_id": storage["user_id"],
				"one_tag_id": one_tag_id
			},
			success: function(data) {
				if(data.status == 0) {
					toast(3, "关闭loading");
					var list = data.data;
					var html_quanbu = "<li class=\"two_li_type sel\" id=\"-1\">" +
						"<a>全部</a>" +
						"</li>";
					$("#business_two_tag_ul").append(html_quanbu);
					console.log(html_quanbu);
					for(var index = 0; index < list.length; index++) {
						var obj = list[index];
						var html = "<li class=\"two_li_type\" id=\"" + obj.id + "\">" +
							"<a>" + obj.name + "</a>" +
							"</li>";
						$("#business_two_tag_ul").append(html);
					}
					getBusinessTwoTagWidthSet();
					getBusinessByTagId();
				} else if(data.status == 2) {
					storage["user_id"] = "";
					toast(1, data.msg);
					joinLoginPage();
				} else {
					toast(1, data.msg);
				}
			}
		});
	}
}

//根据分类ID获取商家
function getNearbyBusiness() {
	publicnull_tip("暂无数据", 1);
	$("#business_list_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkBusinessByTypeIdAndJuLiTwo",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"type_id": one_tag_id,
			"lat": storage["lat"],
			"longt": storage["longt"],
			"user_juli": -1,
			"sort_type": 1
		},
		success: function(data) {
			if(data.status == 0) {
				publicnull_tip("暂无数据", 0);
				toast(3, "关闭loading");
				wnk_state = data.data.wnk_state;
				var list = data.data.list;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					var business_hours = obj.business_hours;
					if(business_hours == undefined) {
						business_hours = "";
					}
					var html = "<li id=\"" + obj.business_id + "\"\">" +
						"<div class=\"li_left_div\">" +
						"<img src=\"" + obj.fm_photo + "\"  onerror=\"this.src='../images/logo.jpg'\"/>" +
						"<a>" + business_hours + "</a>" +
						"</div>" +
						"<div class=\"li_right_div\">" +
						"<a>" + obj.store_name + "</a>" +
						"<a>" + obj.juli + "</a>";
					//TODO 店铺未启用万能卡权益的最高商品赠送比例(如果没有则隐藏赠送)
					if(obj.gift_noun != undefined && obj.gift_noun != null && obj.gift_noun != '') {
						html += "<a>[" + obj.area + "]<span><span>送</span>消费即赠<span>" + obj.gift_noun + "%</span></span></a>";
					} else {
						html += "<a>[" + obj.area + "]</a>";
					}

					html += "<a><span>惠</span>" + obj.store_describe + "</a>" +
						"<a><span>￥" + obj.min_price + "起</span><span>" + obj.member_price + "</span></a>" +
						"<a>已售" + obj.sale + "</a>" +
						"<div class=\"li_bottom_div\">" +
						"<div class=\"tese_div\">" +
						"<div>";
					var tese_label = obj.tese_label.trim();
					//指定的分隔符把一个字符串分割存储到数组
					if(tese_label != "" && tese_label != undefined) {
						var tese_labels = tese_label.split(" ");
						for(var i = 0; i < tese_labels.length; i++) {
							html += "<p>" + tese_labels[i] + "</p>";
						}
					}

					html += "</div>" +
						"<div>";

					var fuwu_label = obj.fuwu_label.trim();
					if(fuwu_label != "" && tese_label != undefined) {
						var fuwu_labels = fuwu_label.split(" ");
						for(var i = 0; i < fuwu_labels.length; i++) {
							html += "<p>" + fuwu_labels[i] + "</p>";
						}
					}

					var vip_icon_state = obj.vip_icon_state;
					if(vip_icon_state == 1) {
						html += "</div>" +
							"</div>" +
							"<img src=\"../images/VIP.png\" class=\"vip_icon\"/>" +
							"</div>" +
							"</li>";
					} else {
						html += "</div>" +
							"</div>" +
							"</div></li>";
					}
					$("#business_list_ul").append(html);
				}

			} else if(data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				joinLoginPage();
				publicnull_tip(data.msg, 1);
			} else {
				toast(1, data.msg);
				publicnull_tip(data.msg, 1);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest.status);
			console.log(XMLHttpRequest.readyState);
			console.log(errorThrown);
		}
	});
}

//获取标签下的商家
function getBusinessByTagId() {
	var tag_id = -1;
	if(two_tag_id == -1) {
		tag_id = one_tag_id;
	} else {
		tag_id = two_tag_id;
	}
	publicnull_tip("暂无数据", 1);
	toast(2, "打开loading");
	$("#business_list_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkBusinessByTagId",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"tag_id": tag_id,
			"lat": storage["lat"],
			"longt": storage["longt"],
			"user_juli": -1,
			"sort_type": 1
		},
		success: function(data) {
			if(data.status == 0) {
				publicnull_tip("暂无数据", 0);
				toast(3, "关闭loading");
				var list = data.data;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					var business_hours = obj.business_hours;
					if(business_hours == undefined) {
						business_hours = "";
					}
					var html = "<li id=\"" + obj.business_id + "\" data-card = \"" + obj.business_card_state + "\">" +
						"<div class=\"li_left_div\">" +
						"<img src=\"" + obj.fm_photo + "\"  onerror=\"this.src='../images/logo.jpg'\"/>" +
						"<a>" + business_hours + "</a>" +
						"</div>" +
						"<div class=\"li_right_div\">" +
						"<a>" + obj.store_name + "</a>" +
						"<a>" + obj.juli + "</a>";
					//TODO 店铺未启用万能卡权益的最高商品赠送比例(如果没有则隐藏赠送)
					if(obj.gift_noun != undefined && obj.gift_noun != null && obj.gift_noun != '') {
						html += "<a>[" + obj.area + "]<span><span>送</span>消费即赠<span>" + obj.gift_noun + "%</span></span></a>";
					} else {
						html += "<a>[" + obj.area + "]</a>";
					}
					html += "<a><span>惠</span>" + obj.store_describe + "</a>" +
						"<a><span>￥" + obj.min_price + "起</span><span>" + obj.member_price + "</span></a>" +
						"<a>已售" + obj.sale + "</a>" +
						"<div class=\"li_bottom_div\">" +
						"<div class=\"tese_div\">" +
						"<div>";
					var tese_label = obj.tese_label.trim();
					//指定的分隔符把一个字符串分割存储到数组
					if(tese_label != "" && tese_label != undefined) {
						var tese_labels = tese_label.split(" ");
						for(var i = 0; i < tese_labels.length; i++) {
							html += "<p>" + tese_labels[i] + "</p>";
						}
					}

					html += "</div>" +
						"<div>";

					var fuwu_label = obj.fuwu_label.trim();
					if(fuwu_label != "" && tese_label != undefined) {
						var fuwu_labels = fuwu_label.split(" ");
						for(var i = 0; i < fuwu_labels.length; i++) {
							html += "<p>" + fuwu_labels[i] + "</p>";
						}
					}

					var vip_icon_state = obj.vip_icon_state;
					if(vip_icon_state == 1) {
						html += "</div>" +
							"</div>" +
							"<img src=\"../images/VIP.png\" class=\"vip_icon\"/>" +
							"</div>" +
							"</li>";
					} else {
						html += "</div>" +
							"</div>" +
							"</div></li>";
					}
					$("#business_list_ul").append(html);
				}

			} else if(data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				publicnull_tip(data.msg, 1);
				joinLoginPage();
			} else {
				toast(1, data.msg);
				publicnull_tip(data.msg, 1);
			}
		}
	});
}

//获取商户一级标签每一项宽度并设置ul宽度
function getBusinessOneTagWidthSet() {
	var width = 0;
	var business_type_ul = document.getElementById("business_type_ul");
	var lis = business_type_ul.getElementsByTagName("li");
	for(var index = 0; index < lis.length; index++) {
		var li = lis[index];
		width = width + li.offsetWidth;
	}
	//	business_type_ul.style.width = width + "px";
	business_type_ul.style.width = (lis.length + 1) * 100 + "px";
}

//获取商户二级标签每一项宽度并设置ul宽度
function getBusinessTwoTagWidthSet() {
	var width = 0;
	var business_type_ul = document.getElementById("business_two_tag_ul");
	var lis = business_type_ul.getElementsByTagName("li");
	for(var index = 0; index < lis.length; index++) {
		var li = lis[index];
		width = width + li.offsetWidth;
	}
	//	business_type_ul.style.width = width+20 + "px";
	business_type_ul.style.width = (lis.length + 1) * 100 + "px";
}

/*
 * 提示修改
 * */
function publicnull_tip(content, state) {
	var publicnull_tip = document.getElementById("publicnull_tip");
	if(state == 0) {
		publicnull_tip.style.display = "none";
	} else {
		document.getElementById("request_tip").innerText = content;
		publicnull_tip.style.display = "block";
	}
}

//初始化当前城市名
function initCurrentCityName() {
	//	if(storage["city"] == undefined || storage["city"] == "" || storage["city"] == null){
	//		document.getElementById("current_city_name").innerText = "曲靖";
	//	}
	//	else{
	//		document.getElementById("current_city_name").innerText = storage["city"];
	//	}
}

//获取商家轮播图推广信息
function userSelectImgDoingsSpread() {
	//	  toast(2,"打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/userSelectImgDoingsSpread",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if(data.status == 0) {
				//	                toast(3,"关闭loading");
				var list = data.data;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					var html = "";
					if(obj.gallery_type == 1) {
						html = "<div class=\"swiper-slide\" id=\"" + obj.gallery_content_img + "\" data-type=\"" + obj.gallery_type + "\"><img src=\"" + obj.gallery_img + "\" /></div>";
					} else {
						html = "<div class=\"swiper-slide\" id=\"" + obj.business_id + "\" data-type=\"" + obj.gallery_type + "\"><img src=\"" + obj.gallery_img + "\" /></div>";
					}

					$(".swiper-wrapper").append(html);
				}
				$(".swiper-container").swiper({
					loop: true,
					autoplay: 2000
				});
			} else if(data.status == 2) {
				storage["user_id"] = "";
				//	            		toast(1,data.msg);
				joinLoginPage();
			} else {
				//	                toast(1,data.msg);
				$(".swiper-container").swiper({
					loop: true,
					autoplay: 2000
				});
			}
		}
	});
}