var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Content = new Schema({
    type: String,
    aboutMe: String,
    profileImageUrl: String,
    headerMessage: String,
    linkedInUrl: String,
    twitterHandle: String,
    githubUsername: String,
    facebookUrl: String
});

module.exports = mongoose.model('content', Content);