import { useEffect } from 'react'

/**
 * Custom hook for keyboard shortcuts
 * @param {Array} shortcuts - Array of shortcut objects with { key, ctrl, handler }
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input, textarea, or contenteditable
      const target = event.target
      if (
        target.matches('input, textarea, [contenteditable="true"]') ||
        target.closest('input, textarea, [contenteditable="true"]')
      ) {
        // Allow ESC to work even in inputs
        if (event.key === 'Escape') {
          // Let it bubble up
          return
        }
        return
      }

      const key = event.key.toLowerCase()
      const withCtrl = event.ctrlKey || event.metaKey
      const withShift = event.shiftKey
      const withAlt = event.altKey

      shortcuts.forEach(({ key: shortcutKey, ctrl, shift, alt, handler }) => {
        const keyMatch = key === shortcutKey.toLowerCase()
        const ctrlMatch = ctrl === undefined ? false : (ctrl === withCtrl)
        const shiftMatch = shift === undefined ? false : (shift === withShift)
        const altMatch = alt === undefined ? false : (alt === withAlt)

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault()
          event.stopPropagation()
          handler(event)
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

