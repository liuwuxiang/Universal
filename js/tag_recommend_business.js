var storage = window.localStorage;
//一级标签id
var one_tag_id = -1;
//二级标签id
var type_id = -1;
//距离(1-1公里,3-3公里，5-5公里,10-10公里,-1-全城)
var juli = -1;
//排序类型(1-离我最近,2-销量最高,3-价格最低)
var sort_type = 1;
//一级标签名称
var one_tag_name_name = "";

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		one_tag_id = self.one_tag_id; //获得参数
		var one_tag_name = self.one_tag_name; //获得参数
		one_tag_name_name = self.one_tag_name; //获得参数
		document.getElementById("title_tag_name").innerText = one_tag_name;
		getNearbyBusiness();
		// 绑定商户列表点击事件
		mui('#nearby_business_ul').on('tap', 'li', function() {
			var business_id = this.getAttribute('id');
			var data_card = this.getAttribute('data-card');
			//			if(data_card == 1){
			//				mui.confirm('开通商家会员卡可全年免费享受服务','优惠提示',['不开通','去开通'],function(e){
			//					if(e.index == 0){
			//						jumpBusinessDetail(business_id);
			//					}
			//					else{
			//						jumpMemberOpenCard(business_id);	
			//					}
			//				},'div');
			//			}
			//			else{
			//				jumpBusinessDetail(business_id);
			//			}
			jumpBusinessDetail(business_id);
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

		// 绑定商户一级标签列表点击事件
		mui('#business_tag_li').on('tap', 'a', function() {
			var two_tag_id = this.getAttribute('id');
			var one_tag_name = this.getAttribute('name');
			mui.openWindow({
				url: "../html/tag_business_list.html",
				id: "tag_business_list.html",
				extras: {
					one_tag_id: one_tag_id,
					one_tag_name: one_tag_name,
					two_tag_id: two_tag_id,
					one_tag_title: one_tag_name_name,
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
	})
})

//获取一级标签下的所有二级标签
function getNearbyBusiness() {
	$("#business_tag_li a").remove();
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
				var length_data = list.length;
				if(list.length > 7) {
					length_data = 7;
				}
				var oneTagImg =
					"<a id=\"-1\" name=\"全部\" class=\"item\"><span class=\"img\"><img src=\"../images/all.png\" alt=\"\"></span>全部</a>";
				$("#business_tag_li").append(oneTagImg);
				for(var index = 0; index < length_data; index++) {
					var obj = list[index];
					var html = "<a id=\"" + obj.id + "\" name=\"" + obj.name + "\" class=\"item\"><span class=\"img\"><img src=\"" +
						obj.photo_id + "\" alt=\"\"></span>" + obj.name + "</a>";
					$("#business_tag_li").append(html);
				}
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

//获取标签下的商家
function getBusinessByTagId() {
	publicnull_tip("暂无数据", 1);
	toast(2, "打开loading");
	$("#nearby_business_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkBusinessByTagId",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"tag_id": one_tag_id,
			"lat": storage["lat"],
			"longt": storage["longt"],
			"user_juli": -1,
			"sort_type": 1
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.status == 0) { 
				publicnull_tip("暂无数据", 0);
				toast(3, "关闭loading");
				var list = data.data;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index]; 
					console.log(JSON.stringify(obj)); 
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

					$("#nearby_business_ul").append(html);
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