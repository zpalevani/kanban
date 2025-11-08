import React, { useCallback, useMemo, useState } from 'react'
import Column from './Column'
import Toast from './Toast'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateTaskId, validateTaskTitle, sanitizeInput } from '../utils/taskHelpers'
import { COLUMNS, STORAGE_KEYS } from '../utils/constants'
import './KanbanBoard.css'

function KanbanBoard() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, [])
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = useCallback((message, type = 'error') => {
    setToastMessage({ message, type })
  }, [])

  const addTask = useCallback((columnId, title) => {
    const sanitizedTitle = sanitizeInput(title)
    const validation = validateTaskTitle(sanitizedTitle)
    
    if (!validation.valid) {
      showToast(validation.error, 'error')
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
    showToast('Task added successfully', 'success')
  }, [setTasks, showToast])

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        // Sanitize title if it's being updated
        if (updates.title !== undefined) {
          const sanitizedTitle = sanitizeInput(updates.title)
          const validation = validateTaskTitle(sanitizedTitle)
          if (!validation.valid) {
            showToast(validation.error, 'error')
            return task
          }
          return { ...task, ...updates, title: sanitizedTitle }
        }
        return { ...task, ...updates }
      }
      return task
    }))
  }, [setTasks, showToast])

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

  const exportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify(tasks, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showToast('Tasks exported successfully', 'success')
    } catch (error) {
      showToast('Failed to export tasks', 'error')
      console.error('Export error:', error)
    }
  }, [tasks, showToast])

  const importData = useCallback((event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)
        if (Array.isArray(imported)) {
          // Validate imported data structure
          const isValid = imported.every(task => 
            task.id && task.title && task.columnId
          )
          if (isValid) {
            setTasks(imported)
            showToast('Tasks imported successfully', 'success')
          } else {
            showToast('Invalid file format', 'error')
          }
        } else {
          showToast('Invalid file format', 'error')
        }
      } catch (error) {
        showToast('Failed to import tasks', 'error')
        console.error('Import error:', error)
      }
    }
    reader.onerror = () => {
      showToast('Failed to read file', 'error')
    }
    reader.readAsText(file)
    // Reset input
    event.target.value = ''
  }, [setTasks, showToast])

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
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
        <div className="kanban-actions">
          <button
            onClick={exportData}
            className="action-button export"
            aria-label="Export tasks to JSON file"
          >
            📥 Export
          </button>
          <label htmlFor="import-file" className="action-button import">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
              id="import-file"
              aria-label="Import tasks from JSON file"
            />
            📤 Import
          </label>
        </div>
      </div>
    </>
  )
}

export default React.memo(KanbanBoard)
