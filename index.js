var setup = require("./populate_redis");

var newDocument = {
  show_id: "123456789",
  type: "Movie",
  title: "Nightcrawler",
  director: "Mathias",
  cast: "Jake J and some other actors",
  country: "United States",
  date_added: "October 9, 2018",
  release_year: "2018",
  rating: "TV-PG",
  duration: "110 min",
  listed_in: "Action",
  description: "About a blue dude from xmen being super cool",
  _id: "fdsajbgkjdalghajksdbndslkjf12313t64",
};

setup(function (mongoClient, redisClient, documents) {
  var document = documents[0];
  var start = new Date();
  console.log("Lookup on data meassure");
  console.log("-----------------------");
  console.log("Find one document");
  console.log("---------------------------------------");
  var findDataRedis = new Promise(function (resolve) {
    redisClient.hgetall(document._id, function (err, result) {
      var end = new Date() - start;
      console.log("Redis takes: " + end + " milliseconds to find the data");
      resolve();
    });
  });

  var findDataMongoDB = new Promise(function (resolve) {
    mongoClient
      .db("movies")
      .collection("documents")
      .findOne({ _id: document._id }, function (err, result) {
        var end = new Date() - start;
        console.log("MongoDB takes: " + end + " milliseconds to find the data");
        resolve();
      });
  });

  Promise.all([findDataRedis, findDataMongoDB]).then(function () {
    var start = new Date();
    console.log("---------------------------------------");
    console.log("Insert one document");
    console.log("---------------------------------------");
    var putOneDocumentIntoRedis = new Promise(function (resolve) {
      redisClient.hmset(newDocument._id, newDocument, function (err, result) {
        var end = new Date() - start;
        console.log(
          "It took redis: " + end + " milliseconds to put data into the store"
        );
        resolve();
      });
    });
    var putOneDocumentIntoMongoDB = new Promise(function (resolve) {
      mongoClient
        .db("movies")
        .collection("documents")
        .insertOne(document, function (err, result) {
          var end = new Date() - start;
          console.log(
            "It took MongoDB: " +
              end +
              " milliseconds to put data into the database"
          );
          resolve();
        });
    });
    Promise.all([putOneDocumentIntoRedis, putOneDocumentIntoMongoDB]).then(
      function () {
        newDocument.release_year = "4. September 2008";
        console.log("---------------------------------------");
        console.log("Update one document");
        console.log("---------------------------------------");
        var updateOneDocumentFromRedis = new Promise(function (resolve) {
          redisClient.hmset(newDocument._id, newDocument, function (
            err,
            result
          ) {
            var end = new Date() - start;
            console.log(
              "It took redis: " +
                end +
                " milliseconds to update data into the store"
            );
            resolve();
          });
        });
        var updateOneDocumentFromMongoDB = new Promise(function (resolve) {
          mongoClient
            .db("movies")
            .collection("documents")
            .updateOne(
              { _id: newDocument._id },
              { $set: { release_year: "4. September 2008" } },
              function (err, result) {
                var end = new Date() - start;
                console.log(
                  "It took MongoDB: " +
                    end +
                    " milliseconds to update data into the database"
                );
                resolve();
              }
            );
        });

        Promise.all([
          updateOneDocumentFromRedis,
          updateOneDocumentFromMongoDB,
        ]).then(function () {
          console.log("---------------------------------------");
          console.log("Delete one document");
          console.log("---------------------------------------");
          var deleteOneDocumentFromRedis = new Promise(function (resolve) {
            redisClient.del(newDocument._id, function (err) {
              var end = new Date() - start;
              console.log(
                "It took redis: " +
                  end +
                  " milliseconds to delete data from the store"
              );
              resolve();
            });
          });
          var deleteOneDocumentFromMongoDB = new Promise(function (resolve) {
            mongoClient
              .db("movies")
              .collection("documents")
              .deleteOne({ _id: newDocument._id }, function (err, result) {
                var end = new Date() - start;
                console.log(
                  "It took MongoDB: " +
                    end +
                    " milliseconds to delete data from the database"
                );
                resolve();
              });
          });
          Promise.all([
            deleteOneDocumentFromRedis,
            deleteOneDocumentFromMongoDB,
          ]).then(function () {
            // Close connections
            mongoClient.close();
            redisClient.quit();
          });
        });
      }
    );
  });
});
