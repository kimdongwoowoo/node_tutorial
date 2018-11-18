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
  
});
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});
router.get('/addUser',function(req,res){
  res.render('addUser');
});
var addUser = function (database, id, password,name, callback) {
  console.log('addUser 호출됨'+id+' '+password+' '+name);
  var users = database.collection('users');
  users.insertMany([{ "id": id, "password": password,"name":name }],function (err, result) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log('추가된개체수:'+result.insertedCnt)
    if (result) {
      console.log('사용자 레코드 추가됨');
    }
    else {
      console.log('추가실패');
    }

    callback(null,result);
  });
}
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
router.post('/process/addUser',function(req,res){
  var id=req.body.id;
  var password=req.body.password;
  var name=req.body.name;
  if(db){
    addUser(db,id,password,name,function(err,result){
      if(err)throw err;
      if(result){
        console.dir(result);
        console.log('회원가입 성공');
        res.render('login');
      }
      else{
        console.log('회원가입 실패');
        res.render('login');
      }
    });
  }
  else{
    res.write('<h1>databaseConnectionError</h1>');
  }
  
});
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
      else{
        res.write('<h1>please check your id & password</h1>');
      }
    })
  }
  else{
    res.write('<h1>databaseConnectionError</h1>');
  }
});

module.exports = router;
