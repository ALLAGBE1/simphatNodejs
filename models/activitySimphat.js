const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySimphatSchema = new Schema({
    activitySimphat: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,  // Utilisez Number pour stocker un prix ou un montant
        required: true
    }
}, {
    timestamps: true
});

const ActivitySimphat = mongoose.model('ActivitySimphat', activitySimphatSchema);
module.exports = ActivitySimphat;


