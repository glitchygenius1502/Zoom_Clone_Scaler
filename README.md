# 🎥 Zoom Workplace Clone

A full-stack, real-time video conferencing application built to replicate the core experience of Zoom. This platform features secure, low-latency video rooms, real-time chat, interactive reactions, and robust host controls, all wrapped in a pixel-perfect, custom-designed dark mode UI.

## ✨ Key Features

* **Real-Time Video & Audio:** High-quality, low-latency WebRTC communication.
* **Custom UI/UX:** A highly customized, responsive dark-theme interface that overrides default SDK layouts for a seamless, professional look.
* **Dynamic Room Generation:** Instantly generate secure, unique meeting links to share with participants.
* **Pre-Join Lobby:** Users can enter their display name before entering the room, ensuring everyone is properly identified.
* **In-Meeting Chat:** Real-time text messaging alongside the video feed.
* **Host Controls:** * Mute all participants simultaneously.
  * Remove disruptive participants from the room.
* **Live Reactions:** Floating emoji reactions to maintain engagement.
* **Screen Sharing:** One-click screen sharing for presentations.
* **One-Click Invites:** Integrated clipboard functionality to instantly copy and share meeting links.

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS
* **Video Infrastructure:** ZegoCloud (UIKit Prebuilt)
* **Deployment:** Vercel

**Backend:**
* **Framework:** FastAPI (Python)
* **Database:** SQLite (via SQLAlchemy)
* **Deployment:** Render

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js (v18+)
* Python (3.11+)
* A [ZegoCloud](https://www.zegocloud.com/) account for WebRTC credentials.

### 1. Backend Setup (FastAPI)
Navigate to the backend directory and set up your Python environment:

    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt

Start the local server:

    uvicorn main:app --reload --port 8000

### 2. Frontend Setup (Next.js)
Navigate to the frontend directory and install dependencies:

    cd frontend
    npm install

Create a `.env.local` file in the root of your frontend directory and add your ZegoCloud credentials:

    NEXT_PUBLIC_ZEGO_APP_ID=your_app_id_here
    NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_server_secret_here

Start the development server:

    npm run dev

Open [https://zoom-clone-scaler.vercel.app/](https://zoom-clone-scaler.vercel.app/) in your browser to view the application.

## 🌍 Deployment

This project is fully configured for cloud deployment.
* **Frontend:** Pushed to Vercel for fast, edge-network delivery. Ensure your ZegoCloud keys are added to the Vercel Environment Variables.
* **Backend:** Deployed via Render as a Python Web Service. CORS middleware is configured to accept requests from the deployed Vercel domain.

## 👨‍💻 Author

Built by **Lekhni Bakliwal**