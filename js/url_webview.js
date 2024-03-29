var nWaiting,nTitle; // 原生view的等待界面和title
var touchX; // nWaiting的点击坐标的x数值
var backPressed; //返回箭头是否处于按下状态
var contentWebview=null; //准备打开网址的webview
var bitmap=null; // 返回图标
var topoffset=0;

//mui.init();
//mui.plusReady(function() {
//	mui.ready(function() {
//		initView();
//	});
//
//	
//})

//初始化
function initViewWebViewData(){
	initWebView();
	// 重写返回处理
	var _back=window.back;
	function safeback(){
		contentWebview?contentWebview.close('pop-out'):(bitmap&&bitmap.clear(),nWaiting&&nWaiting.clear(),_back());
	}
	window.back=safeback;
}

//初始化webview
	function initWebView(){
		if(plus.navigator.isImmersedStatusbar()){// 兼容沉浸式状态栏模式
				topoffset=Math.round(plus.navigator.getStatusbarHeight());
			}
			var bdata = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABYCAYAAAADWlKCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKwwAACsMBNCkkqwAAABZ0RVh0Q3JlYXRpb24gVGltZQAwOS8xMi8xM5w+I3MAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAACcklEQVR4nO3a0XESURiG4TeO99iBWoGZ+RvADtKBpAPtwBLsANJBrEAs4MyYDmIHSQXkgk0mMLK7ILt8/+F778ici394OGfDsher1Qqn05tTD+A2M4hYBhHLIGIZRCyDiGUQsQwilkHEMohYBhHLIGIZRCyDiGUQsQwilkHEMohYBhHLIGIZRCyDiGUQsQwilkHEMohYb089wNCVUq6Ay+blfUQsTjhOZxc1P9tbSlkAX7b+/C0ifpxgnF5Ve2TtwAD4OvIoe1UlSAsGwPsRR9m76kA6MAD+jjTKQVUF0gMD4HaEUQ6umot6T4ybiJgNP83hVbFDasGACnZIT4yfEXE1wjj/Xeod0hPjDpgNPsyRSguyB8Y0Ih6Gn+g4pQSpFQMSgtSMAclAaseARCDngAFJQM4FAxKAnBMGiH8xLKVMgV89ln6MiPthpxkn6R0SEUvgusfSZSnlsnuZftI75LlSygyYdyx7ZH1s/Rl+ouFKAQIvx9ctMGlZlh4lDQhAcywtqRhF+hqyXfMmT1m/6buasL6mzMaY6dilAoENlLuWZRNgnhEl1ZH1ulLKO9bH16eOpdfqz2K9Lt0Oea75EjilfadAsp2SFgQ2UH53LJ2XUr4PPtARSntkbVfL7+rVgEBvlM/NHQDJUh9Z2zWf/puOZbPhJzm8qkDgBaXt/teHcSY5rOpAAJp/c/vclJSrShDYifKI+NPvVV3U/1VzU3LavFyo/25SPUi2qj2ysmYQsQwilkHEMohYBhHLIGIZRCyDiGUQsQwilkHEMohYBhHLIGIZRCyDiGUQsQwilkHEMohYBhHLIGIZRCyDiGUQsZ4Ak9fPFwUy/HsAAAAASUVORK5CYII=';
			bitmap = new plus.nativeObj.Bitmap('back');
			bitmap.loadBase64Data(bdata, function(){
				bitmap.isLoadSuccess = true;
				nWaiting&&nWaiting.drawBitmap(bitmap,null,{top:topoffset+'px',left:'0px',width:'44px',height:'44px'},'backicon');
				console.log('Back bitmap load success');
			}, function(e){
				console.log('Back bitmap load failed: '+JSON.stringify(e));
			});
			
			//创建nWaiting
			creatWaiting();
	}


	function creatWaiting(){
		//判断view是否已存在，避免重复创建，尤其调试刷新网页时很容易触发重复创建 
		nWaiting = plus.nativeObj.View.getViewById('nWaiting');
		if(nWaiting){
			return;
		}
		nWaiting = new plus.nativeObj.View('nWaiting',{top:'0px',left:'0px',height:'100%',width:'100%'});
		nWaiting.interceptTouchEvent(true);
		
		//初始化绘制nwaiting界面
		nWaiting.drawRect('#0b8ffe',{top:'0px',left:'0px',height:(topoffset+44)+'px',width:'100%'}) //绘制title背景色
		bitmap&&bitmap.isLoadSuccess&&nWaiting.drawBitmap(bitmap,null,{top:topoffset+'px',left:'0px',width:'44px',height:'44px'},'backicon');
		nWaiting.drawText( '标题', {top:topoffset+'px',left:'0px',width:'100%',height:'44px'}, {size:'17px',color:'#FFFFFF'});
		nWaiting.drawRect('#EEEEEE',{top:(topoffset+44)+'px',left:'0px',width:'100%'}) //绘制等待内容区背景色
		nWaiting.drawText( '加 载 中 ...', {top:(topoffset+44)+'px',left:'0px',width:'100%',height:'50%'}, {size:'12px',color:'rgb(100,100,100)'});
		
	}

	// 更新窗口导航栏 
	function updateNavigationbar(){
		nTitle = contentWebview.getNavigationbar();
//		if(nTitle == null){
			nTitle.interceptTouchEvent(true);
			 //处理点击事件
			nTitle.addEventListener('click', function(e){
				touchX = e.pageX;
				if(touchX>3 && touchX<44){
					back();
				}
			});
			//补充绘制nTitle界面
			nTitle.drawBitmap(bitmap, null, {top:'0px',left:'0px',width:'44px',height:'44px'}, 'backicon'); // 绘制返回箭头
//		}
		
	}
	// 使用原生View控件作为动画模板显示窗口 
	function showWithWaiting(loadUrl){
		var bShow=bUpdate=false;
		contentWebview = plus.webview.create(loadUrl, 'contendWebview', {navigationbar:{backgroundColor:'#0b8ffe',titletText:'标题',titleColor:'#FFFFFF'}});
		// 更新Webview的原生头内容
		updateNavigationbar();//setTimeout(updateNavigationbar, 100);
		contentWebview.addEventListener('close', function(){
			contentWebview=null;
		});
		contentWebview.addEventListener('titleUpdate', function(){
			bUpdate=true;
			bShow&&nWaiting.hide();
		}, false);
		contentWebview.addEventListener('loaded', function(){// 兼容titleUpdate事件不触发的情况
			bUpdate||(bUpdate=true,bShow&&nWaiting.hide());
		}, false);
		contentWebview.show('pop-in', null, function(){
			bShow=true;
			bUpdate&&nWaiting.hide();
		}, {capture:nWaiting});
	}