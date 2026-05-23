"use client";

import { useState } from "react";

export default function JoinMeetingModal({ isOpen, onClose, onJoin }) {
  const [meetingId, setMeetingId] = useState("");
  const [name, setName] = useState("Participant");

  if (!isOpen) {
    return null;
  }

  const trimmedMeetingId = meetingId.trim();
  const trimmedName = name.trim();

  function handleSubmit(event) {
    event.preventDefault();

    if (!trimmedMeetingId || !trimmedName) {
      return;
    }

    onJoin(trimmedMeetingId, trimmedName);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl"
      >
        <header className="flex h-11 items-center justify-between border-b border-slate-200 bg-slate-100 px-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              zm
            </span>
            <span className="text-base font-medium text-slate-500">
              Zoom Workplace
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-3xl font-light leading-none text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close join meeting dialog"
          >
            ×
          </button>
        </header>

        <div className="px-14 py-12">
          <h2 className="text-4xl font-bold tracking-normal text-slate-950">
            Join meeting
          </h2>

          <label className="sr-only" htmlFor="meeting-id">
            Meeting ID or personal link name
          </label>
          <div className="relative mt-10">
            <input
              id="meeting-id"
              type="text"
              value={meetingId}
              onChange={(event) => setMeetingId(event.target.value)}
              placeholder="Meeting ID or personal link name"
              className="h-16 w-full rounded-2xl border-2 border-slate-400 px-5 pr-12 text-xl text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-slate-950">
              ⌄
            </span>
          </div>

          <label className="sr-only" htmlFor="participant-name">
            Your name
          </label>
          <div className="relative mt-8">
            <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-600">
              Your name
            </span>
            <input
              id="participant-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-16 w-full rounded-2xl border-2 border-blue-600 px-5 text-xl text-slate-950 outline-none transition focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-8 space-y-5">
            <label className="flex cursor-pointer items-center gap-4 text-lg font-medium text-slate-950">
              <input
                type="checkbox"
                className="h-6 w-6 rounded-md border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span>Don&apos;t connect to audio</span>
            </label>

            <label className="flex cursor-pointer items-center gap-4 text-lg font-medium text-slate-950">
              <input
                type="checkbox"
                className="h-6 w-6 rounded-md border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span>Turn off my video</span>
            </label>
          </div>

          <div className="mt-10 flex justify-end gap-5">
            <button
              type="submit"
              disabled={!trimmedMeetingId || !trimmedName}
              className="rounded-xl bg-blue-600 px-12 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Join
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-slate-400 bg-white px-10 py-3 text-lg font-medium text-slate-950 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
