var storage = window.localStorage;

//城市id
var city_id = -1;
//省份id
var province_id = -1;
//房间id
var house_number_id = -1;
//小区栋号id
var residential_building_id = -1;
//小区单元号id
var residential_unit_id = -1;
//小区id
var residential_id = -1;

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    getOwnerAuthenticationInformation();
		getProvince();
		// 绑定商户分类列表切换事件
		mui('body').on('tap', '#submit_button', function() {
			submitAuthentication();
		})
  	})
	//业主认证信息提交
	function submitAuthentication() {
	    var buy_house_mobile = document.getElementById("buy_house_mobile").value;
	    var buy_house_name = document.getElementById("buy_house_name").value;
	    if (buy_house_mobile == undefined || buy_house_mobile == ""){
	        toast(1,"请输入购房所留电话");
	    }
	    else if (buy_house_name == undefined || buy_house_name == ""){
	        toast(1,"请输入购房姓名");
	    }
	    else if (province_id == -1){
	        toast(1,"请选择省份");
	    }
	    else if (city_id == -1){
	        toast(1,"请选择城市");
	    }
	    else if (residential_id == -1){
	        toast(1,"请选择小区");
	    }
	    else if (residential_building_id == -1){
	        toast(1,"请选择栋号");
	    }
	    else if (residential_unit_id == -1){
	        toast(1,"请选择单元号");
	    }
	    else if (house_number_id == -1){
	        toast(1,"请选择房间号");
	    }
	    else{
	        toast(2,"打开loading");
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/submitOwnerAuthentication",
	            type:"POST",
	            dataType : 'json',
	            data:{"mobile":buy_house_mobile,"name":buy_house_name,"residential_id":residential_id,"house_id":house_number_id,"user_id":storage["user_id"]},
	            success:function(data){
	                if (data.status == 0){
	                    toast(0,"提交成功");
	                    // 重新加载父页面
					  var view = plus.webview.all();
					  view[view.length - 2].reload(true);
					  // 关闭当前页面
					  plus.webview.close(plus.webview.getTopWebview().id, 'slide-out-right', 500);
	                }
	                else{
	                    toast(1,data.msg);
	                }
	            },
	        });
	    }
	}
	
})

//获取业主认证信息
function getOwnerAuthenticationInformation() {
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getOwnerAuthenticationInformation",
        type:"POST",
        dataType : 'json',
        data:{"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭Loading");
                settingData(data);

            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(1,data.msg);
                settingData(null);
            }
        },
    });
}

//设置信息
function settingData(data) {
    if (data != null && data != undefined && data != ""){
            city_id = data.data.city_id;
            province_id = data.data.province_id;
            house_number_id = data.data.house_number_id;
            residential_building_id = data.data.residential_building_id;
            residential_unit_id = data.data.residential_unit_id;
            residential_id = data.data.residential_id;

            document.getElementById("buy_house_mobile").value = data.data.buy_house_mobile;
            document.getElementById("buy_house_name").value = data.data.buy_house_name;
            document.getElementById("province_name").innerText = data.data.province_name;
            document.getElementById("city_name").innerText = data.data.city_name;
            document.getElementById("residential_name").innerText = data.data.residential_name;
            document.getElementById("building_name").innerText = data.data.building_number;
            document.getElementById("unit_name").innerText = data.data.unit_number;
            document.getElementById("house_name").innerText = data.data.house_number;
    }
}

//获取省份数据
function getProvince() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getAllProvince",
        type:"POST",
        dataType : 'json',
        data:{},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
				var list = data.data.list;
				if (list.length <= 0){
                    toast(1,"暂无数据");
				}
				else{
					var provinces=[];
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
						var province = {};
						province["label"] = obj.name;
						province["value"] = obj.province_id;
						provinces.push(province);

                    }
                    initProvinceOption(provinces);
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

