$(document).ready(function () {
    if(location.hash){
        $(".about_tab li").removeClass("select")
        $(`.${location.hash.slice(1)}`).addClass("select")
        $(".introduce_content").hide()
        $(".introduce_content").eq($(location.hash).index()).show()
    }
    $(".about_tab li").click(function () {
        location.hash = $(this).attr("class")
        $(".about_tab li").removeClass("select")
        $(this).addClass("select")
        $(".introduce_content").hide()
        $(".introduce_content").eq($(this).index()).show()
    })
});
