const User = require('../models/users/user');
const Student = require('../models/users/student');
const Advisor = require('../models/users/advisor');
const Eabdb = require('../models/users/eabdb');
const Form = require('../models/forms/form');
const FormDA = require('../models/forms/formDA');
const FormTD = require('../models/forms/formTD');
const FormPPF = require('../models/forms/formPPF');
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
const advisor = require('../models/users/advisor');
sgMail.setApiKey('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');

 
exports.getFormDA = async (req, res, next) => {

    var daForms = await FormDA.find({ student_id: mongoose.Types.ObjectId(req.user._id) }).exec().then();
    var advisor = await User.findOne({ email : req.user.advisorEmail }).exec().then();

    if(!advisor){
        await req.flash('error', 'You must have an approved advisor to fill out the form. If not, save Form TD or wait for Form TD to be approved by EABDB.')
        await res.redirect('/dashboard');
        return ;
    }

    var count = daForms.length;

    var action;
    if (count < 2) {
        action = "create";
    }
 
    res.render('../views/forms/FormDA', {
        student: req.user,
        user: req.user,
        action: action,
        advisor: advisor,
    })
}

exports.createFormDA = async (req, res, next) => {


    const formName = "FormDA";
    const studentID = req.body.studentID;
    const programName = req.body.programName;
    const courseUniversity = req.body.courseUniversity;
    const courseInstitute = req.body.courseInstitute;
    const courseCode = req.body.courseCode;
    const courseName = req.body.courseName;
    const courseCredits = req.body.courseCredits;
    const courseECTS = req.body.courseECTS;
    const requestNumber = req.body.requestNumber;

    var student_id;

    student_id = await Student.findOne({ 'studentID': studentID }, function (err, student) {
        return student._id;
    });

    var eabdb_id;
    eabdb_id = await Eabdb.findOne({ 'department': req.user.department }, { "userType": "Eabdb" }, function (err, eabdb) {
        return eabdb._id;
    });

    var advisor_id;
    advisor_id = await Advisor.findOne({ 'email': req.user.advisorEmail }, function (err, advisor) {
        if (!advisor) {
            return eabdb_id;
        } else {
            return advisor._id;
        }
    });

    const form = new FormDA({
        formName: formName,
        student_id: student_id,
        advisor_id: advisor_id,
        eabdb_id: eabdb_id,
        formStatus: "Send to Advisor",

        programName: programName,
        courseUniversity: courseUniversity,
        courseInstitute: courseInstitute,
        courseCode: courseCode,
        courseName: courseName,
        courseCredit: courseCredits,
        courseECTS: courseECTS,
        requestNumber: requestNumber
    });

    form.save();

    const msg = {
        to: "iztechmasterstest@yandex.com",
        from: 'iztechmasterstest@yandex.com',
        subject: 'A new form saved.',
        html: 'Dear User , <br> <h1>A new form DA created. Please visit requests in https://iztech-masters-degree.herokuapp.com </h1>',
      };
      
      sgMail.send(msg);

      req.flash('success', 'FormDA succesfully saved! You can check your requests to follow the form status.')
      res.redirect('/dashboard');
  

}

exports.updateFormDA = async (req, res, next) => {

    var form = await Form.findById(req.body.requestNumber).exec().then()
    form.formName = "FormDA";
    form.studentID = req.body.studentID;
    form.formStatus = "Send to Advisor";
    form.programName = req.body.programName;
    form.courseUniversity = req.body.courseUniversity;
    form.courseInstitute = req.body.courseInstitute;
    form.courseCode = req.body.courseCode;
    form.courseName = req.body.courseName;
    form.courseCredits = req.body.courseCredits;
    form.courseECTS = req.body.courseECTS;
    form.requestNumber= req.body.requestNumber;

    await form.save();



    const msg = {
        to: "iztechmasterstest@yandex.com",
        from: 'iztechmasterstest@yandex.com',
        subject: 'A new form saved.',
        html: 'Dear User , <br> <h1>A new form DA updated. Please visit requests in https://iztech-masters-degree.herokuapp.com </h1>',
      };
      
      sgMail.send(msg);

    req.flash('success', 'FormDA succesfully updated! You can check your requests to follow the form status.')
    res.redirect('/dashboard');


}



exports.getFormTD = async (req, res, next) => {

    var tdForms = await FormTD.find({ student_id: mongoose.Types.ObjectId(req.user._id) }).exec().then();
    var advisors = await Advisor.find({ department :req.user.department}).exec().then();

    var count = tdForms.length;

    var action;
    if (count < 1) {
        action = "create";
    }
 
    res.render('../views/forms/FormTD', {
        student: req.user,
        user: req.user,
        action: action,
        advisors : advisors,

    })
}

