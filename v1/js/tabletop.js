function initTabletop(next){
	Tabletop.init({
		key: '1VNQ3JYLmdEbnhvRPi4z-bvHo4UzzbeTdetaFK-M3q6s',
		callback: function(d, t){ showInfo(d, t, next) },
		simpleSheet: true
	});
}
function showInfo(tabletopData, tabletopInfo, next) {
	var keys = Object.keys(tabletopData[0]);
	var dataTemplate = $('#tpl-col').html();
	var popupTemplate = $('#tpl-popup').html();
	var $sink = $('#tabletop-output');
	tabletopData.forEach(function (item, j){
		// Data must be manually confirmed. If not confirmed, go on to next item.
		if (typeof item["Confirmed"] === undefined || item["Confirmed"] === "") return;

		// Create map markers. They will be appended to the map later.
		var popupHtml = popupTemplate;
		popupHtml = popupHtml.replace(new RegExp("{Name}", "g"), item["Name"]);
		popupHtml = popupHtml.replace(new RegExp("{index}", "g"), j);
		if (typeof item["Latitude"] !== undefined && typeof item["Longitude"] !== undefined){
			ngoMarkers[j] = L.marker([item["Latitude"], item["Longitude"]]).bindPopup(popupHtml);
			ngoMarkers[j].on("popupopen", popup_opened);
		}
		
		// Append html
		var data = dataTemplate;
		var regexp, classField;
		data = data.replace(new RegExp("{index}", "g"), j);
		for (var i = keys.length - 1; i >= 0; i--) {
			if (item[keys[i]] === ""){
				// If data empty -> hide corresponding element by setting its class to 'hidden'
				classField = keys[i].replace(/ /g, "_");
				regexp = "{class-"+classField+"}";
				data = data.replace(new RegExp(regexp, "g"), "hidden");
			} else {
				regexp = "{"+keys[i]+"}";
				var replaceBy = "";
				if (keys[i] !== "Causes"){
					replaceBy = item[keys[i]];
				} else {
					var items = item[keys[i]].split(',');
					items.forEach(function (item){
						var str = item.trim();
						if (str == "") return;
						replaceBy = replaceBy + '<span class="cause">'+str.trim()+'</span>';
					});
				}
				data = data.replace(new RegExp(regexp, "g"), replaceBy);
			}
		};
		$sink.append(data);
	});

	// Add click handler to show location
	$('.class-Show_on_map').click(clicked_description_show_location);

	next();
}
/**
 * Handles click on "Show on map" link in NGO description.
 * Centers map on marker. Since re-centering map takes time, the animation is started
 * first to have a chance to complete recentering of the map.
 */
function clicked_description_show_location(e){
	e.preventDefault();
	$("html, body").animate({ scrollTop: 0 }, 300);
	var index = e.target.attributes["data-index"].nodeValue;
	var bounds = new L.LatLngBounds();
	bounds.extend(ngoMarkers[index].getLatLng());
	map.fitBounds(bounds);
	ngoMarkers[index].openPopup();
}
/**
 * Click handler cannot be attached if the popup is not opened, i.e. not visible
 * @param  {Object} obj Contains popup, type, target
 */
function popup_opened(obj){
	$('#map-canvas .map-readmore').click(function (e){
		e.preventDefault();
		var id = $(e.target).attr('href');
		var top = $(id).offset().top - NAVBAR_HEIGHT - 1;
		$("html, body").animate({ scrollTop: top }, 300);
	});
}