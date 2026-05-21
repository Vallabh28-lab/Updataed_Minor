import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Sparkline from './ui/sparkline'
import { Plus, Calendar, BarChart3, Search } from 'lucide-react'

function MainContent({ user, onNavigate }) {
  const stats = [
    { title: 'Active Cases', value: '0', change: '0%', color: 'bg-blue-500', sparklineData: [12, 19, 15, 27, 22, 18, 24], sparklineColor: '#3b82f6' },
    { title: 'Total Clients', value: '0', change: '0%', color: 'bg-green-500', sparklineData: [8, 12, 16, 14, 18, 22, 20], sparklineColor: '#10b981' },
    { title: 'Appointments Today', value: '0', change: '0', color: 'bg-yellow-500', sparklineData: [5, 8, 12, 9, 15, 11, 13], sparklineColor: '#f59e0b' },
    { title: 'Success Rate', value: '0%', change: '0%', color: 'bg-purple-500', sparklineData: [85, 88, 82, 90, 87, 92, 89], sparklineColor: '#8b5cf6' },
  ]

  const recentCases = []
  const upcomingAppointments = []
  const recentDocuments = []

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Navbar */}
      <div className="shadow-lg px-8 py-8" style={{ backgroundColor: '#040406' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-xl mr-4 shadow-lg">
              <span className="text-3xl">⚖️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Legal Case Analysis Dashboard</h1>
              <p className="text-slate-400 mt-1 font-medium">Welcome back! Here's what's happening with your legal practice today.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-sm`}>
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div className="text-right">
                    <Sparkline data={stat.sparklineData} color={stat.sparklineColor} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{stat.value}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change} from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-lg mr-3">
                    <span className="text-black text-xl">📁</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Cases</h3>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-md border border-gray-300">View All</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentCases.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No recent cases found</p>
                    <p className="text-sm text-slate-400">Start by creating your first case</p>
                  </div>
                ) : (
                  recentCases.map((case_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-500">{case_.id}</span>
                          <h4 className="font-medium text-gray-900">{case_.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{case_.type}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-lg mr-3">
                  <span className="text-black text-xl">📅</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Today's Appointments</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No appointments today</p>
                    <p className="text-sm text-slate-400">Schedule your first appointment</p>
                  </div>
                ) : (
                  upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-900">
                        {appointment.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{appointment.client}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <p className="text-xs text-gray-500">{appointment.duration}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Recent Documents</h3>
                <button className="bg-white text-black hover:bg-gray-100 text-sm font-medium px-3 py-1 rounded border border-gray-300">Upload New</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {recentDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No documents uploaded</p>
                    <p className="text-sm text-slate-400">Upload your first document</p>
                  </div>
                ) : (
                  recentDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📄</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{doc.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start h-12 text-left" size="lg">
                  <Plus className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">New Case</div>
                    <div className="text-xs text-muted-foreground">Create a new case file</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-left"
                  size="lg"
                  onClick={() => onNavigate('appointments')}
                >
                  <Calendar className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Schedule</div>
                    <div className="text-xs text-muted-foreground">Book appointment</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-left"
                  size="lg"
                  onClick={() => onNavigate('case-prediction')}
                >
                  <BarChart3 className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-muted-foreground">View case insights</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-left"
                  size="lg"
                  onClick={() => onNavigate('case-search')}
                >
                  <Search className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Search</div>
                    <div className="text-xs text-muted-foreground">Find cases & docs</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Case Performance Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-green-600">✅</span>
                </div>
                <h4 className="font-semibold text-gray-900">Cases Won</h4>
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-yellow-600">⏳</span>
                </div>
                <h4 className="font-semibold text-gray-900">Pending</h4>
                <p className="text-2xl font-bold text-yellow-600">0</p>
                <p className="text-sm text-gray-600">In progress</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-blue-600">📈</span>
                </div>
                <h4 className="font-semibold text-gray-900">Success Rate</h4>
                <p className="text-2xl font-bold text-blue-600">0%</p>
                <p className="text-sm text-gray-600">Overall</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Recent Notifications</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <p className="text-slate-500">No notifications</p>
              <p className="text-sm text-slate-400">You're all caught up!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainContent
