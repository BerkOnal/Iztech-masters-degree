const User = require('../models/users/user');
const Student = require('../models/users/student');
const Advisor = require('../models/users/advisor');
const Eabdb = require('../models/users/eabdb');
const Form = require('../models/forms/form');
const FormDA = require('../models/forms/formDA');
const FormTD = require('../models/forms/formTD');
const FormPPF = require('../models/forms/formPPF');
const FormTSb = require('../models/forms/formTSb');
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');




exports.getFormTSB = async (req, res, next) => {

    var tsbForms = await Form.find({ jury_id: mongoose.Types.ObjectId(req.user._id) }).exec().then();

    var count = tsbForms.length;
    var action;
    if (count < 1) {
        action = "create";
    }

    res.render('../views/forms/FormTSB', {
        user: req.user,
        action: "create",
    })
}

exports.createFormTSB = async (req, res, next) => {

    const formName = "FormTSB";
    const studentID = req.body.studentID;
    const programName = req.body.programName;
    const requestNumber = req.body.requestNumber;
    const examDate = req.body.examDate;
    const result = req.body.result;
    var examResult;

    switch (result) {
        case "1":
            examResult = "Accepted";
            break;
        case "2":
            examResult = "Rejected"
            break;
        case "3":
            examResult = "Correction"
            break;
        default:
        // code block
    }

    var student = await Student.findOne({ 'studentID': studentID }).exec().then();
    if(student){
        var student_id = student._id;
    }
    else {
      req.flash('error', "FormTSB could not saved! Student could not found.")
      res.redirect("/dashboard");
    }


    var eabdb_id;
    eabdb_id = await Eabdb.findOne({ 'department': student.department }, { "userType": "eabdb" }, function (err, eabdb) {
        return eabdb._id;
    });

    var advisor_id;
    advisor_id = await Advisor.findOne({ 'email': student.advisorEmail }, function (err, advisor) {
        if (!advisor) {
            return eabdb_id;
        } else {
            return advisor._id;
        }
    });

    const form = new FormTSb({
        formName: formName,
        student_id: student_id,
        advisor_id: advisor_id,
        eabdb_id: eabdb_id,
        formStatus: "Send to Advisor",
        jury_id: req.user._id,
        examDate : examDate,
        examResult: examResult,
        programName: programName,
        requestNumber: requestNumber
    });

    const msg = {
        to: "iztechmasterstest@yandex.com",
        from: 'iztechmasterstest@yandex.com',
        subject: 'A new form saved.',
        html: 'Dear User , <br> <h1>A new form approved. Please visit requests in https://iztech-masters-degree.herokuapp.com </h1>',
      };

      sgMail.send(msg);

    form.save();

    req.flash('success', "FormTSB succesfully saved! You can check your requests to follow the form status.")
    res.redirect("/dashboard");
}
