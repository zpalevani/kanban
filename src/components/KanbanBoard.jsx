import React, { useCallback, useMemo } from 'react'
import Column from './Column'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateTaskId, validateTaskTitle, sanitizeInput } from '../utils/taskHelpers'
import { COLUMNS, STORAGE_KEYS } from '../utils/constants'
import './KanbanBoard.css'

function KanbanBoard() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, [])

  const addTask = useCallback((columnId, title) => {
    const sanitizedTitle = sanitizeInput(title)
    const validation = validateTaskTitle(sanitizedTitle)
    
    if (!validation.valid) {
      console.warn('Cannot add task:', validation.error)
      // Could show toast notification here
      return
    }

    const newTask = {
      id: generateTaskId(),
      title: sanitizedTitle,
      columnId,
      completed: false,
      notes: '',
      createdAt: new Date().toISOString()
    }
    setTasks(prevTasks => [...prevTasks, newTask])
  }, [setTasks])

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        // Sanitize title if it's being updated
        if (updates.title !== undefined) {
          const sanitizedTitle = sanitizeInput(updates.title)
          const validation = validateTaskTitle(sanitizedTitle)
          if (!validation.valid) {
            console.warn('Cannot update task:', validation.error)
            return task
          }
          return { ...task, ...updates, title: sanitizedTitle }
        }
        return { ...task, ...updates }
      }
      return task
    }))
  }, [setTasks])

  const deleteTask = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }, [setTasks])

  const moveTask = useCallback((taskId, newColumnId) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, columnId: newColumnId } : task
    ))
  }, [setTasks])

  const toggleComplete = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }, [setTasks])

  // Memoize tasks by column for performance
  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter(task => task.columnId === column.id)
      return acc
    }, {})
  }, [tasks])

  return (
    <div className="kanban-board" role="main" aria-label="Kanban board">
      {COLUMNS.map(column => (
        <Column
          key={column.id}
          column={column}
          tasks={tasksByColumn[column.id] || []}
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
