---
    layout: null
---

/**
 * 页面ready方法
 */
$(document).ready(function() {

    console.log("你不乖哦，彼此之间留点神秘感不好吗？");

    backToTop();
    search();
});

/**
 * 回到顶部
 */
function backToTop() {
    var e = $("#rocket-to-top"),
    t = $(document).scrollTop(),
    n,
    r,
    i = !0;
    $(window).scroll(function() {
        var t = $(document).scrollTop();
        t == 0 ? e.css("background-position") == "0px 0px" ? e.fadeOut("slow") : i && (i = !1, $(".level-2").css("opacity", 1), e.delay(100).animate({
            marginTop: "-1000px"
        },
        "normal",
        function() {
            e.css({
                "margin-top": "-125px",
                display: "none"
            }),
            i = !0
        })) : e.fadeIn("slow")
    }),
    e.hover(function() {
        $(".level-2").stop(!0).animate({
            opacity: 1
        })
    },
    function() {
        $(".level-2").stop(!0).animate({
            opacity: 0
        })
    }),
    $(".level-3").click(function() {
        function t() {
            var t = e.css("background-position");
            if (e.css("display") == "none" || i == 0) {
                clearInterval(n),
                e.css("background-position", "0px 0px");
                return
            }
            switch (t){
            case "0px 0px":
                e.css("background-position", "-298px 0px");
                break;
            case "-298px 0px":
                e.css("background-position", "-447px 0px");
                break;
            case "-447px 0px":
                e.css("background-position", "-596px 0px");
                break;
            case "-596px 0px":
                e.css("background-position", "-745px 0px");
                break;
            case "-745px 0px":
                e.css("background-position", "-298px 0px");
            }
        }
        if (!i) return;
        n = setInterval(t, 50),
        $("html,body").animate({scrollTop: 0},"slow");
    });
}

function search(){
    (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
        (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
        e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.appendChild(s);
    })(window,document,'script','//s.swiftypecdn.com/install/v2/st.js','_st');

    _st('install','{{site.swiftype_searchId}}','2.0.0');
}

//返回顶部
function backToTop2(){
    $("html,body").animate({ scrollTop: 0 },100,function(){
    });
}

function showme(){
var div = document.getElementById('showpic');
if (div.style.display == "block") {
div.style.display = "none";
} else if (div.style.display == "none") {
div.style.display = "block"
}
}