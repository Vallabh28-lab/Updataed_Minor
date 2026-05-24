const bcrypt = require('bcryptjs'); // or 'bcrypt'
const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { email, password, name, profession, age } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", status: "error" });
        }

        // Save to DB (The User model will handle hashing automatically)
        const user = await User.create({
            email,
            password,
            name,
            profession,
            age
        });
        
        res.status(201).json({ 
            message: "User created!", 
            status: "success",
            user: { email: user.email, name: user.name } 
        });
    } catch (error) {
        console.error("Registration error:", error);
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
            console.log("🔍 [LOGIN DEBUG] User found:", user.email);
            console.log("🔍 [LOGIN DEBUG] Stored Hash:", user.password);
            
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            console.log("🔍 [LOGIN DEBUG] Password match result:", isPasswordCorrect);

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

module.exports = { registerUser, login };