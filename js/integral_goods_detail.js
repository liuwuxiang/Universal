var storage = window.localStorage;


var goods_id = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		goods_id = self.goods_id; //获得参数
		//获取商品详情
		function getGoodsDetail() {
			toast(2, "打开loading");
			$.ajax({
				url: Main.url + "/wx/v1.0.0/getGoodsById",
				type: "POST",
				dataType: 'json',
				data: {
					"user_id": storage["user_id"],
					"id": goods_id
				},
				success: function(data) {
					console.log(JSON.stringify(data));
					if (data.status == 0) {
						toast(3, "关闭loading");
						$("#top_img").attr("src", data.data.IntegralGoods.img);
						$("#goods_name").text(data.data.IntegralGoods.name);
						$("#text-highlight").text(data.data.IntegralGoods.price);
						$("#desc-main").empty();
						$("#desc-main").html(data.data.IntegralGoods.detail);
						if (parseInt(data.data.integral) <= parseInt(data.data.IntegralGoods.price)) {
							$('.pay-bar-cell1 > div').empty().html("积分不足");
							$('.pay-bar-cell1 > div').addClass(" disabled");
						} else {
							$('.pay-bar-cell1 > div').empty().html("立即兑换");
							$('.pay-bar-cell1 > div').removeClass(" disabled");
							$('#pay-bar').click(function() {
								console.log("----" + data.data.IntegralGoods.id);
								goodsDuiHuan(data.data.IntegralGoods.id);
							})
						}

					} else if (data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
						joinLoginPage();
					} else {
						toast(1, data.msg);
					}
				}
			});
		}

		getGoodsDetail();

		//商品兑换
		function goodsDuiHuan(goods_id) {
			mui.openWindow({
				url: "../html/integral_order_confirm.html",
				id: "integral_order_confirm.html",
				extras: {
					goods_id: goods_id
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
