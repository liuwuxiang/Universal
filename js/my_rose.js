var storage = null;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	//获取账户余额
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
					document.getElementById("my_rose_balance").innerText = data.data.my_rose;
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
	mui.ready(function() {
		storage = window.localStorage;
		getUserBaseInformation();
		listOptionInit(0);
		initViewWebViewData();
		
		// 帮助说明点击事件
		mui('.head').on('tap', '#help_icon', function() {
			toast(2, "开启loading");
			jQuery.support.cors = true;
			$.ajax({
				url: Main.url + '/app/v1.0.0/getIntegralHelpContent',
				type: "POST",
				dataType: 'json',
				data: {
					"type": 6
				},
				success: function(data) {
					toast(3, "关闭loading");
					if(data.status == 0) {
						var open_type = data.data.open_type;
						if(open_type == 0){
							mui.openWindow({
							   url: "../html/integral_help.html",
							   id: "integral_help.html",
							   extras: {
									'title': "玫瑰说明帮助",
									'type' : 6
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
						else{
							showWithWaiting(data.data.content);
						}
					} else if(data.status == 2) {
						mMain.gotoLogin();
					} else {
						mui.openWindow({
						   url: "../html/integral_help.html",
						   id: "integral_help.html",
						   extras: {
								'title': "玫瑰说明帮助",
								'type' : 6
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
		});
		
		// 绑定兑换按钮点击事件
		mui('.buts').on('tap', '#rose_exchange', function() {
			mui.openWindow({
			   url: "../html/rose_exchange.html",
			   id: "rose_exchange.html",
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
	});
})

/*
 *	列表项初始化
 * type=0:玫瑰收入，type=1：玫瑰支出
 * */
function listOptionInit(type){
	if(type == 0){
		document.getElementById("rose_income").setAttribute("class","item sel"); 
		document.getElementById("rose_expenditure").setAttribute("class","item"); 
	}
	else if(type == 1){
		document.getElementById("rose_income").setAttribute("class","item"); 
		document.getElementById("rose_expenditure").setAttribute("class","item sel"); 
	}
	getUserRoseRoseDetail(type);
}

//获取玫瑰(银币)明细
function getUserRoseRoseDetail(type) {
    toast(2,"打开loading");
    $("#list li").remove();
    publicnull_tip("暂无数据",1);
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserRoseRoseDetail",
        type:"POST",
        dataType : 'json',
        data:{
        		"user_id":storage["user_id"],
        		type:type
        	},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                publicnull_tip("关闭提示",0);
                var list = data.data;
                var type_str = "+";
                if(type == 0){
                		type_str = "+";
                }
                else{
                		type_str = "-";
                }
                for (var index = 0;index < list.length;index++){
                    var obj = list[index];
                    var html = "<li class=\"item\">"+
						        "<div class=\"left\">"+
						          "<span class=\"name\">"+obj.name+"</span>"+
						          "<span class=\"time\">"+obj.transactions_date+"</span>"+
						        "</div>"+
						        "<div class=\"right\">"+
						          "<span class=\"num down\">"+type_str+obj.integral_number+"</span>"+
						        "</div>"+
						      "</li>";
                    $("#list").append(html);
                }

            }
            else if(data.status == 2){
            		storage["user_id"] = "";
            		toast(1,data.msg);
            		joinLoginPage();
            }
            else{
                toast(1,data.msg);
                publicnull_tip(data.msg,1);
            }
        }
    });
}

/*
* 提示修改
* */
function publicnull_tip(content,state) {
    var publicnull_tip = document.getElementById("publicnull_tip");
    if (state == 0){
        publicnull_tip.style.display = "none";
    }
    else{
        document.getElementById("request_tip").innerText = content;
        publicnull_tip.style.display = "block";
    }
}