var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	// 防止手机弹出输入法是tar跟着跑
 	plus.webview.currentWebview().setStyle({height:'d'});
 	mui.ready(function() {
		var self = plus.webview.currentWebview();
		listOptionInit(0);
		
		// 绑定推广活动消息点击事件
		mui('#system_message_ul').on('tap', 'li', function() {
			//type=0:普通消息;type=1:推广活动消息
			var type = this.getAttribute('name');
			if(type == 1){
				var business_id = this.getAttribute('id');
				var message_id = this.getAttribute('data-message');
				userTextDoingsSpreadRead(message_id);
				mui.openWindow({
				   url: "../html/business_detail.html",
				   id: "business_detail.html",
				   extras:{
				   		business_id:business_id
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
				var message_id = this.getAttribute('id');
				mui.openWindow({
				   url: "../html/message_detail.html",
				   id: "message_detail.html",
				   extras:{
				   		message_id:message_id
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
	
})

/*
 *	列表项初始化
 * type=0:系统消息，type=1：我的消息
 * */
function listOptionInit(type){
	if(type == 0){
		$("#system_message_item").addClass("sel"); 
		$("#promotion_activities").removeClass("sel");
//		document.getElementById("my_message_item").setAttribute("class","item");
        getUserSystemMessage();
	}
	else if(type == 1){
		$("#system_message_item").removeClass("sel"); 
		$("#promotion_activities").addClass("sel");
//		document.getElementById("my_message_item").setAttribute("class","item");
        getDoingsSpreadForTextMessage();
	}
//	else if(type == 2){
//		document.getElementById("system_message_item").setAttribute("class","item"); 
//		document.getElementById("promotion_activities").setAttribute("class","item");
//		document.getElementById("my_message_item").setAttribute("class","item sel");
//      publicnull_tip("暂无消息",1);
//	}
}

//获取系统消息
function getUserSystemMessage() {
    toast(2,"打开loading");
    publicnull_tip("暂无消息",1);
    $("#system_message_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserSystemMessage",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                var list = data.data.list;
                if (list.length <= 0){
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无消息",1);
                }
                else{
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无消息",0);
                    var no_read_number = 0;
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        	var html = "";
                        if(obj.read_status == 0){
                        		no_read_number = no_read_number + 1;
                        		html = "<li name = \"0\" id=\""+obj.id+"\">"+
			                        "<a class=\"system_message_title\">"+obj.title+"</a>"+
			                            "<a class=\"system_message_content\">"+obj.content+"</a>"+
			                        "<a class=\"system_message_time\">"+obj.send_date+"</a>"+
			                        "</li>";
                        }
                        else{
                        		html = "<li name = \"0\" id=\""+obj.id+"\"  class=\"read_li\">"+
			                        "<a class=\"system_message_title\">"+obj.title+"</a>"+
			                            "<a class=\"system_message_content\">"+obj.content+"</a>"+
			                        "<a class=\"system_message_time\">"+obj.send_date+"</a>"+
			                        "</li>";
                        }
                        
                        $("#system_message_ul").append(html);
                    }
                    if(no_read_number > 0){
                    		document.getElementById("system_no_read").style.display = "block";
                    }
                    else{
                    		document.getElementById("system_no_read").style.display = "none";
                    }
                }
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(3,"关闭Loading");
                publicnull_tip(data.msg,1);
            }
        },
    });
}

//获取文本推广活动
function getDoingsSpreadForTextMessage() {
    toast(2,"打开loading");
    publicnull_tip("暂无消息",1);
    $("#system_message_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/userSelectTextDoingsSpread",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                var list = data.data;
                if (list.length <= 0){
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无消息",1);
                }
                else{
                		var no_read_number = 0;
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无消息",0);
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        var html = "";
                        if(obj.read_status == 0){
                        		no_read_number = no_read_number + 1;
                        		html = "<li name = \"1\" data-message=\""+obj.id+"\" id=\""+obj.business_id+"\">"+
							      	"<a class=\"system_message_title\">"+obj.title+"</a>"+
							      	"<a class=\"system_message_content\">"+obj.system_msg+"</a>"+
							      	"<a class=\"system_message_time\">"+obj.create_time+"</a>"+
							      "</li>";
                        }
                        else{
                        		html = "<li name = \"1\" data-message=\""+obj.id+"\" class=\"read_li\" id=\""+obj.business_id+"\">"+
							      	"<a class=\"system_message_title\">"+obj.title+"</a>"+
							      	"<a class=\"system_message_content\">"+obj.system_msg+"</a>"+
							      	"<a class=\"system_message_time\">"+obj.create_time+"</a>"+
							      "</li>";
                        }
                        $("#system_message_ul").append(html);
                    }
                    if(no_read_number > 0){
                    		document.getElementById("promotion_no_read").style.display = "block";
                    }
                    else{
                    		document.getElementById("promotion_no_read").style.display = "none";
                    }
                }
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(3,"关闭Loading");
                publicnull_tip(data.msg,1);
            }
        },
    });
}


//标记推广消息已读
function userTextDoingsSpreadRead(message_id) {
    $.ajax({
        url:Main.url + "/app/v1.0.0/userTextDoingsSpreadRead",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"message_id":message_id},
        success:function(data){
           
        },
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