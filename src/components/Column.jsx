import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { SortableContext, useSortable } from '@dnd-kit/sortable';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  deadline: z.string().optional(),
});

function Column({ column, tasks, onAddTask, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", deadline: "" }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  
  // --- DND-KIT INTEGRATION ---
  const { setNodeRef } = useSortable({ id: column.id });
  // --- END DND-KIT INTEGRATION ---

  const onSubmit = (data) => {
    onAddTask(column.id, data.title, data.deadline);
    reset();
    setShowAddForm(false);
  };
  
  const handleCancel = () => {
    reset();
    setShowAddForm(false);
  };

  return (
    <div ref={setNodeRef} className="kanban-column">
      <header className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="task-count">{tasks.length}</span>
      </header>
      <div className="column-content">
        {/* --- DND-KIT: WRAP TASKS IN SORTABLECONTEXT --- */}
        <SortableContext items={tasks.map(task => task.id)}>
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
        </SortableContext>
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
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-task-btn" onClick={() => setShowAddForm(true)}>+ Add Task</button>
      )}
    </div>
  );
}

Column.propTypes = {
  column: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onUpdateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onMoveTask: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  availableColumns: PropTypes.array.isRequired,
};

export default React.memo(Column);