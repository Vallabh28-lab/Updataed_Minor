import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const CATEGORY_COLORS = {
  'Violent Crimes':     { bg: 'bg-red-500',    light: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    badge: 'bg-red-100 text-red-800' },
  'Property Crimes':    { bg: 'bg-orange-500',  light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' },
  'White-Collar Crimes':{ bg: 'bg-blue-500',    light: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-800' },
  'Domestic Crimes':    { bg: 'bg-purple-500',  light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' },
  'Torts / Civil Wrongs':{ bg: 'bg-green-500',  light: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-800' },
}

const DEFAULT_COLOR = { bg: 'bg-gray-500', light: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' }

function StatuteModal({ offense, onClose }) {
  if (!offense) return null
  const color = CATEGORY_COLORS[offense.category] || DEFAULT_COLOR
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-100" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${color.badge}`}>
            {offense.category}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">{offense.offense}</h2>

        {offense.description && (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 mb-6 leading-relaxed border border-gray-100">
            {offense.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* IPC */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Older Law</p>
            <p className="text-xs text-amber-500 mb-3">Indian Penal Code (IPC)</p>
            <p className="text-2xl font-bold text-amber-700">{offense.ipc}</p>
          </div>
          {/* BNS */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">New Law</p>
            <p className="text-xs text-emerald-500 mb-3">Bharatiya Nyaya Sanhita (BNS)</p>
            <p className="text-2xl font-bold text-emerald-700">{offense.bns}</p>
          </div>
        </div>

        <button onClick={onClose}
          className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors">
          Close
        </button>
      </div>
    </div>
  )
}

function CaseSearch() {
  const [grouped, setGrouped]         = useState({})
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedOffense, setSelectedOffense] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [searching, setSearching]     = useState(false)

  useEffect(() => {
    fetch(`${API}/statutes`)
      .then(r => r.json())
      .then(d => {
        setGrouped(d.data)
        setSelectedCategory(Object.keys(d.data)[0] || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSearch = async (q) => {
    setSearchQuery(q)
    if (!q.trim()) { setSearchResults([]); return }
    setSearching(true)
    const res = await fetch(`${API}/statutes/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setSearchResults(data.data)
    setSearching(false)
  }

  const categories = Object.keys(grouped)

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="shadow-lg px-8 py-8" style={{backgroundColor: '#040406'}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-xl mr-4 shadow-lg">
              <Search className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Case Search</h1>
              <p className="text-slate-400 mt-1 font-medium">Tap any offense to view IPC & BNS sections</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search offense (e.g. theft, murder, fraud...)"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all"
          />
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mr-3"></div>
            Loading statutes...
          </div>
        ) : searchQuery ? (
          /* Search Results */
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {searching ? 'Searching...' : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((item, i) => {
                const color = CATEGORY_COLORS[item.category] || DEFAULT_COLOR
                return (
                  <div key={i} onClick={() => setSelectedOffense(item)}
                    className={`p-4 rounded-xl border ${color.border} ${color.light} cursor-pointer hover:shadow-md transition-all`}>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.badge} mb-2 inline-block`}>{item.category}</span>
                    <p className="text-sm font-semibold text-gray-900">{item.offense}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{item.ipc}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{item.bns}</span>
                    </div>
                  </div>
                )
              })}
              {!searching && searchResults.length === 0 && (
                <p className="text-gray-400 italic col-span-3">No matching offenses found.</p>
              )}
            </div>
          </div>
        ) : (
          /* Category Browse */
          <div>
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => {
                const color = CATEGORY_COLORS[cat] || DEFAULT_COLOR
                return (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      selectedCategory === cat
                        ? `${color.bg} text-white border-transparent shadow`
                        : `bg-white text-gray-600 border-gray-200 hover:border-gray-400`
                    }`}>
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Offense Cards */}
            {selectedCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(grouped[selectedCategory] || []).map((item, i) => {
                  const color = CATEGORY_COLORS[selectedCategory] || DEFAULT_COLOR
                  return (
                    <div key={i} onClick={() => setSelectedOffense({ ...item, category: selectedCategory })}
                      className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                      <div className={`w-8 h-8 ${color.bg} rounded-lg flex items-center justify-center mb-3`}>
                        <span className="text-white text-sm font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-3 group-hover:text-gray-700">{item.offense}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">IPC: {item.ipc}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">BNS: {item.bns}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-3 group-hover:text-blue-500 transition-colors">Tap to view details →</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <StatuteModal offense={selectedOffense} onClose={() => setSelectedOffense(null)} />
    </div>
  )
}

export default CaseSearch
