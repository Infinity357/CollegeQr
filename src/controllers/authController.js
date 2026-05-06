const User = require('../models/User');

exports.seedUsers = async (req, res, next) => {
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
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
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
        next(error);
    }
};
