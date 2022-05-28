const mongoose = require('mongoose');
const User = mongoose.model("User");

const eabdbSchema = new mongoose.Schema({

})
module.exports = User.discriminator("Eabdb", eabdbSchema);