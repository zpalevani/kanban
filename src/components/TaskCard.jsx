import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { TaskMenu } from './TaskMenu';
import './TaskCard.css';

function TaskCard({ task, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState(task.notes || '');

  const menuButtonRef = useRef(null);

  const handleTitleBlur = () => {
    if (title.trim() && title.trim() !== task.title) {
      onUpdateTask(task.id, { title: title.trim() });
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') handleTitleBlur();
    if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleSaveNotes = () => {
    onUpdateTask(task.id, { notes: noteInput });
    setIsNotesModalOpen(false);
  };

  return (
    <>
      <div className={`task-card ${task.completed ? 'completed' : ''}`}>
        <div className="task-header">
          <div className="task-content">
            <input
              type="checkbox"
              className="task-checkbox-input"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              aria-labelledby={`task-title-${task.id}`}
            />
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="task-edit-input"
                autoFocus
              />
            ) : (
              <p
                id={`task-title-${task.id}`}
                className="task-title"
                onClick={() => setIsEditing(true)}
              >
                {task.title}
              </p>
            )}
          </div>
          <button
            ref={menuButtonRef}
            className="task-menu-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Task options"
          >
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <TaskMenu
          menuRef={menuButtonRef}
          onClose={() => setIsMenuOpen(false)}
          onEdit={() => setIsEditing(true)}
          onDelete={() => onDeleteTask(task.id)}
          onOpenNotes={() => setIsNotesModalOpen(true)}
          onMoveTask={(newColumnId) => {
            onMoveTask(task.id, newColumnId);
            setIsMenuOpen(false);
          }}
          availableColumns={availableColumns}
        />
      )}

      {isNotesModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNotesModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Task Notes</h3>
              <button className="modal-close-btn" onClick={() => setIsNotesModalOpen(false)}>&times;</button>
            </div>
            <textarea
              className="modal-textarea"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add notes to this task..."
              autoFocus
            />
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setIsNotesModalOpen(false)}>Cancel</button>
              <button className="modal-btn primary" onClick={handleSaveNotes}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  onUpdateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onMoveTask: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  availableColumns: PropTypes.array.isRequired,
};

export default React.memo(TaskCard);