var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:hash', function(req, res, next) {
  var hash = req.params.hash;
  res.render('code',  {hash: hash});
});

module.exports = router;
