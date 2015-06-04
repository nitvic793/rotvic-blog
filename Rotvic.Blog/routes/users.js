var express = require('express');
var router = express.Router();
var db = require('../db/db.js');

/* GET users listing. */
router.get('/:id', function (req, res) {
    db.GetPost(1, function (doc) {
        res.send(doc);
    });
});

/* GET users listing. */
router.get('/', function (req, res) {
    console.log(req.id);
    res.send('respond with a resource');
});

module.exports = router;