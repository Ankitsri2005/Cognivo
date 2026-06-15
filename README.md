# Cognivo — Visual Canvas

An infinite spatial canvas for productivity and life-mapping. Built for the Devlynix Buildathon.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, React Flow 11, Lucide Icons
- **State:** Zustand 5
- **AI:** Google Gemini 1.5 Flash (via `@google/generative-ai`)

## Features

- **Infinite Canvas** — Drag, zoom, and organize nodes freely
- **Node Types** — Goals, Tasks, Milestones with custom visuals
- **Eisenhower Matrix** — Classify tasks by urgency/importance
- **Smart Brain Dump** — Paste thoughts, auto-sort into quadrants (local or AI)
- **YouTube Roadmap Extractor** — Paste a video URL, extract actionable steps
- **Deadline Conflict Detection** — Finds overlapping deadlines
- **Time Reality Check** — Warns if workload exceeds available time
- **Voice Input** — Speech-to-text for brain dumps (Chrome/Edge)
- **Node Search** — Ctrl+K to search and jump to any node
- **Persistent State** — Canvas auto-saves to localStorage

## Getting Started

```bash
# Install
npm install

# Add your Gemini API key
# Edit .env.local:
GEMINI_API_KEY="your-key-here"

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No* | Google Gemini API key for AI features |

*Brain Dump & YouTube extract fall back to local keyword matching if no key is set.

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API routes
│   ├── api/          # API routes (brain-dump, youtube-extract)
│   ├── canvas/       # Canvas page
│   └── page.js       # Dashboard page
├── components/
│   ├── canvas/       # React Flow workspace
│   ├── eisenhower/   # Eisenhower Matrix component
│   ├── layout/       # Sidebar, Header
│   ├── nodes/        # GoalNode, TaskNode, MilestoneNode
│   ├── panels/       # BrainDump, YouTube, Conflict, NodeDetail
│   └── ui/           # Button, Badge, Modal, Toast
├── constants/        # Theme, node types
├── hooks/            # useVoiceInput
├── store/            # Zustand stores (useAppStore, useCanvasStore)
└── utils/            # Helpers (eisenhower, nodeFactory, conflictDetector, etc.)
```
