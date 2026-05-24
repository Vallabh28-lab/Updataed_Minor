import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthMessage from './AuthMessage'

function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const navigate = useNavigate()

  // State handles for the Secure Forgot & Reset Password Module
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotNewPassword, setForgotNewPassword] = useState('') // Added state for input synchronization
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotStatus, setForgotStatus] = useState(null)

  // Automatic Environment API URL routing resolution
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  // Form handling logic for User Authentication
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setLoginError('Please fill in all layout fields.')
      return
    }
    
    setIsLoading(true)
    setLoginError(null)

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      })
      const data = await res.json()

      if (res.ok) {
        onLogin(data.user || { email })
        localStorage.setItem('auth_token', data.token) // Hold session safely across tabs
        navigate('/dashboard')
      } else {
        setLoginError(data.message || 'Invalid email or password structure.')
      }
    } catch (error) {
      setLoginError('Unable to reach authentication server. Verify backend connectivity.')
    } finally {
      setIsLoading(false)
    }
  }

  // Secure handler updates user credentials inside the MongoDB Collection
  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    if (!forgotEmail || !forgotNewPassword) {
      setForgotStatus({ type: 'error', text: 'Please complete all required configuration fields.' })
      return
    }

    if (forgotNewPassword.length < 6) {
      setForgotStatus({ type: 'error', text: 'Password must be at least 6 characters long.' })
      return
    }

    setForgotLoading(true)
    setForgotStatus(null)

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotEmail.trim().toLowerCase(), 
          newPassword: forgotNewPassword 
        })
      })
      const data = await res.json()

      if (res.ok) {
        setForgotStatus({ 
          type: 'success', 
          text: 'Account security record updated! Credentials rewritten successfully.' 
        })
        
        // Clear forms and slide out modal automatically on success
        setTimeout(() => {
          setShowForgot(false)
          setForgotEmail('')
          setForgotNewPassword('')
          setForgotStatus(null)
        }, 3000)
      } else {
        setForgotStatus({ type: 'error', text: data.message || 'Failed to update credentials.' })
      }
    } catch {
      setForgotStatus({ type: 'error', text: 'Network transport layer failure.' })
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <span className="text-6xl drop-shadow-sm select-none">⚖️</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          LegalAI Platform
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your digital legal case management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-xl sm:px-10 border border-gray-100">
          
          {/* Dynamic error notification display banner */}
          {loginError && (
            <div className="mb-4">
              <AuthMessage type="error" text={loginError} />
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowForgot(true)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white transition-all duration-150 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                    : 'bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 active:scale-[0.99]'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <span className="text-sm text-gray-600">
              Don't have an account yet?{' '}
              <button 
                type="button" 
                onClick={onSwitchToSignup} 
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors focus:outline-none"
              >
                Sign up here
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Production Grade Reset Password Overlay Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-100 transform transition-transform scale-100">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Reset Account Password</h3>
            <p className="text-sm text-gray-500 mb-6">
              Enter your account profile email address along with your new password choice below to overwrite the existing record.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  disabled={forgotLoading}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all disabled:bg-gray-50"
                  placeholder="yourname@legalai.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Secure Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  disabled={forgotLoading}
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all disabled:bg-gray-50"
                  placeholder="••••••••"
                />
              </div>

              {/* Status context alerts rendered inside modal framework */}
              {forgotStatus && (
                <div className="mt-2">
                  <AuthMessage type={forgotStatus.type} text={forgotStatus.text} />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  disabled={forgotLoading}
                  onClick={() => { setShowForgot(false); setForgotStatus(null); }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold text-white transition-all ${
                    forgotLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 active:scale-[0.98]'
                  }`}
                >
                  {forgotLoading ? 'Saving...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login