var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readFile('database/todo.json', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
    if (data == ('' || null)) {
      res.render('index', { todo: data });
    } else {
      res.render('index', { todo: JSON.parse(data) });
    }
  });
});
module.exports = router;

router.post('/task-register', function (req, res) {
  var task = [];
  var date = req.body.date;
  var newTask = req.body.task;
  var genId = new Date().getTime();
  var obj = { "id": genId, "date": date, "task": newTask, "done": false };
  fs.readFile('database/todo.json', 'utf8', function (err, data) {
    if (err) throw err;
    if (data != '') {
      task = JSON.parse(data);
    }
    task.push(obj);
    fs.writeFile('database/todo.json', JSON.stringify(task), function (err) {
      if (err) throw err;
      console.log('saved!!');
      res.redirect('/');
    });
  });
});

router.post('/task-done', function (req, res) {
  var checked = req.body.checked;
  
  if (checked == null)
    res.redirect('/');
  fs.readFile('database/todo.json', 'utf8', function (err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    if (isArray(checked)) {
      checked.forEach(function (doneTask) {
        for (var i = 0; i < obj.length; i++) {
          if (obj[i].id == doneTask) {
            obj[i].done = true;
          }
        }
      });
      fs.writeFile('database/todo.json', JSON.stringify(obj), function (err) {
        if (err) throw err;
        console.log('done save!!');
      });
    } else {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].id == checked) {
          obj[i].done = true;
          console.log(obj[i]);
        }
      }
      fs.writeFile('database/todo.json', JSON.stringify(obj), function (err) {
        if (err) throw err;
        console.log('done save!!');
      });
    }
  });
  res.redirect('/');
});
function isArray(val) {
  return val.constructor.toString().indexOf("Array") > -1;
}