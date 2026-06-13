import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  FileText, Upload, AlertTriangle, RotateCcw, CheckCircle,
  Calendar, Users, DollarSign, Shield, ChevronDown, ChevronUp,
  Loader2, AlertCircle, X, FileSearch, Briefcase
} from 'lucide-react';

// ─── CORE CONFIG — UNCHANGED ────────────────────────────────────────────────
const API_BASE = 'http://127.0.0.1:5000';
// ────────────────────────────────────────────────────────────────────────────

// ─── UI HELPERS ─────────────────────────────────────────────────────────────
const riskCfg = {
  high:   { bar: 'bg-red-500',    badge: 'bg-red-50 text-red-700 border-red-200',    icon: AlertTriangle, ring: 'border-red-100' },
  medium: { bar: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle, ring: 'border-amber-100' },
  low:    { bar: 'bg-emerald-500',badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, ring: 'border-emerald-100' },
};

const termCfg = {
  dates:           { label: 'Dates',            Icon: Calendar,   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-100',   pill: 'bg-blue-100 text-blue-700' },
  parties:         { label: 'Parties',          Icon: Users,      color: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-100', pill: 'bg-violet-100 text-violet-700' },
  monetaryAmounts: { label: 'Monetary Amounts', Icon: DollarSign, color: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-100',pill: 'bg-emerald-100 text-emerald-700' },
};

function ClauseCard({ clause }) {
  const [open, setOpen] = useState(false);
  const cfg = riskCfg[clause.riskLevel] || riskCfg.low;
  const RiskIcon = cfg.icon;
  return (
    <div className={`rounded-xl border ${cfg.ring} bg-white shadow-sm overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <RiskIcon className={`w-4 h-4 shrink-0 ${cfg.badge.split(' ')[1]}`} />
          <span className="text-sm font-semibold text-gray-800">{clause.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.badge} uppercase tracking-wide`}>
            {clause.riskLevel} risk
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-3 border-t border-gray-100 space-y-2">
          <p className="text-sm text-gray-700 leading-relaxed">{clause.fullText}</p>
          {clause.riskReason && <p className="text-xs text-gray-400 italic">{clause.riskReason}</p>}
        </div>
      )}
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

function DocumentAnalysis() {

  // ─── CORE STATE — UNCHANGED ───────────────────────────────────────────────
  const [uploadedFile, setUploadedFile]       = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [activeTab, setActiveTab]             = useState('upload');
  const [isProcessing, setIsProcessing]       = useState(false);
  const [errorMessage, setErrorMessage]       = useState(null);
  const inputRef = useRef();
  // ──────────────────────────────────────────────────────────────────────────



  // ─── CORE LOGIC — UNCHANGED ───────────────────────────────────────────────
  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadedFile(file);
    setErrorMessage(null);
    setActiveTab('processing');
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/api/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const jobId = response.data.job_id;

      // Poll for job status
      const pollStatus = async () => {
        try {
          const statusResponse = await axios.get(`${API_BASE}/api/status/${jobId}`);
          const { status, analysis, error } = statusResponse.data;

          if (status === 'completed' && analysis) {
            setAnalysisResults({
              summary: analysis.summary || 'No summary provided.',
              legalCategory: analysis.legalCategory || 'Other',
              urgencyLevel: analysis.urgencyLevel || 'Low',
              riskScore: analysis.riskScore || 0,
              importantDates: analysis.importantDates || [],
              keywords: analysis.keywords || [],
              riskyClauses: analysis.riskyClauses || [],
              recommendedLawyerTypes: statusResponse.data.recommendedLawyerTypes || []
            });

            setIsProcessing(false);
            setActiveTab('results');

          } else if (status === 'failed') {
            setErrorMessage(error || 'Analysis failed');
            setIsProcessing(false);
            setActiveTab('upload');
          } else {
            // Still processing, poll again
            setTimeout(pollStatus, 2000);
          }
        } catch (err) {
          console.error('Status poll error:', err);
          setErrorMessage('Failed to check analysis status');
          setIsProcessing(false);
          setActiveTab('upload');
        }
      };

      pollStatus();

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.response?.data?.detail || 'Failed to process document. Check backend logs.');
      setIsProcessing(false);
      setActiveTab('upload');
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  // ─── UI-ONLY HELPERS ──────────────────────────────────────────────────────
  const [dragOver, setDragOver]       = useState(false);
  const [expandText, setExpandText]   = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleReset = () => {
    setActiveTab('upload');
    setAnalysisResults(null);
    setUploadedFile(null);
    setExpandText(false);
    if (inputRef.current) inputRef.current.value = '';
  };
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── PAGE HEADER ── */}
      <div className="bg-gray-900 px-8 py-7 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <FileSearch className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Document Review & Legal Analysis</h1>
            <p className="text-sm text-gray-400 mt-0.5">AI-powered OCR scanning, clause detection and key term extraction</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">

        {/* ── ERROR BANNER ── */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            UPLOAD STATE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Drop Zone */}
            <div className="lg:col-span-2">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 py-24 px-8
                  ${dragOver
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/20'}`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-amber-100' : 'bg-gray-100'}`}>
                  <Upload className={`w-7 h-7 ${dragOver ? 'text-amber-500' : 'text-gray-400'}`} />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-700">
                    {dragOver ? 'Release to analyze' : 'Drop your document here'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    or <span className="text-amber-600 font-medium">browse files</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {['PDF', 'PNG', 'JPG', 'TIFF', 'BMP'].map(f => (
                    <span key={f} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">{f}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Info Cards */}
            <div className="space-y-4">
              {[
                { Icon: FileText,  color: 'text-blue-500',    bg: 'bg-blue-50',    title: 'OCR Extraction',   desc: 'Extracts text from scanned PDFs and images using Tesseract.' },
                { Icon: Shield,    color: 'text-violet-500',  bg: 'bg-violet-50',  title: 'Clause Detection', desc: 'Identifies legal clauses — liability, termination, payment & more.' },
                { Icon: Users,     color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Key Term Mining',  desc: 'Pulls out dates, parties, and monetary amounts automatically.' },
              ].map(({ Icon, color, bg, title, desc }) => (
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

        {/* ══════════════════════════════════════════════════════════════════
            PROCESSING STATE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'processing' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-28 gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-amber-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                {isProcessing ? 'Scanning Document…' : 'Analysis Complete'}
              </p>
              <p className="text-sm text-gray-400 mt-1">Extracting text, detecting clauses & identifying key terms</p>
            </div>
            <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            RESULTS STATE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'results' && analysisResults && (
          <div className="space-y-6">

            {/* Result Header Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {uploadedFile?.name || 'Document'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {analysisResults.legalCategory} · Risk Score: {analysisResults.riskScore}/100 · {analysisResults.urgencyLevel} Urgency
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" /> New Document
              </button>
            </div>

            {/* Summary Card with Key Metrics */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Document Summary</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Category</p>
                    <p className="text-sm font-bold text-blue-700 mt-1">{analysisResults.legalCategory}</p>
                  </div>
                  <div className={`border rounded-xl p-3 text-center ${
                    analysisResults.riskScore > 70 ? 'bg-red-50 border-red-100' :
                    analysisResults.riskScore > 30 ? 'bg-amber-50 border-amber-100' :
                    'bg-emerald-50 border-emerald-100'
                  }`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${
                      analysisResults.riskScore > 70 ? 'text-red-600' :
                      analysisResults.riskScore > 30 ? 'text-amber-600' :
                      'text-emerald-600'
                    }`}>Risk Score</p>
                    <p className={`text-sm font-bold mt-1 ${
                      analysisResults.riskScore > 70 ? 'text-red-700' :
                      analysisResults.riskScore > 30 ? 'text-amber-700' :
                      'text-emerald-700'
                    }`}>{analysisResults.riskScore}/100</p>
                  </div>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-violet-600 font-semibold uppercase tracking-wide">Urgency</p>
                    <p className="text-sm font-bold text-violet-700 mt-1">{analysisResults.urgencyLevel}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto">
                  {analysisResults.summary}
                </div>
              </div>
            </div>

            {/* Important Dates & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Important Dates</span>
                </div>
                {analysisResults.importantDates?.length ? (
                  <div className="space-y-1">
                    {analysisResults.importantDates.map((date, i) => (
                      <div key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg font-medium">
                        {date}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No dates found</p>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Keywords</span>
                </div>
                {analysisResults.keywords?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResults.keywords.map((kw, i) => (
                      <span key={i} className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-lg font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No keywords found</p>
                )}
              </div>
            </div>

            {/* Risky Clauses */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                Risky Clauses
                <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full normal-case tracking-normal">
                  {analysisResults.riskyClauses?.length || 0}
                </span>
              </h3>

              {analysisResults.riskyClauses?.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {analysisResults.riskyClauses.map((clause, i) => {
                    const cfg = riskCfg[clause.riskLevel?.toLowerCase()] || riskCfg.low;
                    const RiskIcon = cfg.icon;
                    return (
                      <div key={i} className={`rounded-xl border ${cfg.ring} bg-white shadow-sm p-4`}>
                        <div className="flex items-start gap-3">
                          <RiskIcon className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.badge.split(' ')[1]}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-800">{clause.clauseType}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.badge} uppercase tracking-wide`}>
                                {clause.riskLevel}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{clause.reason}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Shield className="w-8 h-8 text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No risky clauses detected</p>
                </div>
              )}
            </div>

            {/* Recommended Lawyer Types */}
            {analysisResults.recommendedLawyerTypes && analysisResults.recommendedLawyerTypes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  Recommended Lawyers To Consult
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full normal-case tracking-normal">
                    {analysisResults.recommendedLawyerTypes.length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {analysisResults.recommendedLawyerTypes.map((lt, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-gray-700">{i + 1}.</span>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{lt.lawyer_type}</p>
                              <p className="text-xs text-gray-500">{lt.legal_domain}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-emerald-600">{lt.match_percentage}%</p>
                          <p className="text-xs text-gray-400">Match Score</p>
                        </div>
                      </div>
                      
                      {/* Matched Items */}
                      {lt.matched_items && lt.matched_items.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Detected:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {lt.matched_items.slice(0, 6).map((item, j) => (
                              <div key={j} className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                <span>{item}</span>
                              </div>
                            ))}
                            {lt.matched_items.length > 6 && (
                              <span className="text-xs text-gray-400 px-2">+{lt.matched_items.length - 6} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Key Terms Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(termCfg).map(([key, meta]) => {
                const items = analysisResults.keyTerms[key] || [];
                return (
                  <div key={key} className={`bg-white rounded-2xl border ${meta.border} shadow-sm p-5`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center`}>
                        <meta.Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{meta.label}</span>
                    </div>
                    {items.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((v, i) => (
                          <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-lg ${meta.pill}`}>{v}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">None detected</p>
                    )}
                  </div>
                );
              })}
            </div>


          </div>
        )}

      </div>
    </div>
  );
}

export default DocumentAnalysis;
