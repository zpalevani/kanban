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

  // Position the menu near the button
  useEffect(() => {
    if (mountNode && menuRef.current && dropdownRef.current) {
      const buttonRect = menuRef.current.getBoundingClientRect();
      const menu = dropdownRef.current;
      
      menu.style.top = `${buttonRect.bottom + 8}px`;
      menu.style.left = `${buttonRect.left}px`;
    }
  }, [mountNode, menuRef]);

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
      <button className="menu-item delete" onClick={() => handleAction(onDelete)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Delete</span>
      </button>
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
      <button className="menu-item" onClick={() => handleAction(onEdit)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>Edit</span>
      </button>
      <button className="menu-item" onClick={() => handleAction(onOpenNotes)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <span>Add Notes</span>
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