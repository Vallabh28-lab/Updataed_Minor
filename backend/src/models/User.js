const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'Email address field is required.'], 
        unique: true,
        trim: true,
        lowercase: true // Automatically converts "User@Email.com" to "user@email.com"
    },
    password: { 
        type: String, 
        required: [true, 'Password field is required.'],
        minlength: [6, 'Password must be at least 6 characters long.']
    },
    profession: {
        type: String,
        trim: true,
        default: 'General'
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be a negative value.']
    }
}, { 
    timestamps: true,
    collection: 'users' // Explicitly forces usage of the "users" collection
});

// 🔒 Automated Pre-Save Encryption Middleware Hook
userSchema.pre('save', async function(next) {
    // Only compute a new hash if the password field was newly created or modified
    if (!this.isModified('password')) return next();

    try {
        // 10 salt rounds provides excellent balance between high-grade security and hashing speed
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error); // Passes the error to Mongoose to cancel the database save action
    }
});

module.exports = mongoose.model('User', userSchema);