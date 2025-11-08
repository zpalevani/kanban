# Changelog

## [1.0.1] - 2025-01-XX

### Fixed
- ✅ Fixed package.json: Updated name from "google-analytics-mcp" to "kanban-board"
- ✅ Removed unused Google Analytics dependencies and files
- ✅ Improved task ID generation to prevent collisions (uses timestamp + random string)
- ✅ Enhanced error handling with proper logging

### Added
- ✅ Custom `useLocalStorage` hook for better localStorage management
- ✅ Input validation and sanitization utilities
- ✅ Task validation with proper error messages
- ✅ Accessibility improvements (ARIA labels, keyboard navigation, focus management)
- ✅ Component breakdown: Extracted TaskMenu and TaskNotes from TaskCard
- ✅ Performance optimizations: Memoized callbacks and computed values
- ✅ Loading states for form submissions
- ✅ Better keyboard support (ESC to close modals, Enter to submit)

### Improved
- ✅ Better error handling with user-friendly messages
- ✅ Input sanitization to prevent XSS
- ✅ Focus management for better UX
- ✅ Disabled states for buttons during submission
- ✅ Better component organization and separation of concerns

### Changed
- ✅ Refactored KanbanBoard to use useCallback and useMemo for performance
- ✅ Updated Column component with better accessibility
- ✅ Improved TaskCard with better keyboard navigation
- ✅ Enhanced form validation and error handling

## [1.0.0] - Initial Release

### Features
- Four-column Kanban board (Backlog, To Do, Doing, Done)
- Task CRUD operations
- Task notes functionality
- Dark/light theme toggle
- Responsive design
- Local storage persistence

