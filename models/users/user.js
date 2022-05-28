
const mongoose = require('mongoose');
const baseOptions = {
    discriminatorKey: '_type', // our discriminator key, could be anything
    collection: 'users', // the name of our collection
  };

const userSchema = new mongoose.Schema({
    nameSurname: {
        type: String,
    },
    email: {
        type: String,
    },
    department: {
        type: String,
    },
    institution: {
        type: String,
    },
    userType: {
        type: String, 
    }

} ,baseOptions)

module.exports = mongoose.model("User", userSchema);