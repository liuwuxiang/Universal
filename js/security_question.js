var storage = window.localStorage;
var code = "";
var chooseTxts = new Array();
var questionIds = new Array();
//问题1下标
var questionIndex1 = -1;
//问题2下标
var questionIndex2 = -1;
//问题3下标
var questionIndex3 = -1;

mui.init();
//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
mui.plusReady(function() {
	mui.ready(function() {
		var self = plus.webview.currentWebview();
	    code = self.code;//获得参数
	    getAllSecurityQuestion();
	    getUserSecurityQuestion();
  })
})

//获取所有可供选择的密保
function getAllSecurityQuestion() {
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getAllSecurityQuestion",
        type:"POST",
        dataType : 'json',
        data:{},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭Loading");
                var list = data.data.list;
                for(var index = 0;index < list.length;index++){
                    var obj = list[index];
                    chooseTxts.push(obj.question_name);
                    questionIds.push(obj.question_id);
                    initChooseView();
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

//初始化选项
function initChooseView() {
    var question = chooseTxts;
    // 选择问题
    $("#selectQuestion1").picker({
        title: "请选择密保问题",
        cols: [
            {
                textAlign: 'center',
                values: question,
            }
        ],
        onChange: function(p, v, dv) {
            console.log(p, v, dv);
            for (var index = 0;index < chooseTxts.length;index++){
                var text = chooseTxts[index];
                if (text == dv){
                    questionIndex1 = index;
                    return;
                }
            }
        },
        onClose: function(p, v, d) {
            console.log("close");
        }
    });
    $("#selectQuestion2").picker({
        title: "请选择密保问题",
        cols: [
            {
                textAlign: 'center',
                values: question,
            }
        ],
        onChange: function(p, v, dv) {
            console.log(p, v, dv);
            for (var index = 0;index < chooseTxts.length;index++){
                var text = chooseTxts[index];
                if (text == dv){
                    questionIndex2 = index;
                    return;
                }
            }
        },
        onClose: function(p, v, d) {
            console.log("close");
        }
    });
    $("#selectQuestion3").picker({
        title: "请选择密保问题",
        cols: [
            {
                textAlign: 'center',
                values: question,
            }
        ],
        onChange: function(p, v, dv) {
            console.log(p, v, dv);
            for (var index = 0;index < chooseTxts.length;index++){
                var text = chooseTxts[index];
                if (text == dv){
                    questionIndex3 = index;
                    return;
                }
            }
        },
        onClose: function(p, v, d) {
            console.log("close");
        }
    });
}

//获取用户设置的密保问题
function getUserSecurityQuestion() {
    toast(2,"开启loading");
    $.ajax({
        url:Main.url + "/app/v1.0.0/getUserSecurityQuestion",
        type:"POST",
        dataType : 'json',
        data:{"code":code,"user_id":storage["user_id"]},
        success:function(data){
            if (data.status == 0){
                toast(3,"关闭Loading");
                questionIndex1 = data.data.one_security_question_id;
                questionIndex2 = data.data.two_security_question_id;
                questionIndex3 = data.data.three_security_question_id;
                if (data.data.one_security_question_answer != undefined && data.data.one_security_question_answer != ""){
                    document.getElementById("question_answer_one").value = data.data.one_security_question_answer;
                }
                if (data.data.two_security_question_answer != undefined && data.data.two_security_question_answer != ""){
                    document.getElementById("question_answer_two").value = data.data.two_security_question_answer;
                }
                if (data.data.three_security_question_answer != undefined && data.data.three_security_question_answer != ""){
                    document.getElementById("question_answer_three").value = data.data.three_security_question_answer;
                }
                for(var index = 0;index < questionIds.length;index++){
                    var obj = questionIds[index];
                    if (obj == questionIndex1){
                        document.getElementById("selectQuestion1").value = chooseTxts[index];
                    }
                    if (obj == questionIndex2){
                        document.getElementById("selectQuestion2").value = chooseTxts[index];
                    }
                    if (obj == questionIndex3){
                        document.getElementById("selectQuestion3").value = chooseTxts[index];
                    }
                }

            }
            else if(data.status == 2){
	            storage["user_id"] = "";
	            toast(1,data.msg);
	            joinLoginPage();
	        }
            else{
                toast(3,"关闭Loading");
            }
        },
    });
}

//设置密保问题
function settingQuestionAnswer() {
    var question_answer_one = document.getElementById("question_answer_one").value;
    var question_answer_two = document.getElementById("question_answer_two").value;
    var question_answer_three = document.getElementById("question_answer_three").value;
    if (questionIndex1 == -1){
        toast(1,"请选择第一个密保问题");
    }
    else if (questionIndex2 == -1){
        toast(1,"请选择第二个密保问题");
    }
    else if (questionIndex3 == -1){
        toast(1,"请选择第三个密保问题");
    }
    else if (question_answer_one == undefined || question_answer_one == ""){
        toast(1,"请设置第一个密保问题答案");
    }
    else if (question_answer_two == undefined || question_answer_two == ""){
        toast(1,"请设置第二个密保问题答案");
    }
    else if (question_answer_three == undefined || question_answer_three == ""){
        toast(1,"请设置第三个密保问题答案");
    }
    else{
        toast(2,"开启loading");
        $.ajax({
            url:Main.url + "/app/v1.0.0/setUserSecurityQuestion",
            type:"POST",
            dataType : 'json',
            data:{"code":code,"user_id":storage["user_id"],"one_security_question_id":questionIds[questionIndex1],"two_security_question_id":questionIds[questionIndex2],"three_security_question_id":questionIds[questionIndex3],
            "one_security_question_answer":question_answer_one,"two_security_question_answer":question_answer_two,"three_security_question_answer":question_answer_three},
            success:function(data){
                if (data.status == 0){
                    toast(0,"设置成功");
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