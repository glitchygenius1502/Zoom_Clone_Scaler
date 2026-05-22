"use client";

import { useState } from "react";

export default function JoinMeetingModal({ isOpen, onClose, onJoin }) {
  const [meetingId, setMeetingId] = useState("");

  if (!isOpen) {
    return null;
  }

  const trimmedMeetingId = meetingId.trim();

  function handleSubmit(event) {
    event.preventDefault();

    if (!trimmedMeetingId) {
      return;
    }

    onJoin(trimmedMeetingId);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <header className="border-b border-slate-100 py-4 text-center">
          <h2 className="text-lg font-semibold text-slate-900">Join Meeting</h2>
        </header>

        <div className="px-6 py-6">
          <label className="sr-only" htmlFor="meeting-id">
            Meeting ID or Personal Link Name
          </label>
          <input
            id="meeting-id"
            type="text"
            value={meetingId}
            onChange={(event) => setMeetingId(event.target.value)}
            placeholder="Meeting ID or Personal Link Name"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <div className="mt-5 space-y-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span>Do not connect to audio</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span>Turn off my video</span>
            </label>
          </div>
        </div>

        <footer className="flex justify-end gap-3 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!trimmedMeetingId}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Join
          </button>
        </footer>
      </form>
    </div>
  );
}
