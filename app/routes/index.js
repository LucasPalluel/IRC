var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


/* GET home page. */
router.get(['/', '/index'], function(req, res, next) {

  res.render('index', { title: 'Express'});
});

module.exports = router;
