import React, { useState, useRef, useEffect } from 'react'
import TaskMenu from './TaskMenu'
import TaskNotes from './TaskNotes'
import './TaskCard.css'

function TaskCard({ task, onUpdate, onDelete, onMove, onToggleComplete, availableColumns }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showNotes, setShowNotes] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setEditTitle(task.title)
  }, [task.title])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  const handleMove = (columnId) => {
    onMove(task.id, columnId)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`} role="listitem">
      <div className="task-header">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="task-edit-input"
            aria-label="Edit task title"
            maxLength={500}
          />
        ) : (
          <div className="task-content">
            <label className="task-checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
              />
              <span 
                className="task-title" 
                onClick={() => setIsEditing(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setIsEditing(true)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Edit task: ${task.title}`}
              >
                {task.title}
              </span>
            </label>
          </div>
        )}
        <div className="task-menu-container">
          <button
            className="task-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Task options menu"
            aria-expanded={showMenu}
            aria-haspopup="true"
          >
            ⋮
          </button>
          <TaskMenu
            showMenu={showMenu}
            onClose={() => setShowMenu(false)}
            onEdit={() => setIsEditing(true)}
            onShowNotes={() => setShowNotes(true)}
            onMove={handleMove}
            onDelete={() => onDelete(task.id)}
            availableColumns={availableColumns}
          />
        </div>
      </div>
      {task.notes && (
        <div 
          className="task-notes-indicator" 
          onClick={() => setShowNotes(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setShowNotes(true)
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="View task notes"
        >
          📝 Has notes
        </div>
      )}
      {showNotes && (
        <TaskNotes
          task={task}
          onUpdate={onUpdate}
          onClose={() => setShowNotes(false)}
        />
      )}
    </div>
  )
}

export default TaskCard
