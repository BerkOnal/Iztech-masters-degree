var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
var flash = require('express-flash-messages');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./routes/account');
var advisorRouter = require('./routes/advisor');
var studentRouter = require('./routes/student');
var requestRouter = require('./routes/requests');
var eabdbRouter = require('./routes/eabdb');
var juryRouter = require('./routes/jury');
var getFormRouter = require('./routes/getForm');

var app = express();
app.use(flash())

const MongoClient = require('mongodb').MongoClient;
const ConnectionString = "mongodb+srv://dbUser:iyte123@realmcluster.kivvp.mongodb.net/iztechApp?retryWrites=true&w=majority";



var store = new mongoDbStore({
  uri: ConnectionString,
  collection: 'mySessions'
});

mongoose.connect(ConnectionString);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 3600000
  },
  store: store
}));

const User = require('./models/users/user');

app.use((req, res, next) => {

  if (!req.session.user) {
      return next();
  }

  User.findById(req.session.user._id)
      .then(user => {
          req.user = user;
          next();
      })
      .catch(err => { console.log(err) });
})

app.use('/', indexRouter);
app.use('/account',accountRouter);
app.use('/advisor',advisorRouter);
app.use('/student',studentRouter);
app.use('/requests', requestRouter);
app.use('/eabdb', eabdbRouter);
app.use('/jury', juryRouter);
app.use('/getForm',getFormRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



app.use(csurf());





module.exports = app;











var net = require('net');

var textChunk = null;


let users = [
    {nameSurname:"Onur Demirörs", password:"onur", email:"onurdemirors@iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"advisor"},
    
    {nameSurname:"Görkem Giray", password:"gorkem", email:"gorkemgiray@iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"advisor"},   

    {nameSurname:"Hüseyin Ünlü", password:"huseyin", email:"huseyinunlu@iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"advisor"},   

    {nameSurname:"Samet Tenekeci", password:"samet", email:"samettenekeci@iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"advisor"},   
    
    {nameSurname:"Kıvılcım Berrak", studentID: 240201008, 
    password:"kivilcim", email:"kivilcimberrak@std.iyte.edu.tr", 
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},
   
    {nameSurname:"Berk Önal", studentID:260201045, 
    password:"berk", email:"berkonal@std.iyte.edu.tr", 
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},
    
    {nameSurname:"Fatma Büber", studentID:280201091, 
    password:"fatma", email:"fatmabuber@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student", },
    
    {nameSurname:"Mert Can Dönmez", studentID:250201050, 
    password:"mertcan", email:"mdonmez@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},
    
    {nameSurname:"Muhammed Ayyıldız", studentID:250201020, 
    password:"muhammed", email:"muhammedayyildiz@std.iyte.edu.tr", 
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student", },
    
    {nameSurname:"İhsan Can Yalabuk", studentID:260201034, 
    password:"ihsan", email:"ihsancanyalabuk@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},

    {nameSurname:"İbrahim Mert İnan", studentID:250201038, 
    password:"ibrahim", email:"ibrahiminan@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},

    {nameSurname:"Ege Perim", studentID:250201018, 
    password:"ege", email:"egeperim@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},

    {nameSurname:"Caner Alparslan", studentID:260201081, 
    password:"caner", email:"caneralparslan@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},

    {nameSurname:"Yaşar Kaan Helva", studentID:250201014, 
    password:"yasar", email:"yasarhelva@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},

    {nameSurname:"İbrahim Ekmen", studentID:260201007, 
    password:"ibrahim", email:"ibrahimekmen@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},

    {nameSurname:"Tamer Uzunoğlu", studentID:250201029, 
    password:"tamer", email:"tameruzunoglu@std.iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"student",},

    {nameSurname:"Tolga Ayav",
    password:"tolga", email:"tolgaayav@iyte.edu.tr",
    department : 'Computer Engineering', institution : 'IZTECH' ,userType:"eabdb",}

];
function search(emailData,passwordData,myArray){
    var result = null ;
 for(var i=0; i<Object.keys(myArray).length; i++){
        if(myArray[i].email == emailData){
            if(myArray[i].password == passwordData){
                result = myArray[i];
            }
            else{
                return result;
            }
        }
        else{
            continue;
        }
    }
    return result;
}

var server = net.createServer(function(socket) {
    socket.on('data', function(data){
	textChunk = JSON.parse(data);
        console.log(textChunk);
        var return_value = search(textChunk.email, textChunk.password , users);
        var json_value = JSON.stringify(return_value);
        socket.write(json_value);
        

    });
    
   	
});

server.listen(1337,"127.0.0.1", function(){

    console.log("Listening on port 1337")

});
