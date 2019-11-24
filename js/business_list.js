var storage = window.localStorage;

//type_id
var type_id = -1;
//距离(1-1公里,3-3公里，5-5公里,10-10公里,-1-全城)
var juli = -1;
//排序类型(1-离我最近,2-销量最高,3-价格最低)
var sort_type = 1;
//用户是否已开通万能卡(-1未开通)
var wnk_state = -1; 

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		type_id = self.type_id; //获得参数
		getNearbyBusiness(type_id, juli, sort_type);
		console.log('type_id:' + type_id);
		getBusinessType();
		// 绑定商户分类列表切换事件
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
					mui.confirm('尊敬的万能卡会员,您可以享受全年免费健身;您可以选择适合您的健身房开通门店后,即可免费健身一年,门店开通费39.9元/家/年', '优惠提示', ['不开通', '去开通'],
						function(e) {
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
								type_id: type_id, //商品所属类型id(电影院、健身、美发...)
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

		// 绑定搜索按钮事件
		mui('.head').on('tap', '.searchsubmit', function() {
			var search_content = document.getElementById('search_content').value;
			if(search_content != undefined && search_content != "") {
				mui.openWindow({
					url: "../html/search.html",
					id: "search.html",
					extras: {
						search_content: search_content
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

//获取商家分类
function getBusinessType() {
	toast(2, "打开loading");
	$("#type_choose_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkBusinessType",
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
					if(type_id == obj.id) {
						$(".Brand").text(obj.name);
						html = "<li onclick=\"BusinessTypes(this," + obj.id + ")\"  style=\"color: #40E0D0;\">" + obj.name + "</li>";
					} else {
						html = "<li onclick=\"BusinessTypes(this," + obj.id + ")\">" + obj.name + "</li>";
					}

					$("#type_choose_ul").append(html);
				}

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

//根据分类ID获取商家
function getNearbyBusiness(type_id_current, current_juli, current_sort_type) {

	if(type_id_current != -1 && type_id_current != undefined) {
		type_id = type_id_current;
	}
	if(current_juli != -2 && current_juli != undefined) {
		juli = current_juli;
	}
	if(current_sort_type != -1 && current_sort_type != undefined) {
		sort_type = current_sort_type;
	}
	$("#business_list_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkBusinessByTypeIdAndJuLiTwo",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"type_id": type_id,
			"lat": storage["lat"],
			"longt": storage["longt"],
			"user_juli": parseFloat(juli),
			"sort_type": sort_type + ''
		},
		success: function(data) {
			1
			if(data.status == 0) {
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
			} else {
				toast(1, data.msg);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest.status);
			console.log(XMLHttpRequest.readyState);
			console.log(errorThrown);
		}
	});
}