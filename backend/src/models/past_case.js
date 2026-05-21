const mongoose = require("mongoose");

const pastCaseSchema = new mongoose.Schema({
    Category: String,
    Year: Number,
    Summary_text: String,
    Case_Title_text: String,
    Keywords_text: String
}, { collection: "past_cases" });

pastCaseSchema.index({
    Summary_text: "text",
    Case_Title_text: "text",
    Keywords_text: "text"
});

module.exports = mongoose.model("PastCase", pastCaseSchema);
