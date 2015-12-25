//设置cookie
function setCookie(name, value, iday) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iday);
    document.cookie = name + '=' + value + ';expires=' + oDate;
}
//获取cookie
function getCookie(name) {
    var arr = document.cookie.split(";");
    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split("=");
        if (arr2[0] == name) {
            return arr2[1];
        }
    }
}
//删除cookie
function reMoveCookie(name) {
    setCookie(name, 1, -1);
}
//获取cookie
$(function() {
    if(getCookie('openState') == 'true') {
       $(".QQ_S").css("display", "block");
	   $(".QQ_S1").css("display", "none");
    }
	else if(getCookie('openState') == 'false'){
		$('.QQ_S').css("display","none");
		$('.QQ_S1').css("display","block");
	}
});
//显示隐藏方法
function HideFoot(){
	setCookie("openState","false",7);
	var winHeight = $(window).height();
	var objHeight = $(".QQ_S").height();
	var objTop = winHeight - objHeight - 15;
	$(".QQ_S").animate({top:objTop},100,function(){
		$('.QQ_S').css("display","none");
		$('.QQ_S1').css("display","block");		
	});
}
function ShowFoot(){
	setCookie("openState","true",7);
	$(".QQ_S").css("display", "block");
	$(".QQ_S1").css("display", "none");
	$(".QQ_S").animate({top:"40%"},100);
}
//返回顶部
function backToTop(){
	$("html,body").animate({ scrollTop: 0 },100,function(){
	});
}
/* 代码整理：懒人之家 www.lanrenzhijia.com */