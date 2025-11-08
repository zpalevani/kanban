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
    setIsNotesModalOpen(false); // Fix: Closes modal on save
  };

  return (
    <>
      <div className={`task-card ${task.completed ? 'completed' : ''}`} ref={menuRef}>
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
            <button className="menu-item" onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit Title
            </button>
            <button className="menu-item" onClick={() => { setIsNotesModalOpen(true); setIsMenuOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.5 2H8.6c-.4 0-.8.2-1 .4L3 7.2c-.2.2-.4.6-.4 1V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L15.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Notes
            </button>
            <div className="menu-divider"></div>
            <p className="menu-label">Move to:</p>
            {availableColumns.map(col => (
              <button key={col.id} className="menu-item" onClick={() => { onMoveTask(task.id, col.id); setIsMenuOpen(false); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                {col.title}
              </button>
            ))}
            <div className="menu-divider"></div>
            <button className="menu-item delete" onClick={() => onDeleteTask(task.id)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Delete
            </button>
          </div>
        )}
      </div>

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

// Add prop types for clarity
TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  onUpdateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onMoveTask: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  availableColumns: PropTypes.array.isRequired,
};

export default React.memo(TaskCard);