var storage = window.localStorage;

var type_id = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	// 防止手机弹出输入法是tar跟着跑
	plus.webview.currentWebview().setStyle({
		height: 'd'
	});

	mui.ready(function() {
		var self = plus.webview.currentWebview();
		$(".open_card_button_yinka").hide();
		getUserMemberLevelInformation();
		getUserBaseInformation();
		// 查询用户健身卡信息
		selectFitnessCard();
		// 绑定我的积分点击事件
		mui('.wrap').on('tap', '#my_integral_tag', function() {
			var business_id = this.getAttribute('id');
			mui.openWindow({
				url: "../html/my_integral_two.html",
				id: "my_integral_two.html",
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

		// 绑定我的玫瑰点击事件
		mui('.wrap').on('tap', '#my_rose_balance_tag', function() {
			var business_id = this.getAttribute('id');
			mui.openWindow({
				url: "../html/my_rose.html",
				id: "my_rose.html",
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

		// 绑定通用积分点击事件
		mui('.wrap').on('tap', '#general_balance_tag_tag', function() {
			var business_id = this.getAttribute('id');
			mui.openWindow({
				url: "../html/general_integral.html",
				id: "general_integral.html",
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

		// 绑定万能银卡开卡按钮点击事件
		mui('.my_member_card_div').on('tap', '.open_card_button_yinka', function() {
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
		})

		// 健身卡点击事件
		mui('#gym_card_ul').on('tap', 'li', function() {
			var card_id = this.getAttribute('data-id');
			var business_id = this.getAttribute("data-business")
			mui.openWindow({
				url: "../html/gym_card_details.html",
				id: "gym_card_details.html",
				extras: {
					card_id: card_id,
					business_id:business_id
				},
				styles: {
					top: '0px',
					bottom: '0px',
				},
				createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			});
		});

	})

	//获取商家分类
	function getBusinessType() {
		toast(2, "打开loading");
		$("#business_type_ul li").remove();
		$.ajax({
			url: Main.url + "/app/v1.0.0/getWnkBusinessType",
			type: "POST",
			dataType: 'json',
			data: {
				"user_id": storage["user_id"]
			},
			success: function(data) {
				if (data.status == 0) {
					toast(3, "关闭loading");
					var list = data.data;
					for (var index = 0; index < list.length; index++) {
						var obj = list[index];
						var html = "";
						if (index == 0) {
							type_id = obj.id;
							html = "<li class=\"li_type sel\" id=\"" + obj.id + "\">" +
								"<a>" + obj.name + "</a>" +
								"<div></div>" +
								"</li>";
						} else {
							html = "<li class=\"li_type\" id=\"" + obj.id + "\">" +
								"<a>" + obj.name + "</a>" +
								"<div></div>" +
								"</li>";
						}
						$("#business_type_ul").append(html);
					}
					getBusinessTypeWidthSet();
					if (type_id != -1) {
						getNearbyBusiness();
					}
				} else if (data.status == 2) {
					storage["user_id"] = "";
					toast(1, data.msg);
					joinLoginPage();
				} else {
					toast(1, data.msg);
					getNearbyBusiness();
				}
			}
		});
	}

	//获取分类商家
	function getNearbyBusiness() {
		toast(2, "打开loading");
		$("#business_ul li").remove();
		$.ajax({
			url: Main.url + "/app/v1.0.0/getWnkBusinessByTypeIdAndJuLi",
			type: "POST",
			dataType: 'json',
			data: {
				"user_id": storage["user_id"],
				"type_id": type_id,
				"lat": storage["lat"],
				"longt": storage["longt"],
				"user_juli": -1,
				"sort_type": 1
			},
			success: function(data) {
				if (data.status == 0) {
					toast(3, "关闭loading");
					var list = data.data;
					for (var index = 0; index < list.length; index++) {
						var obj = list[index];
						var html = "<li id=\"" + obj.business_id + "\"\">" +
							"<div class=\"business_left_div\">" +
							"<img src=\"" + obj.fm_photo + "\" onerror=\"this.src='../images/logo.jpg'\"/>" +
							"</div>" +
							"<div class=\"business_right_div\">" +
							"<a>" + obj.store_name + "</a>" +
							"<a>" + obj.store_describe + "</a>" +
							"<a>" + obj.juli + "</a>" +
							"<input type=\"button\" value=\"立即使用\"/>" +
							"</div>" +
							"</li>";
						$("#business_ul").append(html);
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

})

//获取商家分类每一项宽度并设置ul宽度
function getBusinessTypeWidthSet() {
	var width = 0;
	var business_type_ul = document.getElementById("business_type_ul");
	var lis = business_type_ul.getElementsByTagName("li");
	for (var index = 0; index < lis.length; index++) {
		var li = lis[index];
		width = width + li.offsetWidth;
	}
	business_type_ul.style.width = width + "px";
}

function getUserMemberLevelInformation() {
	toast(2, "打开loading");
	$("#xx_div img").remove();
	$.ajax({
		url: Main.url + "/app/v1.0.0/getUserMemberCardInformation",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id": storage["user_id"]
		},
		success: function(data) {
			if (data.status == 0) {
				toast(3, "关闭loading");
				var member_card_level = data.data.card_level;
				if (member_card_level == -1) {
					$(".open_card_button_yinka").show();
				} else {
					$(".open_card_button_yinka").hide();
					if (member_card_level == 0) {
						document.getElementById("top_background_img").src = "../images/yinka_background.png";
					} else {
						document.getElementById("top_background_img").style.backgroundImage = "../images/jinka_background.png";
					}
					var tuirenshu = data.data.tuirenshu;
					for (var index = 0; index < tuirenshu; index++) {
						var html = "";
						if (member_card_level == 0) {
							html = "<img src=\"../images/yinka_xx.png\"/>";
						} else {
							html = "<img src=\"../images/jinka_xx.png\"/>";
						}
						$("#xx_div").append(html);
					}
					document.getElementById("term_validity_tag").innerText = "有效期至:" + data.data.term_date;
					document.getElementById("card_number_tag").innerText = "NO." + data.data.card_no;
				}

			} else if (data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				joinLoginPage();
			} else {
				$(".open_card_button_yinka").show();
				$(".open_card_button_jinka").show();
				toast(3, "关闭Loading");
			}
		},
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
			if (data.status == 0) {
				toast(3, "关闭loading");
				setUserInformation(data);
			} else if (data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				joinLoginPage();
			} else {
				toast(1, data.msg);
			}
		},
	});
}

// 设置用户信息
function setUserInformation(data) {
	var general_integral = data.data.general_integral;
	var user_integral = data.data.user_integral;
	document.getElementById("general_balance_tag").innerText = general_integral;
	document.getElementById("my_integral_balance").innerText = user_integral;
	document.getElementById("my_rose_balance").innerText = data.data.my_rose;
}

// 获取健身卡信息
function selectFitnessCard() {
	toast(2, "打开loading"); 
	jQuery.support.cors = true;
	$.ajax({
		url: Main.url + "/app/v1.0.0/selectFitnessCard",
		type: "POST", 
		dataType: 'json',
		data: {
			user_id: storage["user_id"],
			lat    : storage["lat"],
			longt  : storage["longt"]
		},
		success: function(data) { 
			console.log(JSON.stringify(data));
			toast(3, "关闭loading");
			if (parseInt(data.status) == 0 && data.data != null && data.data.length > 0) {
				var ul = $('#gym_card_ul');
				for (var i = 0; i < data.data.length; i++) {
					var obj = data.data[i];
					var rgb = '#' + Math.floor(Math.random() * 256).toString(10);
					var html = '<li class="gym_card_ul_li" style="background-color: ' + rgb + ' ;" data-business="'+obj.business_id+'" data-id="'+obj.id+'" >' +
						'<div class="gym_card_ul_li_div">' +
						'		<img src="../images/gymCardBusinessHead.png" />' +
						'		<div class="gym_card_info">' +
						'			<p class="gym_card_business_name" id="gym_card_business_name">' + obj.store_name + '</p>' +
						'			<div class="gym_card_remaining_days">' +
						'				剩余：' +
						'				<span id="gym_card_remaining_days">' + obj.left_time + '</span> 天' +
						'			</div>' +
						'		</div>' +
						'		<div class="gym_card_distance_div">' +
						'			<img src="../images/gymCardStrongLightBlue.png" />' +
						'			<span class="gyn_card_distance">' + obj.removing + 'm</span>' +
						'		</div>' +
						'	</div>' +
						'</li>';
					ul.append(html);
				}
			}
		}
	});
}
