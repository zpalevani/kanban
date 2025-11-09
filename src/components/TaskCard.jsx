import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskMenu } from './TaskMenu';
import { PRIORITIES, PRIORITY_LABELS, PRIORITY_COLORS } from '../utils/constants';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import './TaskCard.css';

function TaskCard({ task, columnId, onUpdateTask, onDeleteTask, onMoveTask, onToggleComplete, availableColumns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState(task.notes || '');

  const menuButtonRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    activationConstraint: {
      distance: 8, // Only activate drag after 8px of movement
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  const priorityInfo = useMemo(() => ({
    label: PRIORITY_LABELS[task.priority || PRIORITIES.MEDIUM],
    color: PRIORITY_COLORS[task.priority || PRIORITIES.MEDIUM]
  }), [task.priority]);

  const deadlineInfo = useMemo(() => {
    if (!task.deadline) return null;
    const deadline = new Date(task.deadline);
    const now = new Date();
    const daysDiff = differenceInDays(deadline, now);
    
    return {
      date: deadline,
      formatted: format(deadline, 'MMM d'),
      isOverdue: isPast(deadline) && !isToday(deadline),
      isToday: isToday(deadline),
      isSoon: daysDiff > 0 && daysDiff <= 3,
      daysLeft: daysDiff
    };
  }, [task.deadline]);

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={isDragging ? 'is-dragging-container' : ''}>
      <div 
        className={`task-card ${task.completed ? 'completed' : ''} column-${columnId}`}
        onMouseDown={(e) => {
          // Don't start drag if clicking on interactive elements
          const target = e.target;
          const isInteractive = target.closest('.custom-checkbox') || 
                                target.closest('.task-menu-btn') || 
                                target.closest('.task-title') ||
                                target.closest('.task-edit-input') ||
                                target.closest('button') ||
                                target.closest('input');
          
          if (!isInteractive) {
            // Apply drag listeners manually
            if (listeners?.onMouseDown) {
              listeners.onMouseDown(e);
            }
          }
        }}
        onTouchStart={(e) => {
          // Same for touch
          const target = e.target;
          const isInteractive = target.closest('.custom-checkbox') || 
                                target.closest('.task-menu-btn') || 
                                target.closest('.task-title') ||
                                target.closest('.task-edit-input') ||
                                target.closest('button') ||
                                target.closest('input');
          
          if (!isInteractive && listeners?.onTouchStart) {
            listeners.onTouchStart(e);
          }
        }}
      >
        <div className="task-header">
          <div className="task-content">
            {/* --- UPDATED ACCESSIBLE CUSTOM CHECKBOX --- */}
            <div
              role="checkbox"
              aria-checked={task.completed}
              tabIndex="0"
              className="custom-checkbox"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Checkbox clicked, toggling task:', task.id);
                onToggleComplete(task.id);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleComplete(task.id);
                }
              }}
              aria-labelledby={`task-title-${task.id}`}
            >
              {task.completed && (
                <svg className="checkmark" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                </svg>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="task-edit-input"
                autoFocus
              />
            ) : (
              <p
                id={`task-title-${task.id}`}
                className="task-title"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {task.title}
              </p>
            )}
          </div>
          <button
            ref={menuButtonRef}
            className="task-menu-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Menu button clicked, opening menu');
              setIsMenuOpen(true);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Task options"
            type="button"
          >
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
          </button>
        </div>
        {/* Priority and Deadline Indicators */}
        <div className="task-meta">
          {task.priority && (
            <span 
              className="task-priority"
              style={{ '--priority-color': priorityInfo.color }}
            >
              {priorityInfo.label}
            </span>
          )}
          {deadlineInfo && (
            <span 
              className={`task-deadline ${deadlineInfo.isOverdue ? 'overdue' : deadlineInfo.isToday ? 'today' : deadlineInfo.isSoon ? 'soon' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {deadlineInfo.formatted}
            </span>
          )}
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
          onUpdatePriority={(priority) => onUpdateTask(task.id, { priority })}
          currentPriority={task.priority || PRIORITIES.MEDIUM}
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
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  columnId: PropTypes.string.isRequired,
  onUpdateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onMoveTask: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  availableColumns: PropTypes.array.isRequired,
};

export default React.memo(TaskCard);