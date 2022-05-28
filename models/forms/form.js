const mongoose = require('mongoose');
const User = require('../users/user');

const baseOptions = {
    discriminatorKey: 'form_type', // our discriminator key, could be anything
    collection: 'forms', // the name of our collection
  };

const formSchema = new mongoose.Schema({

    formName: {
        type: String,
    },
    student_id: {
        type: mongoose.Types.ObjectId,
        ref : "User"
    },
    advisor_id: {
        type: mongoose.Types.ObjectId,
        ref : "User"
    },
    eabdb_id: {
        type: mongoose.Types.ObjectId,
        ref : "User"
    },
    formStatus :{
        type: String,
    }

} ,{ collection : 'form', discriminatorKey : '_type' } );

module.exports = mongoose.model("Form",formSchema);

