const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: { type: String, required: true },
    className: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    teacherId: { type: String },
    students: [{
        rollNo: String,
        name: String,
        batch: String,
        status: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
