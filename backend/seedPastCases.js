const mongoose = require("mongoose");
const PastCase = require("./src/models/past_case");
require("dotenv").config();

const sampleCases = [
    {
        Category: "Criminal",
        Year: 2021,
        Summary_text: "High-profile robbery case involving several sophisticated techniques. The defendants were apprehended after a two-month investigation. Evidence included CCTV footage and ballistics reports.",
        Case_Title_text: "State vs. Vinay Patil & Others",
        Keywords_text: "Robbery, IPC 392, Evidence, Criminal"
    },
    {
        Category: "Civil",
        Year: 2022,
        Summary_text: "Property dispute over ancestral land in suburban Mumbai. The court ruled in favor of the plaintiff based on historical revenue records and title deeds from 1950.",
        Case_Title_text: "Amit Deshmukh vs. Suresh Kulkarni",
        Keywords_text: "Property, Civil, Ancestral Land, Title Deed"
    },
    {
        Category: "Family",
        Year: 2023,
        Summary_text: "Matrimonial dispute involving child custody and alimony. The court emphasized the best interests of the minor child while determining visitation rights.",
        Case_Title_text: "Sneha Rao vs. Arjun Rao",
        Keywords_text: "Family, Divorce, Alimony, Child Custody"
    },
    {
        Category: "Criminal",
        Year: 2020,
        Summary_text: "Corruption case involving a public official misusing discretionary funds. The anti-corruption bureau provided recorded conversations as primary evidence.",
        Case_Title_text: "CBI vs. Harish Gupta",
        Keywords_text: "Corruption, Public Official, IPC 120B, Prevention of Corruption Act"
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing past cases to start fresh (optional)
        // await PastCase.deleteMany({});
        
        await PastCase.insertMany(sampleCases);
        console.log("✅ Successfully seeded 4 past cases!");

    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

seedDatabase();
