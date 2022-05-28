const mongoose = require('mongoose');
const Form = mongoose.model("Form");

const formPPFSchema = new mongoose.Schema({

    minimumNumberofCourses: {
        type: String,
    },
    minimumNumberofLocalCredits: {
        type: String,
    },
    minimumNumberofECTSCredits: {
        type: String,
    },
    selectSemester: {
        type: String,
    },
    courseCodes: [{
        type: String,
    }],
    courseIsSelectives: [{
        type: String,
    }],
    courseCredits: [{
        type: String,
    }],
    courseECTSs: [{
        type: String,
    }],

});
module.exports = Form.discriminator("FormPPF", formPPFSchema);
