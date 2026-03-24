# Digital Mind / Thought Tracker

A modern thought tracker built with React + Vite.

The app helps you capture and organize thoughts, ideas, notes, and tasks in a calm, dark, card-based workspace with Kanban flow.

## Creator

- GitHub: [@Siw115](https://github.com/Siw115)

## Features

- Kanban board with status columns:
  - `Idea`
  - `In Progress`
  - `Done`
- Drag-and-drop between status columns
- Create, edit, and delete thoughts
- Search by title, description, and next action
- Filter by category
- Add new categories directly from the modal
- Optional icon per thought (Twemoji PNG pack)
- Next action + due date support
- Due date badges:
  - `Overdue`
  - `Due today`
- Multi-language UI:
  - English
  - Dutch
- Multiple dashboard themes (full palette switch)
- Profile-based local persistence (no authentication required)

## Tech Stack

- React
- Vite
- CSS (custom theme system using CSS variables)
- LocalStorage for persistence

## Run Locally

```bash
npm install
npm run dev
```

Open the app at the local URL shown by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/
  data/
  i18n/
  utils/
  App.jsx
  main.jsx
  styles.css
public/
  assets/
```

## Notes

- Thoughts are stored per profile name on the same device/browser.
- No backend is required for the current version.
- Architecture is component-based and ready to extend with an API later.
