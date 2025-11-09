import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useClickOutside } from '../hooks/useClickOutside';
import { PRIORITIES, PRIORITY_LABELS } from '../utils/constants';
import './TaskMenu.css';

export function TaskMenu({
  menuRef,
  onClose,
  onEdit,
  onDelete,
  onOpenNotes,
  onMoveTask,
  onUpdatePriority,
  currentPriority,
  availableColumns,
}) {
  const dropdownRef = useRef(null);
  // State to hold the portal container element
  const [mountNode, setMountNode] = useState(null);

  // This ensures we only access document.body on the client-side
  useEffect(() => {
    setMountNode(document.body);
  }, []);

  useClickOutside(dropdownRef, (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      onClose();
    }
  });

  const handleAction = (action) => {
    action();
    onClose();
  };
  
  const menuContent = (
    <div className="task-menu-portal" ref={dropdownRef}>
      <button className="menu-item" onClick={() => handleAction(onOpenNotes)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span>Edit Notes</span>
      </button>
      <button className="menu-item" onClick={() => handleAction(onEdit)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>Edit Task Header</span>
      </button>
      <div className="menu-divider"></div>
      <p className="menu-label">Priority:</p>
      {Object.values(PRIORITIES).map(priority => (
        <button
          key={priority}
          className={`menu-item ${currentPriority === priority ? 'active' : ''}`}
          onClick={() => handleAction(() => onUpdatePriority(priority))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {currentPriority === priority ? (
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            ) : (
              <circle cx="12" cy="12" r="10"></circle>
            )}
          </svg>
          <span>{PRIORITY_LABELS[priority]}</span>
        </button>
      ))}
      <div className="menu-divider"></div>
      <p className="menu-label">Move to:</p>
      {availableColumns.map(col => (
        <button key={col.id} className="menu-item" onClick={() => handleAction(() => onMoveTask(col.id))}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          <span>{col.title}</span>
        </button>
      ))}
      <div className="menu-divider"></div>
      <button className="menu-item delete" onClick={() => handleAction(onDelete)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Delete Task</span>
      </button>
    </div>
  );
  
  // Only render the portal if the mountNode is available (i.e., we are in the browser)
  return mountNode ? createPortal(menuContent, mountNode) : null;
}

TaskMenu.propTypes = {
  menuRef: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onOpenNotes: PropTypes.func.isRequired,
  onMoveTask: PropTypes.func.isRequired,
  onUpdatePriority: PropTypes.func,
  currentPriority: PropTypes.string,
  availableColumns: PropTypes.array.isRequired,
};