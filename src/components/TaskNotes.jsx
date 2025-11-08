import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './TaskNotes.css'

function TaskNotes({ task, onUpdate, onClose }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      )
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="notes-modal" role="dialog" aria-labelledby="notes-title" aria-modal="true">
      <div 
        className="notes-overlay" 
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div className="notes-content">
        <div className="notes-header">
          <h3 id="notes-title">Notes</h3>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close notes dialog"
          >
            ×
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={task.notes || ''}
          onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
          placeholder="Add notes to this task..."
          className="notes-textarea"
          rows="6"
          aria-label="Task notes"
        />
      </div>
    </div>
  )
}

TaskNotes.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    notes: PropTypes.string
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default React.memo(TaskNotes)

