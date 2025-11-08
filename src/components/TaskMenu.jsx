import React, { useEffect, useRef } from 'react'
import './TaskMenu.css'

function TaskMenu({ showMenu, onClose, onEdit, onShowNotes, onMove, onDelete, availableColumns }) {
  const menuRef = useRef(null)

  useEffect(() => {
    if (showMenu && menuRef.current) {
      const firstButton = menuRef.current.querySelector('button')
      if (firstButton) {
        firstButton.focus()
      }
    }
  }, [showMenu])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showMenu) {
        onClose()
      }
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (showMenu) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu, onClose])

  if (!showMenu) return null

  return (
    <>
      <div className="menu-overlay" aria-hidden="true" />
      <div 
        className="task-menu"
        ref={menuRef}
        role="menu"
        aria-label="Task options menu"
      >
        <button
          className="menu-item"
          onClick={() => {
            onEdit()
            onClose()
          }}
          role="menuitem"
        >
          ✏️ Edit
        </button>
        <button
          className="menu-item"
          onClick={() => {
            onShowNotes()
            onClose()
          }}
          role="menuitem"
        >
          📝 Notes
        </button>
        <div className="menu-divider" />
        <div className="menu-section">
          <span className="menu-label">Move to:</span>
          {availableColumns.map(column => (
            <button
              key={column.id}
              className="menu-item"
              onClick={() => onMove(column.id)}
              role="menuitem"
            >
              → {column.title}
            </button>
          ))}
        </div>
        <div className="menu-divider" />
        <button
          className="menu-item delete"
          onClick={() => {
            onDelete()
            onClose()
          }}
          role="menuitem"
        >
          🗑️ Delete
        </button>
      </div>
    </>
  )
}

export default TaskMenu

