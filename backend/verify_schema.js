const mongoose = require('mongoose');
const Appointment = require('./src/models/Appointment');
require('dotenv').config();

async function verifySchema() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testAppointment = new Appointment({
            userId: new mongoose.Types.ObjectId(),
            lawyerName: 'Test Lawyer',
            date: new Date(),
            time: '10:00 AM',
            documents: ['uploads/test1.pdf', 'uploads/test2.png']
        });

        const saved = await testAppointment.save();
        console.log('Appointment saved with documents:', saved.documents);

        await Appointment.findByIdAndDelete(saved._id);
        console.log('Test appointment cleaned up');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Schema verification failed:', error);
        process.exit(1);
    }
}

verifySchema();
