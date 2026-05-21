import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
    Search,
    Map as MapIcon,
    Navigation,
    Scale,
    Clock,
    AlertCircle,
    Gavel,
    BookOpen,
    MapPin,
    TrendingUp,
    Filter,
    Activity,
    ShieldCheck,
    Locate,
    History,
    FileSearch,
    ChevronRight
} from 'lucide-react'

const SmartCrimeSearch = () => {
    const [keyword, setKeyword] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState(null)
    const [currentLocation, setCurrentLocation] = useState("Detecting location...")

    useEffect(() => {
        // Simulate location detection
        setTimeout(() => {
            setCurrentLocation("South Mumbai, Maharashtra")
        }, 1500)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!keyword) return
        setIsSearching(true)

        // Dataset-driven simulation (IPC/BNS and legal keywords)
        setTimeout(() => {
            setResults({
                area: "South Mumbai District",
                stateAverageComparison: "+12%",
                historicalGrowthTrend: "+8.5% YoY",
                hotspots: [
                    { name: "Colaba Region", intensity: "Critical", section: "BNS 115 (Grievous Hurt)" },
                    { name: "Marine Drive Area", intensity: "Moderate", section: "IPC 279 (Rash Driving)" }
                ],
                patterns: [
                    { type: "Commercial Fraud", count: 18, trend: "+12%", severity: "High", section: "IPC 420 / BNS 318" },
                    { type: "Property Infringement", count: 32, trend: "-3%", severity: "Medium", section: "IPC 441 / BNS 329" },
                    { type: "Public Order Cases", count: 54, trend: "+5%", severity: "Low", section: "IPC 141 / BNS 189" },
                    { type: "Cyber Compliance", count: 24, trend: "+30%", severity: "High", section: "IT Act Sec 66" }
                ],
                insights: {
                    lawyerStrategy: "Given the high frequency of BNS 318 (Fraud) cases in this jurisdiction, emphasize procedural compliance in pre-trial arguments.",
                    studentNote: "Observations show a transition from IPC to BNS applications in recent filings. Study BNS 189 vs IPC 141 for area-specific patterns.",
                    citizenAwareness: "High-occurrence zone for commercial disputes; verify contracts under local civil-criminal intersection."
                }
            })
            setIsSearching(false)
        }, 1200)
    }

    return (
        <div className="flex-1 bg-white p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Top Header & Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="bg-amber-600 p-1.5 rounded-lg">
                                <FileSearch className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Smart Crime Search</h1>
                        </div>
                        <p className="text-gray-500 font-medium">IPC/BNS Legal Research & Location-Based Pattern Analysis</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                            <Locate className="w-4 h-4 text-amber-600 animate-pulse" />
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{currentLocation}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-tighter italic flex items-center">
                            <History className="w-3 h-3 mr-1" /> Historical Pattern Analysis Mode
                        </p>
                    </div>
                </div>

                {/* Search Engine Card */}
                <Card className="mb-10 border-none shadow-2xl bg-black text-white relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <CardContent className="p-10 relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold mb-2">Search Regional Judicial Precedents</h2>
                            <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">Enter IPC/BNS Sections or legal keywords to map crimes by district using curated historical datasets.</p>
                        </div>

                        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Scale className="w-6 h-6 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                    </div>
                                    <Input
                                        placeholder="Enter Keyword or Section (e.g., 'IPC 302', 'Bail', 'BNS 115')"
                                        className="pl-14 bg-white/5 border-white/20 text-white placeholder:text-gray-500 h-16 text-xl rounded-2xl focus:ring-2 focus:ring-amber-500/50 focus:bg-white/[0.08] transition-all"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                </div>
                                <Button className="h-16 px-10 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.3)] border-none transition-all hover:-translate-y-0.5 active:translate-y-0">
                                    <Search className="w-5 h-5 mr-2" /> ANALYZE AREA
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
                                <div className="text-center border-r border-white/5 last:border-none">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">State Benchmark</p>
                                    <p className="text-lg font-bold">Maharashtra High</p>
                                </div>
                                <div className="text-center border-r border-white/5 last:border-none">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Temporal Range</p>
                                    <p className="text-lg font-bold">2019 - 2024</p>
                                </div>
                                <div className="text-center border-r border-white/5 last:border-none">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Law Schema</p>
                                    <p className="text-lg font-bold text-amber-500">IPC + BNS Hybrid</p>
                                </div>
                                <div className="text-center border-r border-white/5 last:border-none">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Data Integrity</p>
                                    <p className="text-lg font-bold">Verified NCIB</p>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="relative">
                            <div className="w-20 h-20 border-t-4 border-amber-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-amber-600">
                                <Activity className="w-8 h-8 animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">Analyzing Judicial Heatmaps</h3>
                        <p className="text-gray-500 font-medium max-w-sm">Correlating '{keyword}' with district-wise crime datasets and public law records...</p>
                    </div>
                ) : results ? (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-10">
                        {/* Visualizer and Insights */}
                        <div className="xl:col-span-3 space-y-8">
                            {/* Heatmap Visualization Placeholder */}
                            <Card className="h-[550px] border-none shadow-xl bg-gray-50 relative overflow-hidden ring-1 ring-gray-950/5">
                                {/* Simulated Google Maps/Heatmap Layer */}
                                <div className="absolute inset-0 bg-[#f8fafc]">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]"></div>

                                    {/* Heatmap Simulation */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl"></div>

                                    {/* Markers & Interaction Overlay */}
                                    <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <Activity className="w-4 h-4 text-red-600" />
                                                    <h3 className="text-sm font-bold tracking-tight uppercase">Nearby Pattern Analysis</h3>
                                                </div>
                                                <div className="space-y-3 pb-3 border-b border-gray-100">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-500 font-medium italic">Targeted Area:</span>
                                                        <span className="font-bold">{results.area}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-500 font-medium italic">Frequency vs State Avg:</span>
                                                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{results.stateAverageComparison}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-500 font-medium italic">5-Year Growth Trend:</span>
                                                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{results.historicalGrowthTrend}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Law-Specific Hotspots</p>
                                                    <ul className="space-y-2">
                                                        {results.hotspots.map((spot, i) => (
                                                            <li key={i} className="flex items-center text-xs">
                                                                <MapPin className="w-3 h-3 mr-2 text-amber-600 shrink-0" />
                                                                <span className="font-bold truncate">{spot.name}</span>
                                                                <span className="ml-auto text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 shrink-0">{spot.intensity}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <Button className="bg-white text-gray-900 border-none shadow-lg hover:bg-gray-100 rounded-xl font-bold text-xs px-4 h-11">
                                                    <MapIcon className="w-4 h-4 mr-2" /> VIEW HEATMAP
                                                </Button>
                                                <Button className="bg-white text-gray-900 border-none shadow-lg hover:bg-gray-100 rounded-xl font-bold text-xs px-4 h-11">
                                                    <Filter className="w-4 h-4 mr-2" /> RADIUS: 10KM
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex justify-center flex-col items-center">
                                            <div className="w-20 h-20 bg-amber-600/10 rounded-full flex items-center justify-center border border-amber-600/30 mb-2">
                                                <div className="w-3 h-3 bg-amber-600 rounded-full animate-ping"></div>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 bg-white/80 px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest backdrop-blur-sm">Google Maps API (Dataset Mapping Point)</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Insights Section for Professionals */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="border-l-4 border-l-blue-600 border-none shadow-lg bg-white overflow-hidden group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-sm uppercase tracking-tight">Lawyer Strategy</h3>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed font-medium">{results.insights.lawyerStrategy}</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-amber-600 border-none shadow-lg bg-white overflow-hidden group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 group-hover:scale-110 transition-transform">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-sm uppercase tracking-tight">Student Note</h3>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed font-medium">{results.insights.studentNote}</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-slate-800 border-none shadow-lg bg-white overflow-hidden group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="p-2 bg-gray-50 rounded-lg text-gray-800 group-hover:scale-110 transition-transform">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-sm uppercase tracking-tight">Citizen Awareness</h3>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed font-medium">{results.insights.citizenAwareness}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Sidebar Stats & Patterns */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-950 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-amber-600" /> Pattern Frequency
                                </h2>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">District View</span>
                            </div>

                            <div className="space-y-4">
                                {results.patterns.map((item, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 min-w-0 mr-4">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-amber-600 transition-colors">{item.section}</p>
                                                <h4 className="font-bold text-gray-900 text-sm truncate uppercase group-hover:text-gray-950 transition-colors">{item.type}</h4>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${item.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {item.severity}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 h-12">
                                            <div className="bg-gray-50 rounded-xl p-2 text-center group-hover:bg-amber-50/50 transition-colors">
                                                <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">Cases</p>
                                                <p className="text-xs font-bold text-gray-900">{item.count}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-2 text-center group-hover:bg-amber-50/50 transition-colors">
                                                <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">Trend</p>
                                                <p className={`text-xs font-bold ${item.trend.startsWith('+') ? 'text-red-500' : 'text-green-600'}`}>{item.trend}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between group-hover:border-amber-100 transition-colors">
                                            <span className="text-[10px] font-bold text-gray-400 italic">Dataset: Public NCIB</span>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-all group-hover:text-amber-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200 mt-8 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gray-300 group-hover:bg-amber-600 transition-colors"></div>
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Legal Disclaimer</h5>
                                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                            All insights are generated from <b>historical data patterns</b> for research and strategy purposes. This tool is <b>not a crime prediction system</b> and should only be used as supportive legal literature.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <div className="bg-gray-100/50 p-8 rounded-[40px] mb-8 ring-8 ring-gray-50 group hover:scale-110 transition-transform duration-500">
                            <Gavel className="w-16 h-16 text-gray-300 group-hover:text-amber-600 transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Analyze Local Legal Patterns</h3>
                        <p className="text-gray-500 max-w-lg font-medium leading-relaxed">
                            Detect location-based historical crime patterns by entering specific IPC/BNS sections or legal keywords. Transform public datasets into actionable research.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-xl">
                            {['IPC 302', 'BNS 115', 'Financial Fraud', 'Cyber Crime', 'Property Disputes', 'Bail Applications'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setKeyword(tag)}
                                    className="px-5 py-2.5 bg-white text-gray-600 text-[11px] font-bold rounded-xl hover:bg-black hover:text-white hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 shadow-sm uppercase tracking-wider"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SmartCrimeSearch
