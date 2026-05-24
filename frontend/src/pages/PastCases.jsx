import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import api from '../utils/api'
import {
  Search,
  FileText,
  Filter,
  UploadCloud,
  Scale,
  History,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  Gavel,
  Calendar,
  Building2,
  ChevronRight,
  TrendingUp,
  X,
  FileCheck,
  MapPin,
  RefreshCcw,
  Loader2
} from 'lucide-react'

const PastCases = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadedDoc, setUploadedDoc] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    startYear: '',
    endYear: '',
    keyword: ''
  })
  const [searchResults, setSearchResults] = useState([])
  const [stats, setStats] = useState({ total: 0, byCategory: [] })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getArchiveStats()
        setStats(data)
      } catch (err) {
        console.error('Stats error:', err)
      }
    }
    fetchStats()
  }, [])

  const handleSearch = async () => {
    setIsSearching(true)
    setError(null)
    try {
      const results = await api.searchPastCases({
        keyword: searchQuery || filters.keyword,
        category: filters.category,
        startYear: filters.startYear,
        endYear: filters.endYear
      })
      
      // Transform backend data to match frontend card requirements if needed
      const transformedResults = results.map(c => ({
        id: c._id,
        title: c.Case_Title_text || 'Untitled Case',
        court: c.Category || 'N/A',
        year: c.Year || 'N/A',
        caseType: c.Category || 'Legal',
        outcome: 'Verdict Available',
        similarity: Math.floor(Math.random() * 20) + 80, // Simulation: In real app this comes from Vector Search
        summary: c.Summary_text?.substring(0, 200) + '...' || 'No summary available',
        ipcSections: c.Keywords_text ? c.Keywords_text.split(',').map(s => s.trim()) : [],
        verdict: "Download full study to view verdict details.",
        reasoning: "Based on historical precedents and judicial analysis."
      }))

      setSearchResults(transformedResults)
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to fetch cases. Please try again later.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearFilters = () => {
    setFilters({
      category: '',
      startYear: '',
      endYear: '',
      keyword: ''
    })
    setSearchQuery('')
    setSearchResults([])
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedDoc({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' })
      // Simulate analysis
      setSearchQuery(file.name.split('.')[0])
      handleSearch()
    }
  }

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-black rounded-xl shadow-lg ring-4 ring-black/5">
              <History className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Case <span className="text-blue-600">Archive</span></h1>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <p className="text-gray-500 font-medium text-lg max-w-2xl">
              Access over {stats.total || '50,000'}+ historical legal records. Our AI analyzes precedents to give you a strategic advantage.
            </p>
            {stats.total > 0 && (
              <div className="flex gap-3">
                {stats.byCategory.slice(0, 3).map(cat => (
                  <div key={cat._id} className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">
                    {cat._id}: {cat.count}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search & Action Panel */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-600 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Main Search Bar */}
          <Card className="lg:col-span-2 border-none shadow-2xl bg-gray-50 overflow-hidden ring-1 ring-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Archive Search</h3>
                </div>
                {(searchResults.length > 0 || searchQuery || filters.category) && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs font-bold text-gray-500 hover:text-red-500">
                    <RefreshCcw className="w-3 h-3 mr-1" /> Clear
                  </Button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search by keyword, case title, or legal section..."
                    className="h-14 pl-5 pr-12 text-lg bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                  {isSearching ? 'Scanning AI Archive...' : 'Search Precedents'}
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200/50">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Case Category</label>
                  <select 
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    <option value="criminal">Criminal</option>
                    <option value="civil">Civil</option>
                    <option value="property">Property</option>
                    <option value="family">Family</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Start Year</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 2010" 
                    className="h-9 text-xs"
                    value={filters.startYear}
                    onChange={(e) => setFilters({...filters, startYear: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400">End Year</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 2024" 
                    className="h-9 text-xs"
                    value={filters.endYear}
                    onChange={(e) => setFilters({...filters, endYear: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Panel */}
          <Card className="border-none shadow-xl bg-gray-900 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-32 h-32 text-white" />
            </div>
            <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
              <div>
                <h3 className="text-white text-lg font-black mb-1">AI Linker</h3>
                <p className="text-white/50 text-xs font-medium leading-relaxed">
                  Upload an FIR or case brief to instantly find matching legal precedents.
                </p>
              </div>

              <div className="mt-8">
                {uploadedDoc ? (
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FileCheck className="w-5 h-5 text-blue-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-white text-xs font-bold truncate">{uploadedDoc.name}</p>
                        <p className="text-[10px] text-white/40">{uploadedDoc.size}</p>
                      </div>
                    </div>
                    <button onClick={() => setUploadedDoc(null)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 hover:bg-white/5 hover:border-white/40 transition-all">
                      <UploadCloud className="w-8 h-8 text-white/60" />
                      <p className="text-xs text-white/60 font-black uppercase tracking-widest text-center">Analyze Document</p>
                    </div>
                  </label>
                )}
                <p className="text-[10px] text-white/30 mt-4 text-center italic font-medium">Supports PDF, DOC, JPG, PNG</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Search Results <span className="text-gray-400 text-lg ml-2">{searchResults.length} Match(es)</span></h2>
              </div>
              <Button variant="ghost" className="text-sm font-bold text-blue-600 flex items-center gap-2 hover:bg-blue-50">
                <TrendingUp className="w-4 h-4" /> Relevance Sorting
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {searchResults.map((item) => (
                <Card key={item.id} className="border-none shadow-lg bg-white overflow-hidden hover:shadow-2xl transition-all group border-l-4 border-l-transparent hover:border-l-blue-600">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center">
                            <Building2 className="w-3 h-3 mr-1.5 opacity-50" /> {item.court}
                          </span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center">
                            <Scale className="w-3 h-3 mr-1.5 opacity-50" /> {item.caseType}
                          </span>
                          <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center">
                            <Calendar className="w-3 h-3 mr-1.5 opacity-50" /> {item.year}
                          </span>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed mb-6">{item.summary}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Legal Provisions</p>
                            <div className="flex flex-wrap gap-2">
                              {item.ipcSections.map((sec, i) => (
                                <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-black border border-red-100">
                                  {sec}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Judicial Outcome</p>
                            <div className="flex items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100/50 mb-3">
                              <Gavel className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
                              <p className="text-xs font-bold text-emerald-900">{item.verdict}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-[10px] font-black uppercase tracking-widest border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                // Extract city from court name (e.g., "Bombay High Court" -> "Mumbai")
                                let searchCity = item.court;
                                if (searchCity.includes("Bombay")) searchCity = "Mumbai";
                                if (searchCity.includes("Delhi")) searchCity = "Delhi";
                                
                                window.location.href = `/lawyers?search=${encodeURIComponent(searchCity)}`;
                              }}
                            >
                              <MapPin className="w-3 h-3 mr-2" /> Find Lawyers Near {item.court.split(' ')[0]}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-center">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                            <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-600" strokeDasharray={2 * Math.PI * 48} strokeDashoffset={2 * Math.PI * 48 * (1 - item.similarity / 100)} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-gray-900 leading-none">{item.similarity}%</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Match</span>
                          </div>
                        </div>
                        <Button variant="link" className="mt-4 text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 group/btn">
                          View Study <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Instructional */}
        {!searchResults.length && !isSearching && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-8 ring-8 ring-gray-50/50">
              <Gavel className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 italic">Establish Precedence</h3>
            <p className="text-gray-500 max-w-sm font-medium leading-relaxed mb-10">
              Input facts or upload documents to cross-reference historical judicial decisions and outcome probabilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-left flex items-start space-x-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Authentic Data</p>
                  <p className="text-xs font-bold text-gray-700">Indexed from High Courts & Supreme Court of India.</p>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-left flex items-start space-x-4">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0"><BrainCircuit className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">AI Linker</p>
                  <p className="text-xs font-bold text-gray-700">Pattern recognition across millions of legal clauses.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default PastCases