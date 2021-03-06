// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//title layer tht will be background
var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  maxZoom: 18,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 4,
  //layers: [outdoorsmap, grayscalemap, satellitemap, earthquakes]
});
outdoorsmap.addTo(myMap);


// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  console.log(data)
  // Once we get a response, send the data.features object to the createMarkers function
  //function createMarkers(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake


  // Define function to create the circle radius based on the magnitude
  function radiusSize(magnitude) {
    //var magnitude= feature.properties.mag;
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 5;

    console.log(magnitude);
  }
  // Function for styling the map
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.75,
      fillColor: circleColor(feature.geometry.coordinates[2]),
      color: "yellow",
      radius: radiusSize(feature.properties.mag),
      stroke: true,
      weight: 0.5

    };
  }
  // Define function to set the circle color based on the magnitude
  function circleColor(mag) {
    switch (true) {
      case mag > 90:
        return "#9ACD32";
      case mag > 70:
        return "#ADFF2F";
      case mag > 50:
        return "#808000";
      case mag > 30:
        return "#FFFF00";
      case mag > 10:
        return "#BDB76B";
      default:
        return "#F0E68C";
    }
  }
  //   if (magnitude < 1) {
  //     return "red"
  //   }
  //   else if (magnitude < 2) {
  //     return "green"
  //   }
  //   else if (magnitude < 3) {
  //     return "blue"
  //   }
  //   else if (magnitude < 4) {
  //     return "purple"
  //   }
  //   else if (magnitude < 5) {
  //     return "pink"
  //   }
  //   else {
  //     return "white"
  //   }
  // }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the function once for each piece of data in the array
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng
        //{
        //radius: radiusSize(feature.properties.mag),
        //color: circleColor(feature.properties.mag),
        // fillOpacity: 1
        //}
      );
    },
    style: mapStyle,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h2> Magnitude: " + feature.properties.mag + "</h2> <hr> <h3>Location: " + feature.properties.place +
        "</h3> <h3>Depth: " + feature.geometry.coordinates[2] + "</h3>");
    }
  }).addTo(myMap);

  // // Sending our earthquakes layer to the createMap function
  // createMap(earthquakes);


  // createMarkers(data);
  // console.log(data)

});


// function createMap(earthquakes) {

//   // Define outdoormap, satellitemap, and grayscalemap layers
//   var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
//     maxZoom: 18,
//     id: "mapbox/outdoors-v11",
//     accessToken: API_KEY
//   });

// var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
//   maxZoom: 18,
//   id: "mapbox/satellite-v9",
//   accessToken: API_KEY
// });

// var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
//   maxZoom: 18,
//   id: "mapbox/light-v10",
//   accessToken: API_KEY
// });



//Define a baseMaps object to hold our base layers
// var baseMaps = {
//   "Outdoor Map": outdoorsmap,
//   "Greyscale Map": grayscalemap,
//   "Satellite Map": satellitemap
// };

//Create overlay object to hold our overlay layer
// var overlayMaps = {
//   Earthquakes: earthquakes,
// };


// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// }).addTo(myMap);


// color function to be used when creating the legend
function getColor(d) {
  return d > 5 ? '#9ACD32' :
    d > 4 ? '#ADFF2' :
      d > 3 ? '#808000' :
        d > 2 ? '#FFFF00' :
          d > 1 ? '#BDB76B' :
            '#F0E68C';
}

// Add legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {

  var div = L.DomUtil.create('div', 'info legend');

  var  grades = [-10, 10, 30, 50, 70, 90];
  var colors = ["#9ACD32", "#ADFF2F", "#808000", "#FFFF00", "#BDB76B", "#F0E68C"];
  // var colors = [
  //   "#98ee00",
  //   "#d4ee00",
  //   "#eecc00",
  //   "#ee9c00",
  //   "#ea822c",
  //   "#ea2c2c"
  // ];
  //l//abels = ["pink", "purple", "blue", "green", "red", "white"];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      console.log(colors[i]);
  }

  return div;
 
};
legend.addTo(myMap);

 // legend.addTo(myMap);
//})
