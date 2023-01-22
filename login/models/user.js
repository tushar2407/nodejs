const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    // userId: {type:Date, required:true},
    email : {type:String, required:true},
    name : {type:String, required:true},
    // password : {type: String, required: true},
    referralCode: {type: String, required: false},
    referred: {type: Array, required: false}
});
userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', userSchema);