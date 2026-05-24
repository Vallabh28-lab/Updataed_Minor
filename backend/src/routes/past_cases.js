const express = require("express");
const router = express.Router();
const PastCase = require("../models/past_case");

// 👉 GET STATS
router.get("/stats", async (req, res) => {
  try {
    const total = await PastCase.countDocuments();
    const byCategory = await PastCase.aggregate([
      { $group: { _id: "$Category", count: { $sum: 1 } } }
    ]);
    res.json({ total, byCategory });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// 👉 SEARCH BY CATEGORY (optional case-insensitive)
router.get("/category/:cat", async (req, res) => {
  try {
    const data = await PastCase.find({ 
      Category: { $regex: req.params.cat, $options: "i" } 
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 👉 SEARCH BY YEAR RANGE
router.get("/year", async (req, res) => {
  try {
    const start = Number(req.query.start);
    const end = Number(req.query.end);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid year range" });
    }

    const data = await PastCase.find({ Year: { $gte: start, $lte: end } });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 👉 SEARCH BY SUMMARY KEYWORD
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Query missing" });

    const data = await PastCase.find({ $text: { $search: q } });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 👉 COMBINED FILTER (category + year range + keyword) + PAGINATION
router.get("/", async (req, res) => {
  try {
    const { category, startYear, endYear, keyword, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.Category = { $regex: category, $options: "i" };
    if (startYear && endYear) filter.Year = { $gte: Number(startYear), $lte: Number(endYear) };
    if (keyword) filter.$text = { $search: keyword };

    const data = await PastCase.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 👉 ADD NEW CASE TO ARCHIVE
router.post("/", async (req, res) => {
  try {
    const { Category, Year, Summary_text, Case_Title_text, Keywords_text } = req.body;
    
    if (!Case_Title_text || !Category) {
      return res.status(400).json({ error: "Title and Category are required" });
    }

    const newCase = new PastCase({
      Category,
      Year,
      Summary_text,
      Case_Title_text,
      Keywords_text
    });

    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
