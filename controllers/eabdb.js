const User = require('../models/users/user');
const Advisor = require('../models/users/advisor');
const Eabdb = require('../models/users/eabdb');
const Jury = require('../models/users/jury');
const Form = require('../models/forms/form');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

exports.approveForm = async (req, res, next) => {

  var form = await Form.findById(req.body.requestNumber).exec().then();
  var student = await User.findById(form.student_id).exec().then();
  var advisor = await User.findById(form.advisor_id).exec().then();
  form.formStatus = req.body.submit + "d by EABDB";

  if (form.formName === "FormTD") {
   
    student.advisorEmail = advisor.email;
    student.save();
    req.flash('success', form.formName + " of " + student.nameSurname + " succesfully " + req.body.submit + "d! You can check your requests to follow the form status.")
  }
  else if (form.formName === "FormTJ" ) {
    if(req.body.submit === "Disapprove"){

      var flag = false;
      var forms = await Form.find({ formName: "FormTJ" }).exec().then();
      for (var i = 0; i < form.officialMembers.length; i++) {
        var jury = await User.findById(form.officialMembers[i]).exec().then();
        for (var j = 0; j < forms.lenght; j++) {
          var a = forms[j].officialMembers.include(jury._id);
          var b = forms[j].backupMembers.include(jury._id);
          var c = forms[j].outsideMembers.include(jury._id);
          flag = a || b || c;
        }
        if (jury.userType === "jury" && flag == false) {
          await User.findByIdAndDelete(jury._id);
        }
      } 
      for (var i = 0; i < form.backupMembers.length; i++) {
        var jury = await User.findById(form.backupMembers[i]).exec().then();
        for (var j = 0; j < forms.lenght; j++) {
          var a = forms[j].officialMembers.include(jury._id);
          var b = forms[j].backupMembers.include(jury._id);
          var c = forms[j].outsideMembers.include(jury._id);
          flag = a || b || c;
          if (jury.userType === "jury" && flag == false) {
            await User.findByIdAndDelete(jury._id);
          }
        } 
      } 
      for (var i = 0; i < form.outsideMembers.length; i++) {
        var jury = await User.findById(form.outsideMembers[i]).exec().then();
        for (var j = 0; j < forms.lenght; j++) {
          var a = forms[j].officialMembers.include(jury._id);
          var b = forms[j].backupMembers.include(jury._id);
          var c = forms[j].outsideMembers.include(jury._id);
          flag = a || b || c;
          if (jury.userType === "jury" && flag == false) {
            await User.findByIdAndDelete(jury._id);
          }
        }
      }
    }
    req.flash('success', form.formName + " of " + advisor.nameSurname + " succesfully " + req.body.submit + "d! You can check your requests to follow the form status.")
  }
  else{
    req.flash('success', form.formName + " of " + student.nameSurname + " succesfully " + req.body.submit + "d! You can check your requests to follow the form status.")
  }



  const msg = {
    to: "iztechmasterstest@yandex.com",
    from: 'iztechmasterstest@yandex.com',
    subject: 'A new form saved.',
    html: 'Dear User , <br> <h1>A new form approved. Please visit requests in https://iztech-masters-degree.herokuapp.com </h1>',
  };

  sgMail.send(msg);

  form.save();

  
  res.redirect('/dashboard');



}

