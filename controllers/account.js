const mongoose = require('mongoose');
const Login = require('../models/trash/login');
const User = require('../models/users/user');
const Advisor = require('../models/users/advisor');
const Student = require('../models/users/student');
const EABDB = require('../models/users/eabdb');
const Jury = require('../models/users/jury');
var flash = require('express-flash-messages');


var net = require('net');
const { resolve } = require('path');


exports.getLogin = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/login', {
        title: 'Login',
        errorMessage: errorMessage
    });
}

const getServer = (email, password) => {
    return new Promise(resolve => {
        var client = new net.Socket();
        var checkUser = null;
        client.connect(1337, '127.0.0.1', function () {
            console.log('Connected');
            var userObj = { email: email, password: password };
            let json_value = JSON.stringify(userObj);
            client.write(json_value);
        });

        client.on('data', function (data) {
            checkUser = JSON.parse(data);
            client.destroy(); // kill client after server's response
            console.log("client destroyed");
            resolve(checkUser);
        });

        client.on('close', async function () {
            console.log('Connection closed');
        }); 

    })
}


exports.postLogin = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    const loginModel = new Login({
        email: email,
        password: password
    });
    loginModel
        .validate()
        .then(async () => {
            
            var checkUser = await getServer(email, password);
           
            if (checkUser != null) {
                User.findOne({ email: email })
                    .then(user => {
                        if (user == null) {
                            /// if "new registered" User role is Advisor                    
                            if (checkUser.userType === "advisor") {

                                var newUser = new Advisor({
                                    nameSurname: checkUser.nameSurname,
                                    email: checkUser.email,
                                    department: checkUser.department,
                                    institution: checkUser.institution,
                                    userType: checkUser.userType,
                                });
                            }
                            /// if "new registered" User role is Student  
                            else if (checkUser.userType === "student") {
                                var newUser = new Student({ 
                                    nameSurname: checkUser.nameSurname,
                                    studentID: checkUser.studentID,
                                    department: checkUser.department,
                                    institution: checkUser.institution,
                                    email: checkUser.email,
                                    userType: checkUser.userType,
                                    advisorEmail: "",
                                })
  
                            }
                            /// if "new registered" User role is Student 
                            else if (checkUser.userType === "eabdb") {
                                var newUser = new EABDB({
                                    nameSurname: checkUser.nameSurname,
                                    department: checkUser.department,
                                    institution: checkUser.institution,
                                    email: checkUser.email,
                                    userType: checkUser.userType,
                                })
                
                            }
                            else if (checkUser.userType === "jury") {
                                var newUser = new Jury({
                                    nameSurname: checkUser.nameSurname,
                                    department: checkUser.department,
                                    institution: checkUser.institution,
                                    email: checkUser.email,
                                    userType: checkUser.userType,
                                })
                                
                            };
                            newUser.save();
                                req.session.user = newUser;
                                req.session.isAuthenticated = true;
                                req.session.save(function (err) {
                                    return res.redirect("/dashboard");
                                });
                            
                        }
                        else {
                            if (user.userType === "advisor") {
                                user.nameSurname = checkUser.nameSurname,
                                user.email = checkUser.email,
                                user.department =  checkUser.department,
                                user.institution =  checkUser.institution,
                                user.userType = checkUser.userType
                                
                            }
                            else if (user.userType === "student") {
                                user.nameSurname = checkUser.nameSurname,
                                user.studentID = checkUser.studentID,
                                user.department = checkUser.department,
                                user.institution = checkUser.institution,
                                user.email =  checkUser.email,
                                user.userType =  checkUser.userType,
                                user.advisorEmail = user.advisorEmail

                            }
                            if (user.userType === "eabdb") {
                                user.nameSurname = checkUser.nameSurname,
                                user.email = checkUser.email,
                                user.department =  checkUser.department,
                                user.institution =  checkUser.institution,
                                user.userType = checkUser.userType
                                
                            }
                            if (user.userType === "jury") {
                                user.nameSurname = checkUser.nameSurname,
                                user.email = checkUser.email,
                                user.department =  checkUser.department,
                                user.institution =  checkUser.institution,
                                user.userType = checkUser.userType
                                
                            }
                            user.save();
                            req.session.user = user;
                            req.session.isAuthenticated = true;
                            return req.session.save(function (err) {
                                req.flash('success', 'Hello '+req.session.user.nameSurname+'! You succesfully logged in!')
                                return res.redirect("/dashboard")
                            });
                        };
                    });
            }
            else {     
                var user = await User.findOne({email : req.body.email}).exec().then();
                if(user){
                    if(user.password === req.body.password){
                        req.session.user = user;
                        req.session.isAuthenticated = true;
                        return req.session.save(function (err) {
                            req.flash('success', 'Hello '+req.session.user.nameSurname+'! You succesfully logged in!')
                            return res.redirect("/dashboard")
                        });
                    }else{
                        req.flash('error', 'Incorrect Password!')
                        return res.redirect('/');
                    }
    
                }
                else{
                    req.flash('error', 'Incorrect Email!')
                    return res.redirect('/');
                }

            }

        })
        .catch(async err => {
            console.log("catch")
            req.flash('error', 'Please check the fields!')
            return res.redirect('/');
        });

}
exports.getLogout = async (req, res, next) => {
    await req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}
