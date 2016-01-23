// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;

function submitLocations() {
    window.location.href = "results.html";
}

function initMap() {
    // Two Lat Lon
    var lat1 = -33;
    var lon1 = 150;
    var lat2 = -34;
    var lon2 = 151;

    var midpoint = getMidpoint(lat1, lon1, lat2, lon2)
    var midpointCoords = {
        lat: -33.867,
        lng: 151.195
    };

    console.log(midpoint);

    // Adds AutoComplete for input
    map = new google.maps.Map(document.getElementById('map'), {
        center: midpointCoords,
        zoom: 15
    });

    var input1 = document.getElementById('autocomplete1');




    var autocomplete1 = new google.maps.places.Autocomplete(input1);

    var input2 = document.getElementById('autocomplete2');

    var autocomplete2 = new google.maps.places.Autocomplete(input2);

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: midpointCoords,
        radius: 500,
        types: ['store']
    }, callback);


}


function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            //            console.log(results[i]);
            console.log(results[i].name); //get name
            console.log(results[i].vicinity);
            console.log(results[i].types);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function getMidpoint(lat1, lng1, lat2, lng2) {
    Math.degrees = function (rad) {
        return rad * (180 / Math.PI);
    }
    Math.radians = function (deg) {
        return deg * (Math.PI / 180);
    }
    lat1 = Math.radians(lat1);
    lng1 = Math.radians(lng1);
    lat2 = Math.radians(lat2);
    lng = Math.radians(lng2);
    bx = Math.cos(lat2) * Math.cos(lng - lng1)
    by = Math.cos(lat2) * Math.sin(lng - lng1)
    lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + Math.pow(by, 2)));
    lon3 = lng1 + Math.atan2(by, Math.cos(lat1) + bx);
    return [Math.round(Math.degrees(lat3), 5), Math.round(Math.degrees(lon3), 5)]
}