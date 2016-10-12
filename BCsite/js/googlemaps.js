var test = [];

function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 40.744194, lng: -73.994052},
  });

  directionsDisplay.setMap(map);
}

function initMap2() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 40.744194, lng: -73.994052},
  });

  directionsDisplay.setMap(map);

  var locations = []; //Empty Array which will later contain location objects consisting of a Title & Location (in latitude and longitude coordinates)

  var venue_name = Object.keys(response); //This variable is an array of all of the keys in Response--essentially each venue object in Response
  venue_name.forEach(function(venue) {
    var title = venue_name[i]; //response[venue] will give title everything of venue's information starting with address, formatted address etc...
    var locationlat = response[venue].lat;
    var locationlng = response[venue].lng;
    var obj = {title: title, location: {lat: locationlat, lng: locationlng}} //creates an object representing each object in Response
    locations.push(obj); //pushes to locations array
  });

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    test.push({
      position: locations[i].location,
      name: locations[i].title
    });
  }
  calculateAndDisplayRoute(directionsService, directionsDisplay);
}


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var waypts = [];
  for (var i = 1; i < test.length - 1; i++) {
      waypts.push({
        location: test[i].position,
        stopover: true
    });
  }

  var origin = test[0].position;
  var destination = test[test.length - 1].position;

  directionsService.route({
    origin: origin,
    destination: destination,
    waypoints: waypts,
    optimizeWaypoints: true,  //solves traveling salesman problem
    travelMode: 'WALKING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}