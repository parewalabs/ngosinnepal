$(document).ready(function(){
	$("header .navbar .filter .navbar-text").click(function (e){
		e.preventDefault();
		var filterPos = $("#filter-wrapper").offset().top;
		var scrollTo = filterPos;
		var curScrollPos = $(window).scrollTop();
		// Navbar gets hidden on scroll down but not on scroll up, so make this check
		if (curScrollPos + NAVBAR_HEIGHT > filterPos)
			scrollTo = filterPos - NAVBAR_HEIGHT;
		$("html, body").animate({ scrollTop: scrollTo }, 300);
	});
});