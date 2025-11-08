import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { TaskMenu } from './TaskMenu'; // Import the new menu component
import './TaskCard.css';

function TaskCard({ task, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState(task.notes || '');

  const menuButtonRef = useRef(null); // Ref for the three-dots button

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
      {/* The card itself is much simpler now. No more tricky z-index classes needed. */}
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

      {/* Conditionally render the portal-based menu */}
      {isMenuOpen && (
        <TaskMenu
          menuRef={menuButtonRef}
          onClose={() => setIsMenuOpen(false)}
          onEdit={() => setIsEditing(true)}
          onDelete={() => onDeleteTask(task.id)}
          onOpenNotes={() => setIsNotesModalOpen(true)}
          onMoveTask={(newColumnId) => onMoveTask(task.id, newColumnId)}
          availableColumns={availableColumns}
        />
      )}

      {/* Notes Modal (remains unchanged) */}
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

export default React.memo(TaskCard);```

### Step 6: Update Your `TaskCard.css`

Now that the menu is gone, your `TaskCard.css` becomes much cleaner. The `z-index` hacks are no longer needed.

**Replace the contents of your file:** `src/components/TaskCard.css`
```css
/*
  The z-index rules have been removed as they are no longer needed.
  The portal handles the stacking context now.
*/
.task-card {
  background-color: var(--bg-tertiary, #2d3748);
  border: 1px solid var(--border, #4a5568);
  border-radius: 8px;
  padding: 1rem;
  transition: transform 150ms ease, box-shadow 150ms ease;
  position: relative;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow, rgba(0, 0, 0, 0.4));
}

.task-card.completed {
  opacity: 0.6;
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: var(--text-secondary, #a0aec0);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.task-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.task-checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--accent, #38a169);
  flex-shrink: 0;
}

.task-title {
  color: var(--text-primary, #e2e8f0);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
}

.task-edit-input {
  width: 100%;
  background-color: var(--bg-secondary, #1a202c);
  border: 1px solid var(--accent, #38a169);
  border-radius: 6px;
  padding: 0.5rem;
  color: var(--text-primary, #e2e8f0);
  font-size: 1rem;
  outline: none;
}

.task-menu-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary, #a0aec0);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 150ms ease, color 150ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-menu-btn:hover,
.task-menu-btn:focus {
  background-color: var(--bg-primary, #4a5568);
  color: var(--text-primary, #e2e8f0);
  outline: none;
}

.task-menu-btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}```

### Step 7: Establish a Design System with CSS Variables

The recommendations suggested creating a design system. This makes your styling consistent.

**Add this to the top of your main CSS file** (e.g., `index.css` or `App.css`):
```css
:root {
  /* Colors - Dark Theme Example */
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --bg-tertiary: #4a5568;
  --text-primary: #e2e8f0;
  --text-secondary: #a0aec0;
  --border: #4a5568;
  --accent: #38a169;
  --shadow: rgba(0, 0, 0, 0.4);

  /* Spacing (8px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;

  /* Z-index Scale */
  --z-dropdown: 1000;
  --z-modal: 1030;
  --z-toast: 1050;

  /* Animation */
  --transition-base: 250ms;
}