var test = [];

function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 41.85, lng: -87.65},
  });

  directionsDisplay.setMap(map);
  /*
    read in from HTML file produced from Python file
  */
  var locations = [
    {title: 'A', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'B', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'C', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'D', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'E', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'F', location: {lat: 40.7180628, lng: -73.9961237}}
  ];

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