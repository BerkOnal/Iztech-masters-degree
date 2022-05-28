const mongoose = require('mongoose');
const User = mongoose.model("User");

const jurySchema = new mongoose.Schema({
    password :{
        type: String,
    }
})
module.exports = User.discriminator("Jury", jurySchema);