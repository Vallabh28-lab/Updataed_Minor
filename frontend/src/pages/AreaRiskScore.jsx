import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
    ShieldAlert,
    MapPin,
    TrendingUp,
    TrendingDown,
    Clock,
    ShieldCheck,
    Locate,
    Info,
    AlertTriangle,
    History,
    Activity,
    ArrowRight,
    Database
} from 'lucide-react'

const AreaRiskScore = () => {
    const [isDetecting, setIsDetecting] = useState(true)
    const [data, setData] = useState(null)

    useEffect(() => {
        // Simulate high-precision location and risk calculation
        setTimeout(() => {
            setData({
                location: "Worli, Mumbai",
                riskScore: 42,
                riskLevel: "Moderate",
                lastUpdated: "12 mins ago",
                metrics: [
                    { label: "Crime Frequency", value: "High", trend: "up", color: "text-amber-600" },
                    { label: "Resolved Cases", value: "78%", trend: "up", color: "text-emerald-600" },
                    { label: "Recent Alerts", value: "2", trend: "down", color: "text-blue-600" },
                    { label: "Safety Index", value: "Medium", trend: "stable", color: "text-slate-600" }
                ],
                crimeBreakdown: [
                    { type: "Petty Theft", percentage: 45, count: 124 },
                    { type: "Traffic Violations", percentage: 30, count: 82 },
                    { type: "Commercial Disputes", percentage: 15, count: 41 },
                    { type: "Others", percentage: 10, count: 27 }
                ],
                trends: [
                    { period: "Last Quarter", status: "Decreasing", value: "-4%" },
                    { period: "Yearly", status: "Increasing", value: "+2%" }
                ],
                professionalRecommendation: "Standard caution advised for late-night transit. Data shows a concentration of commercial litigation in the nearby financial clusters."
            })
            setIsDetecting(false)
        }, 2000)
    }, [])

    const getRiskColor = (level) => {
        switch (level) {
            case 'Low': return 'text-emerald-600 shadow-emerald-100 bg-emerald-50'
            case 'Moderate': return 'text-amber-600 shadow-amber-100 bg-amber-50'
            case 'High': return 'text-red-600 shadow-red-100 bg-red-50'
            default: return 'text-slate-600 bg-slate-50'
        }
    }

    const getRiskBorder = (level) => {
        switch (level) {
            case 'Low': return 'border-emerald-500/20'
            case 'Moderate': return 'border-amber-500/20'
            case 'High': return 'border-red-500/20'
            default: return 'border-slate-500/20'
        }
    }

    return (
        <div className="flex-1 bg-gray-50/30 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-2 bg-black rounded-xl">
                                <ShieldAlert className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Area Risk Score <span className="text-amber-600">Detector</span></h1>
                        </div>
                        <p className="text-gray-500 font-medium">Real-time safety indexing based on historical crime frequency and regional trends.</p>
                    </div>

                    <Button
                        disabled={isDetecting}
                        className="rounded-2xl h-12 px-6 bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-sm font-bold flex items-center gap-2 group"
                        onClick={() => { setIsDetecting(true); setTimeout(() => setIsDetecting(false), 1500) }}
                    >
                        <Locate className={`w-4 h-4 ${isDetecting ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                        {isDetecting ? 'Refreshing Location...' : 'Refresh Detection'}
                    </Button>
                </div>

                {isDetecting ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="relative">
                            <div className="w-32 h-32 border-4 border-slate-100 rounded-full"></div>
                            <div className="absolute inset-0 border-t-4 border-amber-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="w-8 h-8 text-amber-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900">Calculating Regional Safety Index</h3>
                            <p className="text-slate-400 text-sm mt-1">Cross-referencing NCIB datasets with current geolocation coordinates...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Primary Score View */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-none shadow-2xl bg-white overflow-hidden relative group">
                                <div className={`absolute top-0 left-0 w-2 h-full ${getRiskColor(data.riskLevel).split(' ')[0].replace('text', 'bg')}`}></div>
                                <CardContent className="p-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <div className="flex items-center space-x-2 text-gray-400 mb-2">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-xs font-black uppercase tracking-widest leading-none">{data.location}</span>
                                            </div>
                                            <h2 className="text-4xl font-black text-gray-900 leading-tight">Current Safety <br />Environment</h2>
                                        </div>
                                        <div className={`px-6 py-3 rounded-2xl border ${getRiskBorder(data.riskLevel)} ${getRiskColor(data.riskLevel)} text-center shadow-lg transition-all group-hover:-translate-y-1`}>
                                            <p className="text-[10px] font-black uppercase tracking-tighter mb-1 opacity-70">Calculated Risk</p>
                                            <p className="text-xl font-black italic tracking-tight uppercase leading-none">{data.riskLevel}</p>
                                        </div>
                                    </div>

                                    {/* Visual Meter */}
                                    <div className="relative pt-12 pb-8 px-4">
                                        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner border border-gray-50">
                                            <div className="h-full bg-emerald-500" style={{ width: '30%' }}></div>
                                            <div className="h-full bg-amber-500" style={{ width: '40%' }}></div>
                                            <div className="h-full bg-red-500" style={{ width: '30%' }}></div>
                                        </div>

                                        {/* Marker */}
                                        <div
                                            className="absolute top-0 transition-all duration-1000 ease-out flex flex-col items-center group/marker"
                                            style={{ left: `${data.riskScore}%` }}
                                        >
                                            <div className="bg-black text-white px-3 py-1.5 rounded-xl text-xs font-black mb-2 shadow-xl ring-4 ring-white relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-black">
                                                {data.riskScore}/100
                                            </div>
                                            <div className="w-1.5 h-16 bg-black rounded-full shadow-lg group-hover/marker:scale-y-110 transition-transform"></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-12 pt-8 border-t border-gray-100 space-x-6">
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Professional Insight</p>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                                                "{data.professionalRecommendation}"
                                            </p>
                                        </div>
                                        <div className="shrink-0 flex flex-col justify-end">
                                            <p className="text-[9px] text-gray-400 font-bold italic uppercase flex items-center">
                                                <Clock className="w-3 h-3 mr-1" /> Updated {data.lastUpdated}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {data.metrics.map((metric, idx) => (
                                    <Card key={idx} className="border-none shadow-md bg-white hover:shadow-lg transition-all group cursor-default">
                                        <CardContent className="p-4 flex flex-col items-center text-center">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-2 tracking-tighter">{metric.label}</p>
                                            <p className={`text-lg font-black ${metric.color} mb-1 transition-transform group-hover:scale-110`}>{metric.value}</p>
                                            <div className="flex items-center text-[10px] font-bold text-gray-400">
                                                {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1 text-red-400" /> :
                                                    metric.trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1 text-emerald-400" /> :
                                                        <Activity className="w-3 h-3 mr-1" />}
                                                <span className="uppercase tracking-tighter leading-none">{metric.trend}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar Details */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-xl bg-gray-900 text-white overflow-hidden">
                                <CardHeader className="p-6 pb-2 border-b border-white/5 bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
                                            <Database className="w-4 h-4 mr-2 text-amber-500" /> Area Breakdown
                                        </CardTitle>
                                        <Info className="w-3 h-3 text-gray-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {data.crimeBreakdown.map((item, idx) => (
                                        <div key={idx} className="space-y-2 group">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{item.type}</span>
                                                <span className="text-gray-500 group-hover:text-amber-500 transition-colors font-black">{item.count} Cases</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-amber-600 group-hover:bg-amber-500 transition-all duration-1000"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl bg-white group cursor-pointer hover:bg-black transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-slate-100 group-hover:bg-white/10 transition-colors">
                                            <History className="w-6 h-6 text-slate-800 group-hover:text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors">Safety History</h3>
                                            <p className="text-xs text-gray-500 group-hover:text-gray-400">View local safety trends over time</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs font-bold text-gray-900 group-hover:text-amber-500 mt-4 pt-4 border-t border-gray-100 group-hover:border-white/10">
                                        Explore Archived Data <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Data Transparency Note */}
                            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100/50">
                                <div className="flex space-x-3">
                                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                                    <div>
                                        <h5 className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">Data Integrity</h5>
                                        <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                                            Scores are generated using public historical datasets. This acts as a support tool for judicial strategy and student research.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export default AreaRiskScore
