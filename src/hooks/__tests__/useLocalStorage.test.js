import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('should return value from localStorage when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('stored-value')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  it('should handle objects', () => {
    const initialValue = { name: 'test' }
    const { result } = renderHook(() => useLocalStorage('test-key', initialValue))
    
    expect(result.current[0]).toEqual(initialValue)

    act(() => {
      result.current[1]({ name: 'updated' })
    })

    expect(result.current[0]).toEqual({ name: 'updated' })
    expect(JSON.parse(localStorage.getItem('test-key'))).toEqual({ name: 'updated' })
  })

  it('should handle arrays', () => {
    const initialValue = [1, 2, 3]
    const { result } = renderHook(() => useLocalStorage('test-key', initialValue))
    
    expect(result.current[0]).toEqual(initialValue)

    act(() => {
      result.current[1]([4, 5, 6])
    })

    expect(result.current[0]).toEqual([4, 5, 6])
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json')
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    // Should fall back to initial value
    expect(result.current[0]).toBe('initial')
  })
})

