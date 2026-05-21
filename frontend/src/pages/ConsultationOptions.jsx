import React from 'react'

function ConsultationOptions() {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="shadow-sm border-b border-gray-200 px-8 py-6" style={{backgroundColor: '#040406'}}>
        <div className="flex items-center mb-2">
          <span className="text-4xl mr-4">💬</span>
          <h1 className="text-3xl font-bold text-white">Consultation Options</h1>
        </div>
        <p className="text-lg text-gray-300">Book free or paid consultations with qualified lawyers at your convenience.</p>
      </div>
      
      {/* Main Content */}
      <div className="p-8">
        {/* Consultation Types */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-black">Available Consultation Types</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Consultation */}
              <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-green-600 text-xl">🆓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Free Consultation</h4>
                    <p className="text-sm text-gray-600">15-minute initial consultation</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Basic legal advice</li>
                  <li>• Case assessment</li>
                  <li>• Legal guidance overview</li>
                </ul>
              </div>

              {/* Paid Consultation */}
              <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Paid Consultation</h4>
                    <p className="text-sm text-gray-600">Starting at ₹500 for 30 minutes</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Detailed legal consultation</li>
                  <li>• Document review</li>
                  <li>• Strategic planning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Features */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-black">How It Works</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Video Calls */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">📹</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Video Calls</h4>
                <p className="text-sm text-gray-600">Face-to-face consultation through secure video conferencing for better communication.</p>
              </div>

              {/* Phone Calls */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">📞</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Phone Calls</h4>
                <p className="text-sm text-gray-600">Traditional phone consultations for quick legal advice and guidance sessions.</p>
              </div>

              {/* Online Scheduling */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">📅</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Online Scheduling</h4>
                <p className="text-sm text-gray-600">Easy online booking system to schedule appointments at your preferred time.</p>
              </div>

              {/* Availability Calendar */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 text-2xl">🗓️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Availability Calendar</h4>
                <p className="text-sm text-gray-600">Real-time calendar showing lawyer availability for instant booking confirmation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-black">Consultation Duration & Pricing</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Quick Consultation</h4>
                    <p className="text-sm text-gray-600">15 minutes</p>
                  </div>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Standard Consultation</h4>
                    <p className="text-sm text-gray-600">30 minutes</p>
                  </div>
                  <span className="text-blue-600 font-semibold">₹500 - ₹1,000</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Extended Consultation</h4>
                    <p className="text-sm text-gray-600">60 minutes</p>
                  </div>
                  <span className="text-purple-600 font-semibold">₹1,000 - ₹2,500</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-black">Book Your Consultation</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Free Consultation (15 min)</option>
                    <option>Standard Consultation (30 min)</option>
                    <option>Extended Consultation (60 min)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Method</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Video Call</option>
                    <option>Phone Call</option>
                  </select>
                </div>
                
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Available Slots
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Consultation System?</h3>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Our streamlined consultation system makes it easier than ever for clients to connect with qualified lawyers quickly. 
              With flexible scheduling, multiple communication options, and transparent pricing starting at just ₹500, 
              you can get the legal guidance you need without the hassle of traditional appointment booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultationOptions