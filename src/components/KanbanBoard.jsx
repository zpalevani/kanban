import React from 'react';
import Column from './Column';
import Toast from './Toast';
import { useTasks } from '../hooks/useTasks'; // NEW: Import the custom hook
import { COLUMNS } from '../utils/constants';

function KanbanBoard() {
  // NEW: All state logic is now handled by the useTasks hook
  const {
    tasksByColumn,
    toastMessage,
    setToastMessage,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleComplete
  } = useTasks();

  // The import/export logic remains here as it's UI-specific
  const handleExport = () => { /* ... existing export logic ... */ };
  const handleImport = (event) => { /* ... existing import logic ... */ };

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
        {/* Your import/export buttons can remain here, unchanged */}
      </div>
    </>
  );
}

export default React.memo(KanbanBoard);