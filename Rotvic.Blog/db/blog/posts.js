var mongojs = require('mongojs');
var db = mongojs('rblog', ['posts','counters']);
var utility = require('./../utility.js');

function getNextSequence(name,callback) {
    db.counters.findAndModify(
        {
            query: { _id: name },
            update : { $inc : { seq: 1 } },
            upsert: true,
            new: true
        },
        function (err, ret) {
            if (!err)
                callback(ret.seq);
            else
                callback(null);
        }
    );    
}

exports.GetPost = function (id, callback) {
    //note : use findOne() function and update dependent functions
    db.posts.find({ 'id': id }, function (err, doc) {
        if (!err) {
            callback(doc);
        }
        else {
            callback(null);
        }
    });
}

exports.InsertPost = function (doc, callback) {
    getNextSequence('id', function (seq){
        if (seq == null) {
            throw "Null Sequence ID";
        }
        doc.id = seq;
        db.posts.insert(doc, function (err) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    });    
}

exports.GetAllPosts = function (limit, callback) {
    db.posts.find({}).limit(limit).sort({ date: -1 }, function (err, doc) {
        if (!err) {
            callback(doc);
        }
        else {
            callback(null);
        }
    });
}

exports.UpdatePost = function (doc, callback) {
    exports.GetPost(doc.id, function (old) {
        if (old != null) {
            doc.date = old[0].date;
            doc.modified = new Date();
            db.posts.update({ 'id': doc.id }, doc, function (err) {
                if (!err) {
                    callback(doc);
                }
                else {
                    callback(null);
                }
            });
        }
    });    
}

exports.CheckUserOfPost = function (userId, postId, callback) {
    exports.GetPost(postId, function (doc) {
        if (userId.id === doc[0].userId.id) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
}

