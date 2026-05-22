"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ScheduleMeetingModal from "@/components/ScheduleMeetingModal";
import ZoomActionButton from "@/components/ZoomActionButton";

function CameraIcon({ className = "h-7 w-7" }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 7.5A2.5 2.5 0 016.5 5h7A2.5 2.5 0 0116 7.5v9a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 014 16.5v-9zm13.7 2.2l2.4-1.6A1.2 1.2 0 0122 9.1v5.8a1.2 1.2 0 01-1.9 1l-2.4-1.6V9.7z" />
    </svg>
  );
}

function PlusIcon({ className = "h-7 w-7" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
    </svg>
  );
}

function CalendarIcon({ className = "h-7 w-7" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v4m8-4v4M5 10h14M7 20h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v11a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14h.01M12 14h.01M15 14h.01" />
    </svg>
  );
}

function ShareIcon({ className = "h-7 w-7" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V5m0 0l-4 4m4-4l4 4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" />
    </svg>
  );
}

function LineIcon({ children }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  );
}

function NavItem({ label, active = false, icon }) {
  return (
    <button
      type="button"
      className={`flex w-full flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-medium transition-colors ${
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function EmptyMeetingsIllustration() {
  return (
    <div className="relative mx-auto h-24 w-36">
      <div className="absolute bottom-3 left-1/2 h-7 w-20 -translate-x-1/2 rounded-full bg-indigo-50" />
      <div className="absolute left-14 top-7 h-16 w-1.5 -rotate-2 rounded-full bg-indigo-200" />
      <div className="absolute left-9 top-6 h-7 w-24 -rotate-12 bg-indigo-200 [clip-path:polygon(0_30%,100%_0,70%_70%,35%_52%)]" />
      <div className="absolute left-14 top-6 h-6 w-20 rotate-12 bg-indigo-100 [clip-path:polygon(0_0,100%_30%,58%_68%,24%_42%)]" />
      <div className="absolute bottom-6 left-14 h-2 w-12 -rotate-6 rounded-full bg-indigo-200" />
    </div>
  );
}

function EmptyRecordingsIllustration() {
  return (
    <div className="mx-auto flex h-24 w-36 items-center justify-center">
      <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="h-8 w-8 rounded-full border-4 border-slate-300" />
      </div>
    </div>
  );
}

function formatMeetingTime(startTime) {
  if (!startTime) return "Time not set";

  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return startTime;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function Home() {
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const [now, setNow] = useState(null);

  async function fetchMeetings(isActive = () => true) {
    try {
      const response = await fetch("http://localhost:8000/users/1/meetings");

      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }

      const data = await response.json();
      if (isActive()) {
        setMeetings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);

      if (isActive()) {
        setMeetings([]);
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    let isActive = true;

    Promise.resolve().then(() => fetchMeetings(() => isActive));

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  async function handleNewMeeting() {
    const response = await fetch("http://localhost:8000/meetings/instant/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ host_id: 1 }),
    });

    if (!response.ok) {
      throw new Error("Failed to create instant meeting");
    }

    const data = await response.json();
    router.push(`/room/${data.meeting_id}`);
  }

  async function handleJoinMeeting(meetingId) {
    const trimmedMeetingId = meetingId.trim();

    if (!trimmedMeetingId) {
      alert("Enter a Meeting ID to join.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/meetings/join/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meeting_id: trimmedMeetingId }),
      });

      if (response.ok) {
        router.push("/room/" + trimmedMeetingId);
        return;
      }

      alert("Invalid Meeting ID. Please check the code and try again.");
    } catch {
      alert("Unable to connect to the server.");
    }
  }

  async function handleScheduleMeeting({ topic, date, time }) {
    try {
      const scheduledAt = `${date}T${time}:00`;
      const response = await fetch("http://localhost:8000/meetings/schedule/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: topic,
          scheduled_at: scheduledAt,
          start_time: scheduledAt,
          duration: 30,
          host_id: 1,
        }),
      });

      if (response.ok) {
        setIsScheduleModalOpen(false);
        await fetchMeetings();
        alert("Meeting Scheduled!");
        return;
      }

      alert("Failed to schedule meeting.");
    } catch {
      alert("Failed to schedule meeting.");
    }
  }

  const clockTime = useMemo(() => {
    if (!now) return "--:-- --";

    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .format(now)
      .replace(":", ".")
      .toUpperCase();
  }, [now]);

  const currentDate = useMemo(() => {
    if (!now) return "Friday, May 22, 2026.";

    return `${new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(now)}.`;
  }, [now]);

  const todayLabel = useMemo(() => {
    if (!now) return "Today, May 22";

    return new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
    }).format(now);
  }, [now]);

  const hasMeetings = meetings.length > 0;

  return (
    <div className="min-h-screen bg-[#e8edf3] text-slate-900">
      <header className="flex h-14 items-center justify-between px-5">
        <div className="flex w-56 items-center gap-7">
          <div className="leading-none">
            <div className="text-xs font-semibold lowercase text-slate-700">zoom</div>
            <div className="text-lg font-bold tracking-normal text-slate-800">
              Workplace
            </div>
          </div>
          <div className="hidden items-center gap-4 text-slate-500 lg:flex">
            <button type="button" className="text-2xl leading-none hover:text-slate-800">
              ‹
            </button>
            <button type="button" className="text-2xl leading-none text-slate-300">
              ›
            </button>
          </div>
        </div>

        <div className="hidden h-9 w-[460px] items-center gap-3 rounded-xl bg-slate-300/70 px-4 text-slate-600 lg:flex">
          <LineIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </LineIcon>
          <span className="text-sm font-medium">Search (Ctrl+F)</span>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          {["+", "!", "▣", "*"].map((item) => (
            <button
              key={item}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm hover:bg-white"
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-sm font-semibold text-white"
            aria-label="User profile"
          >
            P
            <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-[#e8edf3] bg-green-500" />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)] gap-3 px-2 pb-2">
        <aside className="flex w-[92px] shrink-0 flex-col items-center justify-between rounded-2xl py-2">
          <div className="flex w-full flex-col gap-1.5">
            <NavItem active label="Home" icon={<LineIcon><path strokeLinecap="round" strokeLinejoin="round" d="M3 11l9-8 9 8M5 10v10h14V10" /></LineIcon>} />
            <NavItem label="Meetings" icon={<LineIcon><path strokeLinecap="round" strokeLinejoin="round" d="M4 8h9v8H4zM16 10l4-2v8l-4-2z" /></LineIcon>} />
            <NavItem label="Team Chat" icon={<LineIcon><path strokeLinecap="round" strokeLinejoin="round" d="M5 6h10v7H9l-4 4v-4H5zM14 11h5v6h-2v3l-3-3h-2" /></LineIcon>} />
            <NavItem label="Scheduler" icon={<LineIcon><path strokeLinecap="round" strokeLinejoin="round" d="M7 3v4m10-4v4M5 8h14v12H5zM9 12h2m2 0h2m-6 4h2m2 0h2" /></LineIcon>} />
            <NavItem label="Hub" icon={<LineIcon><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l4 4-4 4-4-4 4-4zM5 13l4 4-4 4-4-4 4-4zm14 0l4 4-4 4-4-4 4-4z" /></LineIcon>} />
            <div className="mx-3 border-t border-slate-300" />
            <NavItem label="Clips" icon={<LineIcon><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4zM9 10l5 2-5 2z" /></LineIcon>} />
            <NavItem label="More" icon={<LineIcon><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" /></LineIcon>} />
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-white"
            aria-label="Settings"
          >
            ⚙
          </button>
        </aside>

        <main className="flex min-w-0 flex-1 overflow-hidden rounded-2xl bg-white">
          <section className="flex min-w-0 flex-1 flex-col items-center overflow-y-auto px-8 py-10">
            <div className="text-center">
              <p className="text-4xl font-semibold tracking-normal text-slate-900">
                {clockTime}
              </p>
              <p className="mt-1.5 text-lg font-normal text-slate-500">{currentDate}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-start justify-center gap-6">
              <ZoomActionButton
                label="New meeting"
                onClick={handleNewMeeting}
                hasDropdown
                buttonClassName="bg-orange-600 group-hover:bg-orange-700"
              >
                <CameraIcon />
              </ZoomActionButton>

              <ZoomActionButton label="Join" onClick={() => handleJoinMeeting(joinMeetingId)}>
                <PlusIcon />
              </ZoomActionButton>

              <ZoomActionButton label="Schedule" onClick={() => setIsScheduleModalOpen(true)}>
                <CalendarIcon />
              </ZoomActionButton>

              <ZoomActionButton label="Share screen" onClick={() => console.log("Share screen clicked")}>
                <ShareIcon />
              </ZoomActionButton>

              <div className="flex h-20 flex-col justify-center">
                <input
                  type="text"
                  value={joinMeetingId}
                  onChange={(event) => setJoinMeetingId(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleJoinMeeting(joinMeetingId);
                    }
                  }}
                  placeholder="Meeting ID"
                  className="h-9 w-36 rounded-lg border border-slate-300 bg-white px-3 text-center text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  aria-label="Meeting ID"
                />
              </div>
            </div>

            <div className="mt-8 grid w-full max-w-6xl gap-4 xl:grid-cols-2">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-slate-50 px-5">
                  <button type="button" className="text-2xl font-light text-slate-600">
                    +
                  </button>
                  <h2 className="text-base font-semibold text-slate-900">
                    Today, {todayLabel}
                  </h2>
                  <button type="button" className="text-xl text-slate-600">
                    ...
                  </button>
                </header>

                <div className="flex min-h-[340px] flex-col">
                  <div className="flex h-12 items-center gap-4 border-b border-slate-200 px-5 text-slate-700">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium"
                    >
                      Today
                    </button>
                    <button type="button" className="text-xl">‹</button>
                    <button type="button" className="text-xl">›</button>
                    {hasMeetings && (
                      <span className="ml-auto text-xs font-medium text-slate-500">
                        {meetings.length} meetings
                      </span>
                    )}
                  </div>

                  {hasMeetings ? (
                    <div className="max-h-[300px] flex-1 space-y-2 overflow-y-auto p-4 pr-3">
                      {meetings.map((meeting, index) => (
                        <article
                          key={meeting.id ?? `${meeting.title}-${meeting.start_time}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-900">
                              {meeting.title || "Untitled meeting"}
                            </h3>
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {formatMeetingTime(meeting.start_time)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => router.push("/room/" + meeting.id)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                          >
                            Start
                          </button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                      <EmptyMeetingsIllustration />
                      <p className="mt-4 text-sm text-slate-600">
                        {isLoading ? "Loading meetings..." : "No meetings scheduled."}
                      </p>
                      {!isLoading && (
                        <button
                          type="button"
                          onClick={() => setIsScheduleModalOpen(true)}
                          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          + Schedule a meeting
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-slate-50 px-5">
                  <h2 className="text-base font-semibold text-slate-900">Recordings</h2>
                  <button type="button" className="text-xl text-slate-600">
                    ...
                  </button>
                </header>
                <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
                  <EmptyRecordingsIllustration />
                  <p className="mt-4 text-sm text-slate-600">No recorded meetings found</p>
                  <button
                    type="button"
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Open recordings
                  </button>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>

      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleMeeting}
      />
    </div>
  );
}
