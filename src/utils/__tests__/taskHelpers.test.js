import { describe, it, expect } from 'vitest'
import { generateTaskId, sanitizeInput, validateTaskTitle } from '../taskHelpers'

describe('taskHelpers', () => {
  describe('generateTaskId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateTaskId()
      const id2 = generateTaskId()
      expect(id1).not.toBe(id2)
    })

    it('should match expected format', () => {
      const id = generateTaskId()
      expect(id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('should generate IDs with timestamp prefix', () => {
      const id = generateTaskId()
      const timestamp = parseInt(id.split('-')[0])
      expect(timestamp).toBeGreaterThan(0)
      expect(timestamp).toBeLessThanOrEqual(Date.now())
    })
  })

  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>hello'
      const result = sanitizeInput(input)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('</script>')
    })

    it('should remove angle brackets', () => {
      expect(sanitizeInput('hello<>world')).toBe('helloworld')
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello')
    })

    it('should limit length to 500 characters', () => {
      const longString = 'a'.repeat(1000)
      const result = sanitizeInput(longString)
      expect(result.length).toBe(500)
    })

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('')
    })

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
      expect(sanitizeInput(123)).toBe('')
    })
  })

  describe('validateTaskTitle', () => {
    it('should accept valid titles', () => {
      const result = validateTaskTitle('Valid task')
      expect(result.valid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should reject empty titles', () => {
      const result = validateTaskTitle('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Task title is required')
    })

    it('should reject whitespace-only titles', () => {
      const result = validateTaskTitle('   ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Task title cannot be empty')
    })

    it('should reject too long titles', () => {
      const longTitle = 'a'.repeat(501)
      const result = validateTaskTitle(longTitle)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('too long')
    })

    it('should accept titles at max length', () => {
      const maxTitle = 'a'.repeat(500)
      const result = validateTaskTitle(maxTitle)
      expect(result.valid).toBe(true)
    })

    it('should handle non-string inputs', () => {
      const result = validateTaskTitle(null)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Task title is required')
    })
  })
})

