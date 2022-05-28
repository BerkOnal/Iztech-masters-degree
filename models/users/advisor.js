const mongoose = require('mongoose');
const User = mongoose.model("User");

const advisorSchema = new mongoose.Schema({
    
})
module.exports = User.discriminator("Advisor", advisorSchema);