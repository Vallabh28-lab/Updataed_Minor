const mongoose = require('mongoose');

const HearingSchema = new mongoose.Schema({
    title: String,
    date: Date,
    location: String
});

module.exports = mongoose.model('Hearing', HearingSchema);
