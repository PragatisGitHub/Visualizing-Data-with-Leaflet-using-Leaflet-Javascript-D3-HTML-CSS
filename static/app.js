// To fit the world
// var mymap = L.map("mapid").fitWorld();

//To show the United states of America
var myMap = L.map('mapid', {
    'center': [0, 0]
});

var maxBounds = L.latLngBounds(
    L.latLng(31.491920, -110.229263),  //NE coordinates
    L.latLng(40.018822,-98.066505)     //SW coordinates
); 

myMap.setMaxBounds(maxBounds);
myMap.fitBounds(maxBounds);

myMap.setZoom(3);

// Creating a tile layer usually involves setting the URL template for the 
// tile images, the attribution text and the maximum zoom level of the layer.
// In this example we’ll use the mapbox.satellite tiles from Mapbox’s “Classic maps” 

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.satellite',
    accessToken: API_KEY
}).addTo(myMap);

//GeoJSON Summary
//var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
//var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

//Reading the data from the geoJSON url by passing the link as an parameter
d3.json(link, data=>{ 
    createMap(data.features)
});   

//Function to choose color based on the intensity or magnitude of the earthquake
function colorChoice(earthquakeMag){
    if(earthquakeMag>=0 & earthquakeMag<=1){
        return "#ffcc00";
    }
    else if(earthquakeMag>1 & earthquakeMag<=2){
        return "#ffbb00";
    }
    else if(earthquakeMag>2 & earthquakeMag<=3){
        return "#ffaa00";
    }
    else if(earthquakeMag>3 & earthquakeMag<=4){
        return "#ff9900";
    }
    else if(earthquakeMag>4 & earthquakeMag<=5){
        return "#ff8800";
    }
    else if(earthquakeMag>5 & earthquakeMag<=6){
        return "#ff7700";    
    }
    else if(earthquakeMag>6 & earthquakeMag<=7){
        return "#ff6600";
    }    
    else if(earthquakeMag>7 & earthquakeMag<=8){
        return "#ff5000";   
    } 
    else if(earthquakeMag>8){
        return "##ff0000";
    }        
}

//Display map with circle markers and bindpopup
function createMap(earthQuakedata){
    var earthQuake = L.geoJson(earthQuakedata,{
        pointToLayer: function (feature, latlng) 
            {
            return L.circleMarker(latlng,{
                radius:feature.properties['mag']*2,
                color: colorChoice(feature.properties['mag']),
                weight:.8,
                fillopacity:1
             }).bindPopup(function (layer) {
                const {mag,place,time} = layer.feature.properties  
                const displayString = `<strong>Magnitude</strong>: ${mag}<br><strong>Location</strong>: ${place}<br><strong>Date</strong>: ${Date(time)}`
                return displayString; 
            }).addTo(myMap);
            }
    });
    earthQuake.addTo(myMap);
};

// Creating legend control
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = [0,1,2,3,4,5,6,7,8]
    var colors = ["#ffcc00","#ffbb00","#ffaa00","#ff9900","#ff8800","#ff7700","#ff6600","#ff5500","#ff0000"]
    var labels = ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8+"];
    var legenddisplay = [];
    // Add min & max
    
    limits.forEach(function(limit, index) {
        legenddisplay.push("<li style=\"list-style:none;background-color: " + colors[index] + "\">"+ labels[index] +"</li>");
      });
    div.innerHTML += "<ul>" + legenddisplay.join("") + "</ul>";
    return div;  
    };    
legend.addTo(myMap);    