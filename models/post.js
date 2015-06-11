var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    userId: Schema.Types.ObjectId,
    id: Number,
    subject: String,
    body: String,
    date: Date,
    modified: Date,
    name: String,
    publishType: String,
    metaDescription: String
});

module.exports = mongoose.model('post', Post);