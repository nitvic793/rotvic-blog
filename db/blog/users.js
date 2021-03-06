﻿var mongojs = require('mongojs');
var db = mongojs('rblog', ['posts', 'counters','users']);
var Account = require('../../models/account.js');

exports.getUserName = function (id, callback) {
    db.users.find({ 'id': id }, function (err, doc) {
        if (!err) {
            callback(doc[0].name);
        }
        else {
            callback(null);
        }
    });
}