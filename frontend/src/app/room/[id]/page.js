"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

function MicIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 10v2a7 7 0 01-14 0v-2m7 9v3m-4 0h8"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10l4.5-2.6A1 1 0 0121 8.27v7.46a1 1 0 01-1.5.87L15 14m-2 3H5a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 3v5c0 5-3.4 9.4-7 10-3.6-.6-7-5-7-10V6l7-3z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m14-10a4 4 0 10-8 0 4 4 0 008 0zm4 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a8 8 0 01-8 8H7l-4 3 1.5-5A8 8 0 1121 12z"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 14v5a1 1 0 001 1h14a1 1 0 001-1v-5M12 4v12m0-12l-5 5m5-5l5 5"
      />
    </svg>
  );
}

function ControlButton({ label, icon, className = "" }) {
  return (
    <button
      type="button"
      className={`flex min-w-20 flex-col items-center justify-center gap-1 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${className}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export default function RoomPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <main className="flex h-screen w-full flex-col bg-black font-sans">
      <section className="flex flex-1 items-center justify-center px-6 pb-20">
        <h1 className="text-center text-3xl font-medium tracking-normal text-white sm:text-4xl">
          Meeting Room: {id}
        </h1>
      </section>

      <nav className="fixed inset-x-0 bottom-0 flex h-20 items-center justify-between border-t border-zinc-800 bg-zinc-900 px-6">
        <div className="flex items-center gap-2">
          <ControlButton label="Mute" icon={<MicIcon />} />
          <ControlButton label="Stop Video" icon={<VideoIcon />} />
        </div>

        <div className="flex items-center gap-2">
          <ControlButton label="Security" icon={<ShieldIcon />} />
          <ControlButton label="Participants" icon={<UsersIcon />} />
          <ControlButton label="Chat" icon={<ChatIcon />} />
          <ControlButton
            label="Share Screen"
            icon={<ShareIcon />}
            className="text-green-500 hover:text-green-400"
          />
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            End
          </button>
        </div>
      </nav>
    </main>
  );
}
