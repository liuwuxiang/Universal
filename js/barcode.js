mui.init();
mui.plusReady(function() {
	
	// 二维码扫描成功
	function onmarked(type, result, file) {
		endScan();
		var result = result;
		var result2 = JSON.parse(result);
		var business_id = result2.business_id;
		if(business_id != undefined && business_id != ""){
			mui.openWindow({
			   url: "../html/to_wnk_business_pay.html",
			   id: "to_wnk_business_pay.html",
			   extras:{
				     business_id:business_id
				},
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
		}
		
	}

	// 扫描对象
	var scan = null;

	//扫描二维码
	function scanQrCode() {
		$('#barcode').css('display', 'inline');
//		$('.head > h1').text("点击取消扫描");
//		$('.head > a').css('display', 'none');
		$('#barcode').height(window.screen.height - 150);
		// 绑定取消扫描事件
//		mui('.head').on('tap', 'h1', function() {
//			endScan();
//		});
		// 开始扫描
		scan = new plus.barcode.Barcode('barcode', [plus.barcode.QR], {
			top: '0px',
			background: '#000'
		});
		scan.onmarked = onmarked;
		scan.start();
	}

	//停止扫描
	function endScan() {
//		$('#barcode').css('display', 'none');
//		$('.head > h1').text("订单中心");
//		$('.head > a').css('display', 'inline');
		scan.close();
		// 取消事件绑定
//		mui('.head').off('tap', 'h1');
	}
	// 初始化加载
	mui.ready(function() {
		scanQrCode();
	});

});