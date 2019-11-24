// 处理点击事件
var _openw=null;
// 预创建二级页面
var preate={};
// H5 plus事件处理
var as='pop-in';// 默认窗口动画



//启动初始化类
var pageMain = {
	init:function(){
		if(window.plus){
	    		plusReady();
		}else{ 
		    document.addEventListener( "plusready", plusReady, false );
		}
	}
};

pageMain.init();

// 扩展API准备完成后要执行的操作
function plusReady(){
	var ws = plus.webview.currentWebview(); //pw回车可输出plus.webview
	preateWebviews();
}

function preateWebviews(){
	preateWebivew('html/webview.html');
	var myPage=new Array("html/register.html","html/retrieve_password.html","html/tab_bar.html");
	// 由于启动是预创建过多Webview窗口会消耗较长的时间，所以这里限制仅创建5个
	for( var i=0;i<myPage.length&&i<2;i++){
		var id=myPage[i].id;
		id&&(id.length>0)&&preateWebivew(id);
	}
}

function preateWebivew(id){
	if(!preate[id]){
		var w=plus.webview.create(id,id,{scrollIndicator:'none',scalable:false,popGesture:'hide'},{preate:true});
		preate[id]=w;
		w.addEventListener('close',function(){//页面关闭后可再次打开
			_openw=null;
			preate[id]&&(preate[id]=null);//兼容窗口的关闭
		},false);
	}
}

/**
 * 点击打开新窗口
 * @param {Object} id	加载的页面地址，也用作窗口标识
 * @param {Object} a	页面动画内心，默认使用全局as设置的值
 * @param {Object} s	是否不显示窗口
 */
function clicked(id,a,s){
	if(_openw){return;}
	a||(a=as);
	_openw=preate[id];
	if(_openw){
		_openw.showded=true;
		_openw.show(a,null,function(){
			_openw=null;//避免快速点击打开多个页面
		});
	}else{
//		var wa=plus.nativeUI.showWaiting();
//		_openw=plus.webview.create(id,id,{scrollIndicator:'none',scalable:false,popGesture:'hide'},{preate:true});//复用二级页面
		_openw=plus.webview.create(id,id,{scrollIndicator:'none',scalable:false,popGesture:'close'});
		preate[id]=_openw;
		_openw.addEventListener('loaded',function(){//叶面加载完成后才显示
//		setTimeout(function(){//延后显示可避免低端机上动画时白屏
//			wa.close();
			_openw.showded=true;
			s||_openw.show(a,null,function(){
				_openw=null;//避免快速点击打开多个页面
			});
			s&&(_openw=null);//避免s模式下变量无法重置
//		},10);
		},false);
		_openw.addEventListener('hide',function(){
			_openw&&(_openw.showded=true);
			_openw=null;
		},false);
		_openw.addEventListener('close',function(){//页面关闭后可再次打开
			_openw=null;
			preate[id]&&(preate[id]=null);//兼容窗口的关闭
		},false);
	}
}


//打开新页面
function openNewPage(html_id){
	//打开关于页面
  mui.openWindow({
    url: html_id, 
    id:html_id
  });
}