const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    userId: {type:Date, required:true},
    email : {type:String, required:true},
    name : {type:String, required:true},
    role : {type:String}
    // password : {type: String, required: true},
});
userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', userSchema);