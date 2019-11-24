var storage = window.localStorage;

var nWaiting, nTitle; // 原生view的等待界面和title
var touchX; // nWaiting的点击坐标的x数值
var backPressed; //返回箭头是否处于按下状态
var contentWebview = null; //准备打开网址的webview
var bitmap = null; // 返回图标
var topoffset = 0;

//万能卡开卡状态(-1未开卡,0-已开卡)
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
		userSelectImgDoingsSpread();
		getBusinessType();
		getBusinessOneTag();
		getRecommendBusiness();
		getNearbyBusiness(storage["lat"], storage["longt"]);
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
		initCurrentCityName();
		getUserBaseInformation();
		userSelectImgDoingsSpread();
		getBusinessType(); //
		getBusinessOneTag();
		getRecommendBusiness();
		getGeocode();
		// 绑定商户分类列表切换事件
		mui('#indexmenulist').on('tap', 'a', function() {
			var type_id = this.getAttribute('id');
			mui.openWindow({
				url: "../html/business_list.html",
				id: "business_list.html",
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

		// 绑定商户一级标签列表点击事件
		mui('#business_tag_li').on('tap', 'a', function() {
			var tag_business_id = this.getAttribute('id');
			var one_tag_name = this.getAttribute('name');
			mui.openWindow({
				url: "../html/tag_recommend_business.html",
				id: "tag_recommend_business.html",
				extras: {
					one_tag_id: tag_business_id,
					one_tag_name: one_tag_name
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

		// 绑定附近商户列表切换事件
		mui('#nearby_business_ul').on('tap', 'li', function() {
			var business_id = this.getAttribute('id');
			toast(2, "打开loading");
			console.log("参数："+business_id+";"+storage["user_id"]); 
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

		})

		// 绑定推荐商户列表切换事件
		mui('#recommend_business_ul').on('tap', 'li', function() {
			var business_id = this.getAttribute('id');
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
					if (parseInt(data.status) === 0 && data.data != null) {
						var url = '';
						var id = '';
						switch (String(data.data.name)) {
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
		})

		// 绑定万能卡按钮点击事件
		mui('.recommend_div').on('tap', '.wnk_open_card_button', function() {
			if(wnk_state == -1) {
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
			} else {
				mui.openWindow({
					url: "../html/card_bag.html",
					id: "card_bag.html",
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
			}
		})

		// 绑定消息按钮点击事件
		mui('.mui-table-view').on('tap', 'li', function() {
			var html_id = this.getAttribute('id');
			mui.openWindow({
				url: html_id,
				id: html_id,
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
			mui('.mui-popover').popover('hide');
		})

		// 绑定位置选择事件
		mui('.head').on('tap', '.address', function() {
			var business_id = this.getAttribute('id');
			mui.openWindow({
				url: "../html/location_choose.html",
				id: "location_choose.html",
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
					links =
						"https://mp.weixin.qq.com/s?__biz=MzUzNDgzOTMxMA==&mid=100000202&idx=1&sn=9a954fb65c7d4d164b17190ff88d000b&chksm=7a8fe8ab4df861bdafb5ed270839b42371575020ff38f3aef1df7d05da2244e9683e93f3ee2a&scene=0&xtrack=1#rd";
				} else {
					links =
						"https://mp.weixin.qq.com/s?__biz=MzUzNDgzOTMxMA==&mid=100000128&idx=7&sn=3131d3f546212c4c027e7758ffca8144&chksm=7a8fe8e14df861f7b5c65e2ad56bb746de9b3a621f1b8bebfdafcb3bc0c202797cad946ec661&mpshare=1&scene=1&srcid=1129epd6HXSpvEvY6C5prnxg#rd";
				}
				showWithWaiting(links);
				//				mui.openWindow({
				//					   url: "../html/external_links.html",
				//					   id: "external_links.html",
				//					   extras:{
				//					   		links:links
				//					   },
				//					   styles: {
				//					    top: '0px',
				//					    bottom: '0px',
				//					   },
				//					   createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
				//					   show: {
				//					    autoShow: true, //页面loaded事件发生后自动显示，默认为true
				//					    aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
				//					    duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
				//					   },
				//					   waiting: {
				//					    autoShow: true, //自动显示等待框，默认为true
				//					    title: '正在加载...', //等待对话框上显示的提示内容
				//					   }
				//					});
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

		initWebView();
		// 重写返回处理
		var _back = window.back;

		function safeback() {
			contentWebview ? contentWebview.close('pop-out') : (bitmap && bitmap.clear(), nWaiting && nWaiting.clear(),
				_back());
		}
		window.back = safeback;
	})
	// 通过定位模块获取位置信息
	function getGeocode() {
		toast(2, "打开loading");
		// console.log("获取定位位置信息:");
		plus.geolocation.getCurrentPosition(geoInf, function(e) {
			console.log("获取定位位置信息失败：" + e.message);
			toast(1, e.message);
		}, {
			geocode: true
		});
	}

	function geoInf(position) {
		var str = "";
		str += "地址：" + position.addresses + "\n"; //获取地址信息
		str += "坐标类型：" + position.coordsType + "\n";
		var timeflag = position.timestamp; //获取到地理位置信息的时间戳；一个毫秒数；
		str += "时间戳：" + timeflag + "\n";
		var codns = position.coords; //获取地理坐标信息；
		var lat = codns.latitude; //获取到当前位置的纬度；
		str += "纬度：" + lat + "\n";
		var longt = codns.longitude; //获取到当前位置的经度
		str += "经度：" + longt + "\n";
		var alt = codns.altitude; //获取到当前位置的海拔信息；
		str += "海拔：" + alt + "\n";
		var accu = codns.accuracy; //地理坐标信息精确度信息；
		str += "精确度：" + accu + "\n";
		var altAcc = codns.altitudeAccuracy; //获取海拔信息的精确度；
		str += "海拔精确度：" + altAcc + "\n";
		var head = codns.heading; //获取设备的移动方向；
		str += "移动方向：" + head + "\n";
		var sped = codns.speed; //获取设备的移动速度；
		str += "移动速度：" + sped;
		// console.log(str);
		//将坐标从GCJ-02 to WGS-84(将坐标从-02坐标系转到WGS-84坐标系)
		var dstarrUser = GPS.gcj_decrypt_exact(lat, longt);
		lat = dstarrUser["lat"];
		longt = dstarrUser["lon"];
		storage["lat"] = lat;
		storage["longt"] = longt;
		getNearbyBusiness(lat, longt);
		//	outLine( str );
	}

})

//获取商家轮播图推广信息
function userSelectImgDoingsSpread() {
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
				toast(3, "关闭loading");
				var list = data.data;
				console.log('首页轮播图长度：' + list.length);
				for(var index = 0; index < list.length; index++) {
					var obj = list[index];
					var html = "";
					if(obj.gallery_type == 1) {
						html = "<div class=\"swiper-slide\" id=\"" + obj.gallery_content_img + "\" data-type=\"" + obj.gallery_type +
							"\"><img src=\"" + obj.gallery_img + "\" /></div>";
					} else {
						html = "<div class=\"swiper-slide\" id=\"" + obj.business_id + "\" data-type=\"" + obj.gallery_type +
							"\"><img src=\"" + obj.gallery_img + "\" /></div>";
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

//下拉刷新初始化
function dropDownRefreshInit() {
	$("#refresh_div").pullToRefresh(function() {
		dropDownRefreshAction();
	});
}

//下拉刷新处理事件
function dropDownRefreshAction() {
	getBusinessType();
}

//手动下拉刷新初始化
function manualropDownRefreshInit() {
	$("#refresh_div").pullToRefresh('triggerPullToRefresh');
}

//停止下拉刷新
function stopDropDownRefresh() {
	$("#refresh_div").pullToRefreshDone();
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

//获取商家分类
function getBusinessType() {
	toast(2, "打开loading");
	$("#indexmenulist a").remove();
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
				for(var index = 0; index < 4; index++) {
					var obj = list[index];
					var html = "<a id=\"" + obj.id + "\" class=\"item\"><span class=\"img\"><img src=\"" + obj.logo_photo_id +
						"\" alt=\"\"></span>" + obj.name + "</a>";
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

//获取商家一级标签
function getBusinessOneTag() {
	toast(2, "打开loading");
	$("#business_tag_li a").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkBusinessOneTag",
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
					var html = "<a id=\"" + obj.id + "\" class=\"item\" name=\"" + obj.name + "\"><span class=\"img\"><img src=\"" +
						obj.photo_url + "\" alt=\"\"></span>" + obj.name + "</a>";
					$("#business_tag_li").append(html);
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

//获取附近商家
function getNearbyBusiness(lat, longt) {
	toast(2, "打开loading");
	$("#nearby_business_ul li").remove();
	// console.log("********" + lat + ";" + longt + ";" + storage["user_id"]);
	$.ajax({
		url: Main.url + "/app/v1.0.0/getNearbyWnkBusiness",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"lat": lat,
			"longt": longt
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				console.log(JSON.stringify(data));
				var list = data.data;
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

					$("#nearby_business_ul").append(html);
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

//获取推荐商家
function getRecommendBusiness() {
	toast(2, "打开loading");
	$("#recommend_business_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getRecommendWnkBusiness",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				var listLength = list.length;
				if(listLength > 4) {
					listLength = 4;
				}
				for(var index = 0; index < listLength; index++) {
					var obj = list[index];
					var html = "<li id=\"" + obj.id + "\">" +
						"<img src=\"" + obj.fm_photo + "\"/>" +
						"<a class=\"business_name\">" + obj.store_name + "</a>" +
						"<a class=\"business_type\">" + obj.type_name + "</a>" +
						"</li>";
					$("#recommend_business_ul").append(html);
				}
				var clientWidth = document.body.clientWidth;
				var wnk_button_left_width = (clientWidth - 70) / 2;
				document.getElementById("wnk_open_card_button_div").style.marginLeft = wnk_button_left_width + "px";
				document.getElementById("wnk_open_card_button_div").style.display = "block";
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

//获取用户基础信息
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
				wnk_state = data.data.wnk_state;
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
				//              toast(1,data.msg);
			}
		},
	});
}

//初始化webview
function initWebView() {
	if(plus.navigator.isImmersedStatusbar()) { // 兼容沉浸式状态栏模式
		topoffset = Math.round(plus.navigator.getStatusbarHeight());
	}
	var bdata =
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABYCAYAAAADWlKCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKwwAACsMBNCkkqwAAABZ0RVh0Q3JlYXRpb24gVGltZQAwOS8xMi8xM5w+I3MAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAACcklEQVR4nO3a0XESURiG4TeO99iBWoGZ+RvADtKBpAPtwBLsANJBrEAs4MyYDmIHSQXkgk0mMLK7ILt8/+F778ici394OGfDsher1Qqn05tTD+A2M4hYBhHLIGIZRCyDiGUQsQwilkHEMohYBhHLIGIZRCyDiGUQsQwilkHEMohYBhHLIGIZRCyDiGUQsQwilkHEMohYb089wNCVUq6Ay+blfUQsTjhOZxc1P9tbSlkAX7b+/C0ifpxgnF5Ve2TtwAD4OvIoe1UlSAsGwPsRR9m76kA6MAD+jjTKQVUF0gMD4HaEUQ6umot6T4ybiJgNP83hVbFDasGACnZIT4yfEXE1wjj/Xeod0hPjDpgNPsyRSguyB8Y0Ih6Gn+g4pQSpFQMSgtSMAclAaseARCDngAFJQM4FAxKAnBMGiH8xLKVMgV89ln6MiPthpxkn6R0SEUvgusfSZSnlsnuZftI75LlSygyYdyx7ZH1s/Rl+ouFKAQIvx9ctMGlZlh4lDQhAcywtqRhF+hqyXfMmT1m/6buasL6mzMaY6dilAoENlLuWZRNgnhEl1ZH1ulLKO9bH16eOpdfqz2K9Lt0Oea75EjilfadAsp2SFgQ2UH53LJ2XUr4PPtARSntkbVfL7+rVgEBvlM/NHQDJUh9Z2zWf/puOZbPhJzm8qkDgBaXt/teHcSY5rOpAAJp/c/vclJSrShDYifKI+NPvVV3U/1VzU3LavFyo/25SPUi2qj2ysmYQsQwilkHEMohYBhHLIGIZRCyDiGUQsQwilkHEMohYBhHLIGIZRCyDiGUQsQwilkHEMohYBhHLIGIZRCyDiGUQsZ4Ak9fPFwUy/HsAAAAASUVORK5CYII=';
	bitmap = new plus.nativeObj.Bitmap('back');
	bitmap.loadBase64Data(bdata, function() {
		bitmap.isLoadSuccess = true;
		nWaiting && nWaiting.drawBitmap(bitmap, null, {
			top: topoffset + 'px',
			left: '0px',
			width: '44px',
			height: '44px'
		}, 'backicon');
		// console.log('Back bitmap load success');
	}, function(e) {
		// console.log('Back bitmap load failed: ' + JSON.stringify(e));
	});

	//创建nWaiting
	creatWaiting();
}

function creatWaiting() {
	//判断view是否已存在，避免重复创建，尤其调试刷新网页时很容易触发重复创建 
	nWaiting = plus.nativeObj.View.getViewById('nWaiting');
	if(nWaiting) {
		return;
	}
	nWaiting = new plus.nativeObj.View('nWaiting', {
		top: '0px',
		left: '0px',
		height: '100%',
		width: '100%'
	});
	nWaiting.interceptTouchEvent(true);

	//初始化绘制nwaiting界面
	nWaiting.drawRect('#0b8ffe', {
		top: '0px',
		left: '0px',
		height: (topoffset + 44) + 'px',
		width: '100%'
	}) //绘制title背景色
	bitmap && bitmap.isLoadSuccess && nWaiting.drawBitmap(bitmap, null, {
		top: topoffset + 'px',
		left: '0px',
		width: '44px',
		height: '44px'
	}, 'backicon');
	nWaiting.drawText('标题', {
		top: topoffset + 'px',
		left: '0px',
		width: '100%',
		height: '44px'
	}, {
		size: '17px',
		color: '#FFFFFF'
	});
	nWaiting.drawRect('#EEEEEE', {
		top: (topoffset + 44) + 'px',
		left: '0px',
		width: '100%'
	}) //绘制等待内容区背景色
	nWaiting.drawText('加 载 中 ...', {
		top: (topoffset + 44) + 'px',
		left: '0px',
		width: '100%',
		height: '50%'
	}, {
		size: '12px',
		color: 'rgb(100,100,100)'
	});

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