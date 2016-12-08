var express = require('express');
var router = express.Router();
var apigClientFactory = require('aws-api-gateway-client');
var mongoose = require('mongoose');
var Crawl = require('../models/Crawl');

var apigClient = apigClientFactory.newClient({
  invokeUrl: 'https://l6l6cm3bfi.execute-api.us-east-1.amazonaws.com/prod',
  apiKey: 'cRokobNRQi7UpOpIB1Ns978IXIEfHN1J2Gz8V1Vd'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/submit', function(req, res, next) {
  var params = {
   'topic': req.body.top,
   'location': req.body.loc,
   'stops': req.body.sto
  };
  // console.log("params: ", params);
  
  var pathTemplate = '/generatecrawl';
  var method = 'GET';

  apigClient.invokeApi(params, pathTemplate, method)
    .then(function(result) { // success
      response = result.data;
      // console.log("generateCrawl response:", response);
      res.render('index', {
        response : JSON.stringify(response),
        topic: req.body.top,
        location: req.body.loc,
        stops: req.body.sto,
        unique_id : response.unique_id
      });
    }).catch(function(err) { // failure
      console.log("generateCrawl caught an exception:", err);
  });
});


router.get('/:id', function(req, res, next) {
  var id = req.params.id;

  Crawl.findOne({'id': id}, function(err, crawl){
    if (err) {
      console.log("ERROR:", err);
      return;
    } else {
      // console.log("CRAWL:", crawl);
      // console.log("CRAWL.TOPIC", crawl.topic);
      // console.log("CRAWL.LOCATION", crawl.location);
      // console.log("CRAWL.STOPS", crawl.stops);
      // console.log("CRAWL.id", crawl.id);

      res.render('index', {
        response: JSON.stringify(crawl),
        topic: String(crawl.topic),
        location: String(crawl.location),
        stops: parseInt(crawl.stops),
        unique_id: crawl.id
      });
    }
  })
});

module.exports = router;
