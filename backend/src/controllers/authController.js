const bcrypt = require('bcryptjs'); // or 'bcrypt'
const User = require('../models/User');

const registerUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Generate a salt (10-12 rounds is standard)
    const salt = await bcrypt.genSalt(10);
    
    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save to DB with the HASHED password
    const user = await User.create({
        email,
        password: hashedPassword // Save the scrambled version!
    });
    
    res.status(201).json({ message: "User created!" });
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

module.exports = { registerUser, login };