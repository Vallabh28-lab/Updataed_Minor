import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
    // Check local storage on startup to avoid login dropouts on reload
    return !!localStorage.getItem('auth_token')
  })
  
  const [showSignup, setShowSignup] = useState(false)
  const [showForgot, setShowForgot] = useState(false) // 🚀 Added missing conditional UI state controller
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_profile')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogin = (userData) => {
    setUser(userData.user || userData)
    setIsAuthenticated(true)
    if (userData.token) {
      localStorage.setItem('auth_token', userData.token)
    }
    localStorage.setItem('user_profile', JSON.stringify(userData.user || userData))
  }

  const handleSignup = (signupData) => {
    setShowSignup(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setShowSignup(false)
    setShowForgot(false)
    setCurrentPage('dashboard')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_profile')
  }

  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'case-search':
        return <CaseSearch />
      case 'document-analysis':
        return <DocumentAnalysis />
      case 'lawyer-directory':
        return <LawyerDirectory />
      case 'consultation-options':
        return <ConsultationOptions />
      case 'appointments':
        return <Appointments />
      case 'case-prediction':
        return <CasePrediction />
      case 'past-cases':
        return <PastCases />
      case 'strategy-insights':
        return <CaseStrategyInsights />
      case 'smart-crime-search':
        return <SmartCrimeSearch />
      case 'area-risk-score':
        return <AreaRiskScore />
      case 'rights-panel':
        return <KnowYourRights />
      default:
        return <MainContent user={user} onNavigate={handleNavigation} />
    }
  }

  const DashboardLayout = () => (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="topbar p-4 bg-gray-900 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white focus:outline-none"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              /* Handle modal/view overrides if the user is clicking across auth states */
              showSignup ? (
                <Signup
                  onSignup={handleSignup}
                  onSwitchToLogin={() => setShowSignup(false)}
                />
              ) : (
                <Login
                  onLogin={handleLogin}
                  onSwitchToSignup={() => {
                    setShowSignup(true);
                    setShowForgot(false);
                  }}
                />
              )
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App