import React, { useState } from 'react'
import axios from 'axios'

const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',   flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', flag: '🇮🇳' },
]

function DocumentAnalysis() {
  const [uploadedFile, setUploadedFile]     = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [activeTab, setActiveTab]           = useState('upload')
  const [isProcessing, setIsProcessing]     = useState(false)
  const [errorMessage, setErrorMessage]     = useState(null)
  const [processingSteps, setProcessingSteps] = useState({ ocr:'waiting', keyTerms:'waiting', clauses:'waiting', risk:'waiting' })

  // Language toggle state
  const [activeLang, setActiveLang]         = useState('en')
  const [translatedText, setTranslatedText] = useState({})   // cache: { hi: '...', mr: '...' }
  const [isTranslating, setIsTranslating]   = useState(false)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploadedFile(file)
    setErrorMessage(null)
    setActiveTab('processing')
    setIsProcessing(true)
    setActiveLang('en')
    setTranslatedText({})
    setProcessingSteps({ ocr:'running', keyTerms:'waiting', clauses:'waiting', risk:'waiting' })

    const formData = new FormData()
    formData.append('document', file)

    try {
      const response = await axios.post(`${backendBaseUrl}/documents/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        setProcessingSteps({ ocr:'done', keyTerms:'running', clauses:'waiting', risk:'waiting' })
        setTimeout(() => setProcessingSteps({ ocr:'done', keyTerms:'done', clauses:'running', risk:'waiting' }), 600)
        setTimeout(() => setProcessingSteps({ ocr:'done', keyTerms:'done', clauses:'done', risk:'running' }), 1200)
        setTimeout(() => {
          setProcessingSteps({ ocr:'done', keyTerms:'done', clauses:'done', risk:'done' })
          setAnalysisResults({
            ocrText:          response.data.full_text || 'No text could be extracted.',
            keyTerms:         response.data.keyTerms || { dates:[], parties:[], monetaryAmounts:[] },
            extractedClauses: response.data.extractedClauses || [],
            templateComparison: response.data.templateComparison || []
          })
          setIsProcessing(false)
        }, 1800)
      } else {
        throw new Error(response.data.error || 'OCR failed.')
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || 'Connection timed out.')
      setIsProcessing(false)
      setActiveTab('upload')
      setUploadedFile(null)
    }
  }

  const handleLanguageSwitch = async (langCode) => {
    setActiveLang(langCode)
    if (langCode === 'en') return
    if (translatedText[langCode]) return   // already cached

    setIsTranslating(true)
    try {
      const res = await axios.post(`${backendBaseUrl}/documents/translate`, {
        text:   analysisResults.ocrText,
        target: langCode
      })
      if (res.data.success) {
        setTranslatedText(prev => ({ ...prev, [langCode]: res.data.translated_text }))
      }
    } catch (e) {
      setErrorMessage('Translation failed: ' + (e.response?.data?.error || e.message))
      setActiveLang('en')
    } finally {
      setIsTranslating(false)
    }
  }

  const displayedText = activeLang === 'en'
    ? analysisResults?.ocrText
    : (translatedText[activeLang] || null)

  const getRiskColor = (level) => ({ low:'text-green-600 bg-green-100', medium:'text-yellow-600 bg-yellow-100', high:'text-red-600 bg-red-100' }[level] || 'text-gray-600 bg-gray-100')
  const getRiskIcon  = (level) => ({ low:'✅', medium:'⚠️', high:'🚨' }[level] || 'ℹ️')

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="shadow-sm border-b border-gray-200 px-8 py-6" style={{backgroundColor:'#040406'}}>
        <div className="flex items-center mb-2">
          <span className="text-4xl mr-4">📄</span>
          <h1 className="text-3xl font-bold text-white">Document Analysis & OCR</h1>
        </div>
        <p className="text-lg text-gray-300">Upload documents for OCR conversion, key term extraction, and risk analysis</p>
      </div>

      <div className="p-8">
        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center"><span className="text-xl mr-2">❌</span><p className="font-medium text-sm">{errorMessage}</p></div>
            <button onClick={() => setErrorMessage(null)} className="text-red-900 font-bold hover:text-red-500">×</button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          {/* Tab Nav */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id:'upload',     label:'Upload Document', icon:'📤', disabled: isProcessing },
                { id:'processing', label:'OCR Processing',  icon:'⚙️', disabled: !uploadedFile },
                { id:'results',    label:'Analysis Results',icon:'📊', disabled: !analysisResults || isProcessing }
              ].map(tab => (
                <button key={tab.id} disabled={tab.disabled} onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-all ${
                    activeTab === tab.id ? 'border-blue-500 text-blue-600'
                    : tab.disabled ? 'border-transparent text-gray-300 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  <span className="mr-2">{tab.icon}</span>{tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors relative">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Document for Analysis</h3>
                  <p className="text-gray-600 mb-6">Supports PDF, JPG, PNG, and scanned documents.</p>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp" onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" />
                  <label htmlFor="file-upload"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    Choose File
                  </label>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center"><span className="mr-2">🔍</span>OCR Conversion</div>
                    <div className="flex items-center"><span className="mr-2">🎯</span>Key Term Extraction</div>
                    <div className="flex items-center"><span className="mr-2">📋</span>Clause Analysis</div>
                    <div className="flex items-center"><span className="mr-2">🌐</span>EN / HI / MR</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Tab */}
          {activeTab === 'processing' && (
            <div className="p-8">
              <div className="max-w-2xl mx-auto text-center">
                {isProcessing ? (
                  <div>
                    <div className="text-6xl mb-4 animate-spin inline-block">⚙️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Document...</h3>
                    <p className="text-gray-600 mb-6">Running OCR conversion and analyzing document content</p>
                    <div className="space-y-4 max-w-md mx-auto text-left">
                      {[
                        { key:'ocr',      label:'🔍 OCR Text Extraction' },
                        { key:'keyTerms', label:'🎯 Key Term Identification' },
                        { key:'clauses',  label:'📋 Clause Extraction' },
                        { key:'risk',     label:'⚠️ Risk Analysis' },
                      ].map(({ key, label }) => (
                        <div key={key} className={`flex items-center justify-between p-4 rounded-lg transition-all ${processingSteps[key] === 'running' ? 'bg-blue-50 font-semibold' : 'bg-gray-50'}`}>
                          <span className={processingSteps[key] === 'done' ? 'text-green-700 line-through' : 'text-gray-700'}>{label}</span>
                          {processingSteps[key] === 'running' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
                          {processingSteps[key] === 'done'    && <span className="text-green-600 font-bold">✅ Done</span>}
                          {processingSteps[key] === 'waiting' && <span className="text-gray-400 text-sm">Waiting...</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-28 h-28">
                        <svg className="w-28 h-28" viewBox="0 0 100 100">
                          <defs>
                            <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#16a34a"/>
                              <stop offset="100%" stopColor="#15803d"/>
                            </linearGradient>
                          </defs>
                          <circle cx="50" cy="50" r="50" fill="url(#successGrad)"/>
                          <circle cx="50" cy="50" r="50" fill="none" stroke="#bbf7d0" strokeWidth="1.5" opacity="0.4"/>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">File processing successful.</h3>
                    <p className="text-gray-500 mb-6">Output generated.</p>
                    <button onClick={() => setActiveTab('results')}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow">
                      View Results
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && analysisResults && (
            <div className="p-8">
              <div className="space-y-8">

                {/* OCR Text + Language Toggle */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">🔍 OCR Extracted Text</h3>

                    {/* Language Toggle Buttons */}
                    <div className="flex items-center gap-2">
                      {LANGUAGES.map(lang => (
                        <button key={lang.code} onClick={() => handleLanguageSwitch(lang.code)}
                          disabled={isTranslating}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            activeLang === lang.code
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                          } ${isTranslating && activeLang !== lang.code ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {lang.flag} {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Display */}
                  <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto shadow-inner">
                    {isTranslating ? (
                      <div className="flex items-center justify-center h-20 text-gray-400">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                        Translating...
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                        {displayedText || 'Click a language button above to translate.'}
                      </pre>
                    )}
                  </div>
                </div>

                {/* Key Terms */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Key Terms Extracted</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">📅 Dates</h4>
                      {analysisResults.keyTerms.dates.length > 0
                        ? analysisResults.keyTerms.dates.map((d, i) => <span key={i} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-2">{d}</span>)
                        : <p className="text-sm text-gray-400 italic">No dates found.</p>}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">👥 Parties</h4>
                      {analysisResults.keyTerms.parties.length > 0
                        ? analysisResults.keyTerms.parties.map((p, i) => <span key={i} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2 mb-2">{p}</span>)
                        : <p className="text-sm text-gray-400 italic">No parties found.</p>}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">💰 Amounts</h4>
                      {analysisResults.keyTerms.monetaryAmounts.length > 0
                        ? analysisResults.keyTerms.monetaryAmounts.map((a, i) => <span key={i} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm mr-2 mb-2">{a}</span>)
                        : <p className="text-sm text-gray-400 italic">No amounts found.</p>}
                    </div>
                  </div>
                </div>

                {/* Clause Analysis */}
                {analysisResults.extractedClauses.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Core Clause Analysis</h3>
                    <div className="space-y-6">
                      {analysisResults.extractedClauses.map((clause, idx) => (
                        <div key={idx} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-base">{clause.type}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${getRiskColor(clause.riskLevel)}`}>
                              {getRiskIcon(clause.riskLevel)} {clause.riskLevel.toUpperCase()} RISK
                            </span>
                          </div>
                          <div className="mb-3">
                            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Extracted Text:</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 italic">"{clause.fullText}"</p>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Risk Assessment:</h5>
                            <p className="text-sm text-gray-600">{clause.riskReason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-center space-x-4 pt-4 border-t">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow">📥 Download Report</button>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow">📧 Email Summary</button>
                  <button onClick={() => { setActiveTab('upload'); setUploadedFile(null); setAnalysisResults(null); setActiveLang('en'); setTranslatedText({}) }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow">
                    📄 Analyze New Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentAnalysis
