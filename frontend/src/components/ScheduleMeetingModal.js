"use client";

import { useState } from "react";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function ScheduleMeetingModal({ isOpen, onClose, onSchedule }) {
  const [topic, setTopic] = useState("My Meeting");
  const [date, setDate] = useState(getTodayDate);
  const [time, setTime] = useState(getCurrentTime);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSchedule({ topic, date, time });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="border-b border-slate-200 py-4 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Schedule Meeting
          </h2>
        </header>

        <div className="space-y-5 p-6">
          <div>
            <label
              htmlFor="schedule-topic"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              Topic
            </label>
            <input
              id="schedule-topic"
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-slate-800">Date & Time</p>
            <div className="flex gap-4">
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                aria-label="Meeting date"
              />
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                aria-label="Meeting time"
              />
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
