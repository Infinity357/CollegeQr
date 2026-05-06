const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://infinity:kanpur123@cluster0.affj45y.mongodb.net/SmartCampus?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Schemas & Models
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

const gateLogSchema = new mongoose.Schema({
    location: { type: String, required: true }, // e.g. "Main Gate", "Library"
    date: { type: String, required: true },
    logTime: { type: String, required: true },
    logType: { type: String, enum: ['Entry', 'Exit'], required: true },
    rollNo: { type: String, required: true },
    name: { type: String, required: true },
    batch: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
const GateLog = mongoose.model('GateLog', gateLogSchema);

// Routes
app.post('/api/attendance/mark', async (req, res) => {
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
        console.error("Error saving attendance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/gate/log', async (req, res) => {
    try {
        const { location, date, logTime, logType, rollNo, name, batch } = req.body;

        const newLog = new GateLog({
            location,
            date,
            logTime,
            logType,
            rollNo,
            name,
            batch
        });

        await newLog.save();
        res.status(201).json({ message: "Gate log saved successfully", data: newLog });
    } catch (error) {
        console.error("Error saving gate log:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
