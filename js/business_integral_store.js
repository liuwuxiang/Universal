var storage = window.localStorage;

var business_id = -1;
//商家终点经度
var business_end_longt = 116.39131928;
//商家终点纬度
var business_end_lat = 39.90793074;
//商家名称
var business_name = "";

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    business_id = self.business_id;//获得参数
	    getBusinessDetail();
	    // 绑定商品列表点击事件
		mui('#goods_ul').on('tap', 'li', function() {
			var goods_id = this.getAttribute('id');
			mui.openWindow({
			   url: "../html/business_integral_goods_detail.html",
			   id: "business_integral_goods_detail.html",
			   extras:{
				     goods_id:goods_id,
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
		})
		
		// 绑定订单点击事件
		mui('.head').on('tap', '.submit', function() {
			mui.openWindow({
			   url: "../html/business_integral_mall_orders.html",
			   id: "business_integral_mall_orders.html",
			   extras:{
			   		"make_type":1,
			   		"business_id":business_id
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
		})
		
		// 绑定商户位置点击事件
		mui('.address_div').on('tap', '.left_address_div', function() {
			if('Android'===plus.os.name&&navigator.userAgent.indexOf('StreamApp')>0){
				plus.nativeUI.toast('当前环境暂不支持地图插件');
				return;
			}
			//用户起点经度
			var user_start_longt = storage["longt"];
			//用户起点纬度
			var user_start_lat = storage["lat"];
			if(user_start_longt == undefined || user_start_lat == undefined){
				toast(1,"当前用户起点无法确定");
			}
			else if(business_end_longt == -1 || business_end_longt == undefined || business_end_lat == -1 || business_end_lat == undefined){
				toast(1,"当前商家无地理位置");
			}
			else{
				// 设置目标位置坐标点和其实位置坐标点
				var dst = new plus.maps.Point(business_end_longt,business_end_lat); // 天安门 
				var src = new plus.maps.Point(user_start_longt,user_start_lat); // 大钟寺
				// 调用系统地图显示 
				plus.maps.openSysMap( dst, business_name, src );
			}
		})
  })
})

//获取商家分类每一项宽度并设置ul宽度
function getBusinessTypeWidthSet(){
	var width = 0;
	var business_type_ul = document.getElementById("business_type_ul");
	var lis=business_type_ul.getElementsByTagName("li");
	for(var index = 0;index < lis.length;index++){
		var li = lis[index];
		width = width + li.offsetWidth;
	}
	business_type_ul.style.width = lis.length * 100 + "px";
}

//商家分类li点击事件
function businessTypeClick(li_id){
	var business_type_ul = document.getElementById("business_type_ul");
	var lis=business_type_ul.getElementsByTagName("li");
	for(var index = 0;index < lis.length;index++){
		var li = lis[index];
		var liId = li.id;
		if(liId == li_id){
			li.setAttribute("class","li_type sel");
		}
		else{
			li.setAttribute("class","li_type");
		}
	}
	getGoodsTypeGoods(li_id);
	
}


//拨打电话
function callMobile(){
	window.location.href = "tel://"+mobile;
}


//获取商家详情
function getBusinessDetail() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/selectBusinesssDetail",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"business_id":business_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var banners = data.data.banners;
                business_name = data.data.store_name;
                document.getElementById("business_name").innerText = data.data.store_name;
                document.getElementById("address").innerText = data.data.address;
                mobile = data.data.contact_mobile;
                var collection_state = data.data.collection_state;
//              if(collection_state == 0){
//              		document.getElementById("user_collection").setAttribute("class","shouchang");
//              }
//              else{
//              		document.getElementById("user_collection").setAttribute("class","shouchang_sel");
//              }
                initBanner(banners);
				getGoodsType();
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

//初始化banner
function initBanner(banners) {
    $("#swiper-wrapper div").remove();
    for (var index = 0;index < banners.length;index++){
    		var photoUrl = banners[index];
    		var html = "<div class=\"swiper-slide\"><img src=\""+photoUrl+"\"   style=\"height: 200px;\"/></div>";
    		$("#swiper-wrapper").append(html);
    }
    $(".swiper-container").swiper({
		loop: true,
		autoplay: 2000
	});
}


//获取商品分类
function getGoodsType() {
    toast(2,"打开loading");
    $("#business_type_ul li").remove();
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getIntegralTypeByTrue",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"business_id":business_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data;
                var type_id = -1;
                for(var index = 0;index < list.length;index++){
                		var obj = list[index];
                		var html = "";
                		if(index == 0){
                			type_id = obj.id;
                			html = "<li class=\"li_type sel\" id=\""+obj.id+"\" onclick=\"businessTypeClick(this.id)\">"+
			  			"<a>"+obj.name+"</a>"+
			  		"</li>";
                		}
                		else{
                			html = "<li class=\"li_type\" id=\""+obj.id+"\" onclick=\"businessTypeClick(this.id)\">"+
			  			"<a>"+obj.name+"</a>"+
			  		"</li>";
                		}
                		$("#business_type_ul").append(html);
                }
                 getBusinessTypeWidthSet();
                if(type_id != -1){
                		getGoodsTypeGoods(type_id);
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


//获取分类商品
function getGoodsTypeGoods(type_id) {
    toast(2,"打开loading");
    $("#goods_ul li").remove();
    $.ajax({
        url:Main.url + "/wx/v1.0.0/getGoodsByTypeIdAndWnk",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"],"business_id":business_id,"type_id":type_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data;
                var type_id = -1;
                var img_ph = data.data.msg;
                for(var index = 0;index < list.length;index++){
                		var obj = list[index];
                		var html = "<li id=\""+obj.id+"\">"+
					"<div class=\"li_left_div\">"+
						"<img src=\""+img_ph+obj.img+"\"  onerror=\"this.src='../images/logo.jpg'\"/>"+
					"</div>"+
					"<div class=\"li_right_div\">"+
						"<a class=\"goods_name\">"+obj.name+"</a>"+
						"<a class=\"goods_guige\">"+obj.synopsis+"</a>"+
						"<a class=\"goods_price\"><span>"+obj.price+"</span>积分</a>"+
					"</div>"+
				"</li>";
                		
                		$("#goods_ul").append(html);
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

