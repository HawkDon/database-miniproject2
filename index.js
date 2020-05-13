var redis = require("redis");
var redisClient = redis.createClient();
var populateMongo = require("./populate_mongodb");

populateMongo(function (mongoClient, documents) {
  // [ 'result', 'ops', 'insertedCount', 'insertedIds' ]
  redisClient.on("error", function (error) {
    console.log(error);
  });
  var documents = documents.ops;

  var multis;
  documents.forEach((document) => {
    document._id = String(document._id);
    redisClient.hmset(document._id, document, function (err, res) {});
  });
});
