const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res, next) => {
    try {
        const { date, className, startTime, endTime, teacherId, students } = req.body;
        
        const newAttendance = new Attendance({
            date,
            className,
            startTime,
            endTime,
            teacherId,
            students
        });

        await newAttendance.save();
        res.status(201).json({ message: "Attendance saved successfully", data: newAttendance });
    } catch (error) {
        next(error);
    }
};
