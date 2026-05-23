const bcrypt = require('bcryptjs');
const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Password hashing is handled by the User model's pre-save hook
        const user = await User.create({ email, password });

        res.status(201).json({ message: "User created!", status: "success" });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error", status: "error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (user) {
            // This is the CRITICAL part:
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (isPasswordCorrect) {
                // Successful login - don't send password back
                const userResponse = {
                    name: user.name,
                    email: user.email,
                    profession: user.profession,
                    age: user.age
                };

                res.status(200).json({ 
                    message: "Login successful!", 
                    status: "success",
                    user: userResponse 
                });
            } else {
                res.status(400).json({ message: "Invalid password", status: "error" });
            }
        } else {
            res.status(404).json({ message: "User not found", status: "error" });
        }

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", status: "error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email", status: "error" });
        }

        user.password = newPassword; // pre-save hook will hash it
        await user.save();

        res.status(200).json({ message: "Password reset successful!", status: "success" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error", status: "error" });
    }
};

module.exports = { registerUser, login, forgotPassword };