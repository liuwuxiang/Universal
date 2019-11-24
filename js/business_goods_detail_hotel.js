// 本地存储
var storage = window.localStorage;

// 商品iD
var commodity_id = -1;

// 商家ID
var business_id = -1;

// 入住时间
var joinTime = null;
// 退房时间
var outTime  = null;


mui.init();

mui.plusReady(function() {
	mui.ready(initDate)
});

function initDate() {

	var value = plus.webview.currentWebview();
	commodity_id = value.commodity_id;
	business_id  = value.business_id;
	joinTime     = value.joinTime;
	outTime      = value.outTime;

	// 获取商品信息
	selectCommodityInfoAndHotelExpandInfoById(commodity_id, business_id);


	// 显示/关闭更多房型设施
	mui('.goods_info_config').on('tap', 'a', showGoodsConfig);
	// 预定点击事件
	document.getElementById('preordain_submit').addEventListener('click', function() {
		mui.openWindow({
			url: "../html/goods_buy_two_hotel.html",
			id: "goods_buy_two_hotel.html",
			extras: {
				commodity_id: commodity_id,
				business_id : business_id,
				joinTime    : joinTime,
				outTime     : outTime,
				phone       : document.getElementById('mobile').innerText
			},
			styles: {
				top: '0px',
				bottom: '0px',
			},
			createNew: true,
		});
	}, false);

	// 拨打电话
	document.getElementById('dialTel').addEventListener("click", function() {
		window.location.href = "tel://" + document.getElementById('mobile').innerText;
	}, false);

}

/**关闭当前页面*/
function back() {
	plus.webview.close('business_goods_detail_hotel.html');
}

/**显示更多房型设施*/
function showGoodsConfig() {
	var str = this.innerHTML.split('<');
	if (String(str[0]) === '查看更多房型设置 ') {
		var li = $('#facilities_ul > li');
		for (var i = 0; i < li.length; i++) {
			li[i].style.display = "inline";
		}
		this.innerHTML = '收起 <img src="../images/arrow_up.png" alt="" />';
	} else {

		var li = $('#facilities_ul > li');
		for (var i = 1; i < li.length - 5; i++) {
			li[i + 5].style.display = "none";
		}
		this.innerHTML = '查看更多房型设置 <img src="../images/arrow_under.png" alt="" />';
	}

}

/**
 * 查询商品信息和酒店商品扩展信息
 * 参数1:商品ID
 * 参数2:商家ID
 */
function selectCommodityInfoAndHotelExpandInfoById(commodity_id, business_id) {
	toast(2, "打开loading");
	$.ajax({
		url: Main.url + "/app/v1.0.0/selectCommodityInfoAndHotelExpandInfoById",
		type: "POST",
		dataType: 'json',
		data: {
			user_id: storage["user_id"],
			commodity_id: commodity_id,
			business_id: business_id
		},
		success: function(data) {
			toast(3, "关闭loading");
			if (parseInt(data.status) === 0 && data.data != null) {
				// 轮播图
				var slider = $('.mui-slider-loop');
				var photoArr = data.data.photo.split('|');
				slider.empty();
				// 插入循环节点最后一张
				var html = '' +
					'<div class="mui-slider-item mui-slider-item-duplicate">' +
					'		<a href="#"><img src="' + data.data.photo_prefix + photoArr[photoArr.length - 2] + '" /></a>' +
					'</div>';
				slider.append(html);
				for (var i = 0; i < photoArr.length - 1; i++) {
					var html = '' +
						'<div class="mui-slider-item">' +
						'		<a href="#"><img src="' + data.data.photo_prefix + photoArr[i] + '" /></a>' +
						'</div>';
					slider.append(html);
				}
				var html = '' +
					'<div class="mui-slider-item mui-slider-item-duplicate">' +
					'		<a href="#"><img src="' + data.data.photo_prefix + photoArr[0] + '" /></a>' +
					'</div>';
				slider.append(html);

				mui('.mui-slider').slider({
					interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
				});

				// 房间设施
				var ul = $('#facilities_ul');
				ul.empty();
				var expand = data.data.expand;
				if(expand == null){
					plus.nativeUI.toast("请联系商家完善商品信息");
					plus.webview.close("business_goods_detail_hotel.html");
					return;
				}
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


				// 是否可以取消
				if (parseInt(data.data.expand.cancel_reserve) === 0) {
					var date = new Date();
					var cancelTime = data.data.expand.time_cancel_reserve.split(':')[0];
					if (date.getHours() > parseInt(cancelTime)) {
						$('#cancelTime > span').html('不可取消');
						$('#cancelTime > ul > li').html('<span>' + new Date(joinTime).Format('MM月dd日') + cancelTime + '点</span>之前可免费取消,当前已过最晚时间,订单确认后,不可取消/变更. 如未入住,酒店将扣除全额房费.');
					} else {
						$('#cancelTime > span').html('限时取消');
						$('#cancelTime > ul > li').html('<span>' + new Date(joinTime).Format('MM月dd日') + cancelTime + '点</span>之前可免费取消,逾期不可取消/变更. 如未入住,酒店将扣除全额房费.');
					}
				} else {
					$('#cancelTime > span').html('不可取消');
					$('#cancelTime > ul > li').html('订单确认后,不可取消/变更. 如未入住,酒店将扣除全额房费.');
				}

				// 电话号码
				$('#mobile').html(data.data.mobile);

				// 使用规则
				$('#joinOrOutTime > li > span')[0].innerHTML = data.data.expand.time_enter;
				$('#joinOrOutTime > li > span')[1].innerHTML = data.data.expand.time_check_out;
				// 商品价格
				$('#price').html('￥' + data.data.price);
			}
		}
	});
}
