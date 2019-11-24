var storage = window.localStorage;

var business_id = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	// tab菜单顶部固定
	pubtabmenu("pubtabmenu",0.88);
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    business_id = self.business_id;//获得参数
	    getUserIntegral();
	    listOptionInit(0);
  	})
})

/*
 *	列表项初始化
 * type=0:收入明细，type=1：支出明细
 * */
function listOptionInit(type){
	if(type == 0){
		document.getElementById("income_detail").setAttribute("class","item sel"); 
		document.getElementById("expenditure_item").setAttribute("class","item"); 
	}
	else if(type == 1){
		document.getElementById("income_detail").setAttribute("class","item"); 
		document.getElementById("expenditure_item").setAttribute("class","item sel"); 
	}
	getBusinessIntegralDetail(type);
}


//获取用户在商家处的积分
function getUserIntegral() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getUserIntegral",
        type:"POST",
        dataType : 'json',
        data:{
        		"user_id":storage["user_id"],
        		"business_id":business_id
        	},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var integral = data.data.integral;
				document.getElementById("integral_balance").innerText = integral;
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


//获取用户在商家处的积分明细
function getBusinessIntegralDetail(type) {
    toast(2,"打开loading");
    publicnull_tip("暂无数据",1);
    $("#list li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserBusinessIntegralDetailByUserIdAndBusinessId",
        type:"POST",
        dataType : 'json',
        data:{
        		"user_id":storage["user_id"],
        		"business_id":business_id,
        		"income_type":type
        	},
        success:function(data){
            if (data.status == 0){
                var list = data.data;
                if (list.length <= 0){
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",1);
                }
                else{
                    toast(3,"关闭Loading");
                    publicnull_tip("暂无数据",0);
                    var type_str = "+";
                    if(type == 0){
                    		type_str = "+";
                    }
                    else{
                    		type_str = "-";
                    }
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        var html = "<li class=\"item\">"+
	        							"<div class=\"left\">"+
	          						"<span class=\"name\">"+obj.name+"</span>"+
	          						"<span class=\"time\">"+obj.income_date+"</span>"+
	        							"</div>"+
	        							"<div class=\"right\">"+
	          						"<span class=\"num down\">"+type_str+obj.income_amount+"</span>"+
	        							"</div>"+
	      							"</li>";
                        $("#list").append(html);
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
