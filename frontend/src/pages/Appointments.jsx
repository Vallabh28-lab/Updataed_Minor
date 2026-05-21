import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
  Calendar,
  User,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  XCircle,
  RefreshCcw,
  Eye,
  ExternalLink,
  FileText,
  CreditCard,
  Link2,
  BarChart3,
  ClipboardList,
  FolderOpen,
  FileEdit,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

function Appointments() {
  const upcomingAppointments = [
    {
      id: 1,
      lawyerName: "Adv. Priya Sharma",
      specialization: "Family Law",
      date: "2024-01-15",
      time: "10:30 AM",
      mode: "Video Call",
      status: "Confirmed",
      countdown: "2 days 3 hours",
      meetingLink: "https://meet.google.com/abc-def-ghi"
    },
    {
      id: 2,
      lawyerName: "Adv. Rajesh Kumar",
      specialization: "Corporate Law",
      date: "2024-01-18",
      time: "2:00 PM",
      mode: "Office Visit",
      status: "Pending",
      countdown: "5 days 7 hours",
      address: "123 Legal Plaza, Pune"
    }
  ]

  const features = [
    {
      id: 'docs',
      title: 'Upload Documents',
      desc: 'Upload case-related documents before your consultation for better preparation.',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'payment',
      title: 'Payment Details',
      desc: 'View consultation fees, payment status, and transaction history for each appointment.',
      icon: CreditCard,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      id: 'access',
      title: 'Easy Access',
      desc: 'Quick access to video meeting links or office addresses with one-click navigation.',
      icon: Link2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'tracking',
      title: 'Status Tracking',
      desc: 'Real-time appointment status updates: confirmed, pending, or rescheduled notifications.',
      icon: BarChart3,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ]

  const detailedInfo = [
    {
      title: 'Meeting Agenda',
      desc: 'Each appointment page shows a detailed agenda with discussion points and objectives for the consultation.',
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Required Documents',
      desc: 'View and upload all necessary documents as specified by your lawyer for the consultation.',
      icon: FolderOpen,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Consultation Notes',
      desc: 'Access post-consultation notes, action items, and follow-up recommendations from your lawyer.',
      icon: FileEdit,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ]

  return (
    <div className="flex-1 bg-[#040406] overflow-y-auto font-sans">
      {/* Hero Header */}
      <div className="relative overflow-hidden pt-12 pb-16 px-8 border-b border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              <Calendar className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              My <span className="text-amber-500">Appointments</span>
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
            Manage all your upcoming consultations and stay organized for your legal meetings.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-12">
        {/* Upcoming Consultations */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center">
              <Clock className="w-6 h-6 mr-3 text-amber-500" /> Upcoming Consultations
            </h2>
            <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
              {upcomingAppointments.length} Active Sessions
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="bg-[#0f0f13] border-white/5 overflow-hidden group hover:border-amber-500/30 transition-all duration-300 shadow-2xl">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <User className="w-7 h-7 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">{appointment.lawyerName}</h3>
                          <p className="text-sm font-medium text-gray-500">{appointment.specialization}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${appointment.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                        {appointment.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 leading-none">Date & Time</p>
                        <p className="text-sm font-bold text-gray-200">{appointment.date} • {appointment.time}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 leading-none">Meeting Mode</p>
                        <div className="flex items-center mt-1">
                          {appointment.mode === 'Video Call' ? <Video className="w-3 h-3 mr-2 text-blue-400" /> : <MapPin className="w-3 h-3 mr-2 text-amber-400" />}
                          <p className="text-sm font-bold text-gray-200">{appointment.mode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 group-peer/countdown">
                      <div className="flex items-center text-amber-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold uppercase tracking-widest">Starts in {appointment.countdown}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-500/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5">
                    <button className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all">Reschedule</button>
                    <button className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all">Cancel</button>
                    <button className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-400 hover:bg-blue-400/5 transition-all">Message</button>
                  </div>

                  {appointment.meetingLink ? (
                    <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center">
                      Join Meeting <ExternalLink className="w-4 h-4 ml-3" />
                    </button>
                  ) : (
                    <button className="w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center">
                      View Office Map <MapPin className="w-4 h-4 ml-3" />
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="pt-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Management <span className="text-amber-500">Suites</span></h2>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">Streamline your legal consultation workflow with our integrated toolsets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.id} className="border-none bg-white/5 hover:bg-white/[0.08] transition-all group overflow-hidden relative shadow-lg">
                <div className={`absolute top-0 right-0 w-16 h-16 -mr-6 -mt-6 rounded-full ${feature.bgColor} opacity-20 group-hover:scale-150 transition-transform`}></div>
                <CardContent className="p-6 border-b border-white/5 flex flex-col items-center text-center h-full">
                  <div className={`p-4 rounded-2xl ${feature.bgColor} ${feature.color} mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">{feature.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Info Section */}
        <section className="pt-8">
          <Card className="border-none bg-[#0f0f13] overflow-hidden shadow-2xl ring-1 ring-white/5">
            <CardHeader className="p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-serif text-white mb-1">Detailed Information</CardTitle>
                  <CardDescription className="text-gray-500 font-medium">Everything you need for successful legal consultations.</CardDescription>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {detailedInfo.map((item, idx) => (
                  <div key={idx} className="group cursor-default">
                    <div className="flex items-center mb-6">
                      <div className={`w-14 h-14 ${item.bgColor} ${item.color} rounded-2xl flex items-center justify-center mr-4 shadow-inner group-hover:rotate-12 transition-transform`}>
                        <item.icon className="w-7 h-7" />
                      </div>
                      <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-amber-500 transition-colors">{item.title}</h4>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Closing Tagline */}
        <div className="bg-amber-600 rounded-[2.5rem] p-12 text-black relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <ShieldCheck className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">Stay Organized & Prepared</h3>
            <p className="text-lg md:text-xl font-medium leading-relaxed mb-10 opacity-90">
              This comprehensive appointment management system helps you stay organized and fully prepared for all your legal meetings.
              With countdown timers, document management, and one-click access, you'll never miss important details.
              Everything you need is at your fingertips.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="px-10 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 shadow-2xl">Initialize Workspace</Button>
              <Button variant="outline" className="px-10 py-4 bg-transparent border-black/20 text-black hover:bg-black/5 rounded-2xl font-black uppercase tracking-widest text-[10px]">Read User Guide</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointments