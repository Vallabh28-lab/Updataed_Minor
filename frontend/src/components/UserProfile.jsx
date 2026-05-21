import React from 'react'
import { User } from 'lucide-react'

function UserProfile({ user, onLogout, isOpen }) {
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
  }

  const getProfessionLabel = (profession) => {
    const labels = {
      'lawyer': 'Lawyer',
      'practitioner': 'Law Practitioner', 
      'student': 'Law Student',
      'citizen': 'Citizen'
    }
    return labels[profession] || profession
  }

  return (
    <div className="p-4 border-t border-gray-700">
      {isOpen ? (
        <>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-semibold">{getInitials(user?.name || 'Vallabh Sardesai')}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'Vallabh Sardesai'}</p>
              <p className="text-xs text-gray-400">{getProfessionLabel(user?.profession || 'practitioner')}</p>
              {user?.age && <p className="text-xs text-gray-500">Age: {user.age}</p>}
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full text-left text-xs text-gray-400 hover:text-white transition-colors py-1"
            >
              🚪 Sign Out
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">{getInitials(user?.name || 'Vallabh Sardesai')}</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              🚪
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserProfile
