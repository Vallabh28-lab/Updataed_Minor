import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
    Search,
    Scale,
    ShieldCheck,
    Ban,
    CheckCircle2,
    AlertCircle,
    Info,
    ChevronRight,
    BookOpen,
    PieChart as PieChartIcon,
    Gavel,
    ShieldAlert
} from 'lucide-react'

const KnowYourRights = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTopic, setSelectedTopic] = useState(null)

    const legalDictionary = {
        "arrest": {
            title: "Rights During Arrest",
            ipc_bns: "Section 41 (CrPC) / Section 35 (BNSS)",
            rights: [
                "Right to know the grounds of arrest.",
                "Right to inform a relative or friend immediately.",
                "Right to consult a legal practitioner of choice.",
                "Right to be produced before a magistrate within 24 hours.",
                "Right to a medical examination."
            ],
            limitations: [
                "Police cannot use more force than necessary.",
                "Women cannot be arrested after sunset and before sunrise (without special magistrate permission).",
                "Police must wear clear, visible, and legible identification."
            ],
            dos: ["Stay calm and cooperate with the procedure.", "Ask for the arrest memo.", "Sign only after reading."],
            donts: ["Do not resist physically.", "Do not make statements without a lawyer.", "Do not sign blank papers."]
        },
        "theft": {
            title: "Rights Regarding Theft Cases",
            ipc_bns: "Section 378 (IPC) / Section 303 (BNS)",
            rights: [
                "Right to file an FIR (First Information Report) immediately.",
                "Right to receive a free copy of the FIR.",
                "Right to be informed about the progress of the investigation."
            ],
            limitations: [
                "Police cannot refuse to file an FIR for a cognizable offense.",
                "Investigation must be conducted without bias or harassment."
            ],
            dos: ["Note down the details of stolen items.", "Seek witnesses if any.", "Follow up with the police station."],
            donts: ["Do not provide false information in the FIR.", "Do not take the law into your own hands."]
        },
        "search": {
            title: "Rights During Property Search",
            ipc_bns: "Section 100 (CrPC) / Section 103 (BNSS)",
            rights: [
                "Right to see the search warrant.",
                "Right to have two independent witnesses from the locality.",
                "Right to receive a list of seized items (Search Memo)."
            ],
            limitations: [
                "Search must be conducted in the presence of witnesses.",
                "Female occupants have the right to privacy during the search."
            ],
            dos: ["Ask for identify proofs of searching officers.", "Ensure witnesses are present.", "Verify the entry and exit times on the memo."],
            donts: ["Do not interfere with a legal search.", "Do not let officers enter without showing ID."]
        }
    }

    const handleSearch = (query) => {
        const term = query.toLowerCase().trim()
        for (const key in legalDictionary) {
            if (key.includes(term) || term.includes(key)) {
                return legalDictionary[key]
            }
        }
        return null
    }

    const results = searchQuery ? handleSearch(searchQuery) : null

    return (
        <div className="flex-1 bg-white p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 border border-blue-100 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Citizen Empowerment Portal
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight sm:text-5xl mb-4">
                        Know Your <span className="text-blue-600">Rights</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl font-medium">
                        Understand your legal standing in plain language. Search for keywords to see relevant IPC/BNS sections and police protocols.
                    </p>
                </div>

                {/* Search Interface */}
                <Card className="mb-12 border-none shadow-2xl bg-gray-50 overflow-hidden ring-1 ring-gray-200">
                    <CardContent className="p-8">
                        <div className="relative max-w-3xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                            <Input
                                placeholder="Try searching 'arrest', 'theft', or 'search'..."
                                className="pl-14 bg-white border-gray-200 text-gray-900 h-16 text-xl rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {["Arrest", "Theft", "Property Search", "Bail", "FIR"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    className="px-4 py-2 bg-white text-gray-500 text-xs font-bold rounded-xl border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {results ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-none shadow-lg bg-white overflow-hidden">
                                <CardHeader className="bg-blue-600 text-white p-8">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl font-black mb-1">{results.title}</CardTitle>
                                            <CardDescription className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">
                                                Reference: {results.ipc_bns}
                                            </CardDescription>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-xl">
                                            <Gavel className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                        <ShieldCheck className="w-5 h-5 mr-3 text-blue-600" /> Fundamental Rights
                                    </h3>
                                    <ul className="space-y-4">
                                        {results.rights.map((right, i) => (
                                            <li key={i} className="flex items-start bg-gray-50 p-4 rounded-xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-blue-100">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-4 shrink-0 mt-0.5" />
                                                <span className="text-gray-700 font-medium leading-relaxed">{right}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-12 h-px bg-gray-100 w-full" />

                                    <h3 className="text-lg font-bold text-gray-900 mt-10 mb-6 flex items-center">
                                        <Ban className="w-5 h-5 mr-3 text-red-600" /> Police Limitations
                                    </h3>
                                    <ul className="space-y-4">
                                        {results.limitations.map((limit, i) => (
                                            <li key={i} className="flex items-start bg-red-50/30 p-4 rounded-xl border border-red-50">
                                                <AlertCircle className="w-5 h-5 text-red-500 mr-4 shrink-0 mt-0.5" />
                                                <span className="text-gray-700 font-medium leading-relaxed">{limit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Do's and Don'ts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-none shadow-md bg-white">
                                    <CardHeader className="p-6 border-b border-gray-50">
                                        <CardTitle className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Legal Do's</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <ul className="space-y-3">
                                            {results.dos.map((item, i) => (
                                                <li key={i} className="flex items-center text-sm text-gray-600 font-medium">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 shrink-0" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className="border-none shadow-md bg-white">
                                    <CardHeader className="p-6 border-b border-gray-50">
                                        <CardTitle className="text-sm font-bold text-red-700 uppercase tracking-widest">Legal Don'ts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <ul className="space-y-3">
                                            {results.donts.map((item, i) => (
                                                <li key={i} className="flex items-center text-sm text-gray-600 font-medium">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 shrink-0" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Sidebar for Charts & Visuals */}
                        <div className="space-y-8">
                            <Card className="border-none shadow-xl bg-gray-900 text-white overflow-hidden">
                                <CardHeader className="p-6 border-b border-white/5">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
                                        <PieChartIcon className="w-4 h-4 mr-2 text-blue-400" /> Incidence Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="flex justify-center mb-8">
                                        {/* Simple CSS-based Pie Chart */}
                                        <div className="w-40 h-40 rounded-full bg-blue-600 relative overflow-hidden ring-8 ring-white/5 shadow-2xl">
                                            <div className="absolute inset-0 bg-white/20" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}></div>
                                            <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
                                                <span className="text-2xl font-black">72%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="flex items-center text-blue-400"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2" /> Awareness Level</span>
                                            <span>High</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="flex items-center text-emerald-400"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2" /> Resolution Rate</span>
                                            <span>84%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="flex items-center text-amber-400"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2" /> Complexity</span>
                                            <span>Medium</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-8 leading-relaxed font-bold italic text-center uppercase tracking-tighter">
                                        Data Aggregated from Municipal Legal Records (Last 12 Months)
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg bg-blue-50/50 border border-blue-100 p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                    <ShieldAlert className="w-16 h-16 text-blue-900" />
                                </div>
                                <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-3">Professional Tip</h4>
                                <p className="text-[11px] text-blue-700 leading-relaxed font-semibold italic">
                                    Always demand a copy of the search list or seizure memo at the end of the procedure. It is a mandatory requirement under {results.ipc_bns}.
                                </p>
                            </Card>

                            {/* Disclaimer */}
                            <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 leading-none">Legal Disclaimer</h5>
                                        <p className="text-[10px] text-gray-500 leading-relaxed font-bold leading-tight">
                                            This information is for general awareness and educational purposes only. It DOES NOT constitute legal advice. For specific cases, consult a qualified legal practitioner.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700">
                        <div className="bg-gray-50 p-10 rounded-[2.5rem] mb-8 ring-8 ring-gray-50 group hover:ring-blue-50 transition-all cursor-pointer">
                            <BookOpen className="w-20 h-20 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight italic">Legal Knowledge Base</h3>
                        <p className="text-gray-500 max-w-md font-medium leading-relaxed">
                            Empower yourself with legal knowledge. Search for common legal scenarios to find relevant laws and understand your rights.
                        </p>
                        <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-2xl">
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 max-w-xs text-left">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0"><ShieldCheck className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 uppercase leading-none mb-1">Civil Rights</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Fundamental protections under Law</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 max-w-xs text-left">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0"><BookOpen className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 uppercase leading-none mb-1">Plain Language</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Simplified legal terminology</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default KnowYourRights
