const express = require('express');
const cors = require('cors');
const dbConnect = require('./utils/dbConnect');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const qrRoutes = require('./routes/qrRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gateRoutes = require('./routes/gateRoutes');

const app = express();

// Connect to MongoDB
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/gate', gateRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
