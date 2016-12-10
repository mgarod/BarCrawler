var mongoose = require('mongoose');

// Review Schema
var crawlsSchema = mongoose.Schema({
  id: String,
  topic: String,
  stops: String,
  location: String
}, { strict: false });

var Crawl = mongoose.model('crawls', crawlsSchema);
module.exports = Crawl;
