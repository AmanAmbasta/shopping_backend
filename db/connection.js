var Datastore = require('nedb')
  , db = new Datastore({ filename:'db/user_record.db' });
module.exports = db;

