const User = require('../models/users/user');
const Student = require('../models/users/student');
const Eabdb = require('../models/users/eabdb');
const Form = require('../models/forms/form');
const FormTJ = require('../models/forms/formTJ');
const mongoose = require('mongoose');
const Jury = require('../models/users/jury');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');





exports.approveForm = async (req, res, next) => {
  var form = await Form.findById(mongoose.Types.ObjectId(req.body.requestNumber)).exec().then();
  var student = await User.findById(mongoose.Types.ObjectId(form.student_id)).exec().then();
  form.formStatus = req.body.submit + "d by Advisor";
  await form.save();


    const msg = {
      to: "iztechmasterstest@yandex.com",
      from: 'iztechmasterstest@yandex.com',
      subject: 'A new form saved.',
      html: 'Dear Advisor , <br> <h1>A form approved. Please visit requests in https://iztech-masters-degree.herokuapp.com </h1>',
  };

  sgMail.send(msg);

req.flash('success', form.formName +" of "+ student.nameSurname +" succesfully "+ req.body.submit +"d! You can check your requests to follow the form status.")
res.redirect('/dashboard');

};

exports.getFormTJ = async (req, res, next) => {
  
  var action = "create";
  
  res.render('../views/forms/FormTJ', {
    advisor: req.user,
    user: req.user,
    action: action,
  })
};

