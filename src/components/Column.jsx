import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';

// Define the validation schema with Zod
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title is too long'),
  deadline: z.string().optional(),
});

function Column({ column, tasks, onAddTask, ...taskProps }) {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    resolver: zodResolver(taskSchema),
    // CORRECTED: Set default values to prevent placeholder issues
    defaultValues: {
      title: "",
      deadline: ""
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const onSubmit = (data) => {
    onAddTask(column.id, data.title, data.deadline);
    reset();
    setShowAddForm(false);
  };

  return (
    <div className="kanban-column">
      <header className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="task-count">{tasks.length}</span>
      </header>
      <div className="column-content">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} {...taskProps} />
        ))}
      </div>
      {showAddForm ? (
        <form className="add-task-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="add-task-form-main">
            <input
              className="add-task-input"
              type="text"
              placeholder="Enter task title..."
              autoFocus
              {...register('title')}
            />
            <input
              type="date"
              className="add-task-date-input"
              {...register('deadline')}
            />
          </div>
          {errors.title && <p className="form-error">{errors.title.message}</p>}
          <div className="add-task-actions">
            <button type="submit" className="btn-add" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-task-btn" onClick={() => setShowAddForm(true)}>+ Add Task</button>
      )}
    </div>
  );
}

// Your PropTypes here...

export default React.memo(Column);