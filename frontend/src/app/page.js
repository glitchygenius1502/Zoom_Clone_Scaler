"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionCard from "@/components/ActionCard";
import JoinMeetingModal from "@/components/JoinMeetingModal";
import MeetingList from "@/components/MeetingList";
import Navbar from "@/components/Navbar";
import ScheduleMeetingModal from "@/components/ScheduleMeetingModal";

function VideoIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
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

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3M5 11h14M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
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

export default function Home() {
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

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
    try {
      const response = await fetch(`http://localhost:8000/meetings/${meetingId}`);

      if (response.ok) {
        setIsJoinModalOpen(false);
        router.push("/room/" + meetingId);
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

  const actions = [
    {
      title: "New Meeting",
      iconBgColor: "bg-orange-500",
      icon: <VideoIcon />,
      onClick: handleNewMeeting,
    },
    {
      title: "Join",
      iconBgColor: "bg-blue-600",
      icon: <PlusIcon />,
      onClick: () => setIsJoinModalOpen(true),
    },
    {
      title: "Schedule",
      iconBgColor: "bg-blue-500",
      icon: <CalendarIcon />,
      onClick: () => setIsScheduleModalOpen(true),
    },
    {
      title: "Share Screen",
      iconBgColor: "bg-emerald-500",
      icon: <ShareIcon />,
      onClick: () => console.log("Share Screen clicked"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <Navbar />

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className="flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Welcome back
            </h1>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {actions.map((action) => (
              <ActionCard
                key={action.title}
                title={action.title}
                iconBgColor={action.iconBgColor}
                icon={action.icon}
                onClick={action.onClick}
              />
            ))}
          </div>
        </section>

        <MeetingList meetings={meetings} isLoading={isLoading} />
      </main>

      <JoinMeetingModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinMeeting}
      />
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleMeeting}
      />
      </div>
  );
}
