const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'guard'], required: true },
    name: { type: String, required: true },
    email: { type: String },
    contact: { type: String },
    roll: { type: String }, // For students
    batch: { type: String } // For students
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
