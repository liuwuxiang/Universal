var storage = window.localStorage;


var goods_id = -1;
var business_id = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	//获取商品详情
	function getGoodsById() {
		toast(2, "打开loading");
		$.ajax({
			url: Main.url + "/wx/v1.0.0/getIntegralByIdAndWnk",
			type: "POST",
			dataType: 'json',
			data: {
				"user_id": storage["user_id"],
				"goods_id": goods_id,
				"business_id": business_id 
			},
			success: function(data) {
				if (data.status == 0) {
					toast(3, "关闭loading");
					// 设置大图
					jQuery("#top_img").attr("src", data.data.imgPath + data.data.img);
					jQuery(".goods_name").text(data.data.name);
					jQuery("#text-highlight").text(data.data.price);
					jQuery(".desc-main").html(data.data.detail);
					jQuery(".business_name").html(data.data.store_name);
					getIntegralUser();
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

	//获取用户信息
	function getIntegralUser() {
		toast(2, "打开loading");
		$.ajax({
			url: Main.url + "/wx/v1.0.0/getUserIntegral",
			type: "POST",
			dataType: 'json',
			data: {
				"user_id": storage["user_id"],
				"business_id": business_id
			},
			success: function(data) {
				if (data.status == 0) {
					toast(3, "关闭loading");
					console.log(data.data.integral);
					if (parseInt(data.data.integral) <= parseInt(jQuery("#text-highlight").text())) {
						jQuery('.pay-bar-cell1 > div').empty().html("积分不足");
						jQuery('.pay-bar-cell1 > div').addClass("disabled");
					} else {
						jQuery('.pay-bar-cell1 > div').empty().html("立即兑换");
						jQuery('.pay-bar-cell1 > div').removeClass("disabled");
						jQuery('#pay-bar').click(function() {
							goodsDuiHuan();
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

	//商品兑换
	function goodsDuiHuan() {
		mui.openWindow({
			url: "../html/business_integral_goods_buy.html",
			id: "business_integral_goods_buy.html",
			extras: {
				goods_id: goods_id,
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

	mui.ready(function() {
		var self = plus.webview.currentWebview();


		goods_id = self.goods_id; //获得参数
		business_id = self.business_id;

		getGoodsById();
		// 绑定店铺按钮事件
		mui('.container-footer').on('tap', '.shop_div', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
				url: "../html/business_integral_store.html",
				id: "business_integral_store.html",
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
		})
	})
})
