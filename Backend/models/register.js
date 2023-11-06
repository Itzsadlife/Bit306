const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
    id: { type: String },
    password: {type: String},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    contactNumber:{type: String, required: true},
    description: {type : String, required: true},
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    isFirstLogin: {type:Boolean, default: true}
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
