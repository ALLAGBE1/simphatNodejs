var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name: {
      type: String,
      default: '',
      required: true 

    },
    admin: {
      type: Boolean,
      default: false
    },
    number: {
      type: String,
      unique: true, 
      required: true 
    },
    email: {
        type: String,
        unique: true, 
    },
    codeVerify: {
      type: String,
        default: ''
    }
});

User.plugin(passportLocalMongoose, { usernameField: 'number' });

module.exports = mongoose.model('User', User);



// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

// var User = new Schema({
//     name: {
//       type: String,
//       default: '',
//       required: true 

//     },
//     username: {
//       type: String,
//       default: ''
//     },
//     admin: {
//       type: Boolean,
//       default: false
//     },
//     email: {
//       type: String,
//       unique: true, 
//       required: true 
//     },
//     codeVerify: {
//       type: String,
//         default: ''
//     }
// });

// User.plugin(passportLocalMongoose, { usernameField: 'email' });

// module.exports = mongoose.model('User', User);