function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 40.744194, lng: -73.994052},
  });
  var infoWindow = new google.maps.InfoWindow({map: map});
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) { //can do "navigator.geolocation.getCurrentPosition(function(position) { " instead and use getcurrentPosition rather than watchPosition 
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

/*
var destinations = [];
for (var i = 0; i < test.length; i++) {
destinations[i] = test[i].position;
}

var service = new google.maps.DistanceMatrixService;
service.getDistanceMatrix({
	origins: pos;
	destinations: destinations,
	travelMode: 'WALKING',
	unitSystem: google.maps.UnitSystem.IMPERIAL,
}, function(response, status) {
	if (status !== google.maps.DistanceMatrixStatus.OK) {
		window.alert('Error was: ' + status);
    } else {
    	calculateDistance(response);
    }
});

function calculateDistance(response) {
*/

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: We would like to use your location as the starting point of your crawl. Please reload page and allow location services' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function initMap2() {
  var test = [];
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 40.744194, lng: -73.994052},
  });

  directionsDisplay.setMap(map);

  var locations = []; //Empty Array which will later contain location objects consisting of a Title & Location (in latitude and longitude coordinates)

  for (var name in response["venues"]) {
  	if (response["venues"].hasOwnProperty(name)) {
    var title = name; //response[venue] will give title everything of venue's information starting with address, formatted address etc...
    var locationlat = response["venues"][name]["lat"];
    var locationlng = response["venues"][name]["lng"];
    var obj = {title: title, location: {lat: locationlat, lng: locationlng}} //creates an object representing each object in Response
    locations.push(obj); //pushes to locations array
   }
  }

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    test.push({
      position: locations[i].location,
      name: locations[i].title
    });
  }
  calculateAndDisplayRoute(directionsService, directionsDisplay, test);
}


function calculateAndDisplayRoute(directionsService, directionsDisplay, test) {
  var waypts = [];
  for (var i = 1; i < test.length - 1; i++) {
      waypts.push({
        location: test[i].position,
        stopover: true
    });
  }

  var origin = test[0].position;
  var destination = test[test.length - 1].position;

  console.log(pos);
  console.log(origin);
  console.log(destination);

  directionsService.route({
    origin: origin,
    destination: destination,
    waypoints: waypts,
    optimizeWaypoints: true,  //solves traveling salesman problem
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}