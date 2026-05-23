"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function ToolbarButton({ children, label, onClick, active = false, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-w-16 flex-col items-center justify-center gap-1 rounded-md px-2 py-1.5 transition-colors ${
        active ? "bg-zinc-800" : "hover:bg-zinc-900"
      } ${danger ? "text-red-500" : "text-white"}`}
    >
      <span>{children}</span>
      <span className="text-[13px] font-medium leading-none">{label}</span>
    </button>
  );
}

function Slash({ show }) {
  if (!show) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-red-500"
    />
  );
}

function MicIcon({ muted = false }) {
  return (
    <span className="relative inline-flex">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2m7 9v3m-4 0h8" />
      </svg>
      <Slash show={muted} />
    </span>
  );
}

function VideoIcon({ muted = false }) {
  return (
    <span className="relative inline-flex">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.5-2.6A1 1 0 0121 8.27v7.46a1 1 0 01-1.5.87L15 14m-2 3H5a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2z" />
      </svg>
      <Slash show={muted} />
    </span>
  );
}

function ParticipantsIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m11-11a4 4 0 10-8 0 4 4 0 008 0zm9 11v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a8 8 0 01-8 8H7l-4 3 1.5-5A8 8 0 1121 12z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V5m0 0l-4 4m4-4l4 4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 5-3.4 9.4-7 10-3.6-.6-7-5-7-10V6l7-3z" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-7 w-7 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1v3.49a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.24 1.01l-2.21 2.2z" />
    </svg>
  );
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function ZegoVideoRoom({ roomID }) {
  const router = useRouter();
  const zegoInstanceRef = useRef(null);
  const mountedElementRef = useRef(null);
  const zegoRootRef = useRef(null);
  const userIDRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const meetingTitle = useMemo(() => "Parth Sharma's Zoom Meeting", []);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function clickZegoControl(candidates) {
    const root = zegoRootRef.current;
    if (!root) return false;
    const controls = Array.from(root.querySelectorAll("button, [role='button']"));
    const match = controls.find((control) => {
      const text = `${control.textContent || ""} ${control.getAttribute("aria-label") || ""} ${control.getAttribute("title") || ""}`.toLowerCase();
      return candidates.some((candidate) => text.includes(candidate.toLowerCase()));
    });
    if (match) {
      match.click();
      return true;
    }
    return false;
  }

  const setLocalMediaEnabled = useCallback((kind, enabled) => {
    const stream = zegoInstanceRef.current?.localStream;
    const tracks =
      kind === "video"
        ? stream?.getVideoTracks?.()
        : stream?.getAudioTracks?.();

    if (!tracks?.length) return false;

    tracks.forEach((track) => {
      track.enabled = enabled;
    });
    return true;
  }, []);

  const myMeeting = useCallback(
    async (element) => {
      if (!element) {
        try {
          zegoInstanceRef.current?.destroy?.();
        } catch {
          console.warn("ZegoCloud cleaned up in the background.");
        }
        zegoInstanceRef.current = null;
        mountedElementRef.current = null;
        return;
      }
      if (mountedElementRef.current === element) return;

      mountedElementRef.current = element;
      zegoRootRef.current = element;
      setStatus("loading");
      setErrorMessage("");

      try {
        const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
        if (!appID || !serverSecret) throw new Error("Missing ZegoCloud Credentials in .env.local");
        if (!userIDRef.current) userIDRef.current = `user_${Math.floor(Math.random() * 10000)}`;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userIDRef.current,
          "Participant",
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;

        zp.joinRoom({
          container: element,
          scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
          sharedLinks: [{ name: "Join this meeting", url: `${window.location.origin}/room/${roomID}` }],
          layout: "Grid",
          showPreJoinView: false,
          showRoomTimer: false,
          showRoomDetailsButton: false,
          showLayoutButton: false,
          showMoreButton: false,
          showUserList: false,
          showTextChat: false,
          showScreenSharingButton: true,
          showMyMicrophoneToggleButton: true,
          showMyCameraToggleButton: true,
          showAudioVideoSettingsButton: false,
          showLeaveRoomConfirmDialog: false,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          autoHideFooter: false,
          videoScreenConfig: {
            objectFit: "contain",
            localMirror: true,
          },
          onInRoomCommandReceived: (fromUser, command) => {
            try {
              const parsed = JSON.parse(command);
              if (parsed?.type === "chat" && parsed?.text) {
                setChatMessages((messages) => [
                  ...messages,
                  {
                    id: `${Date.now()}-${parsed.text}`,
                    sender: fromUser?.userName || "Participant",
                    text: parsed.text,
                    isMine: false,
                  },
                ]);
              }

              if (parsed?.type === "host-mute-all") {
                setLocalMediaEnabled("audio", false);
                setIsMicMuted(true);
              }

              if (parsed?.type === "host-remove-participant") {
                alert("The host removed you from this meeting.");
                router.push("/");
              }
            } catch {
              if (command) {
                setChatMessages((messages) => [
                  ...messages,
                  {
                    id: `${Date.now()}-${command}`,
                    sender: fromUser?.userName || "Participant",
                    text: command,
                    isMine: false,
                  },
                ]);
              }
            }
          },
          onJoinRoom: () => setStatus("ready"),
          onLeaveRoom: () => {
            if (!isLeaving) router.push("/");
          },
        });
      } catch (error) {
        console.error(error);
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Unable to initialize the video meeting.");
      }
    },
    [isLeaving, roomID, router, setLocalMediaEnabled],
  );
  
  function handleEndCall() {
    setIsLeaving(true);
    try {
      zegoInstanceRef.current?.hangUp?.();
      zegoInstanceRef.current?.destroy?.();
    } catch {
      console.warn("ZegoCloud hangup fallback activated.");
    }
    router.push("/");
  }

  function handleAudioToggle() {
    setIsMicMuted((value) => {
      const nextMuted = !value;
      const changedTrack = setLocalMediaEnabled("audio", !nextMuted);
      if (!changedTrack) clickZegoControl(["microphone", "mic", "audio", "mute"]);
      return nextMuted;
    });
  }

  function handleVideoToggle() {
    setIsVideoMuted((value) => {
      const nextMuted = !value;
      const changedTrack = setLocalMediaEnabled("video", !nextMuted);
      if (!changedTrack) clickZegoControl(["camera", "video"]);
      return nextMuted;
    });
  }

  function showReaction(emoji) {
    setReaction(emoji);
    window.setTimeout(() => setReaction(null), 1600);
  }

  async function handleSendChat(event) {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    setChatMessages((messages) => [
      ...messages,
      {
        id: `${Date.now()}-${text}`,
        sender: "Participant (You)",
        text,
        isMine: true,
      },
    ]);
    setChatInput("");

    try {
      await zegoInstanceRef.current?.sendInRoomCommand?.(
        JSON.stringify({ type: "chat", text }),
        [],
      );
    } catch {
      console.warn("Chat message stayed local because Zego command send failed.");
    }
  }

  async function handleMuteAllParticipants() {
    setLocalMediaEnabled("audio", false);
    setIsMicMuted(true);

    try {
      await zegoInstanceRef.current?.sendInRoomCommand?.(
        JSON.stringify({ type: "host-mute-all" }),
        [],
      );
    } catch {
      console.warn("Mute all stayed local because Zego command send failed.");
    }
  }

  async function handleRemoveParticipant() {
    if (!window.confirm("Remove this participant from the meeting?")) return;

    try {
      await zegoInstanceRef.current?.sendInRoomCommand?.(
        JSON.stringify({ type: "host-remove-participant" }),
        [],
      );
    } catch {
      console.warn("Remove participant stayed local because Zego command send failed.");
    }

    handleEndCall();
  }

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#101316] text-white">
      <style jsx global>{`
        .zoom-zego-stage [class*="footer"],
        .zoom-zego-stage [class*="bottom"],
        .zoom-zego-stage [class*="toolbar"],
        .zoom-zego-stage [class*="control"] {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .zoom-zego-stage video {
          object-fit: contain !important;
        }
      `}</style>

      <header className="flex h-16 shrink-0 items-center bg-[#2b2b2d] px-5">
        <div className="flex items-center gap-10">
          <div className="leading-none">
            <div className="text-sm font-semibold lowercase">zoom</div>
            <div className="text-xl font-bold">Workplace</div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 text-xs">i</span>
            <span>{meetingTitle}</span>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-0 flex-1 flex-col bg-[#111417]">
        <div className="absolute left-9 top-5 z-20 flex items-center gap-2 rounded-full bg-zinc-700/70 px-3 py-1 text-sm font-medium text-zinc-100">
          <span>o</span>
          <span>{formatDuration(seconds)}</span>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center px-10 py-3">
          <div className="relative h-full w-full max-w-[calc((100vh-9rem)*1.777)] bg-black">
            {status !== "ready" && (
              <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black">
                <div className="max-w-md px-6 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Meeting Room</p>
                  <h1 className="mt-3 text-2xl font-semibold tracking-normal text-white">{roomID}</h1>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">
                    {status === "error" ? errorMessage : "Preparing your secure video session..."}
                  </p>
                </div>
              </div>
            )}
            <div ref={myMeeting} className="zoom-zego-stage h-full w-full bg-black" />
            <div className="pointer-events-none absolute bottom-2 left-2 z-20 rounded bg-black/55 px-2 py-1 text-xs font-medium text-white">
              Parth Sharma
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-40 flex h-[74px] shrink-0 items-center justify-between bg-black px-6">
        <div className="flex items-center gap-1">
          <ToolbarButton label={isMicMuted ? "Unmute" : "Audio"} onClick={handleAudioToggle}>
            <MicIcon muted={isMicMuted} />
          </ToolbarButton>
          <ToolbarButton label={isVideoMuted ? "Start Video" : "Video"} onClick={handleVideoToggle}>
            <VideoIcon muted={isVideoMuted} />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-3">
          <ToolbarButton label="Participants" active={openPanel === "participants"} onClick={() => setOpenPanel((value) => (value === "participants" ? null : "participants"))}>
            <span className="relative">
              <ParticipantsIcon />
              <span className="absolute -right-2 -top-2 rounded-full bg-blue-600 px-1.5 text-[10px] font-bold">1</span>
            </span>
          </ToolbarButton>
          <ToolbarButton label="Chat" active={openPanel === "chat"} onClick={() => setOpenPanel((value) => (value === "chat" ? null : "chat"))}>
            <ChatIcon />
          </ToolbarButton>
          <ToolbarButton label="React" active={openPanel === "reactions"} onClick={() => setOpenPanel((value) => (value === "reactions" ? null : "reactions"))}>
            <span className="text-2xl leading-none">{"\u2661"}</span>
          </ToolbarButton>
          <ToolbarButton label="Share" onClick={() => clickZegoControl(["screen", "share"])}>
            <ShareIcon />
          </ToolbarButton>
          <ToolbarButton label="Host tools" active={openPanel === "host"} onClick={() => setOpenPanel((value) => (value === "host" ? null : "host"))}>
            <ShieldIcon />
          </ToolbarButton>
          <ToolbarButton label="More" active={openPanel === "more"} onClick={() => setOpenPanel((value) => (value === "more" ? null : "more"))}>
            <MoreIcon />
          </ToolbarButton>
        </div>

        <ToolbarButton label="End" danger onClick={handleEndCall}>
          <PhoneIcon />
        </ToolbarButton>
      </footer>

      {openPanel === "participants" && (
        <aside className="absolute bottom-24 right-6 z-50 w-80 rounded-2xl border border-zinc-700 bg-[#202124] p-4 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Participants</h2>
            <span className="rounded-full bg-blue-600 px-2 text-xs">1</span>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleMuteAllParticipants}
              className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold hover:bg-zinc-700"
            >
              Mute all
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
            >
              Invite
            </button>
          </div>
          <div className="mt-3 rounded-xl bg-zinc-800 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">Participant (You)</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Host - {isMicMuted ? "Muted" : "Audio on"} - {isVideoMuted ? "Camera off" : "Camera on"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveParticipant}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>
          </div>
        </aside>
      )}

      {openPanel === "chat" && (
        <aside className="absolute bottom-24 right-6 z-50 w-80 rounded-2xl border border-zinc-700 bg-[#202124] p-4 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Meeting chat</h2>
            <button
              type="button"
              onClick={() => setOpenPanel(null)}
              className="rounded-md px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              x
            </button>
          </div>
          <div className="mt-4 flex h-52 flex-col gap-2 overflow-y-auto rounded-xl bg-zinc-900 p-3 text-sm">
            {chatMessages.length === 0 ? (
              <p className="text-zinc-400">No messages yet.</p>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl px-3 py-2 ${
                    message.isMine ? "ml-8 bg-blue-600 text-white" : "mr-8 bg-zinc-800"
                  }`}
                >
                  <p className="text-[11px] font-semibold opacity-80">{message.sender}</p>
                  <p className="mt-1">{message.text}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Type message here..."
              className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </aside>
      )}

      {openPanel === "reactions" && (
        <div className="absolute bottom-24 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-2xl border border-zinc-700 bg-[#202124] p-3 shadow-2xl">
          {["\uD83D\uDC4D", "\uD83D\uDC4F", "\uD83D\uDE02", "\u2764\uFE0F", "\uD83C\uDF89", "\uD83D\uDE2E"].map((emoji) => (
            <button key={emoji} type="button" onClick={() => showReaction(emoji)} className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl hover:bg-zinc-700">
              {emoji}
            </button>
          ))}
        </div>
      )}

      {reaction && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 animate-bounce text-7xl">
          {reaction}
        </div>
      )}

      {(openPanel === "host" || openPanel === "more") && (
        <div className="absolute bottom-24 left-1/2 z-50 w-64 -translate-x-1/2 rounded-2xl border border-zinc-700 bg-[#202124] p-2 text-white shadow-2xl">
          <button
            type="button"
            onClick={handleMuteAllParticipants}
            className="block w-full rounded-xl px-4 py-2 text-left text-sm hover:bg-zinc-700"
          >
            Mute all participants
          </button>
          {["Invite", "Record", "Meeting settings", "Security", "View options"].map((item) => (
            <button key={item} type="button" className="block w-full rounded-xl px-4 py-2 text-left text-sm hover:bg-zinc-700">
              {item}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
