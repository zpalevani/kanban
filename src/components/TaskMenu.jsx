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
  const [mountNode, setMountNode] = useState(null);

  // This ensures we only access document.body on the client-side
  useEffect(() => {
    setMountNode(document.body);
  }, []);

  // Position the menu near the button
  useEffect(() => {
    if (!mountNode) return;
    
    const updatePosition = () => {
      if (!menuRef?.current || !dropdownRef.current) return;
      
      try {
        const buttonRect = menuRef.current.getBoundingClientRect();
        const menu = dropdownRef.current;
        
        if (buttonRect && menu) {
          // For fixed positioning, use viewport coordinates directly
          menu.style.position = 'fixed';
          menu.style.top = `${buttonRect.bottom + 8}px`;
          menu.style.left = `${buttonRect.left}px`;
          menu.style.visibility = 'visible';
          menu.style.opacity = '1';
          menu.style.display = 'block';
          menu.style.zIndex = '99999';
        }
      } catch (error) {
        console.error('Error positioning menu:', error);
      }
    };
    
    // Multiple attempts to ensure positioning works
    updatePosition();
    const timer1 = setTimeout(updatePosition, 10);
    const timer2 = setTimeout(updatePosition, 50);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [mountNode, menuRef]);

  // Close menu when clicking outside
  useClickOutside(dropdownRef, (event) => {
    if (menuRef?.current && !menuRef.current.contains(event.target)) {
      onClose();
    }
  });

  const handleAction = (action) => {
    if (action) {
      action();
    }
    onClose();
  };

  const menuContent = (
    <div 
      className="task-menu-portal" 
      ref={dropdownRef}
      style={{
        position: 'fixed',
        zIndex: 99999,
        visibility: 'visible',
        opacity: 1,
        display: 'block'
      }}
    >
      <button className="menu-item" onClick={() => handleAction(onOpenNotes)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <span>Add Notes</span>
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
      <p className="menu-label">Priority:</p>
      {Object.values(PRIORITIES).map(priority => (
        <button
          key={priority}
          className={`menu-item ${currentPriority === priority ? 'active' : ''}`}
          onClick={() => handleAction(() => onUpdatePriority && onUpdatePriority(priority))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {currentPriority === priority ? (
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </>
            ) : (
              <circle cx="12" cy="12" r="10"></circle>
            )}
          </svg>
          <span>{PRIORITY_LABELS[priority]}</span>
        </button>
      ))}
      <div className="menu-divider"></div>
      <button className="menu-item delete" onClick={() => handleAction(onDelete)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Delete</span>
      </button>
    </div>
  );
  
  if (!mountNode) {
    console.log('TaskMenu: No mountNode, returning null');
    return null;
  }
  
  console.log('TaskMenu: Rendering portal with menuContent');
  return createPortal(menuContent, mountNode);
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

