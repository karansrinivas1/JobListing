const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imagePath: { type: String },
    type: { 
        type: Number, 
        required: true, 
        enum: [1, 2], // 1 for employee, 2 for admin
        default: 1   // Default to 'employee' if not provided
    }
});

module.exports = mongoose.model('User', userSchema);
