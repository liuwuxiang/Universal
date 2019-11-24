var storage = window.localStorage;

//搜索内容
var search_content = "";
//type_id
var type_id = -1;
//距离(1-1公里,3-3公里，5-5公里,10-10公里,-1-全城)
var juli = -1;
//排序类型(1-离我最近,2-销量最高,3-价格最低)
var sort_type = 1;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    search_content = self.search_content;//获得参数
	    plus.webview.close("search_two.html","none");
	    document.getElementById('search_content').value = search_content;
	    // 绑定搜索按钮点击事件
  		document.getElementById('search_content').addEventListener('keyup',enterSearch);
  		getBusinessType();
  		getNearbyBusiness(type_id,juli,sort_type);
  		
  		// 绑定商户分类列表切换事件
		mui('#business_list_ul').on('tap', '.business_information_div', function() {
			var business_id = this.getAttribute('id');
			var data_card = this.getAttribute('data-card');
			if(data_card == 1){
				mui.confirm('开通商家会员卡可全年免费享受服务','优惠提示',['不开通','去开通'],function(e){
					if(e.index == 0){
						jumpBusinessDetail(business_id);
					}
					else{
						jumpMemberOpenCard(business_id);		
					}
				},'div');
			}
			else{
				jumpBusinessDetail(business_id);
			}
		})
  })
	function enterSearch(e){
		if (e.keyCode == 13) {
			var search = document.getElementById('search_content').value;
			if(search == undefined || search == ""){
				toast(1,"请输入搜索内容");
			}
			else{
				//放下键盘
				document.activeElement.blur();
				search_content = search;
				getNearbyBusiness(type_id,juli,sort_type);
			}
		}
	}
	
	//跳转商家详情页
	function jumpBusinessDetail(business_id){
		mui.openWindow({
		   url: "../html/business_detail.html",
		   id: "business_detail.html",
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
	
	//跳转会员卡开卡页面
		function jumpMemberOpenCard(business_id){
			mui.openWindow({
			   url: "../html/open_business_member_card.html",
			   id: "open_business_member_card.html",
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
})

//根据分类ID获取商家
function getNearbyBusiness(type_id_current,current_juli,current_sort_type) {
	if(type_id_current != -1 && type_id_current != undefined){
		type_id = type_id_current;
	}
	if(current_juli != -2 && current_juli != undefined){
		juli = current_juli;
	}
	if(current_sort_type != -1 && current_sort_type != undefined){
		sort_type = current_sort_type;
	}
    console.log("type_id="+type_id+",juli="+juli+",sort_type="+sort_type+",search_content="+search_content);
	$("#business_list_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v2.0.0/fuzzyQueryBusiness",
        type:"POST",
        dataType : 'json',
        data:{
        		"user_id":storage["user_id"],
        		"type_id":type_id,
        		"lat":storage["lat"],
        		"longt":storage["longt"],
        		"user_juli":parseFloat(juli),
        		"sort_type":sort_type+'',
        		"search_content":search_content
        },
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data;
                for (var index = 0;index < list.length;index++){
                    var obj = list[index];
                    var business_hours = obj.business_hours;
	                    if(business_hours == undefined){
	                    		business_hours = "";
	                    }
	                 var html = "<li id=\"business_li\" data-card = \"\">"+
  					"<div class=\"business_information_div\" id=\""+obj.business_id+"\" data-card = \""+obj.business_card_state+"\">"+
  						"<div class=\"li_left_div\">"+
	  						"<img src=\""+obj.fm_photo+"\"  onerror=\"this.src='../images/logo.jpg'\"/>"+
  							"<a>"+business_hours+"</a>"+
	  					"</div>"+
	  					"<div class=\"li_right_div\">"+
	  						"<a>"+obj.store_name+"</a>"+
	  						"<a>"+obj.juli+"</a>"+
	  						"<a>["+obj.area+"]<span>惠</span>"+obj.store_describe+"</a>"+
	  						"<a>￥"+obj.min_price+"起<span>"+obj.member_price+"</span></a>"+
	  						"<a>已售"+obj.sale+"</a>"+
	  						"<div class=\"li_bottom_div\">"+
		  						"<a>"+obj.tese_label+"</a>"+
		  						"<a>"+obj.fuwu_label+"</a>"+
		  					"</div>";
		  				var vip_icon_state = obj.vip_icon_state;
	  					if(vip_icon_state == 1){
	  						html = html + "<img src=\"../images/VIP.png\" class=\"vip_icon\"/>"+
					  						"</div>"+
					  			"</div>"+
	  				"<ul class=\"business_commodity_ul\">";
	  					}
	  					else{
	  						html = html + "</div></div>"+
	  				"<ul class=\"business_commodity_ul\">";
	  					}
	  					html = html + "</ul></li>"
                    $("#business_list_ul").append(html);
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
        error:function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
				console.log(errorThrown);
        }
    });
}

//获取商家分类
function getBusinessType() {
    toast(2,"打开loading");
    $("#type_choose_ul li").remove();
    $.ajax({
        url:Main.url + "/app/v1.0.0/getWnkBusinessType",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data;
                for (var index = 0;index < list.length;index++){
                    var obj = list[index];
                    var html = "";
                    if(type_id == obj.id){
                    		$(".Brand").text(obj.name);
                    		html = "<li onclick=\"BusinessTypes(this,"+obj.id+")\"  style=\"color: #40E0D0;\">"+obj.name+"</li>";
                    }
                    else{
                    		html = "<li onclick=\"BusinessTypes(this,"+obj.id+")\">"+obj.name+"</li>";
                    }
                    
                    $("#type_choose_ul").append(html);
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
        }
    });
}