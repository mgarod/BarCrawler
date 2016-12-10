var express = require('express');
var router = express.Router();
var apigClientFactory = require('aws-api-gateway-client');
var mongoose = require('mongoose');
var Crawl = require('../models/Crawl');
var credentials = require('../credentials.js');

var apigClient = apigClientFactory.newClient({
  invokeUrl: 'https://l6l6cm3bfi.execute-api.us-east-1.amazonaws.com/prod',
  apiKey: process.env.apigkey || credentials.apigkey
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
  
  var pathTemplate = '/generatecrawl';
  var method = 'GET';

  apigClient.invokeApi(params, pathTemplate, method)
    .then(function(result) { // on success
      response = result.data;
      var crawlUrl = "<a href=\"http://"+req.headers.host+"/"+response.unique_id+"\">Share your crawl with this link!</a>";
      res.render('index', {
        response : JSON.stringify(response),
        topic: req.body.top,
        location: req.body.loc,
        stops: req.body.sto,
        unique_id: "Your Crawl code: "+response.unique_id,
        crawlUrl: crawlUrl
      });
    }).catch(function(err) { // on failure
      console.log("generateCrawl caught an exception:", err);
  });
});


router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  if (id === null) {
    next();
  } else {
    Crawl.findOne({'id': id}, function(err, crawl){
      if (err) {
        console.log("ERROR:", err);
        return;
      } else if (crawl) {
        var crawlUrl = "<a href=\"http://"+req.headers.host+"/"+req.url+"\">Share your crawl with this link!</a>";
        res.render('index', {
          response: JSON.stringify(crawl),
          topic: String(crawl.topic),
          location: String(crawl.location),
          stops: parseInt(crawl.stops),
          unique_id: "Your Crawl code: "+response.unique_id,
          crawlUrl: crawlUrl
        });
      } else {
        res.render('index', {
          unique_id: "ERROR"
        });
      }
    })
  }
});

module.exports = router;
