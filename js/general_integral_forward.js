var storage = window.localStorage;

//此处值表示多少个通用积分可以兑换一元人民币
var tyandrmb = 1000;
//通用积分􏰀现手续费
var tytxfl = 10;
//可􏰀提现时间段
var withdraw_time_slot = "";
//银行名称
var bankNames = new Array();
//银行id
var bankIds = new Array();
//当前选中的银行id
var chooseBankId = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    getInitData();
		getSuppertBank();
  	})
})

//获取初始化数据
function getInitData() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getSubscriptionRatioInformationTwo",
        type:"POST",
        dataType : 'json',
        data:{type:1},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                tyandrmb = data.data.tyandrmb;
                tytxfl = data.data.tytxfl;
                withdraw_time_slot = data.data.withdraw_time_slot;
                document.getElementById("withdraw_tip").innerHTML = "1."+tyandrmb+"个通用积分=1元人民币<br>"+"2.提现申请时间为"+withdraw_time_slot+"<br>3.提现手续费"+tytxfl+"%";
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

//提现个数输入监听
function inputChange(number) {
    var count_amount = number / tyandrmb;
    document.getElementById("count_amount").innerHTML = count_amount;
    document.getElementById("receipts_amount").innerHTML = count_amount - count_amount * tytxfl / 100;
}

//提现申请
function submitWithdraw() {
    var withdraw_number = document.getElementById("withdraw_number").value;
    var bank_card_number = document.getElementById("bank_card_number").value;
    var real_name = document.getElementById("real_name").value;
    if (withdraw_number == undefined || withdraw_number == ""){
        toast(1,"请输入提现积分个数");
    }
    else if (withdraw_number % 1 != 0){
        toast(1,"提现积分个数需为整数");
    }
    else if (chooseBankId == -1){
        toast(1,"请选择提现银行");
    }
    else if (bank_card_number == undefined || bank_card_number == ""){
        toast(1,"请输入银行卡号");
    }
    else if (real_name == undefined || real_name == ""){
        toast(1,"请输入卡户姓名");
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
                    withdrawAction(withdraw_number,chooseBankId,real_name,bank_card_number,storage["user_id"],text);
                }
            },
            onCancel: function() {

            },
            input: ''
        });
    }
}

//提现网络事件
function withdrawAction(withdraw_number,chooseBankId,real_name,bank_card_number,user_id,user_pay_pwd) {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/userWithdrawApply",
        type:"POST",
        dataType : 'json',
        data:{"expenditure_integral":withdraw_number,"bank_id":chooseBankId,"bank_card_name":real_name,"bank_card_number":bank_card_number,"user_id":user_id,"user_pay_pwd":user_pay_pwd},
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

//获取支持的提现银行
function getSuppertBank() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getAllWithdrawSupportBank",
        type:"POST",
        dataType : 'json',
        data:{},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var banks = data.data.list;
                for(var index = 0;index < banks.length;index++){
                    var obj = banks[index];
                    bankNames.push(obj.name);
                    bankIds.push(obj.bank_id);
                }
                initBankList();
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

//银行卡号输入监听
function bankCardNumberinputChange(bank_card_number) {
    if (bank_card_number.length > 19){
        document.getElementById("bank_card_number").value = bank_card_number.slice(0,19);
    }
}

//初始化银行选择列表
function initBankList() {
    $("#selectBank").picker({
        title: "请选择开户行",
        cols: [
            {
                textAlign: 'center',
                values: bankNames
            }
        ],
        onChange: function(p, v, dv) {
            for (var index = 0;index < bankNames.length;index++){
                var text = bankNames[index];
                if (text == dv){
                    chooseBankId = bankIds[index];
                    return;
                }
            }
        },
        onClose: function(p, v, d) {

        }
    })
}

