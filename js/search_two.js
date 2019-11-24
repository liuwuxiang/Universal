var storage = window.localStorage;

//搜索框是否已点击(0-未点击打开,1-已点击打开)
var search_input_state = 0;
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		// 绑定搜索按钮点击事件
		document.getElementById('search_content').addEventListener('keyup', enterSearch);
		getSearchHistoryAndHoltBusiness();
		// 绑定删除搜索历史记录按钮点击事件
		document.getElementById('delete_history_record').addEventListener('tap', deleteUserSearchRecordByUserId);
		// 热门商家列表点击事件
		mui('#holt_ul').on('tap', 'li', function() {
			var business_id = this.getAttribute('id');
			jumpBusinessDetail(business_id);
		})
		// 搜索历史列表点击事件
		mui('#search_history_ul').on('tap', 'li', function() {
			var search_content = this.getAttribute('id');
			mui.openWindow({
				url: "../html/search_result.html",
				id: "search_result.html",
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
		})
		document.getElementById('search_content').focus();
		searchInputClick();
	})

	function enterSearch(e) {
		if (e.keyCode == 13) {
			var search = document.getElementById('search_content').value;
			if (search == undefined || search == "") {
				toast(1, "请输入搜索内容");
			} else {
				//放下键盘
				document.activeElement.blur();
				coverClick();
				mui.openWindow({
					url: "../html/search_result.html",
					id: "search_result.html",
					extras: {
						search_content: search
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
	}

	//跳转商家详情页
	function jumpBusinessDetail(business_id) {
		mui.openWindow({
			url: "../html/business_detail.html",
			id: "business_detail.html",
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
})

//搜索框点击事件
function searchInputClick() {
	if (search_input_state == 0) {
		search_input_state = 1;
		$(".cover_div").show();
	}
}

//遮盖层点击事件
function coverClick() {
	if (search_input_state == 1) {
		search_input_state = 0;
		$(".cover_div").hide();
	}
}

//获取搜索历史以及热门商家
function getSearchHistoryAndHoltBusiness() {
	toast(2, "打开loading");
	$("#holt_ul li").remove();
	$("#search_history_ul li").remove();
	$.ajax({
		url: Main.url + "/app/v2.0.0/getSearchHistoryAndHoltBusiness",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if (data.status == 0) {
				toast(3, "关闭loading");
				var holt_business_list = data.data.holt_business_list;
				var search_history_list = data.data.search_history_list;
				for (var index = 0; index < holt_business_list.length; index++) {
					var obj = holt_business_list[index];
					var html = "<li id=\"" + obj.business_id + "\">" + obj.store_name + "</li>";
					$("#holt_ul").append(html);
				}
				for (var index = 0; index < search_history_list.length; index++) {
					var obj = search_history_list[index];
					var html = "<li id=\"" + obj.search_content + "\">" + obj.search_content + "</li>";
					$("#search_history_ul").append(html);
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

//根据用户ID删除搜索记录
function deleteUserSearchRecordByUserId() {
	mui.confirm('确定删除历史记录', ['取消', '确定'], function(e) {
		if (e.index == 0) {
			//确定
			toast(2, "打开loading");
			$.ajax({
				url: Main.url + "/app/v2.0.0/deleteUserSearchRecordByUserId",
				type: "POST",
				dataType: 'json',
				data: {
					"user_id": storage["user_id"]
				},
				success: function(data) {
					if (data.status == 0) {
						toast(3, "关闭loading");
						getSearchHistoryAndHoltBusiness();
					} else if (data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
						joinLoginPage();
					} else {
						toast(1, data.msg);
					}
				}
			});
		} else {
			//取消
		}
	});
}
