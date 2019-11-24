// 本地存储
var storage = window.localStorage;


// 订单ID
var order_id = -1;

//商家终点经度
var business_end_longt = -1;
//商家终点纬度
var business_end_lat = -1;
// 用户ID
var user_id = -1;
// 商家ID
var business_id = -1;

mui.init();

mui.plusReady(function() {
	mui.ready(initDate)
});

function initDate() {
	// 返回图标被点击
	document.getElementsByClassName('back')[0].addEventListener('click', back, false);
	// 房型详情被点击
	mui('.top_business_div').on('tap','.goods_info',showGoodsInfo)

	// 显示更多房型设施
	mui('.goods_info_config').on('tap', 'a', showGoodsConfig);
	// 关闭显示更多房型设施
	mui('.goods_info_title').on('tap', 'span', hideGoodsConfig);
	
	
	// 获取参数:
	var self = plus.webview.currentWebview();
	order_id = self.order_id;
	selectHotelBusinessOrderInfoByOrderId();
	
	
	document.getElementById('business_navigation').addEventListener('click',function(){
		console.log(1);
		if('Android' === plus.os.name && navigator.userAgent.indexOf('StreamApp') > 0) {
				plus.nativeUI.toast('当前环境暂不支持地图插件');
				return;
			}
			//用户起点经度
			var user_start_longt = storage["longt"];
			//用户起点纬度
			var user_start_lat = storage["lat"];

			if(user_start_longt == undefined || user_start_longt == null || user_start_lat == undefined || user_start_lat ==
				null) {
				toast(1, "当前用户起点无法确定");
			} else if(business_end_longt == -1 || business_end_longt == undefined || business_end_longt == null ||
				business_end_lat == -1 || business_end_lat == undefined || business_end_lat == null) {
				toast(1, "当前商家无地理位置");
			} else {
				//调用第三方导航传入的坐标必须是WGS-84 坐标，所以需要将坐标转换成 wgs坐标(参考文献：https://blog.csdn.net/ren365880/article/details/53883569)
				//BD-09 to GCJ-02先将百度坐标转成中国坐标
				//				var tmp = GPS.bd_decrypt(business_end_lat,business_end_longt);
				//GCJ-02 to WGS-84再将中国坐标转成GPS坐标
				var dstarrBusiness = GPS.gcj_decrypt_exact(business_end_lat, business_end_longt);
				var business_longt = dstarrBusiness["lon"];
				var business_lat = dstarrBusiness["lat"];
				//用户坐标已在进入首页获取时转换为WPS坐标系
				//				var dstarrUser = GPS.gcj_decrypt_exact(user_start_lat,user_start_longt);
				//				user_start_lat = dstarrUser["lat"];
				//				user_start_longt = dstarrUser["lon"];
				console.log("user_lat = " + user_start_lat + ";user_long=" + user_start_longt);
				console.log("business_lat = " + business_lat + ";business_long=" + business_longt);
				var dst = new plus.maps.Point(business_longt, business_lat); // 天安门 
				var src = new plus.maps.Point(user_start_longt, user_start_lat); // 大钟寺
				// 调用系统地图显示 
				plus.maps.openSysMap(dst, document.getElementById('business_name').innerHTML, src);
			}
	},false);
}

//获取商家详情
function getBusinessDetail() {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/selectBusinesssDetail",
		type: "POST",
		dataType: 'json',
		data: {
			"user_id"    : user_id,
			"business_id": business_id
		},
		success: function(data) {
			if(data.status == 0) {
				toast(3, "关闭loading");
				//商家终点经度
				business_end_longt = data.data.longt;
				//商家终点纬度
				business_end_lat = data.data.lat;
			} else {
				toast(1, data.msg);
			}
		},
	});
}

