function initTabletop(next){
	Tabletop.init({
		key: '1VNQ3JYLmdEbnhvRPi4z-bvHo4UzzbeTdetaFK-M3q6s',
		callback: function(d, t){ showInfo(d, t, next) },
		simpleSheet: true
	});
}
/**
 * Data has been fetched from database, now display it.
 */
function showInfo(tabletopData, tabletopInfo, next) {
	var keys = Object.keys(tabletopData[0]);
	var dataTemplate = $('#tpl-col').html();
	var popupTemplate = $('#tpl-popup').html();
	var $sinkTabletop = $('#tabletop-output');
	var causes = [];
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
		var dataHtml = dataTemplate;
		var regexp, classField;
		dataHtml = dataHtml.replace(new RegExp("{index}", "g"), j);
		var name_underscore = item["Name"].replace(/ /g, '_');
		dataHtml = dataHtml.replace(new RegExp("{Name_Underscore}", "g"), name_underscore);
		for (var i = keys.length - 1; i >= 0; i--) {
			if (item[keys[i]] === ""){
				// If data empty -> hide corresponding element by setting its class to 'hidden'
				classField = keys[i].replace(/ /g, "_");
				regexp = "{class-"+classField+"}";
				dataHtml = dataHtml.replace(new RegExp(regexp, "g"), "hidden");
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
						var cause = str.trim();
						var cause_underscore = cause.replace(/ /g, '_');
						causes.push(cause);
						replaceBy = replaceBy + '<span class="cause" data-name="'+cause_underscore+'">'+cause+'</span>';
					});
					dataHtml = dataHtml.replace("{causes-count}", items.length);
				}
				dataHtml = dataHtml.replace(new RegExp(regexp, "g"), replaceBy);
			}
		};
		$sinkTabletop.append(dataHtml);
	});
	// Add click handler to show location
	$('.class-Show_on_map').click(clicked_description_show_location);
	// Add click handler to reflow elements on expand/collapse content
	$('.ngo .panel-body button').click(function(){
		$('#tabletop-output').masonry({ itemSelector:'.ngo' });
	});

	/* FILTERING BEGIN */
	var filterTemplate = $('#tpl-filter').html();
	var filterHtml = "";
	// Return unique causes
	causes = arrayUnique(causes);
	causes.forEach(function (item){
		var item_underscore = item.replace(/ /g, '_');
		filterHtml = filterHtml + filterTemplate.replace(/{Name}/g, item).replace(/{Name_Underscore}/g, item_underscore);
	});
	$('#filter-selected .filter-output').append(filterHtml);
	$('.cause-clickable').click(clicked_filter);
	updateFilterView();
	/* FILTERING END */

	updateShownNgoNumber();
	updateTotalNgoNumber(tabletopData.length);
	next();
}
/**
 * When the filter button is clicked:
 * 1. The button is moved from "active filters" to "disabled filters" or vice versa, depending on where the button is now.
 * 2. "Active filter"-count (the div of class selected-causes-count) is updated to show how many filters for this particular NGO are active right now.
 * 		When that count reaches 0 (user clicks away all filters), all NGO panels with active filter count == 0 are hidden
 * 		When the count instead changes from 0 to 1, affected panels are shown again.
 * 3. Update number of currently shown NGOs
 * 4. Reflow elements (Masonry)
 */
function clicked_filter(e){
	var $target = $(e.target);
	var name = $target.attr("data-name");
	if ($target.hasClass("selected")){
		$target.detach().appendTo("#filter-select .filter-output");
		$('.class-causes [data-name='+name+']').each(function (i, item){
			var $element = $(item).parents(".panel-footer").children(".selected-causes-count");
			var count = parseInt($element.attr("data-count"));
			$element.attr("data-count", count - 1);
		});
	} else {
		$target.detach().appendTo("#filter-selected .filter-output");
		$('.class-causes [data-name='+name+']').each(function (i, item){
			var $element = $(item).parents(".panel-footer").children(".selected-causes-count");
			var count = parseInt($element.attr("data-count"));
			$element.attr("data-count", count + 1);
		});
	}

	$(".selected-causes-count[data-count=0]").parents(".ngo").addClass('hidden');
	$(".selected-causes-count[data-count=1]").parents(".ngo").removeClass('hidden');
	updateFilterView();
	updateShownNgoNumber();

	// Toggle class for the clicked element
	$target.toggleClass("selected");

	// Reflow elements
	$('#tabletop-output').masonry({ itemSelector:'.ngo' });
}
/**
 * The filter consists of two categories, one for shown NGOs and one for hidden NGOs.
 * During filtering, one category can turn empty and should then be hidden.
 * This function checks whether a category should be hidden and hides/shows it.
 */
function updateFilterView(){
	var $filterSelect = $('#filter-select');
	var $filterSelected = $('#filter-selected');
	if ($('#filter-select .filter-output').children().length == 0){
		$filterSelect.addClass('hidden');
	} else {
		$filterSelect.removeClass('hidden');
	}
	if ($('#filter-selected .filter-output').children().length == 0){
		$filterSelected.addClass('hidden');
	} else {
		$filterSelected.removeClass('hidden');
	}
}
function updateTotalNgoNumber(total){
	$('#filter-wrapper .showing-wrapper .total-count').text(total);
}
function updateShownNgoNumber(){
	var numVisibleNgos = $('.ngo').length - $('.ngo.hidden').length - 1; // The 1 is the template
	$('#filter-wrapper .showing-wrapper .showing-count').text(numVisibleNgos);
	if (numVisibleNgos == 1){
		$('#filter-wrapper .showing-wrapper .plural').addClass('hidden');
	} else {
		$('#filter-wrapper .showing-wrapper .plural').removeClass('hidden');
	}
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
/**
 * Returns unique array, helper function
 * @param  {array} a Array with possibly duplicate values
 * @return {array}   Array with no duplicate values
 */
function arrayUnique(a) {
	return a.reduce(function (p, c) {
		if (p.indexOf(c) < 0) p.push(c);
		return p;
	}, []);
};
