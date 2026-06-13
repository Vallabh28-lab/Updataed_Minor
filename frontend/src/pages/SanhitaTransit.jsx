import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
    Upload, FileText, Scale, Zap, CheckCircle2, AlertTriangle,
    ArrowRight, Users, Briefcase, Sparkles, Database, Code,
    Shield, BookOpen, Search, ChevronRight, Download
} from 'lucide-react'

const SanhitaTransit = () => {
    const [mode, setMode] = useState('citizen') // 'citizen' or 'advocate'
    const [citizenInput, setCitizenInput] = useState('')
    const [citizenResults, setCitizenResults] = useState(null)
    const [advocateFile, setAdvocateFile] = useState(null)
    const [transitMatrix, setTransitMatrix] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Simulate citizen mode analysis
    const handleCitizenAnalysis = () => {
        if (!citizenInput.trim()) return
        setIsProcessing(true)
        setTimeout(() => {
            setCitizenResults({
                offenses: ['Theft', 'Criminal Breach of Trust'],
                transitedCodes: [
                    { legacy: 'Section 378 IPC', modern: 'Section 303 BNS', title: 'Theft' },
                    { legacy: 'Section 405 IPC', modern: 'Section 316 BNS', title: 'Criminal Breach of Trust' }
                ],
                explanation: "Based on your description, this incident involves unauthorized taking of property (theft) and potential misappropriation of assets by someone in a position of trust. Under the new Bharatiya Nyaya Sanhita (BNS), these offenses are covered under updated provisions.",
                evidenceChecklist: [
                    'Ownership proof of stolen/misappropriated property',
                    'Communication records (emails, messages, letters)',
                    'Witness statements',
                    'CCTV footage or photographs if available',
                    'Financial transaction records'
                ]
            })
            setIsProcessing(false)
        }, 2000)
    }

    // Simulate advocate mode document processing
    const handleAdvocateUpload = (file) => {
        if (!file) return
        setAdvocateFile(file)
        setIsProcessing(true)
        setTimeout(() => {
            setTransitMatrix([
                { 
                    legacyCode: 'Section 302 IPC', 
                    bnsCode: 'Section 101 BNS', 
                    title: 'Murder',
                    complexity: 'High',
                    modifications: 'Enhanced sentencing provisions; added digital evidence protocols',
                    notes: 'Critical statutory change in burden of proof'
                },
                { 
                    legacyCode: 'Section 420 IPC', 
                    bnsCode: 'Section 318 BNS', 
                    title: 'Cheating',
                    complexity: 'Medium',
                    modifications: 'Expanded scope to include cyber fraud',
                    notes: 'Includes online transaction fraud'
                },
                { 
                    legacyCode: 'Section 498A IPC', 
                    bnsCode: 'Section 84 BNS', 
                    title: 'Cruelty by Husband/Relatives',
                    complexity: 'Medium',
                    modifications: 'Streamlined investigation process',
                    notes: 'Faster preliminary inquiry mandated'
                }
            ])
            setIsProcessing(false)
        }, 2500)
    }

    const resetCitizen = () => {
        setCitizenInput('')
        setCitizenResults(null)
    }

    const resetAdvocate = () => {
        setAdvocateFile(null)
        setTransitMatrix(null)
    }

    return (
        <div className="flex-1 bg-gray-900 min-h-screen overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b-2 border-amber-500/20 px-8 py-8 backdrop-blur-sm shadow-2xl">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/40 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <Zap className="w-10 h-10 text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tight mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Sanhita Transit</h1>
                                <p className="text-xl text-gray-300 font-semibold tracking-wide">IPC <span className="text-amber-400 mx-2">→</span> BNS <span className="text-gray-500 mx-2">|</span> Automated Code Transformation Engine</p>
                            </div>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex items-center gap-3 bg-black/80 p-2 rounded-2xl border-2 border-white/10 shadow-2xl backdrop-blur-md">
                            <button
                                onClick={() => { setMode('citizen'); resetAdvocate(); }}
                                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 ${
                                    mode === 'citizen' 
                                        ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-2xl shadow-orange-500/60 scale-105' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Users className="w-6 h-6" />
                                <span>Citizen Mode</span>
                            </button>
                            <button
                                onClick={() => { setMode('advocate'); resetCitizen(); }}
                                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 ${
                                    mode === 'advocate' 
                                        ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-500/60 scale-105' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Briefcase className="w-6 h-6" />
                                <span>Lawyer Portal</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* ══════════════════════════════════════════════════════════════
                    CITIZEN DESK MODE
                ══════════════════════════════════════════════════════════════ */}
                {mode === 'citizen' && (
                    <div className="space-y-6">
                        {/* Input Section */}
                        <Card className="bg-gradient-to-br from-gray-900 to-black border-orange-500/30 shadow-2xl shadow-orange-500/10">
                            <CardHeader className="border-b border-orange-500/20 bg-gradient-to-r from-orange-900/20 to-transparent">
                                <CardTitle className="text-white text-2xl flex items-center gap-3">
                                    <BookOpen className="w-7 h-7 text-orange-400" />
                                    Describe Your Legal Issue
                                </CardTitle>
                                <p className="text-base text-gray-300 mt-2 leading-relaxed">Tell us what happened in your own words. Our AI will analyze your situation and identify the relevant legal provisions under the new Bharatiya Nyaya Sanhita (BNS).</p>
                            </CardHeader>
                            <CardContent className="p-8">
                                <textarea
                                    placeholder="Example: Someone stole my phone from my bag at the market yesterday. I had left it unattended for just 2 minutes while I was paying. The person was caught on CCTV camera..."
                                    className="w-full h-56 bg-black/50 border-2 border-orange-500/30 rounded-2xl p-6 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-lg leading-relaxed"
                                    value={citizenInput}
                                    onChange={(e) => setCitizenInput(e.target.value)}
                                />
                                <div className="flex justify-between items-center mt-6">
                                    <span className="text-sm text-gray-400 font-semibold">{citizenInput.length} characters</span>
                                    <Button
                                        onClick={handleCitizenAnalysis}
                                        disabled={isProcessing || !citizenInput.trim()}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-orange-500/30 transition-all"
                                    >
                                        {isProcessing ? (
                                            <>Processing Your Case...</>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5 mr-2" />
                                                Analyze My Case
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results Section */}
                        {citizenResults && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                                {/* Main Results */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Offense Badges */}
                                    <Card className="bg-gradient-to-br from-gray-900 to-black border-orange-500/30 shadow-lg">
                                        <CardHeader className="border-b border-orange-500/20">
                                            <CardTitle className="text-white text-lg flex items-center gap-3">
                                                <Shield className="w-6 h-6 text-orange-400" />
                                                Identified Legal Violations
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="flex flex-wrap gap-3">
                                                {citizenResults.offenses.map((offense, idx) => (
                                                    <div key={idx} className="px-5 py-3 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                                                        <span className="text-red-400 font-bold text-base">{offense}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Transit Codes */}
                                    <Card className="bg-gradient-to-br from-gray-900 to-black border-orange-500/30 shadow-lg">
                                        <CardHeader className="border-b border-orange-500/20">
                                            <CardTitle className="text-white text-lg flex items-center gap-3">
                                                <Code className="w-6 h-6 text-orange-400" />
                                                Applicable Legal Sections (Old → New)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-4">
                                            {citizenResults.transitedCodes.map((code, idx) => (
                                                <div key={idx} className="bg-black/50 border-2 border-orange-500/20 rounded-xl p-5">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <span className="text-sm font-mono text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg">{code.legacy}</span>
                                                        <ArrowRight className="w-5 h-5 text-orange-400" />
                                                        <span className="text-sm font-mono text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg font-bold border border-orange-500/30">{code.modern}</span>
                                                    </div>
                                                    <p className="text-base text-gray-200 font-semibold">{code.title}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Explanation */}
                                    <Card className="bg-gradient-to-br from-gray-900 to-black border-orange-500/30 shadow-lg">
                                        <CardHeader className="border-b border-orange-500/20">
                                            <CardTitle className="text-white text-lg flex items-center gap-3">
                                                <FileText className="w-6 h-6 text-orange-400" />
                                                What This Means For You
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <p className="text-gray-200 text-base leading-relaxed">{citizenResults.explanation}</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Sidebar: Evidence Checklist */}
                                <div className="space-y-6">
                                    <Card className="bg-gradient-to-br from-orange-900/20 to-black border-orange-500/40 shadow-xl">
                                        <CardHeader className="border-b border-orange-500/30">
                                            <CardTitle className="text-white text-lg flex items-center gap-3">
                                                <CheckCircle2 className="w-6 h-6 text-orange-400" />
                                                Evidence You Should Collect
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-4">
                                            {citizenResults.evidenceChecklist.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-3 text-gray-200 text-base">
                                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 shrink-0" />
                                                    <span className="leading-relaxed">{item}</span>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6 shadow-lg">
                                        <p className="text-sm text-orange-400 font-bold mb-2 uppercase tracking-wide flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            Important Notice
                                        </p>
                                        <p className="text-base text-gray-300 leading-relaxed">
                                            Gather all evidence before filing an FIR. Digital records like messages, emails, and transaction records are now admissible under BNS. Take photographs and save all documentation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    ADVOCATE PORTAL MODE
                ══════════════════════════════════════════════════════════════ */}
                {mode === 'advocate' && (
                    <div className="space-y-6">
                        {/* Upload Section */}
                        {!transitMatrix && (
                            <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-500/30 shadow-2xl shadow-blue-500/10">
                                <CardHeader className="border-b border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-transparent">
                                    <CardTitle className="text-white text-2xl flex items-center gap-3">
                                        <Database className="w-7 h-7 text-blue-400" />
                                        Professional Document Analysis
                                    </CardTitle>
                                    <p className="text-base text-gray-300 mt-2 leading-relaxed">Upload FIRs, charge sheets, legal drafts, or court documents containing IPC provisions. Our AI will automatically map them to corresponding BNS sections with detailed annotations.</p>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div
                                        onClick={() => document.getElementById('fileInput').click()}
                                        className="border-2 border-dashed border-blue-500/40 hover:border-blue-500/70 bg-blue-500/5 rounded-2xl p-16 text-center cursor-pointer transition-all group hover:bg-blue-500/10"
                                    >
                                        <Upload className="w-16 h-16 text-blue-500 group-hover:text-blue-400 mx-auto mb-6 transition-colors" />
                                        <p className="text-gray-200 font-bold text-xl mb-2">
                                            {advocateFile ? advocateFile.name : 'Click to Upload Legal Document'}
                                        </p>
                                        <p className="text-base text-gray-400">Supported: PDF, DOC, DOCX, TXT (Maximum 10MB)</p>
                                    </div>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={(e) => handleAdvocateUpload(e.target.files[0])}
                                    />
                                    {advocateFile && (
                                        <Button
                                            onClick={() => handleAdvocateUpload(advocateFile)}
                                            disabled={isProcessing}
                                            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                                        >
                                            {isProcessing ? 'Analyzing Document Structure...' : (
                                                <>
                                                    <Zap className="w-5 h-5 mr-2" />
                                                    Execute IPC → BNS Transit Scan
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Transit Matrix */}
                        {transitMatrix && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Scale className="w-7 h-7 text-blue-400" />
                                            Transit Matrix Report
                                        </h3>
                                        <p className="text-base text-gray-300 mt-2">Comprehensive IPC to BNS mapping with statutory annotations</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 py-3 text-base shadow-lg">
                                            <Download className="w-5 h-5 mr-2" />
                                            Export BNS Draft
                                        </Button>
                                        <Button onClick={resetAdvocate} className="border-2 border-blue-500/30 text-blue-300 hover:bg-blue-500/10 rounded-xl px-6 py-3 text-base font-bold">
                                            New Analysis
                                        </Button>
                                    </div>
                                </div>

                                {/* Matrix Grid */}
                                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="grid grid-cols-6 gap-px bg-blue-500/20">
                                        {['Legacy IPC Code', 'BNS Equivalent', 'Offense Title', 'Complexity', 'Key Statutory Changes', 'Legal Notes'].map((header, idx) => (
                                            <div key={idx} className="bg-gradient-to-b from-blue-900/40 to-black px-5 py-4">
                                                <span className="text-sm font-bold text-blue-300 uppercase tracking-wider">{header}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {transitMatrix.map((row, idx) => (
                                        <div key={idx} className="grid grid-cols-6 gap-px bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                                            <div className="bg-black px-5 py-5">
                                                <span className="text-sm font-mono text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">{row.legacyCode}</span>
                                            </div>
                                            <div className="bg-black px-5 py-5">
                                                <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg font-bold border-2 border-blue-500/30">{row.bnsCode}</span>
                                            </div>
                                            <div className="bg-black px-5 py-5">
                                                <span className="text-base text-gray-100 font-semibold">{row.title}</span>
                                            </div>
                                            <div className="bg-black px-5 py-5">
                                                <span className={`text-sm px-3 py-2 rounded-lg font-bold ${
                                                    row.complexity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                    row.complexity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                }`}>
                                                    {row.complexity}
                                                </span>
                                            </div>
                                            <div className="bg-black px-5 py-5">
                                                <p className="text-sm text-gray-300 leading-relaxed">{row.modifications}</p>
                                            </div>
                                            <div className="bg-black px-5 py-5">
                                                <p className="text-sm text-gray-400 italic">{row.notes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats Footer */}
                                <div className="grid grid-cols-3 gap-6">
                                    <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-500/30 shadow-lg">
                                        <CardContent className="p-6 text-center">
                                            <p className="text-4xl font-black text-white">{transitMatrix.length}</p>
                                            <p className="text-sm text-gray-300 font-bold uppercase tracking-wide mt-2">Sections Transited</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-500/30 shadow-lg">
                                        <CardContent className="p-6 text-center">
                                            <p className="text-4xl font-black text-blue-400">100%</p>
                                            <p className="text-sm text-gray-300 font-bold uppercase tracking-wide mt-2">Mapping Accuracy</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-500/30 shadow-lg">
                                        <CardContent className="p-6 text-center">
                                            <p className="text-4xl font-black text-emerald-400">Ready</p>
                                            <p className="text-sm text-gray-300 font-bold uppercase tracking-wide mt-2">Export Status</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SanhitaTransit