// 通过订单查询酒店类商家订单信息
function selectHotelBusinessOrderInfoByOrderId(){
	$.ajax({
		url: Main.url + "/app/v2.0.0/selectHotelBusinessOrderInfoByOrderId",
		type: "POST",
		dataType: 'json',
		data: {
			userId  : storage["user_id"],
			orderId : order_id
		},
		success: function(data) {
			if (data.status == 0 && data.data != null) {
				// 基本信息
				var basic = data.data[0].basic;
				// 扩展信息
				var expand = data.data[0].expand;
				// 退款信息
				var refund = data.data[0].refund;
				// 规格信息
				var specification = data.data[0].specification[0];
				// 规格扩展信息
				var specification_expand = data.data[0].specification_expand;
				// 商品信息
				var commodity = data.data[0].commodity;
				// 商家信息
				var business = data.data[0].business;
				// 设置用户ID
				user_id = basic.user_id;
				business_id = basic.business_id;
				getBusinessDetail();
				if(refund == undefined || refund == null || refund.length == 0){
					document.getElementById('refund_div').style.display  = 'none';
					document.getElementById('order_info_div_title').innerText = "订单信息";
				} else {
					document.getElementById('order_info_div_title').innerHTML = "订单信息(有退款)";
					document.getElementById('refund_time').innerHTML = refund[0].refund_date;
					document.getElementById('refund_id').innerHTML   = refund[0].refund_no;
					document.getElementById('refund_cash_integral_number').innerHTML    = refund[0].cash;
					document.getElementById('refund_general_integral_number').innerHTML = refund[0].general_integral;
					document.getElementById('refund_send_integral_number').innerHTML    = refund[0].send_integral;
				}
				// 订单信息
				document.getElementById('order_info_id').innerHTML = basic.order_no;
				if(basic.submit_time != null){
					document.getElementById('order_info_submit_time').innerHTML = new Date(basic.submit_time).Format('yyyy-MM-dd hh:mm:ss');
				}

				if(basic.pay_time != null){
					document.getElementById('order_info_pay_time').innerHTML = new Date(basic.pay_time).Format('yyyy-MM-dd hh:mm:ss');
				}
				
				// 房费
				// 入住时间
				var joinTime = new Date(expand.register_start_time_stamp);
				// 离店时间
				var outTime = new Date(expand.register_end_time_stamp);
				// 入住天数
				var checkIn = (Date.parse(outTime) - Date.parse(joinTime)) / (1000 * 60 * 60 * 24);
				var ul = $('#order_info_ul');
				// 是否有早餐
				var breakfast = '';
				if(specification_expand != undefined && specification_expand.breakfast != 0){
					breakfast = '含' + specification_expand.breakfast + '份早';
				} else {
					breakfast = '不含早';
				}
				// 计算使用的date
				var numberDate = new Date(joinTime.getTime());
				// 入住人数
				var checkInNum = expand.register_people.split(',').length;
				for (var i = 0; i < checkIn; i++) {
					var dataStr = numberDate.Format('yyyy-MM-dd');
					var html = '<li>'+
								'	<a class="commodity_name_tag">'+dataStr+' '+breakfast+'</a>'+
								'	<a class="price_tag">'+checkInNum+' x ￥'+specification.price.toFixed(2)+'</a>'+
								'</li>' 
					ul.append(html);
					numberDate.setDate(numberDate.getDate() + 1);
				}
				// 总价
				var html =  '<li> '+
							'	<a class="commodity_name_tag">总价</a>'+
							'	<a class="price_tag" style="font-size: .4rem;">￥'+(checkInNum * checkIn * specification.price).toFixed(2)+'</a>'+
							'</li>';
				ul.append(html);
				// 通用积分支付
				html =  '<li> '+
						'	<a class="commodity_name_tag">通用积分</a>'+
						'	<a class="price_tag">-￥'+basic.general_integral.toFixed(2)+'</a>'+
						'</li>';
				ul.append(html);
				// 代金卷
				html =  '<li> '+
						'	<a class="commodity_name_tag">代金卷</a>'+
						'	<a class="price_tag">-￥'+basic.send_integral.toFixed(2)+'</a>'+
						'</li>';
				ul.append(html);
				// 优惠券
				html =  '<li> '+
						'	<a class="commodity_name_tag">优惠券</a>'+
						'	<a class="price_tag">-'+basic.coupon+'张</a>'+
						'</li>';
				ul.append(html);
				// 现金支付
				html =  '<li> '+
						'	<a class="commodity_name_tag">实付款</a>'+
						'	<a class="price_tag" style="font-size: .4rem;color:red !important;" >-￥'+basic.cash_amount.toFixed(2)+'</a>'+
						'</li>';
				ul.append(html);
				// 商品信息
				document.getElementById('commodities_name').innerHTML = commodity.name;
				// 获取床/早餐/窗户信息
				if(specification_expand.type_bed != undefined && specification_expand.type_bed != null && specification_expand.type_bed != '-'){
					breakfast += '|'+specification_expand.type_bed;
				}
				if (specification_expand.windows == '有') {
					breakfast += '|有窗';
				} 
				document.getElementById('specification_simple_info').innerHTML = breakfast;
				// 入住时间
				// register_info
				var registerStr = joinTime.Format('MM月dd日') +'-'+outTime.Format('MM月dd日');
				registerStr+= '共'+ checkIn +'晚'+checkInNum+'间'
				document.getElementById('register_info').innerHTML = registerStr;
				
				// 入住人
				document.getElementById('register_name').innerHTML = expand.register_people;
				// 联系电话
				document.getElementById('register_mobile').innerHTML = expand.mobile;
				// 预计到店时间
				document.getElementById('register_time').innerHTML = expand.register_time;
				// 入住说明
				$('#register_description > span ').html(specification_expand.time_enter);
				
				// 商家信息
				document.getElementById('business_name').innerHTML = business.name;
				document.getElementById('business_address').innerHTML = business.address;
				document.getElementById('business_tel').addEventListener("click",function(){
					window.location.href = "tel://" + business.mobile;
				},false);
				// 导航
				document.getElementById('business_navigation').addEventListener("click",function(){
					
				},false);
				
				// 是否可以取消
				var order_other_title = '';
				var order_other_tip   = '';
				
				// 取消按钮显示开关 
				var isCancel = false;
				if (specification_expand.cancel_reserve == 0) {
					var date = new Date(expand.register_start_time_stamp);
					date.setHours(specification_expand.time_cancel_reserve.split(':')[0])
					
					if(basic.state != 5 && basic.state != 6 && basic.state != 0){
						if (date.getTime() > new  Date().getTime()) {
							order_other_tip   =  (joinTime.getMonth() + 1) + '月'+joinTime.getDate()+'日' +specification_expand.time_cancel_reserve+'前可免费取消';
							isCancel = false;
						} else{
							order_other_tip   = (joinTime.getMonth() + 1) + '月'+joinTime.getDate()+'日'+specification_expand.time_cancel_reserve+'前可免费取消,现在已经过取消时间';
							isCancel = true;
						}
					}
					
				} else{
					order_other_tip   = '该房间预定不可取消';
					isCancel = true;
				}
				
				
				
				/*
				3-等待商家确认,
				4-商家已确认,
				5-商家已拒绝,
				6-用户取消订单)
				*/
				if (basic.state == 3) {
					order_other_title = '等待商家确认 <a id="order_other_btn" href="javascript:void(0);">取消订单</a>';
				} 
				if (basic.state == 4) {
					order_other_title = '商家已确认 <a id="order_other_btn" href="javascript:void(0);">取消订单</a>';
				}
				if (basic.state == 5 ) {
					order_other_title = '商家取消订单';
					order_other_tip   = '您的订单已被商家拒绝,如有疑问请联系商家';
					isCancel = true;
				}
				if (basic.state == 6 ) {
					order_other_title = '用户取消订单';
					order_other_tip   = '您的订单已取消,期待你再次预定';
					isCancel = true;
				}
				if (basic.state == 0 ){
					order_other_title = '订单已完成';
					order_other_tip   = '您的订单已完成,期待你再次预定'; 
					isCancel = true;
				}
				
				document.getElementById('order_other_title').innerHTML = order_other_title;
				document.getElementById('order_other_tip').innerHTML = order_other_tip;
				if(isCancel){
					document.getElementById('order_other_btn').style.display = 'none';
				} else {
					if(document.getElementById("order_other_btn")){ 
					// 绑定取消事件
					document.getElementById('order_other_btn').addEventListener('click',orderCancel,null);
					}
				
				}
				
				// 轮播图
				var slider = $('#slider');
				var photoArr = commodity.photo.split('|');
				slider.empty();
				// 插入循环节点最后一张
				var html = '' +
					'<div class="mui-slider-item mui-slider-item-duplicate">' +
					'		<a href="#"><img src="' + Main.url + '/images/getimage.do?imageid=' + photoArr[photoArr.length - 2] + '" /></a>' +
					'</div>';
				slider.append(html);
				for (var i = 0; i < photoArr.length - 1; i++) {
					var html = '' +
						'<div class="mui-slider-item">' +
						'		<a href="#"><img src="' +  Main.url + '/images/getimage.do?imageid=' + photoArr[i] + '" /></a>' +
						'</div>';
					slider.append(html);
				}
				var html = '' +
					'<div class="mui-slider-item mui-slider-item-duplicate">' +
					'		<a href="#"><img src="' +  Main.url + '/images/getimage.do?imageid=' + photoArr[0] + '" /></a>' +
					'</div>';
				slider.append(html);
				
				mui('.mui-slider').slider({
					interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
				});

				// 房间设施
				var ul = $('#facilities_ul');
				expand = specification_expand;
				ul.empty();
				if (expand.area != undefined && expand.area != null && expand.area != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">面积</span>' +
						'	<span class="goods_info_config_content">' + expand.area + '㎡</span>' +
						'</li>');
				}

				if (expand.breakfast != undefined && expand.breakfast != null && expand.breakfast != '-') {
					if (expand.breakfast == 0) {
						ul.append('<li>' +
							'	<span class="goods_info_config_title">早餐</span>' +
							'	<span class="goods_info_config_content">无早餐</span>' +
							'</li>');
					} else {
						ul.append('<li>' +
							'	<span class="goods_info_config_title">早餐</span>' +
							'	<span class="goods_info_config_content">' + expand.breakfast + '份早餐</span>' +
							'</li>');
					}

				}

				if (expand.floor != undefined && expand.floor != null && expand.floor != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">楼层</span>' +
						'	<span class="goods_info_config_content">' + expand.floor + '楼</span>' +
						'</li>');
				}

				if (expand.windows != undefined && expand.windows != null && expand.windows != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">窗户</span>' +
						'	<span class="goods_info_config_content">' + expand.windows + '</span>' +
						'</li>');
				}

				if (expand.lives != undefined && expand.lives != null && expand.lives != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">可住</span>' +
						'	<span class="goods_info_config_content">' + expand.lives + '人</span>' +
						'</li>');
				}

				if (expand.air_conditioner != undefined && expand.air_conditioner != null && expand.air_conditioner != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">空调</span>' +
						'	<span class="goods_info_config_content">' + expand.air_conditioner + '</span>' +
						'</li>');
				}

				if (expand.bathroom != undefined && expand.bathroom != null && expand.bathroom != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">卫浴</span>' +
						'	<span class="goods_info_config_content">' + expand.bathroom + '</span>' +
						'</li>');
				}

				if (expand.broadband != undefined && expand.broadband != null && expand.broadband != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">宽带</span>' +
						'	<span class="goods_info_config_content">' + expand.broadband + '</span>' +
						'</li>');
				}

				if (expand.type_bed != undefined && expand.type_bed != null && expand.type_bed != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">床型</span>' +
						'	<span class="goods_info_config_content">' + expand.type_bed + '</span>' +
						'</li>');
				}

				if (expand.size_bed != undefined && expand.size_bed != null && expand.size_bed != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">床尺寸</span>' +
						'	<span class="goods_info_config_content">' + expand.size_bed + '</span>' +
						'</li>');
				}

				if (expand.num_bed != undefined && expand.num_bed != null && expand.num_bed != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">床数量</span>' +
						'	<span class="goods_info_config_content">' + expand.num_bed + '张</span>' +
						'</li>');
				}

				if (expand.bathroom_matching != undefined && expand.bathroom_matching != null && expand.bathroom_matching != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">浴室配套</span>' +
						'	<span class="goods_info_config_content">' + expand.bathroom_matching + '</span>' +
						'</li>');
				}

				if (expand.electric != undefined && expand.electric != null && expand.electric != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">生活电器</span>' +
						'	<span class="goods_info_config_content">' + expand.electric + '</span>' +
						'</li>');
				}

				if (expand.media != undefined && expand.media != null && expand.media != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">媒体设施</span>' +
						'	<span class="goods_info_config_content">' + expand.media + '</span>' +
						'</li>');
				}

				if (expand.window_description != undefined && expand.window_description != null && expand.window_description !=
					'-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">窗户说明</span>' +
						'	<span class="goods_info_config_content">' + expand.window_description + '</span>' +
						'</li>');
				}

				if (expand.room_features != undefined && expand.room_features != null && expand.room_features != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">房间特色</span>' +
						'	<span class="goods_info_config_content">' + expand.room_features + '</span>' +
						'</li>');
				}

				if (expand.others != undefined && expand.others != null && expand.others != '-') {
					ul.append('<li>' +
						'	<span class="goods_info_config_title">其他</span>' +
						'	<span class="goods_info_config_content">' + expand.others + '</span>' +
						'</li>');
				}
		
				// 隐藏6项目以外的
				var li = $('#facilities_ul > li');
				if (li.length >= 5) {
					for (var i = 1; i < li.length - 5; i++) {
						li[i + 5].style.display = "none";
					}
				} else {
					$('.goods_info_config > a').remove();
				}
				
				// 使用规则
				$('#joinOrOutTime > li > span')[0].innerHTML = expand.time_enter;
				$('#joinOrOutTime > li > span')[1].innerHTML = expand.time_check_out;
				
			}
		}
	});
}

