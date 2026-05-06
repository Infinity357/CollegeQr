const GateLog = require('../models/GateLog');

exports.logGate = async (req, res, next) => {
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
        next(error);
    }
};

exports.getLogsByStudent = async (req, res, next) => {
    try {
        const { rollNo } = req.query;
        if (!rollNo) {
            return res.status(400).json({ error: "Roll No is required" });
        }
        
        const logs = await GateLog.find({ rollNo }).sort({ createdAt: -1 });
        res.status(200).json({ logs });
    } catch (error) {
        next(error);
    }
};
