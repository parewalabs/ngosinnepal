function initTabletop(){
	Tabletop.init({
		key: '1VNQ3JYLmdEbnhvRPi4z-bvHo4UzzbeTdetaFK-M3q6s',
		callback: showInfo,
		simpleSheet: true
	});
}
function showInfo(tabletopData, tabletopInfo) {
	// console.log("spreadsheet data:", tabletopData);

	var keys = Object.keys(tabletopData[0]);
	var dataTemplate = $('#tpl-col').html();
	var $sink = $('#tabletop-output');
	tabletopData.forEach(function (item, i){
		// Data must be manually confirmed
		if (typeof item["Confirmed"] === undefined || item["Confirmed"] === "") return;

		// Create map markers. They will be appended to the map later.
		if (typeof item["Latitude"] !== undefined && typeof item["Longitude"] !== undefined)
			ngoMarkers[i] = L.marker([item["Latitude"], item["Longitude"]]).bindPopup(item["Name"]);
		
		// Append html
		var data = dataTemplate;
		var regexp, underscored_field;
		for (var i = keys.length - 1; i >= 0; i--) {
			if (item[keys[i]] === ""){
				underscored_field = keys[i].replace(/ /g, "_");
				regexp = "{field-"+underscored_field+"}";
				data = data.replace(new RegExp(regexp, "g"), "hidden");
			} else {
				regexp = "{"+keys[i]+"}";
				data = data.replace(new RegExp(regexp, "g"), item[keys[i]]);
			}
		};
		$sink.append(data);
	});

	initMap();
}