exports.createFormTJ = async (req, res, next) => {

  const formName = "FormTJ";
  const studentID = req.body.studentID;
  const programName = req.body.programName;
  const programType = req.body.programType;
  const place = req.body.place;
  const date = req.body.date;
  const time = req.body.time;
  const requestNumber = req.body.requestNumber;
  var isOnline = true;
  if(programType === "1"){
      isOnline = false ;
  }

  const officialMemberNameSurname1 = req.body.officialMemberNameSurname1;
  const officialMemberEmail1 = req.body.officialMemberEmail1;
  const officialMemberDepartment1 = req.body.officialMemberDepartment1;
  const officialMemberInstitution1 = req.body.officialMemberInstitution1;

  const officialMemberNameSurname2 = req.body.officialMemberNameSurname2;
  const officialMemberEmail2 = req.body.officialMemberEmail2;
  const officialMemberDepartment2 = req.body.officialMemberDepartment2;
  const officialMemberInstitution2 = req.body.officialMemberInstitution2;

  const officialMemberNameSurname3 = req.body.officialMemberNameSurname3;
  const officialMemberEmail3 = req.body.officialMemberEmail3;
  const officialMemberDepartment3 = req.body.officialMemberDepartment3;
  const officialMemberInstitution3 = req.body.officialMemberInstitution3;

  const officialMemberNameSurname4 = req.body.officialMemberNameSurname4;
  const officialMemberEmail4 = req.body.officialMemberEmail4;
  const officialMemberDepartment4 = req.body.officialMemberDepartment4;
  const officialMemberInstitution4 = req.body.officialMemberInstitution4;

  const backupMemberNameSurname1 = req.body.backupMemberNameSurname1;
  const backupMemberEmail1 = req.body.backupMemberEmail1;
  const backupMemberDepartment1 = req.body.backupMemberDepartment1;
  const backupMemberInstitution1 = req.body.backupMemberInstitution1;

  const backupMemberNameSurname2 = req.body.backupMemberNameSurname2;
  const backupMemberEmail2 = req.body.backupMemberEmail2;
  const backupMemberDepartment2 = req.body.backupMemberDepartment2;
  const backupMemberInstitution2 = req.body.backupMemberInstitution2;

  const MemberNameSurname1 = req.body.MemberNameSurname1;
  const MemberEmail1 = req.body.MemberEmail1;
  const MemberDepartment1 = req.body.MemberDepartment1;
  const MemberInstitution1 = req.body.MemberInstitution1;

  const MemberNameSurname2 = req.body.MemberNameSurname2;
  const MemberEmail2 = req.body.MemberEmail2;
  const MemberDepartment2 = req.body.MemberDepartment2;
  const MemberInstitution2 = req.body.MemberInstitution2;

  const MemberNameSurname3 = req.body.MemberNameSurname3;
  const MemberEmail3 = req.body.MemberEmail3;
  const MemberDepartment3 = req.body.MemberDepartment3;
  const MemberInstitution3 = req.body.MemberInstitution3;

  const MemberNameSurname4 = req.body.MemberNameSurname4;
  const MemberEmail4 = req.body.MemberEmail4;
  const MemberDepartment4 = req.body.MemberDepartment4;
  const MemberInstitution4 = req.body.MemberInstitution4;


  var officialMembers = [];
  var backUpMembers = [];
  var outsideMembers = [];
  await createJury(officialMemberNameSurname1, officialMemberEmail1, officialMemberDepartment1, officialMemberInstitution1, officialMembers);
  await createJury(officialMemberNameSurname2, officialMemberEmail2, officialMemberDepartment2, officialMemberInstitution2, officialMembers);
  await createJury(officialMemberNameSurname3, officialMemberEmail3, officialMemberDepartment3, officialMemberInstitution3, officialMembers);
  await createJury(officialMemberNameSurname4, officialMemberEmail4, officialMemberDepartment4, officialMemberInstitution4, officialMembers);

  await createJury(backupMemberNameSurname1, backupMemberEmail1, backupMemberDepartment1, backupMemberInstitution1, backUpMembers);
  await createJury(backupMemberNameSurname2, backupMemberEmail2, backupMemberDepartment2, backupMemberInstitution2, backUpMembers);

  await createJury(MemberNameSurname1, MemberEmail1, MemberDepartment1, MemberInstitution1, outsideMembers);
  await createJury(MemberNameSurname2, MemberEmail2, MemberDepartment2, MemberInstitution2, outsideMembers);
  await createJury(MemberNameSurname3, MemberEmail3, MemberDepartment3, MemberInstitution3, outsideMembers);
  await createJury(MemberNameSurname4, MemberEmail4, MemberDepartment4, MemberInstitution4, outsideMembers);

  var student_id;

  student_id = await Student.findOne({ 'studentID': studentID }, function (err, student) {
    return student._id;
  });

  var eabdb_id;
  eabdb_id = await Eabdb.findOne({ 'department': req.user.department }, { "userType": "Eabdb" }, function (err, eabdb) {
    return eabdb._id;
  });


  var advisor_id = req.user._id;

  var existForm = await FormTJ.findOne({ 'student_id': student_id }).exec().then();

  if (existForm != null) {

    existForm.formName = formName;
    existForm.student_id = student_id;
    existForm.advisor_id = advisor_id;
    existForm.eabdb_id = eabdb_id;
    existForm.formStatus = "Send to EABDB";
    existForm.programName = programName;
    existForm.officialMembers = officialMembers;
    existForm.isOnline = isOnline;
    existForm.backupMembers = backUpMembers;
    existForm.outsideMembers = outsideMembers;
    existForm.place = place;
    existForm.date = date;
    existForm.time = time;
    existForm.requestNumber = requestNumber;
    
    existForm.save();
    req.flash('success', 'FormTJ succesfully updated! You can check your requests to follow the form status.')
  }



  else {
    const form = new FormTJ({
      formName: formName,
      student_id: student_id,
      advisor_id: advisor_id,
      eabdb_id: eabdb_id,
      formStatus: "Send to EABDB",
      isOnline : isOnline,
      programName: programName,
      officialMembers: officialMembers,
      backupMembers: backUpMembers,
      outsideMembers: outsideMembers,
      place: place,
      date: date,
      time: time,
      requestNumber: requestNumber
    });

    form.save();
    req.flash('success', 'FormTJ succesfully saved! You can check your requests to follow the form status.')

  }

  const msg = {
    to: "iztechmasterstest@yandex.com",
    from: 'iztechmasterstest@yandex.com',
    subject: 'A new form saved.',
    html: "Dear Advisor,<br> A new TJ form created. Please visit requests in https://iztech-masters-degree.herokuapp.com jury emails are : "+ officialMemberEmail1+","+officialMemberEmail2+" "+officialMemberEmail3+" "+officialMemberEmail4+" "+backupMemberEmail1+" "+backupMemberEmail2+" "+MemberEmail1+" "+MemberEmail2+" "+MemberEmail3+" "+MemberEmail4+" and jury passwords are <h1>jury</1> as default",
};

sgMail.send(msg);




res.redirect('/dashboard');

}

async function createJury(nameSurname, juryEmail, department, institution, memberArray) {
  if (nameSurname !== '' && juryEmail !== '' && department !== '' && institution !== '') {

    var existMember = await User.findOne({ email: juryEmail }).exec().then();
    if (existMember) {
      memberArray.push(existMember._id);
    } else {
      notExistMember = new Jury({
        nameSurname: nameSurname,
        email: juryEmail,
        department: department,
        institution: institution,
        password: "jury",
        userType: "jury",
      });
      await notExistMember.save();
      memberArray.push(notExistMember._id);
    }

  }
};
