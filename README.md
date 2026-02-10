# Tori Scout

A generic, preset-based tool for scouting items on **Tori.fi**. Load a preset, filter candidates, and build your procurement list.

![Tori Scout Screenshot](https://via.placeholder.com/800x400?text=Tori+Scout+Screenshot)

## Features

- **Preset System**: Load curated search lists for any topic (routers, retro gaming, cameras, etc.)
- **Smart Filtering**: Filter by category, price, or custom fields
- **Procurement List**: Track candidates, add direct links, and calculate total cost
- **Local Storage**: Your list and active preset are saved automatically

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173)

## Creating Custom Presets

You can create your own private presets!

1. Copy the template:
   ```bash
   cp src/data/presets/routers.example.js src/data/presets/my-preset.js
   ```

2. Edit `my-preset.js` with your own search items and rules.
3. The app will automatically load any valid `.js` file in `src/data/presets/` (restart dev server if adding a new file).

**Note:** `pointers.js` and other private presets can be added to `.gitignore` if you don't want to share them.

## Testing (TDD)

This project follows TDD best practices using **Vitest** and **React Testing Library**.

- Run tests once:
  ```bash
  npm test
  ```

- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```

## Project Structure

- `src/data/presets/`: Where the magic happens. Drop your presets here.
- `src/components/`: Reusable UI components (ItemCard, PresetSwitcher).
- `src/App.jsx`: The main shell that loads presets and manages state.
