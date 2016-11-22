function initMap2() {
  var markers = [];
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true
    });

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 40.744194, lng: -73.994052},
  });

  directionsDisplay.setMap(map);

  var locations = []; //Empty Array which will later contain location objects consisting of a Title & Location (in latitude and longitude coordinates)
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  for (var name in response["venues"]) {
    if (response["venues"].hasOwnProperty(name)) {
    var title = name; //response[venue] will give title everything of venue's information starting with address, formatted address etc...
    var locationlat = response["venues"][name]["lat"];
    var locationlng = response["venues"][name]["lng"];
    var faddress = response["venues"][name]["formattedAddress"][0];
    var fphone = response["venues"][name]["formattedPhone"];
    var obj = {title: title, location: {lat: locationlat, lng: locationlng}, address: faddress, phone: fphone} //creates an object representing each object in Response
    locations.push(obj); //pushes to locations array
   }
  }

    for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    var address = locations[i].address;
    var phone = locations[i].phone;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      address: address,
      phone: phone,
      label: labels[labelIndex++ % labels.length],
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

    var input = ( document.getElementById('loc'));
    var Autocomplete = new google.maps.places.Autocomplete(input);
    Autocomplete.bindTo('bounds', map)
    var places = new google.maps.places.PlacesService(map);

    calculateAndDisplayRoute(directionsService, directionsDisplay, markers, map);
  }

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>' + '</div>' + marker.address + '</div>' + '<div>' + marker.phone + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker(null);
    });
  }
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, markers, map) {
  var waypts = [];
  for (var i = 1; i < markers.length - 1; i++) {
      waypts.push({
        location: markers[i].position,
        stopover: true
    });
  }
  var origin = markers[0].position;
  var destination = markers[markers.length - 1].position;

  console.log("origin: ", origin);
  console.log("destination: ", destination);

  directionsService.route({
    origin: origin,
    destination: destination,
    waypoints: waypts,
    optimizeWaypoints: true,  //solves traveling salesman problem
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}