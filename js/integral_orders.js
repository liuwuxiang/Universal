var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		//积分商城界面积分兑换记录(平台：0、商家：1)
		var order_type = self.record_type;
		if(order_type == 0) {
			//平台
			optionClick(0);
		} else if(order_type == 1) {
			//商家
			optionClick(1);
		} else {
			optionClick(0);
		}
		// 绑定列表切换事件
		mui('#order_in_progress_ul').on('tap', 'li', function() {
			var data_type = this.getAttribute('data-type');
			if(data_type == 0) {
				var order_id = this.getAttribute('id');
				mui.openWindow({
					url: "../html/integral_order_detail.html",
					id: "integral_order_detail.html",
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
			} else {
				var order_id = this.getAttribute('id');
				var business_id = this.getAttribute('name');
				mui.openWindow({
					url: "../html/business_integral_mall_orders_detail.html",
					id: "business_integral_mall_orders_detail.html",
					extras: {
						order_id: order_id,
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

		})
	})

})

//选项切换事件(0-平台积分订单,1-商家积分订单)
function optionClick(index) {
	if(index == 0) {
		document.getElementById("pingtai_orders").setAttribute("class", "item sel");
		document.getElementById("business_orders").setAttribute("class", "item");
		getOrders();
	} else if(index == 1) {
		document.getElementById("pingtai_orders").setAttribute("class", "item");
		document.getElementById("business_orders").setAttribute("class", "item sel");
		getUserInBusinessOrders();
	}

}

//获取商家订单
function getUserInBusinessOrders() {
	publicnull_tip("暂无数据", 1);
	toast(2, "打开loading");
	$("#order_in_progress_ul li").remove();
	$.ajax({
		url: Main.url + "/wx/v1.0.0/getIntegralWnkOrderByUserId",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if(data.status == 0) {
				publicnull_tip("暂无数据", 0);
				toast(3, "关闭loading");
				var img_ph = data.msg;
				var list = data.data;
				
				for(var index = 0; index < list.length - 1; index++) {
					var status;
					switch(list[index].status) {
						case 0:
							status = "已支付";
							break;
						case 1:
							status = "已完成";
							break;
					}
					var html = "<li data-type=\"1\" class=\"order_li\" id=\"" + data.data[index].order_id + "\" name=\"" + data.data[index].business_id + "\">" +
						"<div class=\"li_top_div\">" +
						"<a class=\"order_no\">下单时间：<span>" + data.data[index].creation_time_str + "</span></a>" +
						"<a class=\"order_status\">" + status + "</a>" +
						"</div>" +
						"<div class=\"goods_div\">" +
						"<img src=\"" + data.msg + data.data[index].img + "\"/>" +
						"<div class=\"goods_information_div\">" +
						"<a>" + data.data[index].goods_name + "</a>" +
						"<a>" + data.data[index].business_name + "</a>" +
						"</div>" +
						"</div>" +
						"<div class=\"li_bottom_div\">" +
						"<a>共<span>1</span>件商品,实付<span>" + data.data[index].price + "</span>积分</a>" +
						"<a>订单详细</a>" +
						"</div>" +
						"</li>";
					$("#order_in_progress_ul").append(html);
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

//获取订单
function getOrders() {
	publicnull_tip("暂无数据", 1);
	toast(2, "打开loading");
	$("#order_in_progress_ul li").remove();
	$.ajax({
		url: Main.url + "/wx/v1.0.0/getIntegralOrderById",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if(data.status == 0) {
				publicnull_tip("暂无数据", 0);
				toast(3, "关闭loading");
				var list = data.data;
				for(var index = 0; index < list.length - 1; index++) {
					var status;
					switch(data.data[index].status) {
						case 0:
							status = "已付款";
							break;
						case 1:
							status = "已发货";
							break;
						case 2:
							status = "交易成功";
							break;
						default:
							status = "渲染异常";
					}
					var html = "<li data-type=\"0\" class=\"order_li\" id=\"" + data.data[index].order_id + "\">" +
						"<div class=\"li_top_div\">" +
						"<a class=\"order_no\">下单时间：<span>" + data.data[index].startTime_str + "</span></a>" +
						"<a class=\"order_status\">" + status + "</a>" +
						"</div>" +
						"<div class=\"goods_div\">" +
						"<img src=\"" + data.data[index].img + "\"/>" +
						"<div class=\"goods_information_div\">" +
						"<a>" + data.data[index].name + "</a>" +
						"<a>" + data.data[index].address + "</a>" +
						"</div>" +
						"</div>" +
						"<div class=\"li_bottom_div\">" +
						"<a>共<span>" + data.data[index].count + "</span>件商品,实付<span>" + data.data[index].price + "</span>积分</a>" +
						"<a>订单追踪</a>" +
						"</div>" +
						"</li>";
					$("#order_in_progress_ul").append(html);
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

//进入订单详情页
function joinOrderDetail(order_no, html_id) {
	//打开页面

	mui.openWindow({
		url: html_id,
		id: html_id,
		extras: {
			order_no: order_no
		},
		styles: {
			top: '0px',
			bottom: '0px',
		},
		extras: {},
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