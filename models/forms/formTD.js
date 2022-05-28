const mongoose = require('mongoose');
const Form = mongoose.model("Form");

const formTDSchema = new mongoose.Schema({

    programName:{
        type: String
    },

    thesisName: {
        type:String
    },
});
module.exports = Form.discriminator("FormTD", formTDSchema);