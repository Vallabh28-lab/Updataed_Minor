import React, { useState, useEffect, useRef } from 'react'
import {
  LayoutDashboard,
  Search,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  User,
  MessageCircle,
  Scale,
  BookOpen,
  Briefcase,
  BarChart3,
  Map,
  UserCheck,
  Shield
} from 'lucide-react'
import UserProfile from './UserProfile'
import { Tooltip } from './ui/tooltip'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & Analytics' },
  { id: 'case-search', label: 'Case Research', icon: Search, description: 'Legal Precedents' },
  { id: 'document-analysis', label: 'Document Review', icon: FileText, description: 'Legal Analysis' },
  { id: 'lawyer-directory', label: 'Legal Directory', icon: Users, description: 'Attorney Network' },
  { id: 'consultation-options', label: 'Consultations', icon: MessageCircle, description: 'Client Services' },
  { id: 'appointments', label: 'Calendar', icon: Calendar, description: 'Schedule Management' },
  { id: 'case-prediction', label: 'Case Analytics', icon: TrendingUp, description: 'Outcome Prediction' },
  { id: 'past-cases', label: 'Case Archive', icon: Briefcase, description: 'Historical Records' },
]

const crimeIQItems = [
  { id: 'strategy-insights', label: 'Case Strategy Insights', icon: BarChart3, description: '' },
  { id: 'smart-crime-search', label: 'Smart Crime Search', icon: Search, description: '(By Law Sections)' },
  { id: 'area-risk-score', label: 'Area Risk Score', icon: Map, description: '(Safety Index)' },
  { id: 'rights-panel', label: 'Know Your Rights', icon: Shield, description: 'Panel' },
]

function Sidebar({ user, onLogout, onNavigate, isOpen, onToggle }) {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const navRef = useRef(null)
  const buttonRefs = useRef([])

  useEffect(() => {
    const totalItems = menuItems.length + crimeIQItems.length
    const handleKeyDown = (e) => {
      if (!navRef.current?.contains(document.activeElement)) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => {
            const next = prev < totalItems - 1 ? prev + 1 : 0
            buttonRefs.current[next]?.focus()
            return next
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => {
            const next = prev > 0 ? prev - 1 : totalItems - 1
            buttonRefs.current[next]?.focus()
            return next
          })
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0) {
            let item
            if (focusedIndex < menuItems.length) {
              item = menuItems[focusedIndex]
            } else {
              item = crimeIQItems[focusedIndex - menuItems.length]
            }
            setActiveItem(item.id)
            onNavigate && onNavigate(item.id)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, onNavigate])

  return (
    <div className={`${isOpen ? 'w-72' : 'w-16'} sidebar flex flex-col h-full transition-all duration-300 shadow-lg relative z-10`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        {isOpen ? (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center mr-4 shadow-lg border border-amber-500/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">LegalAI</h1>
              <p className="text-xs text-gray-400 font-medium">AI-Powered Legal Platform</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center shadow-lg border border-amber-500/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav ref={navRef} className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
        {/* Legal Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Legal Practice</h3>
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              const isFocused = focusedIndex === index
              return (
                <li key={item.id}>
                  {!isOpen ? (
                    <Tooltip content={item.label} side="right">
                      <button
                        ref={el => buttonRefs.current[index] = el}
                        onClick={() => {
                          setActiveItem(item.id)
                          onNavigate && onNavigate(item.id)
                        }}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(-1)}
                        className={`sidebar-item w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-[180ms] ease-out cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/20 ${isActive ? 'active' : ''
                          }`}
                      >
                        <Icon className={`w-5 h-5 transition-all duration-[180ms] ease-out ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                          }`} />
                      </button>
                    </Tooltip>
                  ) : (
                    <button
                      ref={el => buttonRefs.current[index] = el}
                      onClick={() => {
                        setActiveItem(item.id)
                        onNavigate && onNavigate(item.id)
                      }}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(-1)}
                      className={`sidebar-item w-full flex items-center px-4 py-3 rounded-lg cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/20 ${isActive ? 'active' : ''
                        }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                        }`} />
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          }`}>{item.label}</div>
                        <div className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'
                          }`}>{item.description}</div>
                      </div>
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* CrimeIQ Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">CrimeIQ Analytics</h3>
          <ul className="space-y-1">
            {crimeIQItems.map((item, index) => {
              const Icon = item.icon
              const globalIndex = menuItems.length + index
              const isActive = activeItem === item.id
              const isFocused = focusedIndex === globalIndex
              return (
                <li key={item.id}>
                  {!isOpen ? (
                    <Tooltip content={item.label} side="right">
                      <button
                        ref={el => buttonRefs.current[globalIndex] = el}
                        onClick={() => {
                          setActiveItem(item.id)
                          onNavigate && onNavigate(item.id)
                        }}
                        onFocus={() => setFocusedIndex(globalIndex)}
                        onBlur={() => setFocusedIndex(-1)}
                        className={`sidebar-item w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-[180ms] ease-out cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/20 ${isActive ? 'active' : ''
                          }`}
                      >
                        <Icon className={`w-5 h-5 transition-all duration-[180ms] ease-out ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                          }`} />
                      </button>
                    </Tooltip>
                  ) : (
                    <button
                      ref={el => buttonRefs.current[globalIndex] = el}
                      onClick={() => {
                        setActiveItem(item.id)
                        onNavigate && onNavigate(item.id)
                      }}
                      onFocus={() => setFocusedIndex(globalIndex)}
                      onBlur={() => setFocusedIndex(-1)}
                      className={`sidebar-item w-full flex items-center px-4 py-3 rounded-lg cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/20 ${isActive ? 'active' : ''
                        }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                        }`} />
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          }`}>{item.label}</div>
                        <div className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'
                          }`}>{item.description}</div>
                      </div>
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <UserProfile user={user} onLogout={onLogout} isOpen={isOpen} />
    </div>
  )
}

export default Sidebar
