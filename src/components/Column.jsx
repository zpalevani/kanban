import React, { useState } from 'react';
import TaskCard from './TaskCard';
import PropTypes from 'prop-types';

function Column({ column, tasks, onAddTask, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState(''); // New state for deadline

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(column.id, newTaskTitle, newDeadline); // Pass deadline to handler
      setNewTaskTitle('');
      setNewDeadline('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="kanban-column" aria-labelledby={`column-title-${column.id}`}>
      <header className="column-header">
        <h2 id={`column-title-${column.id}`} className="column-title">{column.title}</h2>
        <span className="task-count">{tasks.length}</span>
      </header>
      <div className="column-content">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            onToggleComplete={onToggleComplete}
            availableColumns={availableColumns}
          />
        ))}
      </div>
      {showAddForm ? (
        <form className="add-task-form" onSubmit={handleAddTask}>
          <div className="add-task-form-main">
            <input
              className="add-task-input"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
            />
            <input
              type="date"
              className="add-task-date-input"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
          </div>
          <div className="add-task-actions">
            <button type="submit" className="btn-add">Add</button>
            <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-task-btn" onClick={() => setShowAddForm(true)}>+ Add Task</button>
      )}
    </div>
  );
}

Column.propTypes = {
  // ... your existing prop types ...
};

export default React.memo(Column);