var express = require('express');
var router = express.Router();
var db = require('../db/db.js');

//// To do

router.get('/', function (req, res) {
    res.render('admin');
});

module.exports = router;