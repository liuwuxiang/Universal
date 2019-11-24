var storage = window.localStorage;
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
	    getUserBankInformation();
	    // 绑定设置按钮点击事件
		mui('.fhandle').on('tap', '.fsubmit', function() {
			settingBankCard();
		})
  	})
	//设置银行卡信息
	function settingBankCard() {
	    var bank_card_number = document.getElementById("bank_card_number").value;
	    var real_name = document.getElementById("real_name").value;
	    if(chooseBankId == -1){
	        toast(1,"请选择银行");
	    }
	    else if (bank_card_number == undefined || bank_card_number == ""){
	        toast(1,"请输入银行卡号");
	    }
	    else if (real_name == undefined || real_name == ""){
	        toast(1,"请输入卡户姓名");
	    }
	    else{
	        toast(2,"开启loading");
	        $.ajax({
	            url:Main.url + "/wx/v1.0.0/setUserBankCardMessage",
	            type:"POST",
	            dataType : 'json',
	            data:{"user_id":storage["user_id"],"bank_id":chooseBankId,"bank_card_number":bank_card_number,"real_name":real_name},
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
	}
	
})

//获取用户银行卡信息
function getUserBankInformation() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getUserBankInformation",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var bank_id = data.data.bank_id;
                chooseBankId = bank_id;
			    if (bank_id != -1){
			        document.getElementById("selectBank").value = data.data.bank_name;
			        document.getElementById("bank_card_number").value = data.data.bank_card_number;
			        document.getElementById("real_name").value = data.data.real_name;
			    }
			    getSuppertBank();
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(1,data.msg);
                getSuppertBank();
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
                console.log(bankNames);
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

//银行卡号输入监听
function bankCardNumberinputChange(bank_card_number) {
    if (bank_card_number.length > 19){
        document.getElementById("bank_card_number").value = bank_card_number.slice(0,19);
    }
}