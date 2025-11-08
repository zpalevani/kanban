import { useEffect } from 'react';

/**
 * A custom hook that triggers a handler function when a click occurs outside of the referenced element.
 * @param {React.RefObject} ref - The ref attached to the element to monitor.
 * @param {Function} handler - The function to call on an outside click.
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if the click is inside the ref's element or its descendants
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};