# 🧠 Cognivo — Visual Second Brain

> Your thoughts, organized. Your tasks, prioritized.

🔗 **Live Demo:** https://cognivowltc.onrender.com

🎥 **Demo Video:** 
https://youtu.be/fInVPDobzoE
---

## 📌 Problem Statement

Students and knowledge workers constantly struggle with information overload — they consume content from YouTube, attend lectures, and juggle dozens of tasks, but have no unified way to capture, connect, and prioritize it all.

Cognivo solves this by giving you an AI-powered visual canvas where your knowledge and tasks live together.

---

## ✨ Features

1. **Brain Dump → Eisenhower Matrix** — Paste or speak your chaotic thoughts, and AI (Gemini 1.5 Flash) instantly sorts them into the Eisenhower Matrix (Urgent/Important quadrants).
2. **YouTube → Actionable Roadmap** — Paste any YouTube URL and AI extracts the transcript into a clean 4–8 step roadmap.
3. **Voice Input** — Speak your thoughts naturally using voice-to-text, transcribed directly into the AI sorting pipeline.
4. **Smart Node Search** — Instantly search across all canvas nodes by keyword, tag, or topic.
5. **Reminders & Notifications** — Set due dates on tasks and get timely notifications.
6. **Visual Canvas** — All goals, tasks, and knowledge become draggable nodes on a React Flow canvas.

---

## 🛠️ Tech Stack

- Next.js 16
- React 19
- React Flow
- Zustand
- Google Gemini
- Web Speech API
- YouTube Transcript API
- CSS3

---

## 🚧 Challenges We Ran Into

1. **YouTube Transcript Extraction** — Handled videos without captions via proper error handling and fallback messages.
2. **Gemini Response Parsing** — Added a cleanup layer to strip markdown code blocks before JSON parsing.
3. **Real-time Voice Input** — Built a custom `useVoiceInput` hook to manage Web Speech API for interim transcripts and browser compatibility.
4. **Local vs AI Classification Fallback** — Designed error boundaries for seamless fallback from Gemini AI to local keyword-based sorting.
