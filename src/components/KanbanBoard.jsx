import React, { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, PRIORITIES } from '../utils/constants';

import Column from './Column';
import TaskCard from './TaskCard';

const initialColumns = {
  backlog: { id: 'backlog', title: 'Backlog', tasks: [] },
  todo: { id: 'todo', title: 'To Do', tasks: [] },
  doing: { id: 'doing', title: 'Doing', tasks: [] },
  done: { id: 'done', title: 'Done', tasks: [] },
};

function KanbanBoard() {
  const [columns, setColumns] = useLocalStorage(STORAGE_KEYS.KANBAN_COLUMNS, initialColumns);
  const [activeTask, setActiveTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnOfTask = useCallback((taskId) => {
    return Object.values(columns).find(column => column.tasks.some(task => task.id === taskId));
  }, [columns]);
  
  const handleDragStart = (event) => {
    const { active } = event;
    const column = findColumnOfTask(active.id);
    if (column) {
      const task = column.tasks.find(t => t.id === active.id);
      setActiveTask(task);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeColumn = findColumnOfTask(active.id);
    const overColumn = columns[over.id] || findColumnOfTask(over.id);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    setColumns(prev => {
      const newColumns = { ...prev };
      const activeTasks = [...newColumns[activeColumn.id].tasks];
      const overTasks = [...newColumns[overColumn.id].tasks];
      const activeIndex = activeTasks.findIndex(t => t.id === active.id);
      
      const [movedTask] = activeTasks.splice(activeIndex, 1);
      
      let overIndex = overTasks.findIndex(t => t.id === over.id);
      if (overIndex === -1) {
         overIndex = overTasks.length;
      }

      overTasks.splice(overIndex, 0, movedTask);

      newColumns[activeColumn.id].tasks = activeTasks;
      newColumns[overColumn.id].tasks = overTasks;

      return newColumns;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }
    
    const activeColumn = findColumnOfTask(active.id);
    const overColumn = findColumnOfTask(over.id) || columns[over.id];

    if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
      const activeIndex = activeColumn.tasks.findIndex(t => t.id === active.id);
      const overIndex = overColumn.tasks.findIndex(t => t.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        setColumns(prev => ({
          ...prev,
          [overColumn.id]: {
            ...prev[overColumn.id],
            tasks: arrayMove(prev[overColumn.id].tasks, activeIndex, overIndex)
          }
        }));
      }
    }
    
    setActiveTask(null);
  };
  
  const onAddTask = useCallback((columnId, title, deadline) => {
    const newTask = { 
      id: nanoid(), 
      title, 
      deadline: deadline || null, 
      completed: false, 
      notes: '',
      priority: PRIORITIES.MEDIUM,
      createdAt: new Date().toISOString()
    };
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: [...prev[columnId].tasks, newTask]
      }
    }));
  }, [setColumns]);
  
  const onUpdateTask = useCallback((taskId, newValues) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      for (const columnId in newColumns) {
        const taskIndex = newColumns[columnId].tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          newColumns[columnId].tasks[taskIndex] = { ...newColumns[columnId].tasks[taskIndex], ...newValues };
          break;
        }
      }
      return newColumns;
    });
  }, [setColumns]);

  const onDeleteTask = useCallback((taskId) => {
     setColumns(prev => {
      const newColumns = { ...prev };
       for (const columnId in newColumns) {
         newColumns[columnId].tasks = newColumns[columnId].tasks.filter(t => t.id !== taskId);
       }
       return newColumns;
     });
  }, [setColumns]);
  
  // --- UPDATED LOGIC TO MOVE TASK TO "DONE" ---
  const onToggleComplete = (taskId) => {
    const activeColumn = findColumnOfTask(taskId);
    if (!activeColumn) return;

    const taskIndex = activeColumn.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = activeColumn.tasks[taskIndex];
    const isCompleted = !task.completed;

    if (isCompleted && activeColumn.id !== 'done') {
      // Logic to move the task to the "Done" column
      setColumns(prev => {
        const newColumns = { ...prev };
        const [movedTask] = newColumns[activeColumn.id].tasks.splice(taskIndex, 1);
        movedTask.completed = true;
        newColumns.done.tasks.push(movedTask);
        return newColumns;
      });
    } else {
      // Default behavior: just toggle the completion state in its current column
      onUpdateTask(taskId, { completed: isCompleted });
    }
  };
  
  const onMoveTask = useCallback((taskId, newColumnId) => {
    setColumns(prev => {
      const activeColumn = Object.values(prev).find(col => col.tasks.some(t => t.id === taskId));
      if (!activeColumn || activeColumn.id === newColumnId) return prev;
      
      const taskIndex = activeColumn.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;
      
      const [taskToMove] = activeColumn.tasks.splice(taskIndex, 1);
      const newCols = {...prev};
      newCols[activeColumn.id] = {
        ...activeColumn,
        tasks: [...activeColumn.tasks]
      };
      newCols[newColumnId] = {
        ...newCols[newColumnId],
        tasks: [...newCols[newColumnId].tasks, taskToMove]
      };
      return newCols;
    });
  }, [setColumns]);

  // Filter tasks based on search and priority
  const filteredColumns = useMemo(() => {
    if (!searchQuery && !priorityFilter) {
      return columns;
    }
    
    const filtered = {};
    Object.keys(columns).forEach(columnId => {
      filtered[columnId] = {
        ...columns[columnId],
        tasks: columns[columnId].tasks.filter(task => {
          const matchesSearch = !searchQuery || 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));
          const matchesPriority = !priorityFilter || task.priority === priorityFilter;
          return matchesSearch && matchesPriority;
        })
      };
    });
    return filtered;
  }, [columns, searchQuery, priorityFilter]);

  const availableColumnsList = useMemo(() => 
    Object.values(columns).map(c => ({ id: c.id, title: c.title })),
    [columns]
  );

  return (
    <div className="kanban-board">
      {/* Search and Filter Bar */}
      <div className="kanban-controls">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="priority-filter">
          <select
            className="priority-select"
            value={priorityFilter || ''}
            onChange={(e) => setPriorityFilter(e.target.value || null)}
          >
            <option value="">All Priorities</option>
            <option value={PRIORITIES.URGENT}>Urgent</option>
            <option value={PRIORITIES.HIGH}>High</option>
            <option value={PRIORITIES.MEDIUM}>Medium</option>
            <option value={PRIORITIES.LOW}>Low</option>
          </select>
        </div>
      </div>
      <div className="kanban-board-grid">
        <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.values(filteredColumns).map(column => (
          <Column
            key={column.id}
            column={column}
            tasks={column.tasks}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            onToggleComplete={onToggleComplete}
            availableColumns={availableColumnsList.filter(c => c.id !== column.id)}
          />
        ))}
        <DragOverlay>
          {activeTask ? (
            <TaskCard 
              task={activeTask}
              columnId={findColumnOfTask(activeTask.id)?.id || 'backlog'}
              onUpdateTask={() => {}}
              onDeleteTask={() => {}}
              onMoveTask={() => {}}
              onToggleComplete={() => {}}
              availableColumns={[]}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      </div>
    </div>
  );
}

export default React.memo(KanbanBoard);