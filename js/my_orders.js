var storage = window.localStorage;

//顶部选项当前选中项
var topOptionCurrentChooseIndex = -1;

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
		if (topOptionCurrentChooseIndex == -1) {
			optionClick(1);
		} else {
			optionClick(topOptionCurrentChooseIndex);
		}
		mui('#slider').pullRefresh().endPulldown();
	}, 1000)
}

//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		if (topOptionCurrentChooseIndex == -1) {
			optionClick(1);
		} else {
			optionClick(topOptionCurrentChooseIndex);
		}

		// 绑定列表切换事件
		mui('#order_in_progress_ul').on('tap', 'li', function() {
			var order_id = this.getAttribute('id');
			var order_type = this.getAttribute('data-type');
			if (order_id != null) {
				switch (parseInt(order_type)) {
					case 0:
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
						});
						break;
					case 1: // 酒店类
						mui.openWindow({
							url: "../html/order_detail_hotel.html",
							id: "order_detail_hotel.html",
							extras: {
								order_id: order_id
							},
							styles: {
								top: '0px',
								bottom: '0px',
							},
							createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
						});
						break;
					default:
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
						});
						break;
				}

			}
		})
	})

})

//选项切换事件(0-待支付,1-待使用,2-已完成,3-酒店)
function optionClick(index) {
	if (index == 3) {
		document.getElementById("hotel_order").setAttribute("class", "item sel");
		document.getElementById("no_make_order").setAttribute("class", "item");
		document.getElementById("finish_order").setAttribute("class", "item");
		topOptionCurrentChooseIndex = 3;
	} else if (index == 1) {
		document.getElementById("hotel_order").setAttribute("class", "item");
		document.getElementById("no_make_order").setAttribute("class", "item sel");
		document.getElementById("finish_order").setAttribute("class", "item");
		topOptionCurrentChooseIndex = 1;
	} else if (index == 2) {
		document.getElementById("hotel_order").setAttribute("class", "item");
		document.getElementById("no_make_order").setAttribute("class", "item");
		document.getElementById("finish_order").setAttribute("class", "item sel");
		topOptionCurrentChooseIndex = 2;
	}
	getXFOrderData(index);
}



//消费消费订单数据
function getXFOrderData(state) {
	publicnull_tip("暂无数据", 1);
	$("#order_in_progress_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v2.0.0/wnkWnkMyOrder",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"state": state
		},
		success: function(data) {
			if (data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data.list;
				if (list.length <= 0) {
					toast(1, "暂无数据");
				} else {
					publicnull_tip("暂无数据", 0);
					for (var index = 0; index < list.length; index++) {
						var obj = list[index];
						var commodity_list = obj.commodity_list;
						var html = "<li class=\"order_li\" id=\"" + obj.id + "\" name=\"0\" data-type=\"" + obj.order_type + "\" >" +
							"<div class=\"li_top_div\">" +
							"<a class=\"li_top_day_tag\">" + obj.day + "</a>" +
							"<a class=\"li_order_no_tag\">" + obj.business_name + "</a>" +
							"</div>" +
							"<div class=\"li_commodites_div\">" +
							"<a class=\"commodities_number_tag\">商品(" + commodity_list.length + ")</a>" +
							"<ul class=\"commodities_ul\">";
						for (var index2 = 0; index2 < commodity_list.length; index2++) {
							var commodity = commodity_list[index2];
							var specifications_name = commodity.specifications_name;
							if (specifications_name == undefined) {
								specifications_name = "";
							}
							html = html + "<li>" +
								"<a class=\"commodity_name_tag\">" + commodity.commodity_name + "(" + specifications_name + ")</a>" +
								"<a class=\"commodity_number_tag\">x" + commodity.buy_number + "</a>" +
								"<a class=\"price_tag\">" + commodity.count_amount + "</a>" +
								"</li>";
						}
						html = html + "</ul>" +
							"</div>" +
							"<div class=\"li_bottom_div\">" +
							"<a class=\"line_order_time\">" + obj.submit_time_str + "</a>" +
							"<a class=\"order_price_tag\">￥" + obj.amount + "</a>" +
							"</div></li>";
						$("#order_in_progress_ul").append(html);
					}
					document.getElementById("top_people_static_tag").innerText = "消费次数：" + data.data.xf_cs + "次";
					var count_amount = data.data.count_amount;
					count_amount = count_amount.toFixed(2);
					document.getElementById("top_number_static_tag").innerText = "金额：" + count_amount + "元";
				}
			} else if (data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				joinLoginPage();
				document.getElementById("top_people_static_tag").innerText = "消费次数：0次";
				document.getElementById("top_number_static_tag").innerText = "金额：0元";
			} else {
				toast(1, data.msg);
				publicnull_tip(data.msg, 1);
				document.getElementById("top_people_static_tag").innerText = "消费次数：0次";
				document.getElementById("top_number_static_tag").innerText = "金额：0元";
			}
		}
	});
}

/*
 * 提示修改
 * */
function publicnull_tip(content, state) {
	var publicnull_tip = document.getElementById("publicnull_tip");
	if (state == 0) {
		publicnull_tip.style.display = "none";
	} else {
		document.getElementById("request_tip").innerText = content;
		publicnull_tip.style.display = "block";
	}
}
