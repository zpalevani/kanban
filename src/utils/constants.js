export const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' }
]

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Low',
  [PRIORITIES.MEDIUM]: 'Medium',
  [PRIORITIES.HIGH]: 'High',
  [PRIORITIES.URGENT]: 'Urgent'
}

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: '#8E8E93',
  [PRIORITIES.MEDIUM]: '#FF9500',
  [PRIORITIES.HIGH]: '#FF3B30',
  [PRIORITIES.URGENT]: '#FF0000'
}

export const MAX_TASK_TITLE_LENGTH = 500
export const STORAGE_KEYS = {
  KANBAN_COLUMNS: 'kanbanColumns',
  DARK_MODE: 'darkMode'
}

