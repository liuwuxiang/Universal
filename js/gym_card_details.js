mui.init();

var card_id = -1;

var business_id = -1;

var storage = window.localStorage;

mui.plusReady(function() {

	mui.ready(function() { 
		var self = plus.webview.currentWebview();
		//取值
		card_id = self.card_id;
		business_id = self.business_id; 
		setCardInfo();
		getAllRecord();
		//续费点击监听
		document.getElementById('gym_card_renew').addEventListener('tap',function(){
			mui.openWindow({
				url: "../html/open_business_member_card.html",
				id: "open_business_member_card.html",
				extras: {
					business_id: business_id
				},
				styles: {
					top: '0px',
					bottom: '0px',
				},
				createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			});
		})
		
		
		
	});
});

//显示顶部的健身卡信息
function setCardInfo() {
	//	$('#gym_card_detail_qrcode').attr('src','');
	// 获取健身卡信息
	toast(2, "打开loading");
		$.ajax({
			url: Main.url + "/app/v1.0.0/selectFitnessCardInfoById",
			type: "POST",
			dataType: 'json',
			data: {
				user_id : storage["user_id"],
				card_id : card_id
			},
			success: function(data) {
				toast(3, "关闭loading");
				// console.log(JSON.stringify(data)); 
				if(parseInt(data.status) === 0){
					$('#gym_card_detail_name').text(data.data.store_name);
					$('#gym_card_detail_remaining_days').text(data.data.left_time);
					$('#gym_card_detail_qrcode').attr('src',data.data.qrcode_path + data.data.qrcode);
				}
			}
		});
	
}

//获取所有健身记录
function getAllRecord() {
	//清空所有元素
	//	$("#gym_detail_record_ul li").remove();
	//隐藏没有更多
	//	$('#record_nomore_parent').hide(); 
	console.log(business_id);
	$.ajax({
		url: Main.url + "/app/v1.0.0/selectFitnessCardDetailById",
		type: "POST",
		dataType: 'json',
		data: {
			user_id : storage['user_id'],
			business_id : business_id
		},
		success: function(data) {
			console.log(JSON.stringify(data)); 
			if (data.status == 0) {
				var list = data.data; 
				if (list == null || list.length <= 0) {
					toast(3, "关闭Loading");
					//隐藏没有更多
					$('#record_nomore_parent').hide();
				} else {
					toast(3, "关闭Loading"); 
					for (var index = 0; index < list.length; index++) {
						var obj = list[index];
						var img = obj.use_type_str == '离开' ? 'gymCardDetailLeaveIcon' : 'gymCardDetailEnterIcon';
						// gymCardDetailLeaveIcon
						var html =
							"<li class=\"gym_detail_record_ul_li\">" +
							"<img class=\"gym_detail_record_icon\" id=\"gym_detail_record_icon\" src=\"../images/"+img+".png\" />" +
							"<p class=\"gym_detail_record_time\" id=\"gym_detail_record_time\">"+obj.use_time+"</p>" +
							"<span class=\"gym_detail_record_state\" id=\"gym_detail_record_state\">"+obj.use_type_str+"</span>" +
							"</li>";  
						$("#gym_detail_record_ul").append(html);
					}
					$('#record_nomore_parent').show();
				}
			} else if (data.status == 2) {
				storage["user_id"] = "";
				toast(1, data.msg);
				joinLoginPage();
			} else {
				toast(3, "关闭Loading");
				// publicnull_tip(data.msg, 1);
			}
		},
		error : function(a){
			console.log(JSON.stringify(a));
		}
	});
}