exports.createFormTD = async (req, res, next) => {

    const formName = "FormTD";
    const thesisName = req.body.thesisName;
    const studentID = req.body.studentID;
    const programName = req.body.programName;
    const requestNumber = req.body.requestNumber;
    const advisorID = req.body.advisorData;

    var student_id;

    student_id = await Student.findOne({ 'studentID': studentID }, function (err, student) {
        return student._id;
    });

    var eabdb_id;
    eabdb_id = await Eabdb.findOne({ 'department': req.user.department }, { "userType": "Eabdb" }, function (err, eabdb) {
        return eabdb._id;
    });

    var advisor_id;
    advisor_id = await Advisor.findById( advisorID , function (err, advisor) {
        if (!advisor) {
            return eabdb_id;
        } else {
            return advisor._id;
        }
    });
       
    const form = new FormTD({
        formName: formName,
        student_id: student_id,
        advisor_id: advisor_id,
        eabdb_id: eabdb_id,
        formStatus: "Send to Advisor",
        programName: programName,
        thesisName: thesisName,
        requestNumber: requestNumber
    });


    const msg = {
        to: "iztechmasterstest@yandex.com",
        from: 'iztechmasterstest@yandex.com',
        subject: 'A new form saved.',
        html: 'Dear User , <br> <h1>A new formTD saved. Please visit requests in https://iztech-masters-degree.herokuapp.com </h1>',
      };
      
      sgMail.send(msg);

    form.save();

    req.flash('success', 'FormTD succesfully saved! You can check your requests to follow the form status.')
    res.redirect('/dashboard');

}

exports.updateFormTD = async (req, res, next) => {

    var form = await Form.findById(req.body.requestNumber).exec().then()
    form.formName = "FormTD";
    form.formStatus = "Send to Advisor";
    form.programName = req.body.programName;
    form.thesisName = req.body.thesisName;
    form.requestNumber= req.body.requestNumber;

    await form.save();


    const msg = {
        to: "iztechmasterstest@yandex.com",
        from: 'iztechmasterstest@yandex.com',
        subject: 'A new form saved.',
        html: 'Dear User , <br> <h1>A new form td updated. Please visit requests in https://iztech-masters-degree.herokuapp.com </h1>',
      };
      
      sgMail.send(msg);

      req.flash('success', 'FormTD succesfully updated! You can check your requests to follow the form status.')
      res.redirect('/dashboard');
}

exports.getFormPPF = async (req, res, next) => {

    var ppfForms = await FormPPF.find({ student_id: mongoose.Types.ObjectId(req.user._id) }).exec().then();

    var count = ppfForms.length;
 
    var action;
    if (count < 2) {
        action = "create";
    } 

    var advisor = await User.findOne({ email: req.user.advisorEmail }).exec().then();
    
    if(!advisor){
        advisor =  await Eabdb.findOne({ department: req.user.department }).exec().then();
    }
 
    res.render('../views/forms/FormPPF', {
        student: req.user,
        user: req.user,
        action: action,
        advisor : advisor,
    })
}  

