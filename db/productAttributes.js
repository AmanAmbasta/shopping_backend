var Datastore = require('nedb')
  , prdb = new Datastore({ filename:'db/product_record.db' });
module.exports = prdb;

