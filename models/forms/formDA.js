const mongoose = require('mongoose');
const Form = mongoose.model("Form");

const formDASchema = new mongoose.Schema({ 
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
});

module.exports = Form.discriminator("FormDA", formDASchema);
