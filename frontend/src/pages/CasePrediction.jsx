import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Sparkles,
  FileText,
  ShieldCheck,
  AlertCircle,
  Scale,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  UploadCloud,
  CheckCircle2,
  BrainCircuit,
  Target,
  Gavel,
  History,
  X,
  Plus,
  ChevronRight
} from 'lucide-react'

const CasePrediction = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState(null)

  const [formData, setFormData] = useState({
    incidentDate: '',
    location: '',
    description: '',
    parties: '',
    damages: '',
    firFiled: 'no',
    lawyerConsulted: 'no',
    desiredOutcome: 'Compensation'
  })

  const [files, setFiles] = useState([])

  // IPC / BNS section picker state
  const [sectionQuery, setSectionQuery]     = useState('')
  const [sectionResults, setSectionResults] = useState([])
  const [addedSections, setAddedSections]   = useState([])
  const [showDropdown, setShowDropdown]     = useState(false)
  const dropdownRef = useRef(null)
  
  // Adjusted base URL fallback to point directly to your FastAPI backend server port (8000)
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSectionSearch = async (q) => {
    setSectionQuery(q)
    if (!q.trim()) { setSectionResults([]); setShowDropdown(false); return }
    try {
      const res = await fetch(`${API}/statutes/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setSectionResults(data.data || [])
      setShowDropdown(true)
    } catch (err) {
      console.error("Error fetching section search:", err)
    }
  }

  const addSection = (item) => {
    if (addedSections.find(s => s.offense === item.offense)) return
    setAddedSections(prev => [...prev, item])
    setSectionQuery('')
    setSectionResults([])
    setShowDropdown(false)
  }

  const removeSection = (offense) => setAddedSections(prev => prev.filter(s => s.offense !== offense))

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB' }))
    setFiles([...files, ...newFiles])
  }

  // Live integration logic hitting your dynamic FastAPI backend algorithms
  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setPrediction(null) // Reset old prediction visual data states
    
    try {
      const response = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          incident_date: formData.incidentDate,
          location: formData.location,
          fir_filed: formData.firFiled,
          lawyer_consulted: formData.lawyerConsulted,
          desired_outcome: formData.desiredOutcome,
          sections: addedSections.map(s => ({
            offense: s.offense,
            ipc: s.ipc,
            bns: s.bns
          }))
        })
      })

      if (!response.ok) {
        throw new Error(`Server returned error status code: ${response.status}`)
      }

      const data = await response.json()

      // Dynamically map backend JSON payload properties directly to the layout view
      // Uses incoming numerical metrics to dynamically drive style representations
      const scoreValue = data.probability_percentage ?? 50;
      let scoreColor = "bg-amber-600";
      if (scoreValue >= 70) scoreColor = "bg-emerald-600";
      else if (scoreValue < 45) scoreColor = "bg-rose-600";

      // Reformat simple text blocks into array lists if your backend handles text chunks
      const parsedInsights = Array.isArray(data.legal_reasoning) 
        ? data.legal_reasoning 
        : [data.legal_reasoning || "No detailed success vectors extracted."];

      const parsedWeaknesses = Array.isArray(data.missing_evidence) 
        ? data.missing_evidence 
        : [data.missing_evidence || "No critical dependency risks flags caught."];

      setPrediction({
        score: scoreValue,
        label: data.prediction === "ALLOWED" ? "High Probability of Success" : "Risk Vectors Detected",
        colorClass: scoreColor,
        insights: parsedInsights,
        weaknesses: parsedWeaknesses
      })

    } catch (error) {
      console.error("Failed connecting to FastAPI prediction engine:", error)
      // Clean local client fallback to keep interface responsive if connections pull a drop
      setPrediction({
        score: 50,
        label: "Calculation Error (Local Baseline)",
        colorClass: "bg-gray-600",
        insights: ["Check if your FastAPI server window terminal is actively open on port 8000."],
        weaknesses: ["Failed to handshake with prediction API endpoint."]
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-black rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Case <span className="text-blue-600">Prediction</span></h1>
          </div>
          <p className="text-gray-500 font-medium text-lg max-w-2xl">
            Quantitative analysis of success probability using deep judicial pattern recognition and evidence diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Main Intake Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl bg-gray-50 overflow-hidden ring-1 ring-gray-200">
              <CardContent className="p-10">
                <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-gray-200/50">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${activeStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {step}
                      </div>
                      {step < 3 && <div className={`w-12 h-0.5 mx-2 ${activeStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                    </div>
                  ))}
                  <div className="ml-auto text-[10px] font-black uppercase tracking-widest text-gray-400">Step {activeStep} of 3</div>
                </div>

                {activeStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center space-x-2 mb-4">
                      <History className="w-4 h-4 text-blue-600" />
                      <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Incident Background</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Date of Incident</label>
                        <Input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleInputChange} className="h-12 rounded-xl bg-white border-gray-200 font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input name="location" placeholder="City, State" value={formData.location} onChange={handleInputChange} className="h-12 pl-12 rounded-xl bg-white border-gray-200 font-medium" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description of Events</label>
                      <textarea name="description" placeholder="Describe the core legal issue..." className="w-full h-32 p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm transition-all" value={formData.description} onChange={handleInputChange} />
                    </div>

                    {/* IPC / BNS Section Picker */}
                    <div className="space-y-2" ref={dropdownRef}>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Add IPC / BNS Sections</label>
                      <div className="relative">
                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={sectionQuery}
                          onChange={e => handleSectionSearch(e.target.value)}
                          placeholder="Search offense (e.g. theft, murder, fraud...)"
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm transition-all"
                        />
                        {/* Dropdown Results */}
                        {showDropdown && sectionResults.length > 0 && (
                          <div className="absolute z-50 top-14 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                            {sectionResults.map((item, i) => (
                              <button key={i} onClick={() => addSection(item)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
                                <p className="text-xs font-bold text-gray-900">{item.offense}</p>
                                <div className="flex gap-2 mt-1">
                                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">IPC: {item.ipc}</span>
                                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">BNS: {item.bns}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {showDropdown && sectionQuery && sectionResults.length === 0 && (
                          <div className="absolute z-50 top-14 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3">
                            <p className="text-xs text-gray-400 font-medium">No matching sections found.</p>
                          </div>
                        )}
                      </div>

                      {/* Added Sections Tags */}
                      {addedSections.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {addedSections.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                              <div>
                                <p className="text-[10px] font-bold text-gray-800 leading-tight">{s.offense}</p>
                                <div className="flex gap-1 mt-0.5">
                                  <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">{s.ipc}</span>
                                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">{s.bns}</span>
                                </div>
                              </div>
                              <button onClick={() => removeSection(s.offense)} className="ml-1 text-gray-300 hover:text-red-500 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-6">
                      <Button onClick={() => setActiveStep(2)} className="h-12 px-8 bg-black hover:bg-gray-800 text-white font-bold rounded-xl flex items-center gap-2">
                        Next Phase <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center space-x-2 mb-4">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Evidence & Protocols</h3>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                      <label className="w-full text-center cursor-pointer">
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                        <div className="p-3 bg-white shadow-md rounded-xl inline-block mb-3">
                          <UploadCloud className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Upload Key Evidence</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">FIR, PHOTOS, MEDICAL REPORTS, AGREEMENTS</p>
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {files.map((file, i) => (
                          <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                              <span className="text-xs font-bold text-gray-700 truncate">{file.name}</span>
                            </div>
                            <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}><X className="w-3 h-3 text-gray-400 hover:text-red-500" /></button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">FIR Filed?</label>
                        <div className="flex gap-4">
                          {['yes', 'no'].map(opt => (
                            <button key={opt} type="button" onClick={() => setFormData({ ...formData, firFiled: opt })} className={`flex-1 h-10 rounded-lg text-xs font-black uppercase tracking-widest border transition-all ${formData.firFiled === opt ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Counsel Consulted?</label>
                        <div className="flex gap-4">
                          {['yes', 'no'].map(opt => (
                            <button key={opt} type="button" onClick={() => setFormData({ ...formData, lawyerConsulted: opt })} className={`flex-1 h-10 rounded-lg text-xs font-black uppercase tracking-widest border transition-all ${formData.lawyerConsulted === opt ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-8 flex gap-4">
                      <Button variant="outline" onClick={() => setActiveStep(1)} className="h-12 px-6 rounded-xl font-bold">Back</Button>
                      <Button onClick={() => setActiveStep(3)} className="h-12 px-8 bg-black hover:bg-gray-800 text-white font-bold rounded-xl flex-1">Finalize Assessment</Button>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center space-x-2 mb-4">
                      <Target className="w-4 h-4 text-orange-600" />
                      <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Strategic Goals</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['Compensation', 'Bail', 'Acquittal', 'Settlement', 'Injunction', 'Custody'].map(opt => (
                        <button key={opt} type="button" onClick={() => setFormData({ ...formData, desiredOutcome: opt })} className={`p-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${formData.desiredOutcome === opt ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                          {opt}
                          {formData.desiredOutcome === opt && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                    <div className="pt-10 flex gap-4">
                      <Button variant="outline" onClick={() => setActiveStep(2)} className="h-12 px-6 rounded-xl font-bold">Back</Button>
                      <Button
                        onClick={runAnalysis}
                        disabled={isAnalyzing}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl flex-1 shadow-lg active:scale-95 transition-all"
                      >
                        {isAnalyzing ? "Processing Patterns..." : "Launch AI Analysis"}
                        {!isAnalyzing && <Sparkles className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Result Dashboard / Summary */}
          <div className="space-y-6">
            {!prediction && !isAnalyzing ? (
              <Card className="border-none shadow-xl bg-gray-900 overflow-hidden group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-white text-xl font-black mb-3">Analysis Logic</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Scale, text: "Precedent Alignment Index" },
                      { icon: Gavel, text: "Judicial Discretion Mapping" },
                      { icon: Users, text: "Party Strength Variance" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center text-white/40 text-xs font-bold">
                        <item.icon className="w-4 h-4 mr-3" /> {item.text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : isAnalyzing ? (
              <Card className="border-none shadow-xl bg-white p-10 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                  <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-black uppercase tracking-widest text-sm mb-1">Synthesizing Data</h4>
                  <p className="text-gray-400 text-[10px] font-bold">Cross-referencing case outcomes...</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <Card className="border-none shadow-2xl bg-white overflow-hidden">
                  <CardHeader className={`${prediction.colorClass} text-white p-8 text-center transition-colors duration-300`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Confidence Score</p>
                    <h4 className="text-5xl font-black mb-2">{prediction.score}%</h4>
                    <p className="text-xs font-bold bg-white/20 inline-block px-3 py-1 rounded-full">{prediction.label}</p>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Success Factors</h5>
                      {prediction.insights.map((ins, i) => (
                        <div key={i} className="flex items-start text-xs font-bold text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0 mt-0.5" /> {ins}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 pt-6 border-t border-gray-50">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Vectors</h5>
                      {prediction.weaknesses.map((weak, i) => (
                        <div key={i} className="flex items-start text-xs font-bold text-gray-700">
                          <AlertCircle className="w-3.5 h-3.5 text-orange-500 mr-2 shrink-0 mt-0.5" /> {weak}
                        </div>
                      ))}
                    </div>

                    {addedSections.length > 0 && (
                      <div className="space-y-3 pt-6 border-t border-gray-50">
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied IPC / BNS Sections</h5>
                        {addedSections.map((s, i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-800 mb-1">{s.offense}</p>
                            <div className="flex gap-2">
                              <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">IPC: {s.ipc}</span>
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">BNS: {s.bns}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-200 text-gray-900 font-black uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Export Report (PDF)
                </Button>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="flex space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1 leading-none">AI Accuracy</h5>
                  <p className="text-[10px] text-blue-700 leading-relaxed font-bold leading-tight">
                    Powered by JudicialBERT Large. Results are probabilistic benchmarks for educational/triage use only.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default CasePrediction