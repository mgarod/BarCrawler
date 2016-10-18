function testgeneratecrawl(params) {
  var apigClient = apigClientFactory.newClient({
    apiKey: 'cRokobNRQi7UpOpIB1Ns978IXIEfHN1J2Gz8V1Vd'
  });
  console.log(params)
// -- THIS PORTION IS HANDLED IN THE INDEX.HTML FILE ---
 // var params = {
  // This is where any modeled request parameters should be added. 
  // The key is the parameter name, as it is defined in the API in API Gateway.
 //   'topic': 'nightlife',
 //   'location': 'east village',
 //   'stops': 5
 // };

  var body = {
    // This is where you define the body of the request
  };
  
  var additionalParams = {
    // If there are any unmodeled query parameters or headers that must be 
    //   sent with the request, add them here.
    headers: {
    },
    queryParams: {
    }
  };

  apigClient.generatecrawlGet(params, body, additionalParams)
    .then(function(result){
      // Add success callback code here.
      response = result.data;
      initMap2();
    }).catch(function(result){
      // Add error callback code here.
      console.log("Error in the generatecrawl API call");
  });
};