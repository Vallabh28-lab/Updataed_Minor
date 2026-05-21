import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Scale, Shield, Zap, Globe, Gavel, Cpu } from 'lucide-react'
import NetworkBackground from '../components/NetworkBackground'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="landing-bg relative min-h-screen overflow-hidden">
      {/* Abstract Background Pattern */}
      <NetworkBackground />

      {/* Glassy Background Gradients (Subtle White/Gray instead of Blue/Amber) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header/Nav */}
      <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-black">
            <Scale className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            LegalAI
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-white/70 hover:text-white font-medium transition-colors hidden md:block"
        >
          Sign In
        </button>
      </nav>

      {/* Main Hero Container */}
      <div className="landing-container relative z-10 flex flex-col items-center justify-center min-h-screen pt-20">
        <div className="glass-card max-w-4xl p-12 md:p-20 text-center animate-fade-in rounded-3xl border-white/20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 text-white/90 text-sm font-semibold tracking-widest uppercase animate-pulse">
            <Cpu className="w-4 h-4" />
            Next-Gen Legal Intelligence
          </div>

          <h1 className="hero-heading text-5xl md:text-7xl font-bold text-white mb-8">
            Empowering Counsel <br />
            <span className="text-white/40">with Intelligence.</span>
          </h1>

          <p className="hero-subtext text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto">
            The authoritative AI platform for elite practitioners. Accelerate research,
            predict outcomes with surgical precision, and master the complex network
            of legal precedents.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate('/login')}
              className="btn-gold px-12 py-5 rounded-xl text-lg flex items-center gap-3 w-full md:w-auto justify-center"
            >
              Get Started
              <Zap className="w-5 h-5 fill-black" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-white/10 flex flex-wrap justify-center gap-8 md:gap-16 opacity-30">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase">Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase">Global Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase">Authoritative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Minimal */}
      <footer className="footer-minimal backdrop-blur-md bg-black/40 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
          <span className="text-white/40">© 2026 LegalAI — Precise Intelligence for Counsel</span>
          <div className="flex items-center gap-4 text-white/40">
            <span className="hover:text-white transition-colors cursor-pointer">Security Protocol</span>
            <span className="text-white/10">|</span>
            <span className="hover:text-white transition-colors cursor-pointer">System Status</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing