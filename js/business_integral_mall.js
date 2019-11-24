var storage = window.localStorage;

//当前排序类别 0：全部、1：价格排序、2：销量排序
var type_sort = 2;
//升序true、降序false
var sort_state_all = false;
var sort_state_price = false;
var sort_state_males = true; //(默认按销量排序)
//上一个页面id(平台/商家)
var page_id = '';

// 店铺ID
var business_store_id = -1;

//分页
var max_page = 20; //每页加载数据量
var num_page = 0; //数据总页数
var currentpage = 0; //当前页
var counter = 1; //上拉加载计数器

//业务数据获取完毕，并已插入当前页面DOM；
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		//		//去掉下拉刷新
		//		down: {
		//			style: 'circle',
		//			callback: pulldownRefresh
		//		},
		up: {
			height: 50, //可选.默认50.触发上拉加载拖动距离
			auto: false, //可选,默认false.自动上拉加载一次
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: pullupRefresh //必选，刷新函数，根据具体业务来编写；
		}
	}
});

/*下拉刷新具体业务实现*/
function pulldownRefresh() {
	setTimeout(function() {
		mui.toast("刷新成功");
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	}, 2000);
}

/*上拉加载具体业务*/
function pullupRefresh() {
	setTimeout(function() {
//		getWnkBusinessRecommendGoods(page_id, type_sort);
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((++counter > num_page)); //参数为true代表没有更多数据了。
	}, 1500);
}

//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		//取出上一个页面id，判断是平台还是商家
		page_id = self.page_id;

		if(page_id == 'platform') {
			//平台全部商品
			$('#title_head').text('全部商品(平台)');
			//隐藏剩余积分、兑换记录(平台)
			$('#integral_and_exchange_record').css('display', 'none');

		} else if(page_id == 'business') {
			//商家店铺名称
			// var name_store_business = self.name_store;
			//取出商家店铺id(用于获取积分明细)
			business_store_id = self.store_id;

			//商家店铺全部商品
			//$('#title_head').text(name_store_business);
			//显示剩余积分、兑换记录(商家)
			$('#integral_and_exchange_record').css('display', 'flex');

			//获取剩余积分
			getRemainingIntegral(business_store_id);
		}

		//初始化
		getWnkBusinessRecommendGoods(page_id, type_sort);

		//绑定顶部积分、兑换记录点击事件
		mui('#integral_and_exchange_record').on('tap', 'div', function() {
			var item = this.getAttribute('class');
			if(item == 'integral') {

				//剩余积分(跳转积分明细)
				mui.openWindow({
					url: "../html/business_integral_detail.html",
					id: "business_integral_detail.html",
					extras: {
						//传递店铺id(用于获取店铺积分明细)
						business_id: business_store_id
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
			} else if(item == 'exchange_record') {
				//兑换记录（跳转用户在当前商家的兑换记录列表）
				mui.openWindow({
					url: "../html/business_integral_mall_orders.html",
					id: "business_integral_mall_orders.html",
					extras: {
						//使用类型(0-总订单合集,1-商家订单合集) 
						"make_type": 1,
						//商家id
						"business_id": business_store_id
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

		//绑定顶部排序标签切换事件
		mui('.options_sort').on('tap', 'p', function() {
			var option_id = this.id;

			//还原未选中的样式
			$('.options_sort').children().removeClass('option_selected');
			$('.options_sort').children().children('img').attr('src', '../images/memberSortPull.png');
			if(option_id == 'sort_all') {
				type_sort = 0;
				sort_state_all = !sort_state_all;
				$(this).addClass('option_selected');
				if(sort_state_all == true) {
					$(this).children().attr('src', '../images/memberSortUp.png');
				} else {
					$(this).children().attr('src', '../images/memberSortPull.png');
				}
			} else if(option_id == 'sort_price') {
				type_sort = 1;
				sort_state_price = !sort_state_price;
				$(this).addClass('option_selected');
				if(sort_state_price == true) {
					$(this).children().attr('src', '../images/memberSortUp.png');
				} else {
					$(this).children().attr('src', '../images/memberSortPull.png');
				}
			} else if(option_id == 'sort_sales') {
				type_sort = 2;
				sort_state_males = !sort_state_males;
				$(this).addClass('option_selected');
				if(sort_state_males == true) {
					$(this).children().attr('src', '../images/memberSortUp.png');
				} else {
					$(this).children().attr('src', '../images/memberSortPull.png');
				}
			}

			//点击排序后重置分页、页面和上拉加载
			currentpage = 0; //当前页
			counter = 1; //上拉加载计数器
			$("#recommrnd_div a").remove();
			mui('#pullrefresh').pullRefresh().refresh(true); //重置上拉加载
			//根据类型请求排序
			getWnkBusinessRecommendGoods(page_id, type_sort);
		});

		// 绑定商品列表切换事件
		mui('#recommrnd_div').on('tap', 'a', function() {
			var goods_id = this.getAttribute('id');
			var business_id = this.getAttribute('name');
			if(business_store_id != -1) {
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
			} else {
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
			}

		})

		//		// 绑定分类列表点击事件
		//		mui('#indexmenulist').on('tap', 'a', function() {
		//			var type_id = this.getAttribute('id');
		//			mui.openWindow({
		//			   url: "../html/business_integral_mall_type_goods.html",
		//			   id: "business_integral_mall_type_goods.html",
		//			   extras:{
		//				     type_id:type_id
		//				},
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

		//		// 绑定订单点击事件
		//		mui('.head').on('tap', '.submit', function() {
		//			mui.openWindow({
		//			   url: "../html/business_integral_mall_orders.html",
		//			   id: "business_integral_mall_orders.html",
		//			   extras:{
		//			   		"make_type":0,
		//			   		"business_id":-1
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
		//		})
	})
	// 防止手机弹出输入法是tar跟着跑
	plus.webview.currentWebview().setStyle({
		height: 'd'
	});

})

/*获取剩余积分
 * @param: store_id:店铺id 
 * */
function getRemainingIntegral(store_id) {
	$.ajax({
		url: Main.url + '/wx/v1.0.0/selectIntegralBusinessInfoByBusinessId',
		type: "POST",
		dataType: 'json',
		data: {
			user_id: storage['user_id'],
			business_id: store_id
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				$('#title_head').text(data.data.store_name);
				$('#integral_tab').text(data.data.integral_number);
			}
		}
	});
}

/*获取推荐商品
 * @param type_sort:排序类型	
 * 		page_id:上一个页面id
 */
function getWnkBusinessRecommendGoods(page_id, type_sort) {
	toast(2, "打开loading");
	var req_url = '';
	if(page_id == 'platform') {
		//平台全部商品
		req_url = '/wx/v1.0.0/getIntegralGoodsAll';
		if(parseInt(type_sort) === 1) {
			console.log("价格");
			type_sort = sort_state_price ? 0 : 1;
		} else if(parseInt(type_sort) === 2) {
			type_sort = sort_state_males ? 2 : 3;
		} else {
			type_sort = 4;
		}
	} else if(page_id == 'business') {
		//商家店铺对应的商品
		req_url = '/wx/v1.0.0/selectIntegralBusinessGoodsByBusinessId';
		if(parseInt(type_sort) === 1) {
			type_sort = sort_state_price ? 0 : 1;
		} else if(parseInt(type_sort) === 2) {
			type_sort = sort_state_males ? 2 : 3;
		} else {
			type_sort = 4;
		}
	}
	console.log(type_sort);
	console.log(business_store_id);
//	$("#recommrnd_div a").remove();
	$.ajax({
		url: Main.url + req_url,
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"],
			"type_sort": type_sort,
			"business_id": business_store_id
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.status == 0) {
				toast(3, "关闭loading");
				var list = data.data;
				num_page = list.length / max_page; //计算总页数 
				var remainder = ((list.length - currentpage * max_page) < max_page) ? list.length : max_page * (currentpage + 1); //剩余数据
				var index = currentpage * max_page;
				console.log('当前页:' + currentpage + ";剩余:" + remainder + ";当前项:" + index + ";总数:" + list.length);
				for(; index < remainder; index++) {
					var obj = list[index];
					var html = "<a id=\"" + obj.id + "\" class=\"item\" name=\"" + obj.business_id + "\">" +
						"<span class=\"img\"><img src=\"" + obj.img + "\" alt=\"\" onerror=\"this.src='../images/img_goods.jpg'\"></span>" +
						"<p class=\"name\">" + obj.name + "</p>" +
						"<div class=\"price_and_exchanged\">" +
						"<p class=\"price\" style=\"color: #fc9153;\">" + obj.price + "<span style=\"color: black;text-decoration:none;\">积分</span></p>" +
						"<p class=\"exchanged\">已兑换<span>" + obj.exchanged + "</span></p>" +
						"</div>"
					"</a>";
					$("#recommrnd_div").append(html);
				}
				currentpage++;
			}
		},
		error: function(a) {
			console.log(JSON.stringify(a));
		}
	});
}

//获取商品分类
function getWnkBusinessGoodsTypes() {
	toast(2, "打开loading");
	$("#indexmenulist a").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getWnkBusinessGoodsTypes",
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