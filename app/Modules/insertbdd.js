var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports = {

  DataBaseInsertMsg: function (nickname, message, channel) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");
        var myobj = { message: message, nickname: nickname, channel: channel };

        dbo.collection("Messages").insertOne(myobj, function (error, res) {
          if (error)
            return reject(error)
          db.close();
          return resolve()
        });
      });
    })
  },
  DataBaseInsertUsers: function (nickname, channel) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");
        var myobj = { nickname: nickname, channel: channel };

        dbo.collection("Channels").insertOne(myobj, function (error, res) {
          if (error)
            return reject(error)
          db.close();
          return resolve()
        });
      });
    })
  },
  DataBaseRemoveUsers: function (name) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");

        dbo.collection("Channels").deleteOne({ nickname: name }, function (error, res) {
          if (error)
            return reject(error)
          db.close();
          return resolve()
        });
      });
    })
  },
  DataBaseFindUsers: function (channel) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");
        dbo.collection("Channels").find({ channel: channel }, { projection: { 'nickname': 1, '_id': 0 } }).toArray().then(res => {
          db.close();
          return resolve(res)
        });
      });
    })
  },
  DataBaseFindMessages: function (channel) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");

        dbo.collection("Messages").find({ channel: channel }).toArray(function (error, res) {
          if (error)
            return reject(error)
          db.close();
          return resolve(res)
        });
      });
    })
  },
  DataBaseRemoveOldUsers: function () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");
        dbo.collection("Channels").drop().then(() => resolve()).catch(error => reject(error))
      });
    })
  },
  DataBaseInsertChannels: function (channel) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");
        var myobj = { channel: channel };

        dbo.collection("SavedChannels").insertOne(myobj, function (error, res) {
          if (error)
            return reject(error)
          db.close();
          return resolve()
        });
      });
    })
  },
  DataBaseFindChannels: function () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");

        dbo.collection("SavedChannels").find().toArray(function (error, res) {
          if (error)
            return reject(error)
          db.close();
          return resolve(res)
        });
      });
    }).catch(error => console.error(error))
  },
  DataBaseRemoveChannels: function (name) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err)
          return reject(err)
        var dbo = db.db("Projet");

        dbo.collection("SavedChannels").deleteOne({ channel: name }, function (error, res) {
          if (error)
            return reject(error)
          db.close();
          return resolve()
        });
      });
    })
  }
}
