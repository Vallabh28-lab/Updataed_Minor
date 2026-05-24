import React, { useState, useEffect } from 'react'
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
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [showSignup, setShowSignup] = useState(false)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    try {
      return savedUser ? JSON.parse(savedUser) : null
    } catch (e) {
      return null
    }
  })
  const [currentPage, setCurrentPage] = useState('dashboard')
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
    // Set user data from backend response
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleSignup = (signupData) => {
    // Signup handled in Signup component, just switch to login
    setShowSignup(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setShowSignup(false)
    setCurrentPage('dashboard')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
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
      <div className="flex-1 flex flex-col">
        <div className="topbar p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn p-2 rounded-lg text-gray-300 hover:text-white"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
        {renderCurrentPage()}
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
              showSignup ? (
                <Signup
                  onSignup={handleSignup}
                  onSwitchToLogin={() => setShowSignup(false)}
                />
              ) : (
                <Login
                  onLogin={handleLogin}
                  onSwitchToSignup={() => setShowSignup(true)}
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
