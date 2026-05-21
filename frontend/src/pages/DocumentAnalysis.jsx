import React, { useState } from 'react'

function DocumentAnalysis() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')

  // Mock OCR and analysis results
  const mockAnalysisResults = {
    ocrText: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on January 15, 2024, between TechCorp Solutions Private Limited, a company incorporated under the Companies Act, 2013 ("Company") and Rajesh Kumar Singh, an individual ("Employee").

TERMS AND CONDITIONS:

1. POSITION AND DUTIES
The Employee shall serve as Senior Software Developer and shall perform duties as assigned by the Company.

2. COMPENSATION
The Company shall pay Employee a salary of Rs. 8,50,000 per annum, payable monthly.

3. TERMINATION
Either party may terminate this agreement with 30 days written notice. Company may terminate immediately for cause including misconduct, breach of confidentiality, or poor performance.

4. CONFIDENTIALITY
Employee agrees to maintain strict confidentiality of all proprietary information and trade secrets.

5. LIABILITY
Company's liability shall be limited to the salary amount. Employee shall indemnify Company against any claims arising from Employee's actions.

6. GOVERNING LAW
This Agreement shall be governed by the laws of India and disputes shall be resolved in Mumbai courts.`,

    keyTerms: {
      dates: ['January 15, 2024'],
      parties: ['TechCorp Solutions Private Limited', 'Rajesh Kumar Singh'],
      monetaryAmounts: ['Rs. 8,50,000 per annum'],
      locations: ['Mumbai'],
      timeframes: ['30 days written notice']
    },

    extractedClauses: [
      {
        type: 'Termination',
        fullText: 'Either party may terminate this agreement with 30 days written notice. Company may terminate immediately for cause including misconduct, breach of confidentiality, or poor performance.',
        plainEnglish: 'Both you and the company can end this job with 30 days notice. However, the company can fire you immediately if you do something wrong, break confidentiality rules, or perform poorly.',
        riskLevel: 'medium',
        riskReason: 'Immediate termination clause gives company significant power'
      },
      {
        type: 'Liability',
        fullText: "Company's liability shall be limited to the salary amount. Employee shall indemnify Company against any claims arising from Employee's actions.",
        plainEnglish: 'If something goes wrong, the company only has to pay up to your salary amount. But you have to protect the company and pay for any problems you cause.',
        riskLevel: 'high',
        riskReason: 'Employee bears significant financial risk and liability'
      },
      {
        type: 'Confidentiality',
        fullText: 'Employee agrees to maintain strict confidentiality of all proprietary information and trade secrets.',
        plainEnglish: 'You must keep all company secrets and private information completely confidential.',
        riskLevel: 'low',
        riskReason: 'Standard confidentiality clause'
      },
      {
        type: 'Governing Law',
        fullText: 'This Agreement shall be governed by the laws of India and disputes shall be resolved in Mumbai courts.',
        plainEnglish: 'Indian laws apply to this contract, and any legal disputes must be handled in Mumbai courts.',
        riskLevel: 'low',
        riskReason: 'Standard jurisdiction clause for Indian companies'
      }
    ],

    templateComparison: [
      {
        clause: 'Termination',
        standard: '60-90 days notice period is more common',
        current: '30 days notice period',
        deviation: 'Shorter notice period than industry standard',
        risk: 'medium'
      },
      {
        clause: 'Liability',
        standard: 'Mutual liability limitations',
        current: 'One-sided employee liability',
        deviation: 'Employee bears disproportionate risk',
        risk: 'high'
      },
      {
        clause: 'Compensation',
        standard: 'Annual increments and bonus structure',
        current: 'Fixed salary only',
        deviation: 'No mention of increments or performance bonuses',
        risk: 'medium'
      }
    ]
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      setActiveTab('processing')
      simulateOCRProcessing(file)
    }
  }

  const simulateOCRProcessing = (file) => {
    setIsProcessing(true)
    // Simulate OCR processing time
    setTimeout(() => {
      setAnalysisResults(mockAnalysisResults)
      setIsProcessing(false)
      setActiveTab('results')
    }, 3000)
  }

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskIcon = (level) => {
    switch(level) {
      case 'low': return '✅'
      case 'medium': return '⚠️'
      case 'high': return '🚨'
      default: return 'ℹ️'
    }
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="shadow-sm border-b border-gray-200 px-8 py-6" style={{backgroundColor: '#040406'}}>
        <div className="flex items-center mb-2">
          <span className="text-4xl mr-4">📄</span>
          <h1 className="text-3xl font-bold text-white">Document Analysis & OCR</h1>
        </div>
        <p className="text-lg text-gray-300">Upload documents for OCR conversion, key term extraction, and risk analysis</p>
      </div>

      <div className="p-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'upload', label: 'Upload Document', icon: '📤' },
                { id: 'processing', label: 'OCR Processing', icon: '⚙️' },
                { id: 'results', label: 'Analysis Results', icon: '📊' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Document for Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Supports PDF, JPG, PNG, and scanned documents. Our OCR will convert images to searchable text.
                  </p>
                  
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Choose File
                  </label>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="mr-2">🔍</span>
                      OCR Conversion
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🎯</span>
                      Key Term Extraction
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📋</span>
                      Clause Analysis
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⚠️</span>
                      Risk Assessment
                    </div>
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
                    <div className="text-6xl mb-4">⚙️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Document...</h3>
                    <p className="text-gray-600 mb-6">
                      Running OCR conversion and analyzing document content
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <span className="text-blue-800">🔍 OCR Text Extraction</span>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">🎯 Key Term Identification</span>
                        <span className="text-gray-400">Waiting...</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">📋 Clause Extraction</span>
                        <span className="text-gray-400">Waiting...</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">⚠️ Risk Analysis</span>
                        <span className="text-gray-400">Waiting...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Complete!</h3>
                    <p className="text-gray-600 mb-6">
                      Document has been successfully analyzed. View results in the next tab.
                    </p>
                    <button
                      onClick={() => setActiveTab('results')}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
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
                {/* OCR Text Results */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🔍 OCR Converted Text
                  </h3>
                  <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {analysisResults.ocrText}
                    </pre>
                  </div>
                </div>

                {/* Key Terms Extraction */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🎯 Key Terms Extracted
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">📅 Dates</h4>
                      {analysisResults.keyTerms.dates.map((date, idx) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-2">
                          {date}
                        </span>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">👥 Parties</h4>
                      {analysisResults.keyTerms.parties.map((party, idx) => (
                        <span key={idx} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2 mb-2">
                          {party}
                        </span>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">💰 Amounts</h4>
                      {analysisResults.keyTerms.monetaryAmounts.map((amount, idx) => (
                        <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm mr-2 mb-2">
                          {amount}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clause Analysis */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📋 Core Clause Analysis
                  </h3>
                  <div className="space-y-6">
                    {analysisResults.extractedClauses.map((clause, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{clause.type}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(clause.riskLevel)}`}>
                            {getRiskIcon(clause.riskLevel)} {clause.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Original Text:</h5>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded italic">
                            "{clause.fullText}"
                          </p>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Plain English Summary:</h5>
                          <p className="text-sm text-gray-800">
                            {clause.plainEnglish}
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Risk Assessment:</h5>
                          <p className="text-sm text-gray-600">
                            {clause.riskReason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Template Comparison */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📊 Template Comparison
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Clause Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Standard Practice</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Current Document</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResults.templateComparison.map((comparison, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-3 px-4 font-medium text-gray-900">{comparison.clause}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{comparison.standard}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{comparison.current}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(comparison.risk)}`}>
                                {getRiskIcon(comparison.risk)} {comparison.risk.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    📥 Download Report
                  </button>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    📧 Email Summary
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('upload')
                      setUploadedFile(null)
                      setAnalysisResults(null)
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
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