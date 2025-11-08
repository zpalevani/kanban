import React, { useState } from 'react';
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
import { STORAGE_KEYS } from '../utils/constants';

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnOfTask = (taskId) => {
    return Object.values(columns).find(column => column.tasks.some(task => task.id === taskId));
  };
  
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
  
  const onAddTask = (columnId, title, deadline) => {
    const newTask = { id: nanoid(), title, deadline: deadline || null, completed: false, notes: '' };
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: [...prev[columnId].tasks, newTask]
      }
    }));
  };
  
  const onUpdateTask = (taskId, newValues) => {
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
  };

  const onDeleteTask = (taskId) => {
     setColumns(prev => {
      const newColumns = { ...prev };
       for (const columnId in newColumns) {
         newColumns[columnId].tasks = newColumns[columnId].tasks.filter(t => t.id !== taskId);
       }
       return newColumns;
     });
  };
  
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
  
  const onMoveTask = (taskId, newColumnId) => {
    const activeColumn = findColumnOfTask(taskId);
    if (activeColumn && activeColumn.id !== newColumnId) {
      const taskIndex = activeColumn.tasks.findIndex(t => t.id === taskId);
      const [taskToMove] = activeColumn.tasks.splice(taskIndex, 1);
      
      setColumns(prev => {
        const newCols = {...prev};
        newCols[activeColumn.id].tasks = [...activeColumn.tasks];
        newCols[newColumnId].tasks.push(taskToMove);
        return newCols;
      });
    }
  };

  return (
    <div className="kanban-board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.values(columns).map(column => (
          <Column
            key={column.id}
            column={column}
            tasks={column.tasks}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            onToggleComplete={onToggleComplete}
            availableColumns={Object.values(columns).filter(c => c.id !== column.id).map(c => ({ id: c.id, title: c.title }))}
          />
        ))}
        <DragOverlay>
          {activeTask ? (
            <TaskCard 
              task={activeTask} 
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
  );
}

export default KanbanBoard;