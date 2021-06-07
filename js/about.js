$(document).ready(function () {
    $(".about_tab li").click(function () {
        $(".about_tab li").removeClass("select")
        $(this).addClass("select")
        $(".introduce_content").hide()
        $(".introduce_content").eq($(this).index()).show()
    })
});