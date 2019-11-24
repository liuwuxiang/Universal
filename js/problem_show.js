mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
		// 根据ID查询常见问题详情
		selectProblemById(self.problem_id);
  })
})

/**
* 获取所有已经启用的常见问题
*/
function selectProblemById(problem_id){
	toast(2,"打开loading");
    $.ajax({
        url:Main.url + "/wnk_business_app/v1.0.0/selectProblemById",
        type:"POST",
        dataType : 'json',
        data:{'problem_id' : problem_id},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭loading");
                $('#problem_title').html(data.data.title);
				$('#problem_content').html(data.data.content);
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