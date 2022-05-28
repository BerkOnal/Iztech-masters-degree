const mongoose = require('mongoose');
const User = require('./user');

const formSchema = mongoose.Schema({
    formName: {
        type: String,
    },
    studentNameSurname: {
        type: String,
    },
    studentID: {
        type: Number,
    },
    studentEmail: {
        type: String,
    },
    advisorNameSurname: {
        type: String,
    },
    courseUniversity: {
        type: String,
    },
    programName: {
        type:String
    },
    courseCode: {
        type: String,
    },
    courseInstitute: {
        type: String,
    },
    courseName: {
        type: String,
    },
    courseCredit: {
        type: Number,
    },
    courseECTS: {
        type: Number,
    },
    isCounted: {
        type: Boolean,
    },
    formStatus: {
        type: String,
    },
    studentUserID: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    advisorUserID: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    eabdbUserID: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Form', formSchema);