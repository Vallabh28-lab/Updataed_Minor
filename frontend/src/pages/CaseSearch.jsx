import React, { useState } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Search, Scale, Building, Users, FileText } from 'lucide-react'

function CaseSearch() {
  const [selectedCategory, setSelectedCategory] = useState('criminal')

  const categories = {
    criminal: {
      title: 'Criminal Law',
      icon: Scale,
      color: 'bg-red-500',
      sections: [
        {
          title: 'Violent Crimes',
          cases: ['Murder', 'Attempted Murder', 'Culpable Homicide']
        },
        {
          title: 'Property Crimes', 
          cases: ['Theft', 'Burglary', 'Robbery', 'Dacoity']
        },
        {
          title: 'White-Collar Crimes',
          cases: ['Fraud', 'Money Laundering', 'Tax Evasion', 'Cybercrime']
        },
        {
          title: 'Domestic Crimes',
          cases: ['Domestic Violence', 'Assault', 'Harassment']
        }
      ]
    },
    civil: {
      title: 'Civil Law',
      icon: Building,
      color: 'bg-blue-500',
      sections: [
        {
          title: 'Property & Land',
          cases: ['Boundary disputes', 'Illegal possession', 'Inheritance conflicts']
        },
        {
          title: 'Contractual',
          cases: ['Breach of contract', 'Specific performance', 'Service agreements']
        },
        {
          title: 'Torts',
          cases: ['Defamation', 'Negligence (Medical or Professional)', 'Personal Injury']
        },
        {
          title: 'Recovery',
          cases: ['Debt recovery', 'Check bounce cases (Section 138)', 'Insurance claims']
        }
      ]
    },
    corporate: {
      title: 'Corporate & Commercial Law',
      icon: Building,
      color: 'bg-green-500',
      sections: [
        {
          title: 'Intellectual Property (IP)',
          cases: ['Patent infringement', 'Trademark violations', 'Copyright theft']
        },
        {
          title: 'Employment',
          cases: ['Wrongful termination', 'Sexual harassment at workplace (POSH)', 'Wage disputes']
        },
        {
          title: 'Compliance',
          cases: ['GST/Tax disputes', 'Mergers & Acquisitions (M&A) conflicts', 'Insolvency/Bankruptcy']
        },
        {
          title: 'Governance',
          cases: ['Shareholder disputes', 'Breach of Fiduciary Duty']
        }
      ]
    },
    constitutional: {
      title: 'Constitutional & Public Law',
      icon: Users,
      color: 'bg-purple-500',
      sections: [
        {
          title: 'Writ Wizard',
          cases: ['3-step diagnostic tool for legal remedies (Habeas Corpus, Mandamus, etc.)']
        },
        {
          title: 'Article Popovers',
          cases: ['Instant hover-to-read cards with Constitutional Articles text']
        },
        {
          title: 'Bench Analytics',
          cases: ['Visual Split View of landmark judgments with Majority vs. Dissenting opinions']
        },
        {
          title: 'Compliance Tracker',
          cases: ['Status-based timeline for PIL cases with Ordered/Pending/Complied badges']
        }
      ]
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="shadow-lg px-8 py-8" style={{backgroundColor: '#040406'}}>
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-xl mr-4 shadow-lg">
            <Search className="w-8 h-8 text-gray-900" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Case Search</h1>
            <p className="text-slate-400 mt-1 font-medium">Search and explore legal cases by category</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Category Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                <span>{category.title}</span>
              </Button>
            )
          })}
        </div>

        {/* Selected Category Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories[selectedCategory].sections.map((section, index) => (
            <Card key={index} className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 ${categories[selectedCategory].color} rounded-lg flex items-center justify-center mr-3`}>
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{section.title}</h3>
                </div>
                <div className="space-y-2">
                  {section.cases.map((caseType, caseIndex) => (
                    <div key={caseIndex} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">{caseType}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CaseSearch