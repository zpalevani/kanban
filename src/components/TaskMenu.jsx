import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useClickOutside } from '../hooks/useClickOutside';
import './TaskMenu.css'; // We will create this CSS file next

export function TaskMenu({
  menuRef,
  onClose,
  onEdit,
  onDelete,
  onOpenNotes,
  onMoveTask,
  availableColumns,
}) {
  const dropdownRef = useRef(null);

  // This hook closes the menu if you click anywhere outside of it.
  useClickOutside(dropdownRef, (event) => {
    // Prevent closing if the original menu button was clicked again
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      onClose();
    }
  });

  const handleAction = (action) => {
    action();
    onClose();
  };

  // Render the menu into the document body to escape parent overflow/z-index issues.
  return createPortal(
    <div className="task-menu-portal" ref={dropdownRef}>
      <button className="menu-item" onClick={() => handleAction(onEdit)}>
        <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        Edit Title
      </button>
      <button className="menu-item" onClick={() => handleAction(onOpenNotes)}>
        <svg viewBox="0 0 24 24"><path d="M15.5 2H8.6c-.4 0-.8.2-1 .4L3 7.2c-.2.2-.4.6-.4 1V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L15.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        Notes
      </button>
      <div className="menu-divider"></div>
      <p className="menu-label">Move to:</p>
      {availableColumns.map(col => (
        <button key={col.id} className="menu-item" onClick={() => onMoveTask(col.id)}>
          <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          {col.title}
        </button>
      ))}
      <div className="menu-divider"></div>
      <button className="menu-item delete" onClick={() => handleAction(onDelete)}>
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        Delete
      </button>
    </div>,
    document.body
  );
}

TaskMenu.propTypes = {
  menuRef: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onOpenNotes: PropTypes.func.isRequired,
  onMoveTask: PropTypes.func.isRequired,
  availableColumns: PropTypes.array.isRequired,
};