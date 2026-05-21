import React, { useState } from 'react'

const Tooltip = ({ children, content, side = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false)

  const sideClasses = {
    right: 'left-full ml-2',
    left: 'right-full mr-2',
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${sideClasses[side]} top-1/2 -translate-y-1/2`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 rotate-45 ${side === 'right' ? '-left-1 top-1/2 -translate-y-1/2' : ''}`}></div>
        </div>
      )}
    </div>
  )
}

export { Tooltip }