exports.createFormPPF = async (req, res, next) => {

    const formName = "FormPPF";
    const studentID = req.body.studentID;
    const programName = req.body.programName;
    const minimumNumberofCourses = req.body.minimumNumberofCourses;
    const minimumNumberofLocalCredits = req.body.minimumNumberofLocalCredits;
    const minimumNumberofECTSCredits = req.body.minimumNumberofECTSCredits;
    const selectSemester = req.body.selectSemester;
    const requestNumber = req.body.requestNumber;

    var courseCodes = [];
    var courseIsSelectives = [];
    var courseCredits = [];
    var courseECTSs = [];

    const code1 = req.body.code1;
    courseCodes.push(code1);
    const isSelective1 = req.body.courseisSelective1;
    courseIsSelectives.push(isSelective1);
    const credit1 = req.body.credit1;
    courseCredits.push(credit1);
    const ECTS1 = req.body.ECTS1;
    courseECTSs.push(ECTS1);
    
    const code2 = req.body.code2;
    courseCodes.push(code2);
    const isSelective2 = req.body.courseisSelective2;
    courseIsSelectives.push(isSelective2);
    const credit2 = req.body.credit2;
    courseCredits.push(credit2);
    const ECTS2 = req.body.ECTS2;
    courseECTSs.push(ECTS2);


    const code3 = req.body.code3;
    courseCodes.push(code3);
    const isSelective3 = req.body.courseisSelective3;
    courseIsSelectives.push(isSelective3);
    const credit3 = req.body.credit3;
    courseCredits.push(credit3);
    const ECTS3 = req.body.ECTS3;
    courseECTSs.push(ECTS3);


    const code4 = req.body.code4;
    courseCodes.push(code4);
    const isSelective4 = req.body.courseisSelective4;
    courseIsSelectives.push(isSelective4);
    const credit4 = req.body.credit4;
    courseCredits.push(credit4);
    const ECTS4 = req.body.ECTS4;
    courseECTSs.push(ECTS4);

    const code5 = req.body.code5;
    courseCodes.push(code5);
    const isSelective5 = req.body.courseisSelective5;
    courseIsSelectives.push(isSelective5);
    const credit5 = req.body.credit5;
    courseCredits.push(credit5);
    const ECTS5 = req.body.ECTS5;
    courseECTSs.push(ECTS5);


    var formStatus = "Send to Advisor";

    var student_id;

    student_id = await Student.findOne({ 'studentID': studentID }, function (err, student) {
        return student._id;
    });

    var eabdb_id;
    eabdb_id = await Eabdb.findOne({ 'department': req.user.department }, { "userType": "Eabdb" }, function (err, eabdb) {
        return eabdb._id;
    });

    var advisor_id;
    var advisor = await Advisor.findOne({ 'email': req.user.advisorEmail }).exec().then();

    if(!advisor){
        formStatus = "Send to EABDB";
        advisor_id = eabdb_id;
    }else{
        advisor_id = advisor._id;
    }
    
  var existForm = await FormPPF.find({ 'student_id': student_id }).exec().then();

  if (existForm.length === 2) {

    existForm[1].formName = formName ;
    existForm[1].student_id = student_id;
    existForm[1].advisor_id = advisor_id;
    existForm[1].eabdb_id = eabdb_id;
    existForm[1].formStatus = formStatus;
    existForm[1].programName = programName ;
    existForm[1].minimumNumberofCourses =  minimumNumberofCourses ;
    existForm[1].minimumNumberofLocalCredits = minimumNumberofLocalCredits ;
    existForm[1].minimumNumberofECTSCredits = minimumNumberofECTSCredits ;
    existForm[1].selectSemester = selectSemester;
    existForm[1].courseCodes = courseCodes;
    existForm[1].courseIsSelectives = courseIsSelectives;
    existForm[1].courseCredits = courseCredits;
    existForm[1].courseECTSs = courseECTSs;  
    existForm[1].requestNumber = requestNumber;
    req.flash('success', 'Your second FormPPF succesfully updated! You can check your requests to follow the form status.')
    existForm[1].save();
  }else if (existForm.length === 1 && (existForm[0].formStatus === "Disapproved by Advisor" || existForm[0].formStatus === "Disapproved by EABDB")){
    existForm[0].formName = formName;
    existForm[0].student_id = student_id;
    existForm[0].advisor_id = advisor_id;
    existForm[0].eabdb_id = eabdb_id;
    existForm[0].formStatus = "Send to Advisor" ;
    
    existForm[0].programName = programName ;
    existForm[0].minimumNumberofCourses = minimumNumberofCourses;
    existForm[0].minimumNumberofLocalCredits = minimumNumberofLocalCredits ;
    existForm[0].minimumNumberofECTSCredits = minimumNumberofECTSCredits;
    existForm[0].selectSemester = selectSemester;
    existForm[0].courseCodes = courseCodes;
    existForm[0].courseIsSelectives = courseIsSelectives;
    existForm[0].courseCredits = courseCredits;
    existForm[0].courseECTSs = courseECTSs;  
    existForm[0].requestNumber = requestNumber;
    req.flash('success', 'Your first FormPPF succesfully updated! You can check your requests to follow the form status.')
    existForm[0].save();
  }else{
    const form = new FormPPF({
        formName: formName,
        student_id: student_id,
        advisor_id: advisor_id,
        eabdb_id: eabdb_id,
        formStatus:formStatus,
        
        programName: programName,
        minimumNumberofCourses: minimumNumberofCourses,
        minimumNumberofLocalCredits: minimumNumberofLocalCredits,
        minimumNumberofECTSCredits: minimumNumberofECTSCredits,
        selectSemester: selectSemester,
        courseCodes: courseCodes,
        courseIsSelectives: courseIsSelectives,
        courseCredits: courseCredits,
        courseECTSs: courseECTSs,  
        requestNumber: requestNumber
    });
    req.flash('success', 'FormPPF succesfully saved! You can check your requests to follow the form status.')
    form.save();


}

const msg = {
    to: "iztechmasterstest@yandex.com",
    from: 'iztechmasterstest@yandex.com',
    subject: 'A new form saved.',
    html: 'Dear User , <br> <h1>A new form PPF created. Please visit requests in https://iztech-masters-degree.herokuapp.com </h1>',
  };
  
  sgMail.send(msg);


res.redirect('/dashboard');
}



