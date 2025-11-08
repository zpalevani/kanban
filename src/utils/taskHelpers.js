/**
 * Generate a unique task ID
 * Uses timestamp + random string to prevent collisions
 */
export const generateTaskId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sanitize user input to prevent XSS and limit length
 */
export const sanitizeInput = (input, maxLength = 500) => {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential script tags
}

/**
 * Validate task title
 */
export const validateTaskTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Task title is required' }
  }
  
  const trimmed = title.trim()
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Task title cannot be empty' }
  }
  
  if (trimmed.length > 500) {
    return { valid: false, error: 'Task title is too long (max 500 characters)' }
  }
  
  return { valid: true, error: null }
}

