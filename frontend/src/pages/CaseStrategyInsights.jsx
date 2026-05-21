import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import {
    ShieldCheck,
    Upload,
    FolderTree,
    BarChart4,
    TrendingUp,
    BrainCircuit,
    AlertTriangle,
    FileOutput,
    Target,
    ArrowRight
} from 'lucide-react'

const CaseStrategyInsights = () => {
    const strategyFeatures = [
        {
            title: "Upload & Store Evidence",
            description: "Securely upload and manage all case evidence in one place — organized, searchable, and insight-ready.",
            icon: Upload,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            tag: "Secure Storage"
        },
        {
            title: "Evidence Categorization",
            description: "Automatically categorize evidence by type, stage, and strength to instantly understand its legal impact.",
            icon: FolderTree,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            tag: "AI Classification"
        },
        {
            title: "Evidence–Outcome Insights",
            description: "See how each type of evidence has performed in similar past cases to guide strategic decisions.",
            icon: BarChart4,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            tag: "Predictive Data"
        },
        {
            title: "Evidence Strength Score",
            description: "Get a data-driven strength score for every piece of evidence based on timelines, completeness, and historical outcomes.",
            icon: TrendingUp,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            tag: "Reliability Index"
        },
        {
            title: "Combined Evidence Insight",
            description: "Understand how multiple evidences work together to increase or weaken overall case success probability.",
            icon: BrainCircuit,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            tag: "Correlative Analysis"
        },
        {
            title: "Evidence Gaps & Red Flags",
            description: "Identify missing, weak, or delayed evidence that could affect case outcomes before entering court.",
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            tag: "Risk Assessment"
        },
        {
            title: "Court-Ready Export",
            description: "Generate court-ready evidence reports, indexes, and bundles with built-in analytical summaries.",
            icon: FileOutput,
            color: "text-slate-700",
            bgColor: "bg-slate-100",
            tag: "Legal Compliance"
        },
        {
            title: "Strategic Case Advantage",
            description: "Turn raw evidence into actionable legal insights that support stronger arguments and smarter case strategies.",
            icon: Target,
            color: "text-amber-800",
            bgColor: "bg-amber-100",
            tag: "Winning Strategy"
        }
    ]

    return (
        <div className="flex-1 bg-gray-50/50 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-4 border border-amber-100 uppercase tracking-wider">
                        <Target className="w-3 h-3 mr-1" /> Professional Strategist View
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                        Case Strategy <span className="text-amber-600">Insights</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl font-medium leading-relaxed">
                        This section transforms raw legal evidence into clear, data-backed insights that help lawyers build stronger cases.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {strategyFeatures.map((feature, index) => (
                        <Card key={index} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${feature.bgColor} opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>

                            <CardContent className="p-6 relative z-10">
                                <div className={`${feature.bgColor} ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        {feature.tag}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                    {feature.description}
                                </p>

                                <button className="flex items-center text-xs font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                                    Open Module <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Call to Action Section */}
                <div className="bg-black rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl border border-gray-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-bold mb-4">Ready to build your winning strategy?</h2>
                        <p className="text-gray-400 mb-8 text-lg font-light leading-relaxed">
                            Our AI engine is processing over 26,000 legal precedents to provide you with the most accurate strength scores and evidence outcomes available in modern legal practice.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all shadow-lg flex items-center">
                                Initialize Case Analysis <Target className="w-4 h-4 ml-2" />
                            </button>
                            <button className="px-6 py-3 bg-transparent border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all flex items-center">
                                Review Evidence Guide <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaseStrategyInsights
