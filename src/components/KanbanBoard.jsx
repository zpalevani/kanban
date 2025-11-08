import React, { useCallback, useMemo, useState, useRef } from 'react';
import Column from './Column';
import Toast from './Toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateTaskId, validateTaskTitle, sanitizeInput } from '../utils/taskHelpers';
import { COLUMNS, STORAGE_KEYS } from '../utils/constants';
// The old "./KanbanBoard.css" import is now REMOVED.

function KanbanBoard() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, []);
  const [toastMessage, setToastMessage] = useState(null);
  const importInputRef = useRef(null);

  const showToast = useCallback((message, type = 'error') => {
    setToastMessage({ message, type });
  }, []);

  const addTask = useCallback((columnId, title, deadline) => { // Now accepts deadline
    const sanitizedTitle = sanitizeInput(title);
    const validation = validateTaskTitle(sanitizedTitle);
    
    if (!validation.valid) {
      showToast(validation.error, 'error');
      return;
    }

    const newTask = {
      id: generateTaskId(),
      title: sanitizedTitle,
      columnId,
      completed: false,
      notes: '',
      deadline: deadline || null, // Add deadline to new task object
      createdAt: new Date().toISOString()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    showToast('Task added successfully', 'success');
  }, [setTasks, showToast]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        if (updates.title !== undefined) {
          const sanitizedTitle = sanitizeInput(updates.title);
          const validation = validateTaskTitle(sanitizedTitle);
          if (!validation.valid) {
            showToast(validation.error, 'error');
            return task;
          }
          return { ...task, ...updates, title: sanitizedTitle };
        }
        return { ...task, ...updates };
      }
      return task;
    }));
  }, [setTasks, showToast]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    showToast('Task deleted', 'info');
  }, [setTasks, showToast]);

  const moveTask = useCallback((taskId, newColumnId) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, columnId: newColumnId } : task
    ));
  }, [setTasks]);

  const toggleComplete = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, [setTasks]);

  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter(task => task.columnId === column.id);
      return acc;
    }, {});
  }, [tasks]);

  const exportData = useCallback(() => { /* ... (code unchanged) ... */ }, [tasks, showToast]);
  const importData = useCallback((event) => { /* ... (code unchanged) ... */ }, [setTasks, showToast]);

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
      <div className="kanban-board" role="main">
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
          {/* ... (buttons are unchanged) ... */}
        </div>
        <input
          type="file"
          ref={importInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={importData}
        />
      </div>
    </>
  );
}

export default React.memo(KanbanBoard);