const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerActivitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {  
        type: Number,
        default: ''
    },
    activitySimphat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivitySimphat',
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const RegisterActivity = mongoose.model('RegisterActivity', registerActivitySchema);
module.exports = RegisterActivity;