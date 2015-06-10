var express = require('express');
var router = express.Router();
var db = require('../db/db.js');
var auth = require('../auth.js');

/* GET users listing. */
router.get('/', auth.requireAuth, function (req, res) {
    res.render('user');
});


module.exports = router;