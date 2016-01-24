// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var input1;
var input2;
var autocomplete1;
var autocomplete2;
var lat1;
var lon1;
var lat2;
var lon2;
var markers = [];

function submitLocations(){
    if (input1.value==""||input2.value=="")
        {
            alert("One or more locations is empty!");
            return;
        }
      autocomplete1.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete1.getPlace();
      
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        console.log(place);
        
        console.log(place.name);
        
        lat1=place.geometry.location.lat();
        
        lon1=place.geometry.location.lng();
          


    });
    
    autocomplete2.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete2.getPlace();
      
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        console.log(place);
        
        console.log(place.name);
        
        lat2=place.geometry.location.lat();
        
        lon2=place.geometry.location.lng();

    });
    
    var midpoint = getMidpoint(lat1, lon1, lat2, lon2)
    var midpointCoords = {lat: midpoint[0], lng: midpoint[1]};
    
    console.log(midpoint[0]);
    
    localStorage.setItem("mdpt", midpoint);
    window.location.href = "results.html";
}

function initMap() {
    
    input1 = document.getElementById('autocomplete1');
    autocomplete1 = new google.maps.places.Autocomplete(input1);
    
    input2 = document.getElementById('autocomplete2');
    autocomplete2 = new google.maps.places.Autocomplete(input2);

    infowindow = new google.maps.InfoWindow();
    
    autocomplete1.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete1.getPlace();
      
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        console.log(place);
        
        console.log(place.name);
        
        lat1=place.geometry.location.lat();
        
        lon1=place.geometry.location.lng();
        
                  console.log(lat1);
          console.log(lon1);

    });
    
    autocomplete2.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete2.getPlace();
      
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        console.log(place);
        
        console.log(place.name);
        
        lat2=place.geometry.location.lat();
        
        lon2=place.geometry.location.lng();
        console.log(lat2);
        console.log(lon2);

    });
    
    var midpoint = getMidpoint(lat1, lon1, lat2, lon2);
    var midpointCoords = {lat: midpoint[0], lng: midpoint[1]};

    map = new google.maps.Map(document.getElementById('map'), {
        center: midpointCoords,
        zoom: 15
    });

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: midpointCoords,
        radius: 500
    }, callback);
    
}

function initMaptwo() {
    var midpoint = localStorage.getItem("mdpt");
    var n = midpoint.indexOf(",");
    var midpointCoords = {lat: parseFloat(midpoint.substr(0,n)), lng: parseFloat(midpoint.substr(n+1,midpoint.length-1))};
    
    console.log(midpointCoords);
    
    infowindow = new google.maps.InfoWindow(); 

    map = new google.maps.Map(document.getElementById('map'), {
        center: midpointCoords,
        zoom: 15
    });

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: midpointCoords,
        radius: 500
    }, callback);
    
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var html = "";
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            html += "<div class='locations-wrapper'><div id='left-results'><h1 class='name black-text'>" + results[i].name + "</h1>"
//          console.log(results[i]);
            if (results[i].types.length > 0){
                var start = "<h3 class='type black-text'>";
                html += start;
            }
            var types = "";
            for (var k = 0; k < results[i].types.length; k++){
                if (k == results[i].types.length - 1){
                    types += results[i].types[k];
                    html += types + "</h3></div>";
                } else {
                    types += results[i].types[k] + ", ";
                }

            }
            html += "<div id='right-results'><h4 class='address black-text'>" + results[i].vicinity + "</h4>";
            
            html += "</div></div>";
            
            
//                        <h3 class="type black-text"> test type </h3>
//                        </div>
//                        <div id="right-results">
//                            <h4 class="address black-text"> test address </h4>
//                        </div>
//                    </div>
            console.log(results[i].name); //get name
            console.log(results[i].vicinity);
            console.log(results[i].types);
        }
        document.getElementById('locations-wrapper').innerHTML = html;
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
    markers.push(marker);
}

function clearMarkers() {
    setMapOnAll(null);
}
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
        
function getMidpoint(lat1, lng1, lat2, lng2) {
    Math.degrees = function(rad) {
        return rad * (180 / Math.PI);
    }
    Math.radians = function(deg) {
        return deg * (Math.PI / 180);
    }
    lat1 = Math.radians(lat1);
    lng1 = Math.radians(lng1);
    lat2 = Math.radians(lat2);
    lng = Math.radians(lng2);
    bx = Math.cos(lat2) * Math.cos(lng - lng1);
    by = Math.cos(lat2) * Math.sin(lng - lng1);
    lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + Math.pow(by, 2)));
    lon3 = lng1 + Math.atan2(by, Math.cos(lat1) + bx);
    return [Math.degrees(lat3), Math.degrees(lon3)]
}

function checkedUpdate() {
    // Retrieve the checked radiobuttons
    var checkedArr = [];
    
    var checkItems = $('.checkitem');
    
    for (var i = 0; i < checkItems.size(); i++) {
        if (checkItems[i].checked == true){
            checkedArr.push(checkItems[i].name);
        }
    }
    console.log(checkedArr);
    var midpoint = localStorage.getItem("mdpt")
    var n = midpoint.indexOf(",");
    var midpointCoords = {lat: parseFloat(midpoint.substr(0,n)), lng: parseFloat(midpoint.substr(n+1,midpoint.length-1))};
    
    console.log(midpointCoords);

    map = new google.maps.Map(document.getElementById('map'), {
        center: midpointCoords,
        zoom: 15
    });
    clearMarkers();
    
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: midpointCoords,
        radius: 500,
        types: checkedArr
    }, callback);
    
}
