var storage = window.localStorage;
var pays={};
var type = 0;
//协议选中事件(0-未选择,1-已选中)
var xieyi_state = 1;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    type = self.type;//获得参数
	    
	    var xieyi_width = document.getElementById("user_xieyi_div").style.width;
	    var clientWidth = document.body.clientWidth;
	    var xieyi_width_left_width = (clientWidth - xieyi_width) / 6;
	    document.getElementById("user_xieyi_div").style.marginLeft = xieyi_width_left_width+"px";
	    document.getElementById("user_xieyi_div").style.display = "block";
	    
	    // 协议选中按钮事件
		mui('.user_xieyi_div').on('tap', '#xieyi_choose_img', function() {
			var xieyi_choose_img = document.getElementById("xieyi_choose_img");
			if(xieyi_state == 0){
				xieyi_state = 1;
				xieyi_choose_img.src = "../images/choose_select.svg";
			}
			else{
				xieyi_state = 0;
				xieyi_choose_img.src = "../images/choose.svg";
			}
		})
	    
	    getWnkBuyMeal();
	    
	    // 开卡按钮事件
		mui('.fhandle').on('tap', '.fsubmit', function() {
			arrgenHandelMemberCard();
		})
		
		// 用户协议按钮事件
		mui('.user_xieyi_div').on('tap', '.xieyi_content_button', function() {
			mui.openWindow({
			   url: "../html/user_agreement.html",
			   id: "user_agreement.html",
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
	
	//同意办理会员卡
	function arrgenHandelMemberCard() {
	    var member_card_level = 0;
	    var card_type_id = -1;
	    var pay_way = -1;
	    var general_integral_radio = document.getElementById("general_integral_radio");
//	    var consumption_integral_radio = document.getElementById("consumption_integral_radio");
	    var wx_pay_radio = document.getElementById("wx_pay_radio");
	    for (var index = 0;index < wnkBuyMealList.length;index++) {
	        var obj = wnkBuyMealList[index];
	        var radio = document.getElementById("qingchuncard_radio_"+obj.id);
	        if (radio.checked){
	            card_type_id = obj.id;
	            continue;
	        }
	    }
	    if (general_integral_radio.checked){
	        pay_way = 1;
	    }
//	    else if (consumption_integral_radio.checked){
//	        pay_way = 0;
//	    }
	    else if (wx_pay_radio.checked){
	        pay_way = 2;
	    }
	    if (card_type_id == -1){
	        toast(1,"请选择一种卡片类型");
	    }
	    else if (pay_way == -1){
	        toast(1,"请选择支付方式");
	    }
	    else if(xieyi_state == 0){
	    		toast(1,"暂未同意协议内容");
	    }
	    else{
	        if (pay_way == 0 || pay_way == 1){
	            $.prompt({
	                text: "请填写支付密码进行验证",
	                title: "支付密码",
	                onOK: function(text) {
	                    if (text == undefined || text == ""){
	                        toast(1,"请输入支付密码");
	                    }
	                    else{
	                        handelMemberCardNetwork(member_card_level,pay_way,text,card_type_id,1);
	                    }
	                },
	                onCancel: function() {
	
	                },
	                input: ''
	            });
	        }
	        else{
	            openCardWXPay(member_card_level,card_type_id,1);
	        }
	    }
	}
	
	//开卡-微信支付
	function openCardWXPay(member_card_level,card_type,user_type) {
		toast(2,"打开loading");
			  $.ajax({
			        url:Main.url + "/app/v1.0.0/myMemberCardUpgradeOrHandleWXPayApp",
			        type:"POST",
			        dataType : 'json',
			        data:{
			        		"user_id":storage["user_id"],
			        		"member_card_level":member_card_level,
			        		"card_type":card_type,
			        		"user_type":user_type
			        },
			        success:function(data){
			            if (data.status == 0){
			            		toast(3,"关闭");
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
										toast(1,"错误："+e.message);
									});
								}
								
							},function(e){
								toast(1,"错误："+e.message);
							});
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
	
	//办理会员卡网络事件
	function handelMemberCardNetwork(member_card_level,pay_way,pay_pwd,card_type,user_type) {
	    toast(2,"打开loading");
	    $.ajax({
	        url:Main.url + "/app/v1.0.0/myMemberCardUpgradeOrHandle",
	        type:"POST",
	        dataType : 'json',
	        data:{"user_id":storage["user_id"],"type":-1,"member_card_level":member_card_level,"pay_way":pay_way,"pay_pwd":pay_pwd,"card_type":card_type,"user_type":user_type},
	        success:function(data){
	            if (data.status == 0){
	                toast(0,data.msg);
	                // 重新加载父页面
				  var view = plus.webview.all();
				  view[view.length - 2].reload(true);
				  // 关闭当前页面
				  plus.webview.close(plus.webview.getTopWebview().id, 'slide-out-right', 200);
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
})

//获取万能购买套餐
function getWnkBuyMeal() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getWnkBuyMeal",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"open_card_type":type},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                wnkBuyMealList = data.data;
                for (var index = 0;index < wnkBuyMealList.length;index++){
                    var obj = wnkBuyMealList[index];
                    var html = "";
                    if (index == 0){
                        html = "<label class=\"fradio\" style=\"height: 50px;\" id=\"yinka_member_card\">"+
                            "<span class=\"icon\" style=\"background-image: url(../images/chaojicard.png);\"></span>"+
                            "<span class=\"fname\">"+obj.name+"</span>"+
                        "<input type=\"radio\" name=\"card_type\" id=\"qingchuncard_radio_"+obj.id+"\" checked>"+
                            "<span class=\"status\"></span>"+
                            "</label>";
                    }
                    else{
                        html = "<label class=\"fradio\" style=\"height: 50px;\" id=\"yinka_member_card\">"+
                            "<span class=\"icon\" style=\"background-image: url(../images/chaojicard.png);\"></span>"+
                            "<span class=\"fname\">"+obj.name+"</span>"+
                            "<input type=\"radio\" name=\"card_type\" id=\"qingchuncard_radio_"+obj.id+"\">"+
                            "<span class=\"status\"></span>"+
                            "</label>";
                    }
                    $("#wnk_buy_meal_div").append(html);
                }

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