"use client";

import { useEffect, useMemo, useState } from "react";

function formatMeetingTime(startTime) {
  if (!startTime) {
    return "Time not set";
  }

  const date = new Date(startTime);

  if (Number.isNaN(date.getTime())) {
    return startTime;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function MeetingList({ meetings = [], isLoading = false }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const currentTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(now),
    [now],
  );

  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(now),
    [now],
  );

  const hasMeetings = meetings.length > 0;

  return (
    <aside className="flex h-full min-h-[520px] flex-col rounded-2xl bg-white p-6 shadow-md shadow-slate-200/70">
      <div className="border-b border-slate-100 pb-6">
        <p className="text-5xl font-semibold tracking-normal text-slate-950">
          {currentTime}
        </p>
        <p className="mt-2 text-base font-medium text-slate-500">{currentDate}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">Upcoming Meetings</h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {meetings.length}
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {hasMeetings ? (
          meetings.map((meeting, index) => (
            <article
              key={meeting.id ?? `${meeting.title}-${meeting.start_time}-${index}`}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-blue-100 hover:bg-blue-50/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-950">
                    {meeting.title || "Untitled meeting"}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {formatMeetingTime(meeting.start_time)}
                  </p>
                </div>

                <button
                  type="button"
                  className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Start
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <div>
              <p className="text-base font-semibold text-slate-900">
                {isLoading ? "Loading meetings" : "No meetings scheduled"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isLoading
                  ? "Your upcoming meetings will appear here shortly."
                  : "Scheduled meetings will show up here when they are available."}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
