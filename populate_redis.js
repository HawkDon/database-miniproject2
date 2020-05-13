var redis = require("redis");
var redisClient = redis.createClient();
var populateMongo = require("./populate_mongodb");

function populateRedis(code) {
  populateMongo(function (mongoClient, documents) {
    redisClient.on("error", function (error) {
      console.log(error);
    });
    var documents = documents.ops;

    var multis = documents.map(function (document) {
      document._id = String(document._id);
      return ["hmset", document._id, document];
    });

    redisClient.multi(multis).exec(function (err, replies) {
      if (err) {
        console.log(err);
      } else {
        code(mongoClient, redisClient, documents);
      }
    });
  });
}

module.exports = populateRedis;
