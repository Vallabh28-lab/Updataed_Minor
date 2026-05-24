const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();

// Use Memory Storage so files are processed directly in RAM without writing temporary junk files to disk
const upload = multer({ storage: multer.memoryStorage() });

// @route   GET /api/documents
// @desc    Get user documents
// @access  Private
router.get('/', (req, res) => {
  res.json({ 
    message: 'Get documents endpoint',
    documents: []
  });
});

// @route   POST /api/documents/upload
// @desc    Upload document
// @access  Private
router.post('/upload', upload.single('document'), (req, res) => {
  res.json({ 
    message: 'Document upload endpoint',
    file: req.file
  });
});

// @route   POST /api/documents/analyze
// @desc    Proxy document to FastAPI OCR engine and return fully structured layout blocks
// @access  Private
router.post('/analyze', upload.single('document'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  try {
    const form = new FormData();
    // ✅ Keep the key name as 'file' to match what the Python FastAPI endpoint expects
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    console.log(`📡 Forwarding "${req.file.originalname}" to Python PaddleOCR engine on port 8000...`);

    // Forward the file down to your Python AI Microservice
    const response = await axios.post('http://127.0.0.1:8000/api/extract-text', form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    const data = response.data;

    // Catch explicit runtime logical application flags sent by Python cleanly
    if (!data || data.success === false) {
      return res.status(500).json({ 
        success: false, 
        error: data?.error || 'The OCR service failed to return structured metadata layers.' 
      });
    }

    const text = data.full_text || '';

    // DATES: dd/mm/yyyy, dd-Mon-yyyy, Month dd yyyy, ddth Month yyyy
    const dateMatches = [...new Set(text.match(
      /\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{2,4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{2,4})\b/gi
    ) || [])];

    // MONETARY AMOUNTS: Rs., INR, $, ₹
    const moneyMatches = [...new Set(text.match(
      /(?:Rs\.?|INR|\$|₹)\s?[\d,]+(?:\.\d+)?(?:\s?(?:lakh|crore|thousand|million|billion|per\s+annum|p\.a\.|per\s+month))?/gi
    ) || [])];

    // PARTIES: capitalized proper noun sequences
    const rawParties = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})\.?\b/g) || [];
    const skipWords = /^(This|The|That|These|Such|Any|All|Each|Both|Either|Neither|Upon|With|From|Into|Under|Over|After|Before|During|Between|Within|Without|Whereas|Herein|Hereto|Hereby|Thereof|Therefore|Provided|Subject|Pursuant)/;
    const partyMatches = [...new Set(rawParties.filter(p => p.split(' ').length >= 2 && !skipWords.test(p)))].slice(0, 10);

    // CLAUSES: English + Hindi + Marathi keywords
    const sentences = text.match(/[^.!?\n]+[.!?\n]/g) || [];
    const clauseKeywords = {
      'Termination':           /terminat|dismiss|end\s+of\s+(contract|agreement|employment)|समाप्त|रद्द|बर्खास्त|निलंबन|समाप्ती|रद्द करणे|बडतर्फी/i,
      'Confidentiality':       /confidential|non.?disclosure|proprietary|trade\s+secret|गोपनीय|गुप्त|प्रकटीकरण नहीं|व्यापार रहस्य|गोपनीयता|व्यापार गुपित/i,
      'Liability':             /liabilit|indemnif|damages|loss|claim|दायित्व|क्षतिपूर्ति|नुकसान|हर्जाना|दावा|नुकसानभरपाई|जबाबदारी/i,
      'Governing Law':         /governing\s+law|jurisdiction|courts?\s+of|arbitration|शासी कानून|न्यायालय|मध्यस्थता|अधिकार क्षेत्र|शासकीय कायदा|लवाद/i,
      'Payment':               /payment|salary|compensation|remuneration|fee|invoice|भुगतान|वेतन|मुआवजा|पारिश्रमिक|शुल्क|देयक|पगार|मोबदला/i,
      'Intellectual Property': /intellectual\s+property|copyright|patent|trademark|बौद्धिक संपदा|कॉपीराइट|पेटेंट|ट्रेडमार्क|बौद्धिक संपत्ती/i,
    };
    const riskMap = { 'Termination':'medium','Liability':'high','Confidentiality':'low','Governing Law':'low','Payment':'medium','Intellectual Property':'medium' };
    const riskReasonMap = { 'Termination':'Defines conditions under which the agreement can be ended.','Liability':'Determines financial exposure and indemnification obligations.','Confidentiality':'Standard clause protecting sensitive information.','Governing Law':'Specifies which jurisdiction governs disputes.','Payment':'Outlines financial obligations between parties.','Intellectual Property':'Determines ownership of created work or inventions.' };

    const extractedClauses = [];
    const seenTypes = new Set();
    for (let i = 0; i < sentences.length; i++) {
      for (const [type, pattern] of Object.entries(clauseKeywords)) {
        if (!seenTypes.has(type) && pattern.test(sentences[i])) {
          // Grab the matched sentence + next sentence for fuller context
          const context = [sentences[i], sentences[i+1]].filter(Boolean).join(' ').trim();
          extractedClauses.push({
            type,
            fullText: context,
            plainEnglish: context, // show the real extracted text, no fake summary
            riskLevel: riskMap[type] || 'low',
            riskReason: riskReasonMap[type] || ''
          });
          seenTypes.add(type);
        }
      }
    }

    return res.json({
      success: true,
      filename: data.filename || req.file.originalname,
      full_text: text,
      original_text: data.original_text || text,
      detected_language: data.detected_language || 'en',
      keyTerms: {
        dates: dateMatches,
        parties: partyMatches,
        monetaryAmounts: moneyMatches,
      },
      extractedClauses,
      templateComparison: []
    });

  } catch (err) {
    console.error('💥 Express Gateway Error:', err.message);
    console.error('💥 Full error details:', err.response?.data || err.code || err.stack);

    const isConnectionRefused = err.code === 'ECONNREFUSED';
    const userMessage = isConnectionRefused
      ? 'OCR server is not running. Please start the Python FastAPI server on port 8000.'
      : err.response?.data?.error || err.message;

    return res.status(502).json({ success: false, error: userMessage });
  }
});

// @route   POST /api/documents/translate
// @desc    On-demand translation of extracted text to Hindi or Marathi
router.post('/translate', async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target) return res.status(400).json({ success: false, error: 'text and target are required.' });

  try {
    const { data } = await axios.post('http://127.0.0.1:8000/api/translate', { text, target });
    res.json(data);
  } catch (err) {
    res.status(502).json({ success: false, error: 'Translation service error: ' + err.message });
  }
});

module.exports = router;