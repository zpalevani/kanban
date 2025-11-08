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

- Node.js (v16 or higher)
- npm or yarn

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

## Usage

- **Add Task**: Click "+ Add Task" button in any column
- **Edit Task**: Click on the task title
- **Complete Task**: Check the checkbox next to the task
- **Move Task**: Click the menu (⋮) → "Move to" → Select column
- **Add Notes**: Click the menu (⋮) → "Notes"
- **Delete Task**: Click the menu (⋮) → "Delete"
- **Toggle Theme**: Click the sun/moon button in the top right

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The workflow runs on every push to the `main` branch.

To manually deploy:
1. Build the project: `npm run build`
2. Push the `dist` folder to the `gh-pages` branch (or configure GitHub Pages to use the `dist` folder)

## Built With

- React 18
- Vite
- CSS3 (Custom Properties)

## Author

Made by Zara Palevani
