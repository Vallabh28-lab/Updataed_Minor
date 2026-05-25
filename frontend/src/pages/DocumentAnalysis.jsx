import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FileText, Upload, X, RotateCcw, Calendar, Users, DollarSign, Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',   flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', flag: '🇮🇳' },
];

const ACCEPTED = '.pdf,.png,.jpg,.jpeg,.tiff,.bmp';

const riskConfig = {
  high:   { color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: AlertTriangle },
  medium: { color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: AlertTriangle },
  low:    { color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200',icon: CheckCircle   },
};

const keyTermMeta = {
  dates:           { label: 'Dates',            icon: Calendar,   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  parties:         { label: 'Parties',          icon: Users,      color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  monetaryAmounts: { label: 'Monetary Amounts', icon: DollarSign, color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100' },
};

function ClauseCard({ clause }) {
  const [open, setOpen] = useState(false);
  const cfg = riskConfig[clause.riskLevel] || riskConfig.low;
  const Icon = cfg.icon;
  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${cfg.color}`} />
          <span className="font-semibold text-gray-800 text-sm">{clause.type}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${cfg.border} ${cfg.color} ${cfg.bg}`}>
            {clause.riskLevel} risk
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-gray-100 pt-3 space-y-2">
          <p className="text-sm text-gray-700 leading-relaxed">{clause.fullText}</p>
          {clause.riskReason && (
            <p className="text-xs text-gray-500 italic">{clause.riskReason}</p>
          )}
        </div>
      )}
    </div>
  );
}

function DocumentAnalysis() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver]         = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [activeTab, setActiveTab]       = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeLang, setActiveLang]     = useState('en');
  const [translatedText, setTranslatedText] = useState({});
  const [isTranslating, setIsTranslating]   = useState(false);
  const [expandedText, setExpandedText] = useState(false);
  const inputRef = useRef();

  const processFile = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setErrorMessage(null);
    setActiveTab('processing');
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post(`${backendBaseUrl}/documents/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data;
      if (!data.success) throw new Error(data.error || 'OCR failed.');
      setAnalysisResults({
        ocrText: data.full_text || 'No text extracted.',
        keyTerms: data.keyTerms || {},
        extractedClauses: data.extractedClauses || [],
        detectedLanguage: data.detected_language || 'en',
        filename: data.filename || file.name,
      });
      setActiveTab('results');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || 'Upload failed. Check backend connection.');
      setActiveTab('upload');
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInput = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); };
  const handleReset = () => { setActiveTab('upload'); setAnalysisResults(null); setUploadedFile(null); setActiveLang('en'); setTranslatedText({}); setExpandedText(false); if (inputRef.current) inputRef.current.value = ''; };

  const handleTranslate = async (lang) => {
    if (lang === 'en') { setActiveLang('en'); return; }
    if (translatedText[lang]) { setActiveLang(lang); return; }
    setIsTranslating(true);
    try {
      const { data } = await axios.post(`${backendBaseUrl}/documents/translate`, {
        text: analysisResults.ocrText, target: lang
      });
      if (data.success) {
        setTranslatedText(prev => ({ ...prev, [lang]: data.translated_text }));
        setActiveLang(lang);
      }
    } catch { /* silent */ }
    finally { setIsTranslating(false); }
  };

  const displayText = activeLang === 'en' ? analysisResults?.ocrText : (translatedText[activeLang] || analysisResults?.ocrText);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gray-900 px-8 py-7 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Document Analysis & OCR</h1>
            <p className="text-sm text-gray-400 mt-0.5">AI-powered legal document scanning, clause detection & translation</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">

        {/* Error Banner */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* UPLOAD STATE */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Drop Zone */}
            <div className="lg:col-span-2">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 py-20 px-8
                  ${dragOver ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'}`}
              >
                <input ref={inputRef} type="file" accept={ACCEPTED} onChange={handleFileInput} className="hidden" />
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-amber-100' : 'bg-gray-100'}`}>
                  <Upload className={`w-7 h-7 ${dragOver ? 'text-amber-500' : 'text-gray-400'}`} />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-700">
                    {dragOver ? 'Drop to analyze' : 'Drop your document here'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">or <span className="text-amber-600 font-medium">browse files</span></p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {['PDF', 'PNG', 'JPG', 'TIFF', 'BMP'].map(fmt => (
                    <span key={fmt} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">{fmt}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              {[
                { icon: FileText,    color: 'text-blue-500',   bg: 'bg-blue-50',   title: 'OCR Extraction',     desc: 'Extracts text from scanned PDFs and images using Tesseract.' },
                { icon: Shield,      color: 'text-violet-500', bg: 'bg-violet-50', title: 'Clause Detection',   desc: 'Identifies legal clauses — liability, termination, payment & more.' },
                { icon: Users,       color: 'text-emerald-500',bg: 'bg-emerald-50',title: 'Key Term Mining',    desc: 'Pulls out dates, parties, and monetary amounts automatically.' },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROCESSING STATE */}
        {activeTab === 'processing' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-amber-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-gray-100 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">Analyzing Document</p>
              <p className="text-sm text-gray-400 mt-1">Running OCR and extracting legal insights…</p>
            </div>
            <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {/* RESULTS STATE */}
        {activeTab === 'results' && analysisResults && (
          <div className="space-y-6">

            {/* Result Header Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{analysisResults.filename}</p>
                  <p className="text-xs text-gray-400">Analysis complete · {analysisResults.extractedClauses.length} clauses detected</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" /> New Document
              </button>
            </div>

            {/* Key Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(keyTermMeta).map(([key, meta]) => {
                const Icon = meta.icon;
                const items = analysisResults.keyTerms[key] || [];
                return (
                  <div key={key} className={`bg-white rounded-2xl border ${meta.border} shadow-sm p-5`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{meta.label}</span>
                    </div>
                    {items.length ? (
                      <div className="space-y-1.5">
                        {items.map((v, i) => (
                          <p key={i} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg ${meta.bg} ${meta.color}`}>{v}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">None detected</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Extracted Text */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Extracted Text</h3>
                  {/* Language Toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleTranslate(lang.code)}
                        disabled={isTranslating}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                          activeLang === lang.code
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span> {lang.label}
                        {isTranslating && activeLang !== lang.code && lang.code !== 'en' && <Loader2 className="w-3 h-3 animate-spin" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`relative bg-gray-50 rounded-xl border border-gray-100 p-4 text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap overflow-y-auto transition-all ${expandedText ? 'max-h-[500px]' : 'max-h-48'}`}>
                  {displayText}
                </div>
                <button
                  onClick={() => setExpandedText(e => !e)}
                  className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                >
                  {expandedText ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show more</>}
                </button>
              </div>

              {/* Detected Clauses */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Detected Clauses
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full normal-case tracking-normal">
                    {analysisResults.extractedClauses.length}
                  </span>
                </h3>
                {analysisResults.extractedClauses.length > 0 ? (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {analysisResults.extractedClauses.map((clause, i) => (
                      <ClauseCard key={i} clause={clause} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Shield className="w-8 h-8 text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">No legal clauses detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentAnalysis;
