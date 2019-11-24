var storage = window.localStorage;

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
	// 防止手机弹出输入法是tar跟着跑
	plus.webview.currentWebview().setStyle({
		height: 'd'
	});

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

	//绑定积分和兑换记录点击事件
	mui('.integral_and_exchange_record').on('tap', 'div', function() {
		var item = this.getAttribute('class');
		if(item == 'integral') {
			//积分（1、平台：跳转积分明细；2、商家：显示商家兑换积分总和(不跳转)）
			if(type_tab == 0) {
				mui.openWindow({
					url: "../html/my_integral_two.html",
					id: "my_integral_two.html",
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
			}
		} else if(item == 'exchange_record') {
			//兑换记录(1、平台：跳转平台积分商城兑换列表；2、商家：跳转所有商家类积分兑换记录)
			if(type_tab == 0) {
				mui.openWindow({
					url: "",
					id: "",
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
			} else if(type_tab == 1) {
				mui.openWindow({
					url: "",
					id: "",
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
			}
		}
	});

})

//将基础的请求方法统一放一起
function getNewDatas(type_tab) {
	//		//定位
	//		initCurrentCityName();
	//		//商品分类
	//		getGoodsType();
	//积分数量
	getIntegralByTypeTab(type_tab);
	//推荐商品
	getRecommendGoodsInfo(type_tab);
	//轮播图
	userSelectImgDoingsSpread(type_tab);
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
	toast(2, "打开loading");
	$("#recommrnd_div a").remove();
	$.ajax({
		url: Main.url + "/wx/v1.0.0/getRecommendGoodsInfo",
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
					var html = "<a id=\"" + obj.id + "\" class=\"item\">" +
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

/*根据type_tab获取积分——>1、平台：平台剩余积分； 2、商家：商家兑换积分总和
 * @param type_tab:顶部选显卡id
 * */
function getIntegralByTypeTab(type_tab) {
	var req_url = '';
	if(type_tab == 0) {
		//平台剩余积分
		req_url = '';
	} else if(type_tab == 1) {
		//商家兑换积分总和
		req_url = '';
	}
	$.ajax({
		url: Main.url + req_url,
		type: 'POST',
		dataType: 'json',
		data: {

		},
		success: function(data) {
			if(data.status == 0) {
				//取出积分

				$('#integral_tab').text('');
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

/*切换不同的推荐列表样式*/
function changeListStyle(type_tab) {
	if(type_tab == 0) {
		$('.mask_item_business').css('visibility', 'hidden');
	} else if(type_tab == 1) {
		$('.mask_item_business').css('visibility', 'visible');
	}
}