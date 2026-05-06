const qrcode = require('qrcode');
const User = require('../models/User');

exports.generateQR = async (req, res, next) => {
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
        next(error);
    }
};

exports.validateQR = async (req, res, next) => {
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
        next(error);
    }
};
