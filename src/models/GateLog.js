const mongoose = require('mongoose');

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

module.exports = mongoose.models.GateLog || mongoose.model('GateLog', gateLogSchema);
