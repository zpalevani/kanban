import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateTaskId, validateTaskTitle, sanitizeInput } from '../utils/taskHelpers';
import { COLUMNS, STORAGE_KEYS } from '../utils/constants';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, []);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage({ message, type });
  }, []);

  const addTask = useCallback((columnId, title, deadline) => {
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
      deadline: deadline || null,
      createdAt: new Date().toISOString()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    showToast('Task added successfully', 'success');
  }, [setTasks, showToast]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        if (updates.title) {
          updates.title = sanitizeInput(updates.title);
        }
        return { ...task, ...updates };
      }
      return task;
    }));
  }, [setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    showToast('Task deleted', 'info');
  }, [setTasks, showToast]);

  const moveTask = useCallback((taskId, newColumnId) => {
    updateTask(taskId, { columnId: newColumnId });
  }, [updateTask]);

  const toggleComplete = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { completed: !task.completed });
    }
  }, [tasks, updateTask]);

  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter(task => task.columnId === column.id);
      return acc;
    }, {});
  }, [tasks]);
  
  return {
    tasks, // CORRECTED: Export raw tasks for export functionality
    setTasks, // CORRECTED: Export setter for import functionality
    tasksByColumn,
    toastMessage,
    setToastMessage,
    showToast, // CORRECTED: Export showToast for import/export feedback
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleComplete
  };
}