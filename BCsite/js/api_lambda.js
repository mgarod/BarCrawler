function testgeneratecrawl() {
  var apigClient = apigClientFactory.newClient()

  var params = {
  // This is where any modeled request parameters should be added. 
  // The key is the parameter name, as it is defined in the API in API Gateway.
    'topic': 'nightlife',
    'location': 'east village',
    'stops': 5
  };

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
      console.log(result.data)
      alert("generatecrawl success");
      response = result.data
    }).catch(function(result){
      // Add error callback code here.
      // console.log(result)
      alert("error");
  });
};
