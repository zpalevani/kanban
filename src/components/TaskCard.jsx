import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

function TaskCard({ task, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState(task.notes || '');

  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      onUpdateTask(task.id, { title });
    } else {
      setTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') handleTitleBlur();
    else if (e.key === 'Escape') {
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
      {/* CORRECTED: Conditionally adds a class when the menu is open */}
      <div 
        className={`task-card ${task.completed ? 'completed' : ''} ${isMenuOpen ? 'task-card--menu-open' : ''}`} 
        ref={menuRef}
      >
        <div className="task-header">
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
            />
            <div className="task-details">
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
                <p className="task-title" onClick={() => setIsEditing(true)}>
                  {task.title}
                </p>
              )}
              {task.deadline && (
                <p className="task-deadline">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <button className="task-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Task options">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="task-menu">
            {/* ... menu items are unchanged ... */}
          </div>
        )}
      </div>

      {isNotesModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNotesModalOpen(false)}>
          {/* ... modal content is unchanged ... */}
        </div>
      )}
    </>
  );
}

// PropTypes...

export default React.memo(TaskCard);