// 用户取消订单
function orderCancel(){
	console.log(order_id);
	plus.nativeUI.showWaiting('操作中');
	$.ajax({
		url: Main.url + "/app/v2.0.0/hotelOrderCancel",
		type: "POST",
		dataType: 'json',
		data: {
			user_id  : storage["user_id"],
			order_id : order_id
		},
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			plus.nativeUI.toast(data.msg);
			if (data.status == 0) {
				plus.webview.close("order_detail_hotel.html");
			}
		}
	});
}

/**关闭当前页面*/
function back() {
	plus.webview.close('order_detail_hotel.html');
}

/**遮罩层*/
var mask = null;

/**显示商品详情*/
function showGoodsInfo() {
	mask = mui.createMask(maskClose);
	mask.show(); //显示遮罩
	document.getElementsByClassName('goods_info_div')[0].style.display = 'inline';
}

/**关闭遮罩层*/
function maskClose() {
	mask._remove();
}

/**显示更多房型设施*/
function showGoodsConfig() {
	var ul = $('.goods_info_config > ul');
	for (var i = 0; i < 2; i++) {
		var html = '' +
			'<li>' +
			'	<span class="goods_info_config_title">早餐</span>' +
			'	<span class="goods_info_config_content">无早餐</span>' +
			'</li>';
		ul.append(html);
	}
	$(this).hide();
}

/**关闭显示更多房型设施*/
function hideGoodsConfig() {
	maskClose();
	document.getElementsByClassName('goods_info_div')[0].style.display = 'none';
}
