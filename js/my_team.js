var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	
    mui.ready(function() {
		var self = plus.webview.currentWebview();
	    // 显示二维码
		selShow("ewm","ewmshow");
		getUserBaseInformation();
	    lookMyQrcode();
	    getMyTeamList();
  	})
})

/*
 *	获取二维码信息
 * */
function lookMyQrcode(){
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserQrcode",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                var nick_name = data.data.nick_name;
                var sex = data.data.sex;
                var mobile = data.data.mobile;
                var user_header = data.data.user_header;
                var qrcode_url = data.data.qrcode_url;
                document.getElementById("qrcode_nick_name").innerText = nick_name;
                document.getElementById("qrcode_header_img").src = user_header;
                document.getElementById("qrcode_mobile").innerText = mobile;
                document.getElementById("qrcode_photo_url").src = qrcode_url;
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

//获取我的团队列表
function getMyTeamList() {
    toast(2,"打开loading");
    publicnull_tip("暂无数据",1);
    $("#teamlist li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserTeamMembers",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                var list = data.data.list;
                if (list.length <= 0){
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",1);
                }
                else{
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",0);
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        var html = "<li>"+
                        "<div class=\"item\">"+
                            "<div class=\"left\">"+
                            "<img src=\""+obj.header+"\" alt=\"\" class=\"img\">"+
                            "<span class=\"name\">"+obj.nick_name+"</span>"+
                            "<p class=\"lev\">"+obj.member_star+"星级"+obj.level_name+obj.card_name+"</p>"+
                            "</div>"+
                            "<div class=\"right\">"+
                            "<p class=\"tel\">"+obj.mobile+"</p>"+
                            "<p class=\"time\">"+obj.register_time_str+"</p>"+
                        "</div>"+
                        "</div>"+
                        "</li>";
                        $("#teamlist").append(html);
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

/*
* 设置用户信息
* */
function setUserInformation(data) {
    var header = data.data.header;
    var nick_name = data.data.nick_name;
    var level_name = data.data.member_card_name;
    document.getElementById("header_img").src = header;
    document.getElementById("nick_name").innerHTML = nick_name;
    document.getElementById("level_name").innerText = level_name;
    

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
        publicnull_tip.style.display = "block";
    }
}