var storage = window.localStorage;

var contentWebview = null; //准备打开网址的webview

//记录顶部选项卡 0：平台选项；1：商家选项
var type_tab = 0;
//记录前一次的选项(防止点击顶部重复请求)
var type_tab_last = 0;

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
		getNewDatas(type_tab);

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
		var self = plus.webview.currentWebview();
		var type = self.type; //获得参数
		//		if(type == undefined || type == ""){
		//			$("#scan_button").show();
		//			$(".top_back_button").hide();
		//			document.getElementById("top_search_div").style.width = "62%";
		//			document.getElementById("top_search_div").style.marginLeft = "22%";
		//		}
		//		else{
		//			$("#scan_button").hide();
		//			$(".top_back_button").show();
		//			document.getElementById("top_search_div").style.width = "72%";
		//			document.getElementById("top_search_div").style.marginLeft = "12%";
		//		}

		//初始化：默认选中平台选项
		getNewDatas(type_tab);

		//		// 搜索框点击事件
		//		mui('.serch').on('tap', 'input', function() {
		//			mui.openWindow({
		//				url: "../html/search_two.html",
		//				id: "search_two.html",
		//				extras: {
		//
		//				},
		//				styles: {
		//					top: '0px',
		//					bottom: '0px',
		//				},
		//				createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		//				show: {
		//					autoShow: true, //页面loaded事件发生后自动显示，默认为true
		//					aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
		//					duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		//				},
		//				waiting: {
		//					autoShow: true, //自动显示等待框，默认为true
		//					title: '正在加载...', //等待对话框上显示的提示内容
		//				}
		//			});
		//		})
	})

	//绑定顶部选项卡点击切换事件
	mui('#segmentedControl').on('tap', 'a', function() {
		var name = this.getAttribute('name');
		if(name == 'platform_mall') {
			//平台选项
			type_tab = 0;
			//防止反复点击同一个tab重复请求
			if(type_tab != type_tab_last) {
				getNewDatas(type_tab);
			}
			type_tab_last = type_tab;
		} else if(name == 'business_mall') {
			//商家选项
			type_tab = 1;
			if(type_tab != type_tab_last) {
				getNewDatas(type_tab);
			}
			type_tab_last = type_tab;
		}

	});

	//绑定顶部帮助按钮点击事件
	mui('.head').on('tap', '#help_integrall_mall', function() {
		//帮助类型
		var type_help = -1;
		//标题
		var title_help = '';
		if(type_tab == 0) {
			//平台帮助
			type_help = 0;
			title_help = '平台积分说明帮助';
		} else if(type_tab == 1) {
			//商家帮助
			type_help = 1;
			title_help = '商家积分说明帮助';
		}

		toast(2, "开启loading");
		jQuery.support.cors = true;
		$.ajax({
			url: Main.url + '/app/v1.0.0/getIntegralHelpContent',
			type: "POST",
			dataType: 'json',
			data: {
				"type": type_help
			},
			success: function(data) {
				toast(3, "关闭loading");
				if(data.status == 0) {
					var open_type = data.data.open_type;
					if(open_type == 0) {
						mui.openWindow({
							url: "../html/integral_help.html",
							id: "integral_help.html",
							extras: {
								'title': title_help,
								'type': type_help
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
						showWithWaiting(data.data.content);
					}
				} else if(data.status == 2) {
					mMain.gotoLogin();
				} else {
					mui.openWindow({
						url: "../html/integral_help.html",
						id: "integral_help.html",
						extras: {
							'title': title_help,
							'type': type_help
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
			},
		});

		//根据当前选项卡id跳转不同的帮助页面
		mui.openWindow({
			url: "",
			id: "",
			extras: {
				'type': type_tab
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
	});

	// 绑定积分商品分类列表点击事件
	mui('#indexmenulist').on('tap', 'a', function() {
		var type_id = this.getAttribute('id');
		mui.openWindow({
			url: "../html/integral_goods.html",
			id: "integral_goods.html",
			extras: {
				type_id: type_id
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

	//	// 绑定扫一扫按钮事件
	//	mui('.head').on('tap', '#scan_button', function() {
	//		var business_id = this.getAttribute('id');
	//		mui.openWindow({
	//			url: "../html/barcode.html",
	//			id: "barcode.html",
	//			extras: {},
	//			styles: {
	//				top: '0px',
	//				bottom: '0px',
	//			},
	//			createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	//			show: {
	//				autoShow: true, //页面loaded事件发生后自动显示，默认为true
	//				aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
	//				duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
	//			},
	//			waiting: {
	//				autoShow: true, //自动显示等待框，默认为true
	//				title: '正在加载...', //等待对话框上显示的提示内容
	//			}
	//		});
	//	})

	// 绑定全部商家入口点击事件
	mui('body').on('tap', '#all_integral', function() {
		var target_url = '';
		var target_url_id = '';
		if(type_tab == 0) {
			//平台全部——>全部商品页面
			target_url = '../html/business_integral_mall.html';
			target_url_id = 'business_integral_mall.html';
		} else if(type_tab == 1) {
			//商家全部——>全部商家页面
			target_url = '../html/integral_mall_all_business.html';
			target_url_id = 'integral_mall_all_business.html';
		}
		mui.openWindow({
			url: target_url,
			id: target_url_id,
			extras: {
				//页面id,用于下个页面判断是平台/商家
				page_id: 'platform'
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

	// 绑定积分商品列表点击事件
	mui('#recommrnd_div').on('tap', 'a', function() {
		var goods_id = this.getAttribute('id');
		var business_id = this.getAttribute("data-business");
		if(parseInt(type_tab) === 0) {
			mui.openWindow({
				url: "../html/integral_goods_detail.html",
				id: "integral_goods_detail.html",
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
		} else {
			mui.openWindow({
				url: "../html/business_integral_goods_detail.html",
				id: "business_integral_goods_detail.html",
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

	})

	//	// 绑定位置选择事件
	//	mui('.head').on('tap', '.address', function() {
	//		var search_content = document.getElementById('search_content').value;
	//		mui.openWindow({
	//			url: "../html/location_choose.html",
	//			id: "location_choose.html",
	//			extras: {},
	//			styles: {
	//				top: '0px',
	//				bottom: '0px',
	//			},
	//			createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	//			show: {
	//				autoShow: true, //页面loaded事件发生后自动显示，默认为true
	//				aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
	//				duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
	//			},
	//			waiting: {
	//				autoShow: true, //自动显示等待框，默认为true
	//				title: '正在加载...', //等待对话框上显示的提示内容
	//			}
	//		});
	//	})

	// 绑定搜索按钮事件
	//	mui('.head').on('tap', '.searchsubmit', function() {
	//		var search_content = document.getElementById('search_content').value;
	//		if(search_content != undefined && search_content != ""){
	//			mui.openWindow({
	//			   url: "../html/search.html",
	//			   id: "search.html",
	//			   extras:{
	//			   		search_content:search_content
	//			   },
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
	//		}
	//	})

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
			showWithWaiting(links);

			//			mui.openWindow({
			//				url: "../html/external_links.html",
			//				id: "external_links.html",
			//				extras: {
			//					links: links
			//				},
			//				styles: {
			//					top: '0px',
			//					bottom: '0px',
			//				},
			//				createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			//				show: {
			//					autoShow: true, //页面loaded事件发生后自动显示，默认为true
			//					aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
			//					duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			//				},
			//				waiting: {
			//					autoShow: true, //自动显示等待框，默认为true
			//					title: '正在加载...', //等待对话框上显示的提示内容
			//				}
			//			});
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

	//绑定积分和兑换记录点击事件
	mui('.integral_and_exchange_record').on('tap', 'div', function() {
		var item = this.getAttribute('class');
		if(item == 'integral') {
			if(type_tab == 0) {
				//积分
				//只有平台的积分可以跳转，商家的积分只是显示所有商家兑换积分总和
				mui.openWindow({
					url: "../html/my_integral_two.html",
					id: "my_integral_two.html",
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

		} else if(item == 'exchange_record') {
			//兑换记录
			mui.openWindow({
				url: "../html/integral_orders.html",
				id: "integral_orders.html",
				extras: {
					//平台、商家兑换记录(区分)
					record_type: type_tab
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
	});

})

/**
 * 将基础的请求方法统一放一起
 * 0 - 平台 1 - 商家
 */
function getNewDatas(type_tab) {
	//		//定位
	//		initCurrentCityName();
	//		//商品分类
	//		getGoodsType();
	//轮播图
	userSelectImgDoingsSpread(type_tab);
	//积分数量
	getIntegralByTypeTab(type_tab);
	//推荐商品
	getRecommendGoodsInfo(type_tab);

}

//获取商品分类
function getGoodsType() {
	toast(2, "打开loading");
	$("#indexmenulist a").remove();
	$.ajax({
		url: Main.url + "/wx/v1.0.0/getAllIntegralTypeTrue",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data.list;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					var html = "<a id=\"" + obj.id + "\" class=\"item\"><span class=\"img\"><img src=\"" + obj.img + "\" alt=\"\"></span>" + obj.name + "</a>";
					$("#indexmenulist").append(html);
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

//获取推荐商品
function getRecommendGoodsInfo(type_tab) {
	var url = type_tab == 0 ? Main.url + "/wx/v1.0.0/getRecommendGoodsInfo" : Main.url + "/app/v1.0.0/getWnkBusinessRecommendGoods"
//	toast(2, "打开loading");
	$("#recommrnd_div a").remove();
	$.ajax({
		url: url,
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					console.log(JSON.stringify(obj));
					var html = "<a id=\"" + obj.id + "\" data-business=\"" + obj.business_id + "\" class=\"item\">" +
						"<span class=\"img\">" +
						"<img src=\"" + obj.img + "\" alt=\"\" onerror=\"this.src='../images/img_goods.jpg'\">" +
						"<p class=\"mask_item_business\">" + obj.business_name + "</p>" +
						"</span>" +
						"<p class=\"name\">" + obj.name + "</p>" +
						"<div class=\"price_and_exchanged\">" +
						"<p class=\"price\" style=\"color: #fc9153;\">" + obj.price + "<span style=\"color: black;text-decoration:none;\">积分</span></p>" +
						"<p class=\"exchanged\">已兑换<span>" + obj.exchanged + "</span></p>" +
						"</div>"
					"</a>";

					$("#recommrnd_div").append(html);
					//请求成功，改变列表样式
					changeListStyle(type_tab);
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
function userSelectImgDoingsSpread(type_tab) {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/userSelectImgDoingsSpread",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if(data.status == 0) {
//				toast(3, "关闭loading");
				var list = data.data;
				console.log('轮播图长度：' + list.length);
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

/*根据type_tab获取积分——>1、平台：平台剩余积分； 2、商家：商家兑换积分总和
 * @param type_tab:顶部选显卡id
 *        0-平台 1-积分
 * */
function getIntegralByTypeTab(type_tab) {
//	toast(2, "打开loading");
	var req_url = '';
	if(type_tab == 0) {
		//平台剩余积分
		req_url = '';
	} else if(type_tab == 1) {
		//商家兑换积分总和
		req_url = '';
	}
	$.ajax({
		url: Main.url + "/app/v1.0.0/getUserBaseInformation",
		type: 'POST',
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if(data.status == 0) {
//				toast(3, "关闭loading");
				//取出积分
				if(parseInt(type_tab) === 0) {
					$('#integral_tab').text(data.data.user_integral);
				} else {
					$('#integral_tab').text(data.data.business_integral);
				}

			} else if(data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				joinLoginPage();
			} else {
				toast(1, data.msg);
			}
		},
		error: function() {
			//			Main.initAjax();
		}
	});
}

/*切换不同的推荐列表样式*/
function changeListStyle(type_tab) {
	if(type_tab == 0) {
		$('.mask_item_business').css('visibility', 'hidden');
	} else if(type_tab == 1) {
		$('.mask_item_business').css('visibility', 'visible');
	}
}

// 更新窗口导航栏 
function updateNavigationbar() {
	nTitle = contentWebview.getNavigationbar();
	nTitle.interceptTouchEvent(true);
	//处理点击事件
	nTitle.addEventListener('click', function(e) {
		touchX = e.pageX;
		if(touchX > 3 && touchX < 44) {
			back();
		}
	});
	//补充绘制nTitle界面
	nTitle.drawBitmap(bitmap, null, {
		top: '0px',
		left: '0px',
		width: '44px',
		height: '44px'
	}, 'backicon'); // 绘制返回箭头
}

// 使用原生View控件作为动画模板显示窗口 
function showWithWaiting(loadUrl) {
	var bShow = bUpdate = false;
	contentWebview = plus.webview.create(loadUrl, 'contendWebview', {
		navigationbar: {
			backgroundColor: '#0b8ffe',
			titletText: '标题',
			titleColor: '#FFFFFF'
		}
	});
	// 更新Webview的原生头内容
	updateNavigationbar(); //setTimeout(updateNavigationbar, 100);
	contentWebview.addEventListener('close', function() {
		contentWebview = null;
	});
	contentWebview.addEventListener('titleUpdate', function() {
		bUpdate = true;
		bShow && nWaiting.hide();
	}, false);
	contentWebview.addEventListener('loaded', function() { // 兼容titleUpdate事件不触发的情况
		bUpdate || (bUpdate = true, bShow && nWaiting.hide());
	}, false);
	contentWebview.show('pop-in', null, function() {
		bShow = true;
		bUpdate && nWaiting.hide();
	}, {
		capture: nWaiting
	});
}