import React, { useState, useEffect } from 'react';
import LegalMap from '../components/LegalMap';

function LawyerDirectory() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="flex-1 bg-[#F8FAFC] overflow-y-auto">
      {/* Professional Header */}
      <div className="relative shadow-lg border-b border-slate-800 px-10 py-10" style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-3">
              <div className="p-3 bg-blue-600/20 rounded-xl mr-5 backdrop-blur-sm border border-blue-500/30">
                <span className="text-4xl">⚖️</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Legal Advisory <span className="text-blue-400">Network</span>
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl font-medium leading-relaxed">
              Discover verified legal professionals near you using our intelligent location-based search.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-3">
            <div className="px-4 py-2 bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700">
              <span className="text-slate-400 text-xs block uppercase tracking-widest font-bold mb-1">Network Status</span>
              <span className="text-green-400 font-semibold flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live Feed Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1600px] mx-auto p-8">
        {/* Status Alerts */}
        {error && (
          <div className="mb-8 p-5 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 rounded-xl flex items-center shadow-sm">
            <span className="text-2xl mr-4">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Interactive Map (8/12) */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center uppercase tracking-wider">
                  <span className="mr-3 text-blue-600">🗺️</span> Interactive Map System
                </h3>
              </div>
              <div className="p-4">
                <LegalMap />
              </div>
            </div>
          </div>

          {/* Right Column: Info Panel (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-6">
                How to Use
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Find Location</h4>
                    <p className="text-sm text-slate-600">Click "Find Nearby Lawyers" to use GPS</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <h4 className="font-bold text-slate-900">View Map</h4>
                    <p className="text-sm text-slate-600">Map centers on your location</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📌</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Click Markers</h4>
                    <p className="text-sm text-slate-600">View lawyer details and phone numbers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Adjust Radius</h4>
                    <p className="text-sm text-slate-600">Select 1KM, 3KM, or 5KM search area</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Card */}
            <div className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-white/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-4 flex items-center tracking-wider">
                  <span className="mr-3 text-blue-400">🛡️</span> LEGAL COMPLIANCE
                </h4>
                <p className="text-sm text-slate-300 leading-7 font-medium">
                  All listed professionals are verified against national bar association standards. Our intelligent discovery system ensures optimal match results based on proximity and legal specializations.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol 4.2 Secured</span>
                  <span className="text-blue-400 text-xs font-black cursor-pointer hover:underline uppercase tracking-widest">Inquiry →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LawyerDirectory;