import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import './Toast.css'

function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000) // Auto-close after 4 seconds
    
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="assertive">
      <span className="toast-message">{message}</span>
      <button 
        onClick={onClose} 
        className="toast-close"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'success', 'warning', 'info']),
  onClose: PropTypes.func.isRequired
}

export default Toast

