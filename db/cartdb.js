var Datastore = require('nedb')
  , db = new Datastore({ filename:'db/cart.db' });
module.exports = db;

