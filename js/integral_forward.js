var storage = window.localStorage;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		
		// 获取提现限制信息
		selectWithdrawSetting();
  	})
})

// 获取提现设置信息
function selectWithdrawSetting(){
	toast(2,"打开loading");
	// jQuery.support.cors = true; 
	$.ajax({
		url:Main.url + "/app/v1.0.0/selectWithdrawSetting",
		type:"POST",
		dataType : 'json',
		data:{'user_id':storage["user_id"],"withdraw_type":'2'},
		success:function(data){
			toast(3,"关闭loading");
			console.log(JSON.stringify(data));
			if(parseInt(data.status) === 0){
				if(String(data.msg) === '暂未设置'){
					mui.toast("暂未设置提现信息,请联系管理员");
					plus.webview.close("integral_forward.html",'none');
				} else {
					document.getElementById('min_number_tj').innerHTML = data.data.min_number;
					document.getElementById('withdraw_time').innerText = '每个月' + data.data.withdraw_start_time +'日 至 '+ data.data.withdraw_end_time +'日';
					document.getElementById('withdraw_proportion').innerText = data.data.withdraw_proportion;
				}
			}
		},
		error : function(a){
			console.log(JSON.stringify(a))
		}
	});
}

//提现个数输入监听
function inputChange(number) {
    var count_amount = number * 0.01;
    document.getElementById("count_amount").innerHTML = count_amount;
    document.getElementById("receipts_amount").innerHTML = count_amount;
}

//提现申请
function submitWithdraw() {
    var withdraw_number = document.getElementById("withdraw_number").value;
    if (withdraw_number == undefined || withdraw_number == ""){
        toast(1,"请输入提现积分个数");
    }
    else if (withdraw_number % 100 != 0){
        toast(1,"提现积分个数需为100的整数倍");
    }
    else{
        $.prompt({
            text: "请填写支付密码进行验证",
            title: "支付密码",
            onOK: function(text) {
                if (text == undefined || text == ""){
                    toast(1,"请输入支付密码");
                }
                else{
                    withdrawAction(withdraw_number,storage["user_id"],text);
                }
            },
            onCancel: function() {

            },
            input: ''
        });
    }
}

//提现网络事件
function withdrawAction(withdraw_number,user_id,user_pay_pwd) {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/myIntegralForward",
        type:"POST",
        dataType : 'json',
        data:{"user_id":user_id,"withdraw_number":withdraw_number,"user_pay_pwd":user_pay_pwd},
        success:function(data){
            if (data.status == 0){
                toast(1,data.msg);
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