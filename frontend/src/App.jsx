import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Landing from './pages/Landing'
import CaseSearch from './pages/CaseSearch'
import DocumentAnalysis from './pages/DocumentAnalysis'
import LawyerDirectory from './pages/LawyerDirectory'
import ConsultationOptions from './pages/ConsultationOptions'
import Appointments from './pages/Appointments'
import CasePrediction from './pages/CasePrediction'
import PastCases from './pages/PastCases'
import CaseStrategyInsights from './pages/CaseStrategyInsights'
import SmartCrimeSearch from './pages/SmartCrimeSearch'
import AreaRiskScore from './pages/AreaRiskScore'
import KnowYourRights from './pages/KnowYourRights'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    try {
      return savedUser ? JSON.parse(savedUser) : null
    } catch (e) {
      return null
    }
  })
  
  const [showSignup, setShowSignup] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [isAuthenticated, user])

  const handleLogin = (userData) => {
    setUser(userData.user || userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('auth_token')
  }

  // 🏛️ Master Shell Layout utilizing <Outlet /> to seamlessly inject sub-views
  const DashboardLayout = () => (
    <div className="flex h-screen bg-gray-100 w-full overflow-hidden">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Control Strip */}
        <div className="topbar p-4 bg-gray-900 flex items-center shadow-md relative z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white focus:outline-none transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>
          
          {/* Active API Status Indicator Strip (Green circle restored) */}
          <div className="ml-auto flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">System Online</span>
          </div>
        </div>

        {/* Core Sub-View Canvas Frame Component Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  )

  return (
    <Router>
      <Routes>
        {/* Public Views */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={
          !isAuthenticated ? (
            showSignup ? 
              <Signup onSignup={() => setShowSignup(false)} onSwitchToLogin={() => setShowSignup(false)} /> :
              <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />
          ) : <Navigate to="/dashboard" replace />
        } />

        {/* 🔒 Protected Internal Platform Dashboard Views (Routed Safely) */}
        <Route path="/dashboard" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}>
          <Route index element={<MainContent user={user} />} />
          <Route path="case-search" element={<CaseSearch />} />
          <Route path="document-analysis" element={<DocumentAnalysis />} />
          <Route path="lawyer-directory" element={<LawyerDirectory />} />
          <Route path="consultation-options" element={<ConsultationOptions />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="case-prediction" element={<CasePrediction />} />
          <Route path="past-cases" element={<PastCases />} />
          <Route path="strategy-insights" element={<CaseStrategyInsights />} />
          <Route path="smart-crime-search" element={<SmartCrimeSearch />} />
          <Route path="area-risk-score" element={<AreaRiskScore />} />
          <Route path="rights-panel" element={<KnowYourRights />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App