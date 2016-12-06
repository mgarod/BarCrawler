var mongoose = require('mongoose');

// Review Schema
var crawlsSchema = mongoose.Schema({
  id: String
}, { strict: false });

var Crawl = mongoose.model('crawls', crawlsSchema);
module.exports = Crawl;
