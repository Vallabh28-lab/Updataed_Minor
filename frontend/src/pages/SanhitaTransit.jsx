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
            <div className="bg-black/40 border-b border-white/5 px-8 py-6 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight">Sanhita Transit</h1>
                                <p className="text-sm text-gray-400 font-medium">IPC → BNS Automated Code Transformation Engine</p>
                            </div>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
                            <button
                                onClick={() => { setMode('citizen'); resetAdvocate(); }}
                                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                                    mode === 'citizen' 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Users className="w-4 h-4" />
                                Citizen Desk
                            </button>
                            <button
                                onClick={() => { setMode('advocate'); resetCitizen(); }}
                                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                                    mode === 'advocate' 
                                        ? 'bg-amber-600 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Briefcase className="w-4 h-4" />
                                Advocate Portal
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
                        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
                            <CardHeader className="border-b border-gray-700 bg-gray-800/50">
                                <CardTitle className="text-white flex items-center gap-3">
                                    <BookOpen className="w-5 h-5 text-blue-400" />
                                    Describe Your Incident
                                </CardTitle>
                                <p className="text-sm text-gray-400 mt-1">Tell us what happened in plain language. Our AI will identify applicable laws.</p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <textarea
                                    placeholder="Example: Someone stole my phone from my bag at the market yesterday. I had left it unattended for just 2 minutes while I was paying..."
                                    className="w-full h-48 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                                    value={citizenInput}
                                    onChange={(e) => setCitizenInput(e.target.value)}
                                />
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs text-gray-500 font-medium">{citizenInput.length} characters</span>
                                    <Button
                                        onClick={handleCitizenAnalysis}
                                        disabled={isProcessing || !citizenInput.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl"
                                    >
                                        {isProcessing ? (
                                            <>Processing...</>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                Analyze Incident
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
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardHeader className="border-b border-gray-700">
                                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-blue-400" />
                                                IDENTIFIED OFFENSES
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="flex flex-wrap gap-3">
                                                {citizenResults.offenses.map((offense, idx) => (
                                                    <div key={idx} className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                        <span className="text-red-400 font-bold text-sm">{offense}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Transit Codes */}
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardHeader className="border-b border-gray-700">
                                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                                <Code className="w-4 h-4 text-amber-400" />
                                                LEGAL CODES (TRANSITED)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-4">
                                            {citizenResults.transitedCodes.map((code, idx) => (
                                                <div key={idx} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">{code.legacy}</span>
                                                        <ArrowRight className="w-4 h-4 text-amber-400" />
                                                        <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded font-bold">{code.modern}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-300 font-medium">{code.title}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Explanation */}
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardHeader className="border-b border-gray-700">
                                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-emerald-400" />
                                                PLAIN LANGUAGE EXPLANATION
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <p className="text-gray-300 leading-relaxed">{citizenResults.explanation}</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Sidebar: Evidence Checklist */}
                                <div className="space-y-6">
                                    <Card className="bg-gradient-to-br from-emerald-900/20 to-gray-800 border-emerald-500/30">
                                        <CardHeader className="border-b border-emerald-500/20">
                                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                EVIDENCE CHECKLIST
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-3">
                                            {citizenResults.evidenceChecklist.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                        <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-wide">Pro Tip</p>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            Gather all evidence before filing an FIR. Digital records like messages and emails are now admissible under BNS.
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
                            <Card className="bg-gray-800 border-gray-700 shadow-2xl">
                                <CardHeader className="border-b border-gray-700 bg-gray-800/50">
                                    <CardTitle className="text-white flex items-center gap-3">
                                        <Database className="w-5 h-5 text-amber-400" />
                                        Document Upload & Transit Scan
                                    </CardTitle>
                                    <p className="text-sm text-gray-400 mt-1">Upload FIRs, legal drafts, or police briefs containing IPC sections for instant BNS mapping.</p>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div
                                        onClick={() => document.getElementById('fileInput').click()}
                                        className="border-2 border-dashed border-gray-600 hover:border-amber-500 rounded-xl p-12 text-center cursor-pointer transition-all group"
                                    >
                                        <Upload className="w-12 h-12 text-gray-500 group-hover:text-amber-400 mx-auto mb-4 transition-colors" />
                                        <p className="text-gray-300 font-bold mb-1">
                                            {advocateFile ? advocateFile.name : 'Click to upload or drag & drop'}
                                        </p>
                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT (Max 10MB)</p>
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
                                            className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl"
                                        >
                                            {isProcessing ? 'Scanning Document...' : (
                                                <>
                                                    <Zap className="w-4 h-4 mr-2" />
                                                    Execute Transit Scan
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
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Scale className="w-5 h-5 text-amber-400" />
                                            Transit Matrix Generated
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1">Side-by-side IPC to BNS mapping with statutory changes</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button className="bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export BNS Draft
                                        </Button>
                                        <Button onClick={resetAdvocate} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl">
                                            New Document
                                        </Button>
                                    </div>
                                </div>

                                {/* Matrix Grid */}
                                <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                                    <div className="grid grid-cols-6 gap-px bg-gray-700">
                                        {['Legacy IPC', 'BNS Code', 'Title', 'Complexity', 'Key Modifications', 'Notes'].map((header, idx) => (
                                            <div key={idx} className="bg-gray-900 px-4 py-3">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{header}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {transitMatrix.map((row, idx) => (
                                        <div key={idx} className="grid grid-cols-6 gap-px bg-gray-700 hover:bg-gray-600/50 transition-colors">
                                            <div className="bg-gray-800 px-4 py-4">
                                                <span className="text-xs font-mono text-gray-300 bg-gray-900 px-2 py-1 rounded">{row.legacyCode}</span>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-4">
                                                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded font-bold">{row.bnsCode}</span>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-4">
                                                <span className="text-sm text-gray-200 font-medium">{row.title}</span>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                                    row.complexity === 'High' ? 'bg-red-500/20 text-red-400' :
                                                    row.complexity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-emerald-500/20 text-emerald-400'
                                                }`}>
                                                    {row.complexity}
                                                </span>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-4">
                                                <p className="text-xs text-gray-400">{row.modifications}</p>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-4">
                                                <p className="text-xs text-gray-500 italic">{row.notes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats Footer */}
                                <div className="grid grid-cols-3 gap-4">
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-black text-white">{transitMatrix.length}</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-1">Sections Transited</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-black text-amber-400">100%</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-1">Mapping Accuracy</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-black text-emerald-400">Ready</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-1">Export Status</p>
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
