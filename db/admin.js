var Content = require('../models/content.js');

module.exports.UpdateContent = function (doc, callback) {
    doc.type = "content";
    Content.findOneAndUpdate({},doc, { upsert: true }, function (err, doc) {
        if (!err) {
            callback(doc);
        }
        else {
            throw err;
        }
    });
}

module.exports.LoadContent = function (callback) {
    Content.findOne({}, function (err, doc) {
        if (!err) {
            callback(doc);
        }
        else {
            throw err;
        }
    });
}