//获取某个省份下的城市
function getCity() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getProvinceAllCity",
        type:"POST",
        dataType : 'json',
        data:{"province_id":province_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data.list;
                if (list.length <= 0){
                    toast(1,"暂无数据");
                }
                else{
                		var cities=[];
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                         var city = {};
						city["label"] = obj.name;
						city["value"] = obj.city_id;
						cities.push(city);
                    }
                    initCityOption(cities);
                }
            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(1,data.msg);
                var cities=[];
                initCityOption(cities);
            }
        },
        
    });
}

//获取某个城市下的小区
function getResidential() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getResidentialsByCityId",
        type:"POST",
        dataType : 'json',
        data:{"city_id":city_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data.list;
                if (list.length <= 0){
                    toast(1,"暂无数据");
                }
                else{
                		var cities=[];
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        var city = {};
						city["label"] = obj.residential_name;
						city["value"] = obj.residential_id;
						cities.push(city);
                    }
                    initResidentialOption(cities);
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

//获取某个小区下的栋数
function getResidentialBuild() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getResidentialsAllBuilding",
        type:"POST",
        dataType : 'json',
        data:{"residential_id":residential_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data.list;
                if (list.length <= 0){
                    toast(1,"暂无数据");
                }
                else{
                		var cities=[];
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                         var city = {};
						city["label"] = obj.building_number;
						city["value"] = obj.build_id;
						cities.push(city);
                    }
                    initBuildingOption(cities);
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

//获取单元数
function getAllUnitByBuildingId() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getAllUnitByBuildingId",
        type:"POST",
        dataType : 'json',
        data:{"building_id":residential_building_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data.list;
                if (list.length <= 0){
                    toast(1,"暂无数据");
                }
                else{
                		var cities=[];
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        var city = {};
						city["label"] = obj.unit_number;
						city["value"] = obj.unit_id;
						cities.push(city);
                    }
                    initUnitOption(cities);
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

//获取房间号
function getAllHouseByUnitId() {
    toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getAllHouseByUnitId",
        type:"POST",
        dataType : 'json',
        data:{"unit_id":residential_unit_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                var list = data.data.list;
                if (list.length <= 0){
                    toast(1,"暂无数据");
                }
                else{
                		var cities=[];
                    for (var index = 0;index < list.length; index++){
                        var obj = list[index];
                        var city = {};
						city["label"] = obj.house_number;
						city["value"] = obj.number_id;
						cities.push(city);
                    }
                    initHouseOption(cities);
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

//初始化省份选项
function initProvinceOption(datas){
	$('#province_name').on('click', function () {
		        weui.picker(datas, {
		            onChange: function (result) {
		                console.log(result);
		            },
		            onConfirm: function (result) {
		                console.log("结果："+result);
		                var name = "";
		                for(var index = 0;index < datas.length;index++){
		                		var obj = datas[index];
		                		if(obj["value"] == result){
		                			name = obj["label"];
		                		}
		                }
		                console.log("城市名："+name);
		                province_id = parseInt(result);
		                document.getElementById("province_name").innerText = name;
		                document.getElementById("city_name").innerText = "选择城市";
		                document.getElementById("residential_name").innerText = "选择小区";
		                document.getElementById("building_name").innerText = "选择栋号";
		                document.getElementById("unit_name").innerText = "选择单元号";
		                document.getElementById("house_name").innerText = "选择房间号";
		                //城市id
						city_id = -1;
						//房间id
						house_number_id = -1;
						//小区栋号id
						residential_building_id = -1;
						//小区单元号id
						residential_unit_id = -1;
						//小区id
						residential_id = -1;
						getCity();
		            }
		        });
		    });
}

//初始化城市选项
function initCityOption(datas){
	$('#city_name').on('click', function () {
		        weui.picker(datas, {
		            onChange: function (result) {
		                console.log(result);
		            },
		            onConfirm: function (result) {
		                console.log("结果："+result);
		                var name = "";
		                for(var index = 0;index < datas.length;index++){
		                		var obj = datas[index];
		                		if(obj["value"] == result){
		                			name = obj["label"];
		                		}
		                }
		                console.log("城市名："+name);
		                city_id = parseInt(result);
		                document.getElementById("city_name").innerText = name;
		                document.getElementById("residential_name").innerText = "选择小区";
		                document.getElementById("building_name").innerText = "选择栋号";
		                document.getElementById("unit_name").innerText = "选择单元号";
		                document.getElementById("house_name").innerText = "选择房间号";
						//房间id
						house_number_id = -1;
						//小区栋号id
						residential_building_id = -1;
						//小区单元号id
						residential_unit_id = -1;
						//小区id
						residential_id = -1;
						getResidential();
		            }
		        });
		 });
}

//初始化小区选项
function initResidentialOption(datas){
	$('#residential_name').on('click', function () {
		        weui.picker(datas, {
		            onChange: function (result) {
		                console.log(result);
		            },
		            onConfirm: function (result) {
		                console.log("结果："+result);
		                var name = "";
		                for(var index = 0;index < datas.length;index++){
		                		var obj = datas[index];
		                		if(obj["value"] == result){
		                			name = obj["label"];
		                		}
		                }
		                console.log("城市名："+name);
		                residential_id = parseInt(result);
		                document.getElementById("residential_name").innerText = name;
		                document.getElementById("building_name").innerText = "选择栋号";
		                document.getElementById("unit_name").innerText = "选择单元号";
		                document.getElementById("house_name").innerText = "选择房间号";
						//房间id
						house_number_id = -1;
						//小区栋号id
						residential_building_id = -1;
						//小区单元号id
						residential_unit_id = -1;
						getResidentialBuild();
		            }
		        });
		    });
}


//初始化栋号选项
function initBuildingOption(datas){
	$('#building_name').on('click', function () {
		        weui.picker(datas, {
		            onChange: function (result) {
		                console.log(result);
		            },
		            onConfirm: function (result) {
		                console.log("结果："+result);
		                var name = "";
		                for(var index = 0;index < datas.length;index++){
		                		var obj = datas[index];
		                		if(obj["value"] == result){
		                			name = obj["label"];
		                		}
		                }
		                console.log("城市名："+name);
		                residential_building_id = parseInt(result);
		                document.getElementById("building_name").innerText = name;
		                document.getElementById("unit_name").innerText = "选择单元号";
		                document.getElementById("house_name").innerText = "选择房间号";
						//房间id
						house_number_id = -1;
						//小区单元号id
						residential_unit_id = -1;
						getAllUnitByBuildingId();
		            }
		        });
		    });
}

//初始化单元号选项
function initUnitOption(datas){
	$('#unit_name').on('click', function () {
		        weui.picker(datas, {
		            onChange: function (result) {
		                console.log(result);
		            },
		            onConfirm: function (result) {
		                console.log("结果："+result);
		                var name = "";
		                for(var index = 0;index < datas.length;index++){
		                		var obj = datas[index];
		                		if(obj["value"] == result){
		                			name = obj["label"];
		                		}
		                }
		                console.log("栋号："+name);
		                residential_unit_id = parseInt(result);
		                document.getElementById("unit_name").innerText = name;
		                document.getElementById("house_name").innerText = "选择房间号";
						//房间id
						house_number_id = -1;
						getAllHouseByUnitId();
		            }
		        });
		    });
}

//初始化房间号选项
function initHouseOption(datas){
	$('#house_name').on('click', function () {
		        weui.picker(datas, {
		            onChange: function (result) {
		                console.log(result);
		            },
		            onConfirm: function (result) {
		                console.log("结果："+result);
		                var name = "";
		                for(var index = 0;index < datas.length;index++){
		                		var obj = datas[index];
		                		if(obj["value"] == result){
		                			name = obj["label"];
		                		}
		                }
		                console.log("栋号："+name);
		                house_number_id = parseInt(result);
		                document.getElementById("house_name").innerText = name;
		            }
		        });
		    });
}
