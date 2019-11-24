var storage = window.localStorage;
var uploadImageId = "";

//业务数据获取完毕，并已插入当前页面DOM；
mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    // 绑定反馈按钮点击事件
		mui('.fhandle').on('tap', '.fsubmit', function() {
			feedback();
		})
  	})
	//建议反馈
	function feedback() {
		var ftextarea = document.getElementById("ftextarea").value;
		if (ftextarea == undefined || ftextarea == ""){
	        toast(0,"请填写反馈内容");
		}
		else{
			console.log("content="+ftextarea+";photos="+uploadImageId)
	        toast(2,"开启loading");
	        $.ajax({
	            url:Main.url + "/app/v1.0.0/userFeedBack",
	            type:"POST",
	            dataType : 'json',
	            data:{"user_id":storage["user_id"],"content":ftextarea,"photos":uploadImageId},
	            success:function(data){
	                if (data.status == 0){
	                    toast(0,"反馈完成");
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

/*
 *	图像选择事件
 * */
function imgChoose(){
	document.getElementById("header_file").click();
}

function chooseHeaderChangeFile() {
    toast(2,"开启loading");
    $.ajaxFileUpload({
        url : Main.url + '/images/savaimageMobile.do', // 用于文件上传的服务器端请求地址
        secureuri : false, // 是否需要安全协议，一般设置为false
        fileElementId : 'header_file', // 文件上传域的ID
        dataType : 'json', // 返回值类型 一般设置为json
        type : "post",
        data:{"fileNameStr":"ajaxFile","fileId":"header_file"},
        success : function(data, status) // 服务器成功响应处理函数
        {
            if (data.error == 0){
                toast(3,"关闭loading");
                uploadImageId = uploadImageId + ","+data.url;
                setPhoto(data.url_location);
            }
            else{
                toast(1,data.message);
            }
        },
        error : function(data, status, e)// 服务器响应失败处理函数
        {
            toast(3,"关闭loading");
            alert(e);
        }
    });
}

//设置图片
function setPhoto(photo_url) {
	var html = "<p class=\"loadimgitem\"><img src=\""+photo_url+"\" alt=\"\"><span class=\"delte\"></span></p>";
    var buttonHtml = "<label class=\"floadimgbut\" id=\"floadimgbut\" onclick=\"imgChoose()\"></label>";
    $("#floadimgbut").remove();
    $("#fuploadimg").append(html);
    $("#fuploadimg").append(buttonHtml);
}