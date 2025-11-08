import React, { useState, useRef, useEffect } from 'react'
import TaskCard from './TaskCard'
import './Column.css'

function Column({ column, tasks, onAddTask, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (isSubmitting || !newTaskTitle.trim()) return

    setIsSubmitting(true)
    onAddTask(column.id, newTaskTitle.trim())
    setNewTaskTitle('')
    setIsAdding(false)
    
    // Small delay to prevent double-clicks
    setTimeout(() => setIsSubmitting(false), 300)
  }

  const handleCancel = () => {
    setNewTaskTitle('')
    setIsAdding(false)
  }

  return (
    <div className="kanban-column" role="region" aria-label={`${column.title} column`}>
      <div className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="task-count" aria-label={`${tasks.length} tasks in ${column.title}`}>
          {tasks.length}
        </span>
      </div>
      <div className="column-content" role="list" aria-label={`Tasks in ${column.title}`}>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onMove={onMoveTask}
            onToggleComplete={onToggleComplete}
            availableColumns={availableColumns}
          />
        ))}
        {isAdding ? (
          <form onSubmit={handleAddTask} className="add-task-form" aria-label="Add new task">
            <input
              ref={inputRef}
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="add-task-input"
              aria-label="Task title"
              maxLength={500}
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancel()
                }
              }}
            />
            <div className="add-task-actions">
              <button 
                type="submit" 
                className="btn-add"
                disabled={isSubmitting || !newTaskTitle.trim()}
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button 
            className="add-task-btn"
            onClick={() => setIsAdding(true)}
            aria-label={`Add task to ${column.title} column`}
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  )
}

export default Column
