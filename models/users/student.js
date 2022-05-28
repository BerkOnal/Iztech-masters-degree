const mongoose = require('mongoose');
const User = mongoose.model("User");

const studentSchema = new mongoose.Schema({
    studentID: {
        type: Number,
    },
    advisorEmail: {
        type: String,
    },
})
module.exports = User.discriminator("Student", studentSchema);