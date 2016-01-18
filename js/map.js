var map;
function initMap(){
	var $mapCanvas = $('#map-canvas');
	$mapCanvas.height(MAP_HEIGHT);

	var osmTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var basemap = L.tileLayer(osmTileUrl, {
		attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		maxZoom: 18,
	});
	map = new L.map($mapCanvas[0], {
		layers: [basemap]
	});
	map.setView([27.700769, 85.300140], 8); // Center over Kathmandu, with a certain zoom level
	
	var clusterGroup = L.markerClusterGroup();
	ngoMarkers.forEach(function (item){
		clusterGroup.addLayer(item);
	});
	map.addLayer(clusterGroup);
}