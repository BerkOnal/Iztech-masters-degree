const mongoose = require('mongoose');
const Form = require('./form');
const Jury = require('../users/jury');

const formTSbSchema = new mongoose.Schema({
    examDate:{
        type: String,
    },
    examResult: {
        type: String
    },
    programName: {
        type: String,
    },
    jury_id:{
        type: mongoose.Types.ObjectId,
        ref: "Jury",
    }
});
module.exports = Form.discriminator("FormTSb", formTSbSchema);