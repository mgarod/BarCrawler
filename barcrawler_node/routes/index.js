var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:hash', function(req, res, next) {
  var hash = req.params.hash;
  res.render('index', {hash: hash});
});

module.exports = router;
