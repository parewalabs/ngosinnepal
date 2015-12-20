var ngoMarkers = [];
var NAVBAR_HEIGHT = $('header .navbar').height();
var MAP_HEIGHT = 400;
$(document).ready(function(){
	// Get NGO data
	initTabletop(initMap);

	// Hide navigation on scroll
	var myElement = document.querySelector("header nav");
	var headroom  = new Headroom(myElement, {
		offset: MAP_HEIGHT,	// offset in px before hiding element
		tolerance: {		// scroll tolerance in px before state changes
			up: 10,
			down: 0
		}
	});
	headroom.init();
});