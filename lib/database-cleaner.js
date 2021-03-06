module.exports = DatabaseCleaner = function(type) {
  var type = type;
  var cleaner = {};

  cleaner['mongodb'] = function(db, callback) {
    db.collections( function (skip, collections) {
      var count = collections.length;
      collections.forEach(function (collection) {
        if (collection.collectionName != 'system.indexes') {
          collection.remove({}, function () {
            count--;
            if (count <= 0 && callback) {
              callback.apply();
            }
          });
        } else {
          count--;
          if (count <= 0 && callback) {
            callback.apply();
          }
        }
      });
    });
  };
  
  cleaner['redis'] = function(db, callback) {
    db.flushdb(function(err, results) {
      callback.apply();
    });
  };

  cleaner['couchdb'] = function(db, callback) {
    db.destroy(function (err, res) {
      db.create(function (err, res) {
        callback.apply();
      });
    });
  };

  this.clean = function (db, callback) {
    cleaner[type](db, callback);
  };
};
