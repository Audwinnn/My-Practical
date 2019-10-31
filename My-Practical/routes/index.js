var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventory',
  debug: false
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testconnect', function(req, res, next) {
  if (db != null) {
    res.send('Connection Success');
  } else {
    res.send('connection failed');
  }
});

router.get('/select', function(req, res, next) {
  db.query('SELECT * FROM items', function (err, rs) {
    res.render('select', { inventory: rs });
  });
});

router.get('/insert', function(req, res, next) {
  res.render('insert', { inventory: {} });
});

router.post('/insert', function (req, res, next) {
  db.query('INSERT INTO items SET ?', req.body, function (err, rs) {
    res.send('Insert Sucess');
  })
})

router.get('/delete', function (req, res, next) {
  db.query('DELETE FROM items WHERE id = ?', req.query.id, function(err, rs) {
    res.redirect('/select');
  })
});

router.get('/edit', function (req, res, next) {
  db.query('SELECT * FROM items WHERE id = ?', req.query.id, function(err, rs) {
    res.render('insert', { inventory: rs[0] });
  })
});

router.post('/edit', function (req, res, next) {
  var param = [
    req.body,         //data update
    req.query.id      //condition update
  ]
  db.query('UPDATE items SET ? WHERE id = ?', param, function(err, rs) {
    res.redirect("/select");
  })
})

module.exports = router;
