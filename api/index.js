const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const qrcode = require('qrcode');

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

const Attendance = mongoose.model('Attendance', attendanceSchema);
const GateLog = mongoose.model('GateLog', gateLogSchema);
const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/auth/seed', async (req, res) => {
    try {
        const count = await User.countDocuments();
        if (count > 0) {
            return res.status(400).json({ message: "Database already seeded." });
        }
        
        const initialUsers = [
            // Students
            { username: "231030146", password: "yc123", role: "student", name: "Yuvika Chaudhary", email: "yuvika12@gmail.com", contact: "8435688578", roll: "231030146", batch: "A15" },
            { username: "231030083", password: "aviral123", role: "student", name: "Aviral Gupta", email: "aviral32@gmail.com", contact: "7649467959", roll: "231030083", batch: "A13" },
            { username: "231030197", password: "mayank123", role: "student", name: "Mayank", email: "mayank46@gmail.com", contact: "9787687577", roll: "231030197", batch: "A17" },
            { username: "231030202", password: "sourav123", role: "student", name: "Sourav Bhatt", email: "sourav78@gmail.com", contact: "8547890965", roll: "231030202", batch: "A17" },
            // Teachers
            { username: "Anita123", password: "teacher123", role: "teacher", name: "Anita", email: "anita42@gmail.com", contact: "8768598474" },
            { username: "GauravNegi123", password: "teacher123", role: "teacher", name: "Gaurav Negi", email: "gaurav321@gmail.com", contact: "9785493932" },
            // Gate Guard
            { username: "Gate123", password: "gate123", role: "guard", name: "Gate Guard" }
        ];

        await User.insertMany(initialUsers);
        res.status(201).json({ message: "Seeded initial users successfully" });
    } catch (error) {
        console.error("Error seeding users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        
        // Remove password from response
        const userObj = user.toObject();
        delete userObj.password;
        
        res.status(200).json({ message: "Login successful", user: userObj });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/qr/generate', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: "Username query parameter is required" });
        }

        const user = await User.findOne({ username, role: 'student' });
        if (!user) {
            return res.status(404).json({ error: "Student not found" });
        }

        const qrData = JSON.stringify({
            rollNo: user.roll,
            name: user.name,
            batch: user.batch,
            timestamp: Date.now(),
            secretCode: Math.random().toString(36).substring(2, 10)
        });

        // Generate base64 string
        const qrImageBase64 = await qrcode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            color: {
                dark: '#0f172a',
                light: '#ffffff'
            },
            width: 200
        });

        res.status(200).json({ qrImage: qrImageBase64 });
    } catch (error) {
        console.error("Error generating QR code:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/qr/validate', async (req, res) => {
    try {
        const { qrData } = req.body;
        if (!qrData) {
            return res.status(400).json({ error: "QR Data is required" });
        }

        let parsedData;
        try {
            parsedData = JSON.parse(qrData);
        } catch (e) {
            return res.status(400).json({ error: "Invalid QR format" });
        }

        const { rollNo, name, batch, timestamp } = parsedData;

        if (!timestamp) {
            return res.status(400).json({ error: "Invalid QR format (no timestamp)" });
        }

        const now = Date.now();
        if (now - timestamp > 60000) {
            return res.status(400).json({ error: "Invalid QR Code: This QR code has expired. Please ask the student to refresh their QR code." });
        }

        res.status(200).json({ message: "QR Valid", student: { rollNo, name, batch } });
    } catch (error) {
        console.error("Error validating QR:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

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
