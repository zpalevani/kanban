# Kanban Board

A modern, responsive Kanban board built with React and Vite. Features a beautiful dark/light theme with black and dark duck green color scheme.

## 🌐 Live Demo

**GitHub Pages**: [https://zpalevani.github.io/kanban/](https://zpalevani.github.io/kanban/)

## Features

- 📋 **Four Columns**: Backlog, To Do, Doing, Done
- ✅ **Task Management**: Complete, edit, delete, and move tasks between columns
- 📝 **Notes**: Add detailed notes to each task
- 🌓 **Dark Mode Toggle**: Switch between dark and light themes
- 💾 **Local Storage**: All tasks are automatically saved
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- Node.js 20.19+ (20.x) or 22.12+ (22.x or newer), required by the installed Vite version
- npm (the repository includes `package-lock.json`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zpalevani/kanban.git
cd kanban
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Usage

### Basic Operations

- **Add Task**: Click "+ Add Task" button in any column
- **Edit Task**: Click on the task title (or use the menu)
- **Complete Task**: Check the checkbox next to the task
- **Move Task**: Click the menu (⋮) → "Move to" → Select column
- **Add Notes**: Click the menu (⋮) → "Notes"
- **Delete Task**: Click the menu (⋮) → "Delete"
- **Toggle Theme**: Click the sun/moon button in the top right

### Keyboard Shortcuts

- **Ctrl+T (Cmd+T on Mac)**: Toggle dark/light theme
- **ESC**: Close modals, cancel editing, close menus
- **Enter**: Save task when editing

### Data Management

- **Export**: Click "Export" button to download all tasks as JSON
- **Import**: Click "Import" button to load tasks from a JSON file
- All data is automatically saved to browser's localStorage

### Features

- ✅ **Error Boundary**: App gracefully handles errors without crashing
- ✅ **Toast Notifications**: Visual feedback for all operations
- ✅ **Input Validation**: Prevents invalid data entry
- ✅ **Accessibility**: Full keyboard navigation and screen reader support
- ✅ **Performance**: Optimized with React.memo and useMemo
- ✅ **Type Safety**: PropTypes validation for all components

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The workflow runs on every push to the `main` branch.

To manually deploy:
1. Build the project: `npm run build`
2. Push the `dist` folder to the `gh-pages` branch (or configure GitHub Pages to use the `dist` folder)

## Built With

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **PropTypes** - Runtime type checking
- **CSS3** - Custom properties for theming

## Testing

The project includes comprehensive unit tests for utilities and hooks:

- Task helper functions (ID generation, validation, sanitization)
- LocalStorage hook
- Component tests (coming soon)

Run tests with `npm test` or view coverage with `npm run test:coverage`.

## Code Quality

- ✅ **Error Boundaries** - Prevents app crashes
- ✅ **PropTypes** - Runtime type validation
- ✅ **Accessibility** - WCAG compliant
- ✅ **Performance** - Memoized components and callbacks
- ✅ **Security** - Input sanitization and XSS prevention

## Author

Made by Zara Palevani
