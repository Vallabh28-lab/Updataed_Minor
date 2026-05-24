const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

const EMAIL = '202401040041@mitaoe.ac.in'; // change this
const PASSWORD_TO_TEST = 'your_password_here'; // change this

async function checkUser() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const user = await User.findOne({ email: EMAIL });

    if (!user) {
        console.log('❌ No user found with email:', EMAIL);
        process.exit(0);
    }

    console.log('👤 User found:');
    console.log('   Email     :', user.email);
    console.log('   Name      :', user.name || 'N/A');
    console.log('   Profession:', user.profession || 'N/A');
    console.log('   Created   :', user.createdAt);
    console.log('   Hash      :', user.password);

    const match = await bcrypt.compare(PASSWORD_TO_TEST, user.password);
    console.log('\n🔐 Password match:', match ? '✅ CORRECT' : '❌ WRONG');

    await mongoose.connection.close();
}

checkUser().catch(err => {
    console.error('💥 Error:', err.message);
    process.exit(1);
});
