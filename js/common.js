//页面计算问题
function setRootSize() {
	var deviceWidth = document.documentElement.clientWidth; 
	if(deviceWidth>750){deviceWidth = 750;}  
	document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
}
setRootSize();
window.addEventListener('resize', function () {
    setRootSize();
}, false);
$(document).ready(function(){
	setRootSize();
});

$(function(){
	$("video").attr({
		"width":"100%",
		"height":"auto",
	})
});

//导航
function selNav(but,wrap,classname){
	var _but = $("#"+but),
		_wrap = $("#"+wrap),
		_close = $(".close");
	_but.bind("touchstart click",function(){
		_wrap.addClass('sel');
		return false;
	});
	$(document).bind("touchstart click",function(event){
		if(!$(event.target).hasClass(classname)){
			_wrap.removeClass('sel');
		}		
	});
}

// tab切换
function selTab(wrapid,menubut,item){
	var _wrap = $("#"+wrapid),
		_menu = _wrap.find("."+menubut),
		_item = _wrap.find("."+item);
	_menu.bind("click",function(){
		var _index = $(this).index();
		_menu.removeClass('sel');
		_item.removeClass('sel');
		_menu.eq(_index).addClass('sel');
		_item.eq(_index).addClass('sel');
		return false;
	});
}

// 显示隐藏
function selShow(but,wrap){
	var _but = $("#"+but),
		_wrap = $("#"+wrap),
		_close = _wrap.find(".close");
	_but.bind("click",function(){
		_wrap.addClass('sel');
	});
	_close.bind("click",function(){
		_wrap.removeClass('sel');
	});
}

function pubtabmenu(id,num){
	var _obj = $("#"+id),
		_top = _obj.offset().top,
		_fs  = parseInt(document.documentElement.style.fontSize),
		_flat = _fs*num;
	$(window).bind("scroll",function(){
		var _scrolltop = $(document).scrollTop();
		if(_scrolltop>_flat){
			_obj.addClass('sel');
		}else{
			_obj.removeClass('sel');
		}
	})
}