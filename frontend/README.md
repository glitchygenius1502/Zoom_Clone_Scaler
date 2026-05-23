# Zoom Clone Frontend

This is the Next.js App Router frontend for a Zoom-style video conferencing assignment. It focuses on the Zoom dashboard workflow, meeting creation and joining, scheduling, and a ZegoCloud-powered meeting room.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- ZegoCloud UIKit Prebuilt for WebRTC meeting rooms
- FastAPI backend expected at `http://localhost:8000`
- SQLite database handled by the backend

## Core Features

- Zoom-like landing dashboard with sidebar navigation and profile placeholders
- Instant meeting creation through `POST /meetings/instant/`
- Join meeting flow with display name and Meeting ID or invite link validation
- Schedule meeting flow with topic, description, date, time, and duration
- Upcoming meetings section separated from recent meetings
- Copy invite link support for previews and scheduled meetings
- Meeting preview screen before entering a room
- ZegoCloud video room with custom Zoom-like controls
- Meeting chat panel, reactions, screen share trigger, host tools, mute all, and participant remove action

## Assumptions

- A default user is already logged in. The frontend uses `host_id: 1`.
- The backend seeds or contains user `id = 1`.
- Meeting room URLs use `/room/{meeting_id}` where `meeting_id` is the generated public code, not the numeric database id.
- No authentication is required for the assignment scope.

## Environment

Create `.env.local` in this frontend directory:

```bash
NEXT_PUBLIC_ZEGO_APP_ID=your_zego_app_id
NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_zego_server_secret
```

## Run Locally

Start the backend first from the backend directory:

```bash
uvicorn main:app --reload
```

Then start the frontend:

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Build And Verify

```bash
npm run lint
npm run build
```

Both commands should pass before submission.

## Assignment Notes

The UI is intentionally modeled after Zoom Workplace: dashboard actions, join dialog, pre-join preview, and meeting room controls are implemented as modular client components. The backend remains the source of truth for meeting creation, validation, scheduling, and meeting listing.
