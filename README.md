# NGOs in Nepal
This website aims to crowdsource trusted, reputable and active NGOs in Nepal. All submissions are manually reviewed before going live.

## Tech side
**Submissions** accepted using this public Google Form [https://goo.gl/HV6IYp](https://goo.gl/HV6IYp).

**Database** The resulting Google Spreadsheet forms the database. Using [tabletop.js](https://github.com/jsoma/tabletop), the data from the Google Spreadsheet is fetched in json form.

**Map** created using [leaflet.js](http://leafletjs.com/) with plugins [sleep](https://github.com/CliffCloud/Leaflet.Sleep) and [markercluster](https://github.com/Leaflet/Leaflet.markercluster).

> Sleep plugin: "When scrolling down a page, if you cursor hits a leaflet map, the scroll is stopped in it's tracks and the map starts zooming. This is annoying!"
