var storage = window.localStorage;

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
		getUserBaseInformation();
		mui('#slider').pullRefresh().endPulldown();
	}, 1000)
}

//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	// 防止手机弹出输入法是tar跟着跑
 	plus.webview.currentWebview().setStyle({height:'d'});
 	
    mui.ready(function() {
		var self = plus.webview.currentWebview();
	    getUserBaseInformation();
	    
	    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			document.getElementById("current_version").innerHTML = "V"+inf.version;
		});
	    
	    // 绑定我的玫瑰点击事件
		mui('.wrap').on('tap', '#my_rose_balance_tag', function() {
			mui.openWindow({
			   url: "../html/my_rose.html",
			   id: "my_rose.html",
			   extras:{},
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
	    
	    // 绑定我的优惠券点击事件
		mui('.memmenu').on('tap', '#coupons', function() {
			mui.openWindow({
			   url: "../html/my_coupons.html",
			   id: "my_coupons.html",
			   extras:{},
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
	    
		// 绑定积分订单点击事件
		mui('.memmenu').on('tap', '#jifen_order', function() {
			mui.openWindow({
			   url: "../html/integral_orders.html",
			   id: "integral_orders.html",
			   extras:{},
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
		
		// 绑定我的团队点击事件
		mui('.memmenu').on('tap', '#team', function() {
			mui.openWindow({
			   url: "../html/my_team.html",
			   id: "my_team.html",
			   extras:{},
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
		
		// 绑定安全中心点击事件
		mui('.memmenu').on('tap', '#anquan_center', function() {
			mui.openWindow({
			   url: "../html/security_center.html",
			   id: "security_center.html",
			   extras:{},
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
			   extras:{},
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
		
		// 绑定我的积分点击事件
		mui('.wrap').on('tap', '#my_integral', function() {
			mui.openWindow({
			   url: "../html/my_integral_two.html",
			   id: "my_integral_two.html",
			   extras:{},
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
		
		// 绑定消费积分点击事件
		mui('.wrap').on('tap', '#consumption_integral', function() {
			mui.openWindow({
			   url: "../html/consumption_integral.html",
			   id: "consumption_integral.html",
			   extras:{},
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
		mui('.wrap').on('tap', '#general_integral', function() {
			mui.openWindow({
			   url: "../html/general_integral.html",
			   id: "general_integral.html",
			   extras:{},
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
		
		// 绑定系统设置点击事件
		mui('.memmenu').on('tap', '#system_setting', function() {
			mui.openWindow({
			   url: "../html/system_setting.html",
			   id: "system_setting.html",
			   extras:{},
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
		
		// 绑定会员信息点击事件
		mui('body').on('tap', '#my_information', function() {
			mui.openWindow({
			   url: "../html/my_information.html",
			   id: "my_information.html",
			   extras:{},
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
		
		// 绑定常见问题点击事件
		mui('.memmenu').on('tap', '#problem', function() {
			mui.openWindow({
			   url: "../html/problem.html",
			   id: "problem.html",
			   extras:{},
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
		
		// 绑定我的收藏点击事件
		mui('.memmenu').on('tap', '#my_collection', function() {
			mui.openWindow({
			   url: "../html/my_collection.html",
			   id: "my_collection.html",
			   extras:{},
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
		
		// 绑定检查更新点击事件
		mui('.memmenu').on('tap', '#update_check', function() {
			getLocalVerSD();
		})
		
		// 绑定合作点击事件
		mui('.memmenu').on('tap', '#hezuo', function() {
			mui.openWindow({
			   url: "../html/business_register.html",
			   id: "business_register.html",
			   extras:{},
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

//拨打电话
function callMobile(){
	window.location.href = "tel://0874-3959696";
}

//获取用户基础信息
function getUserBaseInformation() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserBaseInformation",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
				setUserInformation(data);
                //是否实名认证或设置支付密码
//              realAuthentication(data.data.is_pay_state);
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(1,data.msg);
            }
        },
    });
}

//实名认证处理
function realAuthentication(is_pay_state) {
    if (is_pay_state == 0){
        mui.alert('请先设置支付密码', '支付密码', function() {
            self.window.location.href = "/property_system/wx/v1.0.0/securityCenterHome";
        });
    }
}

/*
* 设置用户信息
* */
function setUserInformation(data) {
    var user_id = data.data.user_id;
    var level_name = data.data.level_name;
    var level_icon = data.data.level_icon;
    var consumption_integral = data.data.consumption_integral;
    var nick_name = data.data.nick_name;
    var sex = data.data.sex;
    var header = data.data.header;
    var recommend_mobile = data.data.recommend_mobile;
    var team_members_number = data.data.team_members_number;
    var general_integral = data.data.general_integral;
    var mobile = data.data.mobile;
    var email = data.data.email;
    var is_microfinance = data.data.is_microfinance;
    var member_card_name = data.data.member_card_name;
    var user_integral = data.data.user_integral;
	storage["mobile"] = mobile;
	storage["email"] = email;
    document.getElementById("header_img").src = header;
    document.getElementById("nick_name_tag").innerText = nick_name;
    if (recommend_mobile != "无推荐人" && recommend_mobile != undefined && recommend_mobile != ""){
        document.getElementById("recommend_name").innerText = "推荐人："+recommend_mobile;
    }
    else{
        document.getElementById("recommend_name").innerText = "";
    }
    document.getElementById("member_level_name").innerText = data.data.member_card_name;
    if (sex == 0){
        document.getElementById("nick_name_tag").setAttribute("class","name girl");
    }
    else if(sex == 1){
        document.getElementById("nick_name_tag").setAttribute("class","name boy");
    }
//  document.getElementById("consumption_balance_tag").innerText = consumption_integral;
    document.getElementById("general_balance_tag").innerText = general_integral;
    document.getElementById("my_integral_balance").innerText = user_integral;
    document.getElementById("my_rose_balance").innerText = data.data.my_rose;
	var wnk_state = data.data.wnk_state;
	var no_read_message_count = data.data.no_read_message_count;
	if(no_read_message_count > 0){
		document.getElementById("message_center").setAttribute("class","message_center sel");
	}
	else{
		document.getElementById("message_center").setAttribute("class","message_center");
	}

}