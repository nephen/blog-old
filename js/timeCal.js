$(document).ready(function() {
    calb();
});

function calb()
{
y2=2015;
m2=9;
d2=5;

var myDate = new Date();
y3=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
m3=myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
d3=myDate.getDate();        //获取当前日(1-31)

day2=new Date(y2,m2-1,d2);
day3=new Date(y3,m3-1,d3);

document.getElementById("result2").innerHTML=(day3-day2)/86400000;
}