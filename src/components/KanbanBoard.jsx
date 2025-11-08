import React, { useCallback, useRef } from 'react';
import Column from './Column';
import Toast from './Toast';
import { useTasks } from '../hooks/useTasks';
import { COLUMNS } from '../utils/constants';

function KanbanBoard() {
  const {
    tasks,
    setTasks,
    tasksByColumn,
    toastMessage,
    setToastMessage,
    showToast,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleComplete
  } = useTasks();

  const importInputRef = useRef(null);

  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify(tasks, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Tasks exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export tasks', 'error');
      console.error('Export error:', error);
    }
  }, [tasks, showToast]);

  const handleImport = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported) && imported.every(task => task.id && task.title && task.columnId)) {
          setTasks(imported);
          showToast('Tasks imported successfully', 'success');
        } else {
          showToast('Invalid file format', 'error');
        }
      } catch (error) {
        showToast('Failed to import tasks', 'error');
        console.error('Import error:', error);
      }
    };
    reader.onerror = () => showToast('Failed to read file', 'error');
    reader.readAsText(file);
    event.target.value = '';
  }, [setTasks, showToast]);

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
          <button className="action-button" onClick={handleExport}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17V3" /><path d="m6 11 6 6 6-6" /><path d="M19 21H5" /></svg>
            Export
          </button>
          <button className="action-button" onClick={() => importInputRef.current.click()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v14" /><path d="m18 9-6-6-6 6" /><path d="M5 21h14" /></svg>
            Import
          </button>
        </div>
        <input
          type="file"
          ref={importInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleImport}
        />
      </div>
    </>
  );
}

export default React.memo(KanbanBoard);