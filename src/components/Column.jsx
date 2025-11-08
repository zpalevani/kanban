import React, { useState } from 'react'
import TaskCard from './TaskCard'
import './Column.css'

function Column({ column, tasks, onAddTask, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      onAddTask(column.id, newTaskTitle.trim())
      setNewTaskTitle('')
      setIsAdding(false)
    }
  }

  return (
    <div className="kanban-column">
      <div className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="column-content">
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
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="add-task-input"
              autoFocus
              onBlur={() => {
                if (!newTaskTitle.trim()) {
                  setIsAdding(false)
                }
              }}
            />
            <div className="add-task-actions">
              <button type="submit" className="btn-add">Add</button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setIsAdding(false)
                  setNewTaskTitle('')
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button 
            className="add-task-btn"
            onClick={() => setIsAdding(true)}
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  )
}

export default Column
