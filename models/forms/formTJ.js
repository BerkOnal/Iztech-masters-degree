const Form = require('./form');
const User = require('../users/user')
const mongoose = require('mongoose');

const formTJSchema = new mongoose.Schema({
    programName: {
        type: String,
    },
    isOnline: { 
        type: Boolean,
    },
    place: {
        type: String,
    },
    date: {
        type: String,
    },
    time: { 
        type: String,
    },
    officialMembers: [{ 
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    backupMembers: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    outsideMembers: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
});
module.exports = Form.discriminator("FormTJ", formTJSchema);