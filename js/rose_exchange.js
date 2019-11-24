var storage = null;

//玫瑰与通用积分兑换比例(多少玫瑰兑换1个通用积分)
var rose_rmb_proprotion = 0;
//开放时间
var exchange_time = "";
//兑换要求(至少)
var exchange_min = 0;
//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {

	//获取玫瑰与通用积分兑换比例
	function getRoseAndGeneralIntegralExchangeProportion() {
		toast(2, "打开loading");
		jQuery.support.cors = true;
		$.ajax({
			url: Main.url + "/app/v1.0.0/getRoseAndRMBExchangeProportion",
			type: "POST",
			dataType: 'json',
			data: {},
			success: function(data) {
				console.log(JSON.stringify(data)); 
				if(data.status == 0) {
					toast(3, data.msg);
					//兑换比例 
					rose_rmb_proprotion = data.data.rose_rmb_proprotion;
					exchange_min = data.data.rose_min_number;
					var timeArr = data.data.rose_open_time.split('-');
					exchange_time = "每个月"+timeArr[0]+'日 至 '+timeArr[1]+'日';
					// 设置兑换比例
					document.getElementById("exchange_ratio").innerHTML = rose_rmb_proprotion + ':1';
					// 设置开放时间
					document.getElementById("exchange_time").innerHTML = "" + exchange_time;
					// 设置兑换要求(每次至少兑换多少玫瑰)
					document.getElementById("exchange_min").innerHTML = "" + exchange_min;
					if(rose_rmb_proprotion == 0) {
						toast(1, "当前不可兑换");
					}
				} else if(data.status == 2) {
					storage["user_id"] = "";
					toast(1, data.msg);
					joinLoginPage();
				} else {
					rose_rmb_proprotion = 0;
					toast(1, data.msg);
				}
			}
		});
	}

	//玫瑰兑换
	function userRoseExchange() {
		var rose_number = document.getElementById("rose_number").value;
		if(rose_number == undefined || rose_number == "") {
			toast(1, "请输入玫瑰兑换个数");
		} else if(rose_number <= 0) {
			toast(1, "玫瑰个数需大于0");
		} else {
			toast(2, "打开loading");
			jQuery.support.cors = true;
			$.ajax({
				url: Main.url + "/app/v1.0.0/userRoseExchange",
				type: "POST",
				dataType: 'json',
				data: {
					"user_id": storage["user_id"],
					"rose_number": rose_number
				},
				success: function(data) {

					if(data.status == 0) {
						toast(1, data.msg);

					} else if(data.status == 2) {
						storage["user_id"] = "";
						toast(1, data.msg);
						joinLoginPage();
					} else {
						toast(1, data.msg);
					}
				}
			});
		}
	}

	mui.ready(function() {
		// 防止手机弹出输入法是tar跟着跑
		plus.webview.currentWebview().setStyle({
			height: 'd'
		});
		storage = window.localStorage;
		getRoseAndGeneralIntegralExchangeProportion();
		// 绑定兑换按钮点击事件
		mui('.fhandle').on('tap', '#fsubmit', function() {
			userRoseExchange();
		})
	});
})

//提现个数输入监听
function inputChange(number) {
	//兑换比例<=0
	if(rose_rmb_proprotion <= 0) {
		document.getElementById("count_amount").innerHTML = 0;
		document.getElementById("receipts_amount").innerHTML = 0;
	} else {
		var count_amount = number / rose_rmb_proprotion;
		document.getElementById("count_amount").innerHTML = count_amount;
		document.getElementById("receipts_amount").innerHTML = count_amount;
	}
}