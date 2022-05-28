
const User = require('../models/users/user');
const Advisor = require('../models/users/advisor');
const Form = require('../models/forms/form');
const mongoose = require('mongoose');
  
exports.getForm = async (req, res, next) => {

    var allUsers = await User.find({}).exec().then();
    var advisors = await Advisor.find({ department: req.user.department }).exec().then();

    var formID = await req.params.formID.substring(1,req.params.formID.length);
    
    var form = await Form.findById(mongoose.Types.ObjectId(formID)).exec().then();

    var formName = form.formName;
    var student = await User.findById(form.student_id).exec().then();
    var advisor = await User.findById(form.advisor_id).exec().then();
    var eabdb = await User.findById(form.eabdb_id).exec().then();
    var jury = await User.findById(form.jury_id).exec().then();

    var action;
    if (req.user.userType === "student") {
        if (form.formStatus === "Disapproved by Advisor" || form.formStatus === "Disapproved by EABDB") {
            action = "update";
        } else {
            action = "view";
        }

    } else if (req.user.userType === "advisor") {
        if (form.formStatus === "Disapproved by EABDB" || form.formStatus === "Send to EABDB") {
            if (form.formName === "FormTJ") {
                action = "update";
            }
            else {
                action = "view";
            }
        } else {
            action = "approve";
        }
    } else if(req.user.userType === "jury"){
        action ="view" ;
    }else {
        action = "approve";
    }

    res.render('../views/forms/' + formName, {
        form: form,
        student: student,
        advisor: advisor,
        eabdb: eabdb,
        user: req.user,
        action: action,
        allUsers: allUsers,
        advisors: advisors,
        jury: jury,

    })
};

exports.getRequests = async (req, res, next) => {
    var forms;
    if (req.user.userType === 'student') {
        if(req.params.formStatus === ":pendingRequests"){
            forms = await Form.find({ $and: [{ student_id: mongoose.Types.ObjectId(req.user._id) }, { $or: [{ formStatus: "Disapproved by EABDB" }, { formStatus: "Disapproved by Advisor" }] }] }).sort( [['date', -1]] ).exec().then();
        }
        else if(req.params.formStatus === ":outgoingRequests"){
            forms = await Form.find({ $and: [{ student_id: mongoose.Types.ObjectId(req.user._id) }, { $or: [{ formStatus: "Send to Advisor" }, { formStatus: "Approved by Advisor" }] }] }).sort( [['date', -1]] ).exec().then();
        }
        else if(req.params.formStatus === ":completedRequests"){
            forms = await Form.find({ $and: [{ student_id: mongoose.Types.ObjectId(req.user._id) }, { formStatus: "Approved by EABDB" }] }).sort( [['date', -1]] ).exec().then();
        }
        else{
            forms = await Form.find({ student_id: mongoose.Types.ObjectId(req.user._id) }).sort( [['data', -1]] ).exec().then();
    }
    } else if (req.user.userType === "advisor") {
        if(req.params.formStatus === ":pendingRequests"){
            forms = await Form.find({ $and: [{ advisor_id: mongoose.Types.ObjectId(req.user._id) }, { $or: [{ $and: [{ formStatus: "Disapproved by EABDB" }, { formName: "FormTJ" }] }, { formStatus: "Send to Advisor"}]}] }).sort( [['date', -1]] ).exec().then();
        }
        else if(req.params.formStatus === ":outgoingRequests"){
            forms = await Form.find({ $and: [{ advisor_id: mongoose.Types.ObjectId(req.user._id) }, {$or:[{ $or: [{ formStatus: "Send to EABDB" }, { formStatus: "Approved by Advisor" }]}, { formStatus: "Disapproved by Advisor"}] }] }).sort( [['date', -1]] ).exec().then();
        }
        else if(req.params.formStatus === ":completedRequests"){
            forms = await Form.find({ $and: [{ advisor_id: mongoose.Types.ObjectId(req.user._id) }, { formStatus: "Approved by EABDB" }] }).sort( [['date', -1]] ).exec().then();
        }
        else{
            forms = await Form.find({ $and: [{ advisor_id: mongoose.Types.ObjectId(req.user._id) }, { $or: [{ $and: [{ formStatus: "Disapproved by EABDB" }, { formName: "FormTJ" }] }, { formStatus: { $ne: "Disapproved by EABDB"}}]}]}).sort( [['date', -1]] ).exec().then();
    } }
    else if (req.user.userType === "eabdb") {
        if(req.params.formStatus === ":pendingRequests"){
            forms = await Form.find({ $and: [{ eabdb_id: mongoose.Types.ObjectId(req.user._id) }, { $or: [{ formStatus: "Send to EABDB" }, { formStatus: "Approved by Advisor" }] }] }).sort( [['date', -1]] ).exec().then();
        }
        else if(req.params.formStatus === ":outgoingRequests"){
            forms = await Form.find({ $and: [{ eabdb_id: mongoose.Types.ObjectId(req.user._id) }, { formStatus: "Disapproved by EABDB" }] }).sort( [['date', -1]] ).exec().then();
        }
        else if(req.params.formStatus === ":completedRequests"){
            forms = await Form.find({ $and: [{ eabdb_id: mongoose.Types.ObjectId(req.user._id) }, { formStatus: "Approved by EABDB" }] }).sort( [['date', -1]] ).exec().then();
        }
        else{
            forms = await Form.find({ $and: [{ eabdb_id: mongoose.Types.ObjectId(req.user._id) }, { $or: [{ formStatus: "Send to EABDB" }, { formStatus: "Approved by Advisor" }, { formStatus: "Approved by EABDB" },{ formStatus: "Disapproved by EABDB" }] }] }).sort( [['date', -1]] ).exec().then();
    }
    } else if (req.user.userType === "jury") {
        if(req.params.formStatus === ":pendingRequests"){
            forms = [];
        }
        else if(req.params.formStatus === ":outgoingRequests"){
            forms = await Form.find({ $and: [{ jury_id: mongoose.Types.ObjectId(req.user._id) }, { formStatus: "Send to Advisor" }] }).sort( [['date', -1]] ).exec().then();
        }
        else if(req.params.formStatus === ":completedRequests"){
            forms = await Form.find({ $and: [{ jury_id: mongoose.Types.ObjectId(req.user._id) }, { $or: [{ formStatus: "Disapproved by Advisor" }, { formStatus: "Approved by Advisor" }] }] }).sort( [['date', -1]] ).exec().then();
        }
        else{
            forms = await Form.find({ jury_id: mongoose.Types.ObjectId(req.user._id) }).sort( [['date', -1]] ).exec().then();
    }

    }
    var allUsers = await User.find({}).exec().then();

    res.render("../views/request/requests", {
        forms: forms,
        user: req.user,
        allUsers: allUsers
    });
};
