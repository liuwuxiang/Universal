var storage = window.localStorage;
var pays={};
//使用类型(0-消费积分,1-通用积分)
var makeType = 0;
//此处的值表示多少个消费积分可以兑换一元人民币
var xfandrmb = 1000;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    makeType = self.type;//获得参数
	    getInitData();
	    // 绑定充值按钮点击事件
		mui('.fhandle').on('tap', '.fsubmit', function() {
			rechargeAction();
		})
  })
	
	//充值事件
	function rechargeAction() {
	    var recharge_amount = document.getElementById("recharge_amount").value;
	    if (recharge_amount == undefined || recharge_amount == ""){
	        toast(1,"请输入充值金额");
	    }
	    else if (recharge_amount <= 0){
	        toast(1,"充值金额需大于0");
	    }
	    else if (recharge_amount % 1 != 0){
	        toast(1,"充值金额需为整数");
	    }
	    else{
			    toast(2,"打开loading");
				  $.ajax({
				        url:Main.url + "/wx/v1.0.0/wxUnlineOrderPayApp",
				        type:"POST",
				        dataType : 'json',
				        data:{
				        		"user_id":storage["user_id"],
				        		"amount":recharge_amount
				        },
				        success:function(data){
				        	
				            if (data.status == 0){
				            		toast(3,"关闭");
				            		console.log("111");
				            		var config = data.data;
				            		console.log(config);
				            		// 获取支付通道
								plus.payment.getChannels(function(channels){
									for(var i in channels){
										var channel=channels[i];
										if(channel.id=='wxpay'){	// 过滤掉不支持的支付通道：暂不支持360相关支付
											pays[channel.id]=channel;
										}
										
									}
									if(pays.length <= 0){
										toast(1,"暂不可支付");
									}
									else{
										plus.payment.request(pays["wxpay"],config,function(result){
											console.log("支付成功");
											toast(1,"支付成功");
											back();
										},function(e){
											console.log(JSON.stringify(e));
											toast(1,"用户取消支付");
										});
									}
									
								},function(e){
									toast(1,"用户取消支付");
								});
				            }
				            else if(data.status == 2){
				            	console.log("33");
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
})

//获取初始化数据
function getInitData() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getSubscriptionRatioInformation",
        type:"POST",
        dataType : 'json',
        data:{},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                xfandrmb = data.data.xfandrmb;
                var tip = "积分";
                if (makeType == 0){
                    tip = "消费积分";
                }
                else{
                    tip = "通用积分";
                }
                // document.getElementById("top_tip").innerHTML = xfandrmb+"元=1个"+tip;
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

//金额输入监听
function inputChange(number) {
    if (number > 0){
        document.getElementById("integral_number").innerHTML = number / xfandrmb;
    }
    else{
        document.getElementById("integral_number").innerHTML = 0;
    }
}

