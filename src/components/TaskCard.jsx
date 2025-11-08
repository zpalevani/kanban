import React, { useState } from 'react'
import './TaskCard.css'

function TaskCard({ task, onUpdate, onDelete, onMove, onToggleComplete, availableColumns }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showNotes, setShowNotes] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim() })
      setIsEditing(false)
    }
  }

  const handleMove = (columnId) => {
    onMove(task.id, columnId)
    setShowMenu(false)
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') {
                setEditTitle(task.title)
                setIsEditing(false)
              }
            }}
            className="task-edit-input"
            autoFocus
          />
        ) : (
          <div className="task-content">
            <label className="task-checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
              />
              <span className="task-title" onClick={() => setIsEditing(true)}>
                {task.title}
              </span>
            </label>
          </div>
        )}
        <div className="task-menu-container">
          <button
            className="task-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Task menu"
          >
            ⋮
          </button>
          {showMenu && (
            <>
              <div className="menu-overlay" onClick={() => setShowMenu(false)} />
              <div className="task-menu">
                <button
                  className="menu-item"
                  onClick={() => {
                    setIsEditing(true)
                    setShowMenu(false)
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="menu-item"
                  onClick={() => {
                    setShowNotes(true)
                    setShowMenu(false)
                  }}
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
                      onClick={() => handleMove(column.id)}
                    >
                      → {column.title}
                    </button>
                  ))}
                </div>
                <div className="menu-divider" />
                <button
                  className="menu-item delete"
                  onClick={() => {
                    onDelete(task.id)
                    setShowMenu(false)
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {task.notes && (
        <div className="task-notes-indicator" onClick={() => setShowNotes(true)}>
          📝 Has notes
        </div>
      )}
      {showNotes && (
        <div className="notes-modal">
          <div className="notes-overlay" onClick={() => setShowNotes(false)} />
          <div className="notes-content">
            <div className="notes-header">
              <h3>Notes</h3>
              <button className="close-btn" onClick={() => setShowNotes(false)}>
                ×
              </button>
            </div>
            <textarea
              value={task.notes || ''}
              onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
              placeholder="Add notes to this task..."
              className="notes-textarea"
              rows="6"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskCard
