var Main = {
	url: 'http://m.chenlankeji.cn',
	//	url: 'http://192.168.1.8:8080/property_system', 

	//全局AJAX处理(注意：页面引用api.js放到最后，否则有时会导致不执行请求错误的方法，原因未知)
	//请求错误直接执行error方法，不会执行设置的延时
	initAjax: function() {
		$.ajaxSetup({
			timeout: 15000, //请求超时20秒
		});
		$(document).ajaxError(function(jqXHR, textStatus, errorMsg) {
			setTimeout(function() {
				plus.nativeUI.toast('访问超时，请检查网络后重试');
				plus.nativeUI.closeWaiting();
				toast(3, '关闭loading');
			}, 5000);
		});
	}
}

/**
 * 扩展Date类的Format格式化方法
 */
Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

Main.initAjax();