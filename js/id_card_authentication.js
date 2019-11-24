var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		getIdCardAuthenticationInformation();
		// 绑定提交认证按钮点击事件
		mui('.fhandle').on('tap', '.fsubmit', function() {
			submitAuthentication();
		})
  	})
	//提交认证
	function submitAuthentication() {
	    var mobile = document.getElementById("mobile").value;
	    var real_name = document.getElementById("real_name").value;
	    var id_card_number = document.getElementById("id_card_number").value;
	    // var selectDatetime = document.getElementById("selectDatetime").value;
	    if (mobile == undefined || mobile == ""){
	        toast(0,"请填写手机号");
		}
		else if (real_name == undefined || real_name == ""){
	        toast(0,"请填写真实姓名");
	    }
	    else if (id_card_number == undefined || id_card_number == ""){
	        toast(0,"请填写身份证号码");
	    }
	    else{
	        toast(2,"开启loading");
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/submitIdCardAuthentication",
	            type:"POST",
	            dataType : 'json',
	            data:{"user_id":storage["user_id"],"mobile":mobile,"real_name":real_name,"id_card_number":id_card_number,"handheld_identity_card_photo_id":"","card_effective_deadline":""},
	            success:function(data){
	                if (data.status == 0){
	                    toast(0,"提交成功");
	                    back();
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
	
	}
	
	//获取认证信息
	function getIdCardAuthenticationInformation() {
	        toast(2,"开启loading");
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/getIdCardAuthenticationInformation",
	            type:"POST",
	            dataType : 'json',
	            data:{"user_id":storage["user_id"]},
	            success:function(data){
	                if (data.status == 0){
	                    toast(3,"关闭Loading");
	                    id_card_photo = data.data.handheld_identity_card_photo_id;
	                    document.getElementById("mobile").value = data.data.mobile;
	                    document.getElementById("real_name").value = data.data.real_name;
	                    document.getElementById("id_card_number").value = data.data.id_card_number;
	                }
	                else if(data.status == 2){
	                		storage["user_id"] = "";
	                		toast(1,data.msg);
	                		joinLoginPage();
	                }
	                else{
	                    toast(3,"关闭Loading");
	                }
	            },
	        });
	}
	
})

