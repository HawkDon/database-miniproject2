var mongo = require("mongodb");
var mongoClient = mongo.MongoClient(
  "mongodb://admin:password@localhost:27017",
  { useUnifiedTopology: true }
);
var csvData = require("./csv_converter");

// show_id,type,title,director,cast,country,date_added,release_year,rating,duration,listed_in,description
function populateMongoDB(cb) {
  mongoClient.connect(function (err) {
    if (err) throw err;
    var db = mongoClient.db("movies");
    var collection = db.collection("documents");

    // show_id,type,title,director,cast,country,date_added,release_year,rating,duration,listed_in,description
    csvData.then(function (results) {
      collection.insertMany(results, function (err, resultDocuments) {
        cb(mongoClient, resultDocuments);
      });
    });
  });
}

module.exports = populateMongoDB;
