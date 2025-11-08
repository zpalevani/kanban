import React, { useState, useEffect } from 'react'
import Column from './Column'
import './KanbanBoard.css'

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' }
]

function KanbanBoard() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('kanbanTasks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('kanbanTasks', JSON.stringify(tasks))
    } catch (e) {
      console.error('Error saving tasks:', e)
    }
  }, [tasks])

  const addTask = (columnId, title) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      columnId,
      completed: false,
      notes: '',
      createdAt: new Date().toISOString()
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const moveTask = (taskId, newColumnId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, columnId: newColumnId } : task
    ))
  }

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const getTasksByColumn = (columnId) => {
    return tasks.filter(task => task.columnId === columnId)
  }

  return (
    <div className="kanban-board">
      {COLUMNS.map(column => (
        <Column
          key={column.id}
          column={column}
          tasks={getTasksByColumn(column.id)}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
          onToggleComplete={toggleComplete}
          availableColumns={COLUMNS.filter(c => c.id !== column.id)}
        />
      ))}
    </div>
  )
}

export default KanbanBoard
