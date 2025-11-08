import React, { useState, useRef, useEffect } from 'react';

// A simple hook to detect clicks outside an element
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
};

function TaskCard({ task, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'notes' or 'deadline'

  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      onUpdateTask(task.id, { title });
    } else {
      setTitle(task.title); // Revert if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  // --- Modal State ---
  const [noteInput, setNoteInput] = useState(task.notes);
  const [deadlineInput, setDeadlineInput] = useState(task.deadline || '');

  const handleSaveNotes = () => {
    onUpdateTask(task.id, { notes: noteInput });
    setActiveModal(null);
  };

  const handleSaveDeadline = () => {
    onUpdateTask(task.id, { deadline: deadlineInput });
    setActiveModal(null);
  };

  return (
    <>
      <div
        className={`task-card ${task.completed ? 'completed' : ''}`}
        ref={menuRef}
      >
        <div className="task-header">
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
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
                <div className="task-deadline">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{new Date(task.deadline).toLocaleDateString()}</span>
                </div>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </button>
            <button className="menu-item" onClick={() => { setActiveModal('notes'); setIsMenuOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1 .4L3 7.2c-.2.2-.4.6-.4 1V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L15.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Notes
            </button>
            <button className="menu-item" onClick={() => { setActiveModal('deadline'); setIsMenuOpen(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Edit Deadline
            </button>
            <div className="menu-divider"></div>
            <p className="menu-label">Move to:</p>
            {availableColumns.map(col => (
              <button key={col.id} className="menu-item" onClick={() => { onMoveTask(task.id, col.id); setIsMenuOpen(false); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                {col.title}
              </button>
            ))}
            <div className="menu-divider"></div>
            <button className="menu-item delete" onClick={() => onDeleteTask(task.id)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {activeModal === 'notes' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Task Notes</h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <textarea
              className="modal-textarea"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add notes to this task..."
              autoFocus
            />
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={handleSaveNotes}>Save Note</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'deadline' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Deadline</h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <input
              type="date"
              className="modal-input"
              value={deadlineInput}
              onChange={(e) => setDeadlineInput(e.target.value)}
              autoFocus
            />
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="modal-btn primary" onClick={handleSaveDeadline}>Save Deadline</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(TaskCard);