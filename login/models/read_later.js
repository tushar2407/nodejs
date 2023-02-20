const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email : {type:String, required:true},
    book: {type:String, required:true}
});

module.exports = mongoose.model('ReadLater', userSchema);