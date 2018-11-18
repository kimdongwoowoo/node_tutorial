var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');
// Connection url
var url = 'mongodb://localhost:27017';
// Database Name
var dbName = 'local';
var db;
// Connect using MongoClient
MongoClient.connect(url, function (err, client) {
  // Use the admin database for the operation
  if(err)
  throw err;
  db = client.db(dbName);
  // List all the available databases
  console.log('디비연결됨');
  //console.dir(adminDb);
  
});
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});

var authUser = function (database, id, password, callback) {
  console.log('authUser 호출됨');
  console.dir(database);
  var users = database.collection('users');
  users.find({ "id": id, "password": password }).toArray(function (err, docs) {
    if (err) {
      callback(err, null);
      return;
    }
    if (docs.length > 0) {
      console.log('찾음');
      callback(null, docs);

    }
    else {
      console.log('못찾음');
      callback(null, null);

    }
  });
}

router.post('/process/login', function (req, res) {
  var id = req.body.id;
  var password = req.body.password;
  if (db) {
    authUser(db, id, password, function (err, docs) {
      if (err) throw err;
      if (docs) {
        console.dir(docs);
        var username = docs[0].name;
        res.render('success', { id: id, password: password });
      }
    })
  }
});

module.exports = router;
