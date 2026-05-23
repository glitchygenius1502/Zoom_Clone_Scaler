"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// ─── Icons ────────────────────────────────────────────────────────────────────

function Slash({ show }) {
  if (!show) return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[26px] w-0.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-red-500"
    />
  );
}

function MicIcon({ muted }) {
  return (
    <span className="relative inline-flex">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2m7 9v3m-4 0h8" />
      </svg>
      <Slash show={muted} />
    </span>
  );
}

function CameraIcon({ muted }) {
  return (
    <span className="relative inline-flex">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.5-2.6A1 1 0 0121 8.27v7.46a1 1 0 01-1.5.87L15 14m-2 3H5a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2z" />
      </svg>
      <Slash show={muted} />
    </span>
  );
}

function ParticipantsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function ShareScreenIcon({ active }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {active ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM12 3v6m0 0l-2-2m2 2l2-2" />
      )}
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />
    </svg>
  );
}

function EndCallIcon() {
  return (
    <svg className="h-5 w-5 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function initials(name) {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────

function ToolbarButton({ children, label, onClick, active = false, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        group relative flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2
        transition-all duration-150 select-none
        ${active ? "bg-[#2d8cff]/20 text-[#2d8cff]" : danger ? "text-[#f66] hover:bg-[#f66]/10" : "text-[#cfcfcf] hover:bg-white/10 hover:text-white"}
        ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
      `}
    >
      <span className="relative">{children}</span>
      <span className="text-[11px] font-medium leading-none tracking-tight">{label}</span>
    </button>
  );
}

// ─── Carets (chevrons next to Audio/Video in real Zoom) ──────────────────────
function CaretButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 -ml-1 flex h-4 w-4 items-center justify-center rounded-sm text-[#cfcfcf] hover:bg-white/10 hover:text-white"
      title="More options"
    >
      <svg className="h-2.5 w-2.5" viewBox="0 0 10 6" fill="currentColor">
        <path d="M0 6l5-6 5 6H0z" />
      </svg>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ZegoVideoRoom({ roomID }) {
  const router = useRouter();

  // Refs
  const zegoInstanceRef = useRef(null);
  const mountedElementRef = useRef(null);
  const zegoRootRef = useRef(null);
  const userIDRef = useRef(null);
  const screenStreamRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Pre-join state
  const [userName, setUserName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  // Room state
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [notification, setNotification] = useState(null);

  const meetingTitle = useMemo(
    () => (userName ? `${userName}'s Meeting` : "Zoom Meeting"),
    [userName]
  );

  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/room/${roomID}` : "";

  // Timer
  useEffect(() => {
    if (!hasJoined) return;
    const t = window.setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => window.clearInterval(t);
  }, [hasJoined]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Clear unread when chat open
  useEffect(() => {
    if (openPanel === "chat") setUnreadCount(0);
  }, [openPanel]);

  // Show notification helper
  function showNotification(msg, type = "info") {
    setNotification({ msg, type });
    window.setTimeout(() => setNotification(null), 3000);
  }

  // ── Zego DOM click helper ──────────────────────────────────────────────────
  function clickZegoControl(candidates) {
    const root = zegoRootRef.current;
    if (!root) return false;

    // Screen share — target by class first
    if (candidates.some((c) => ["screen", "share"].includes(c))) {
      const btn = root.querySelector(
        '[class*="ScreenShare"], [class*="Sharing"], [class*="screen-share"]'
      );
      if (btn) { btn.click(); return true; }
    }

    // Fallback: text / aria-label search
    const all = Array.from(root.querySelectorAll("button, [role='button'], div"));
    const match = all.find((el) => {
      const t = `${el.textContent} ${el.getAttribute("aria-label") || ""} ${el.getAttribute("title") || ""} ${el.className}`.toLowerCase();
      return candidates.some((c) => t.includes(c.toLowerCase()));
    });
    if (match) { match.click(); return true; }
    return false;
  }

  // ── Track-level mute/unmute ────────────────────────────────────────────────
  const setLocalMediaEnabled = useCallback((kind, enabled) => {
    const stream = zegoInstanceRef.current?.localStream;
    const tracks = kind === "video" ? stream?.getVideoTracks?.() : stream?.getAudioTracks?.();
    if (!tracks?.length) return false;
    tracks.forEach((t) => { t.enabled = enabled; });
    return true;
  }, []);

  // ── Zego init ──────────────────────────────────────────────────────────────
  const myMeeting = useCallback(
    async (element) => {
      if (!element || !hasJoined) {
        try { zegoInstanceRef.current?.destroy?.(); } catch {}
        zegoInstanceRef.current = null;
        mountedElementRef.current = null;
        return;
      }
      if (mountedElementRef.current === element) return;
      mountedElementRef.current = element;
      zegoRootRef.current = element;
      setStatus("loading");

      try {
        const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
        if (!appID || !serverSecret) throw new Error("Missing ZegoCloud credentials in .env.local");
        if (!userIDRef.current) userIDRef.current = `user_${Math.floor(Math.random() * 100000)}`;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID, serverSecret, roomID, userIDRef.current, userName
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;

        zp.joinRoom({
          container: element,
          scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
          layout: "Grid",
          showPreJoinView: false,
          showRoomTimer: false,
          showRoomDetailsButton: false,
          showLayoutButton: false,
          showMoreButton: false,
          showUserList: false,
          showTextChat: false,
          // Keep screen share button ALIVE (hidden via CSS) so we can click it
          showScreenSharingButton: true,
          showMyMicrophoneToggleButton: false,
          showMyCameraToggleButton: false,
          showAudioVideoSettingsButton: false,
          showLeaveRoomConfirmDialog: false,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          autoHideFooter: false,
          videoScreenConfig: { objectFit: "contain", localMirror: true },

          onInRoomCommandReceived: (fromUser, command) => {
            try {
              const parsed = JSON.parse(command);
              if (parsed?.type === "chat" && parsed?.text) {
                setChatMessages((msgs) => [
                  ...msgs,
                  { id: `${Date.now()}-${Math.random()}`, sender: fromUser?.userName || "Participant", text: parsed.text, isMine: false },
                ]);
                setUnreadCount((n) => n + 1);
              }
              if (parsed?.type === "host-mute-all") {
                setLocalMediaEnabled("audio", false);
                setIsMicMuted(true);
                showNotification("You have been muted by the host.", "warning");
              }
              if (parsed?.type === "host-remove-participant") {
                alert("The host removed you from this meeting.");
                router.push("/");
              }
            } catch {
              if (command) {
                setChatMessages((msgs) => [
                  ...msgs,
                  { id: `${Date.now()}-${Math.random()}`, sender: fromUser?.userName || "Participant", text: command, isMine: false },
                ]);
              }
            }
          },

          onJoinRoom: () => {
            setStatus("ready");
            setParticipants([{ id: userIDRef.current, name: userName, isYou: true }]);
          },
          onLeaveRoom: () => { if (!isLeaving) router.push("/"); },
          onUserJoin: (users) => {
            setParticipants((prev) => {
              const next = [...prev];
              users.forEach((u) => {
                if (!next.find((p) => p.id === u.userID)) {
                  next.push({ id: u.userID, name: u.userName || "Participant", isYou: false });
                  showNotification(`${u.userName || "Participant"} joined the meeting.`);
                }
              });
              return next;
            });
          },
          onUserLeave: (users) => {
            setParticipants((prev) => prev.filter((p) => !users.find((u) => u.userID === p.id)));
            users.forEach((u) => showNotification(`${u.userName || "Participant"} left the meeting.`));
          },
        });
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Unable to initialize video meeting.");
      }
    },
    [hasJoined, isLeaving, roomID, router, setLocalMediaEnabled, userName]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleAudioToggle() {
    setIsMicMuted((muted) => {
      const next = !muted;
      if (!setLocalMediaEnabled("audio", !next)) clickZegoControl(["microphone", "mic", "audio"]);
      return next;
    });
  }

  function handleVideoToggle() {
    setIsVideoMuted((muted) => {
      const next = !muted;
      if (!setLocalMediaEnabled("video", !next)) clickZegoControl(["camera", "video"]);
      return next;
    });
  }

  async function handleScreenShare() {
    if (isSharing) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setIsSharing(false);
      // Tell Zego to stop sharing too
      clickZegoControl(["screen", "share", "stop"]);
      showNotification("Screen sharing stopped.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: true });
      screenStreamRef.current = stream;
      setIsSharing(true);
      showNotification("Screen sharing started.");

      stream.getVideoTracks()[0].onended = () => {
        screenStreamRef.current = null;
        setIsSharing(false);
        showNotification("Screen sharing stopped.");
      };

      // Click Zego's hidden screen share button to broadcast to others
      clickZegoControl(["screen", "share"]);
    } catch {
      // Fallback: just click Zego's hidden button directly
      const clicked = clickZegoControl(["screen", "share"]);
      if (clicked) {
        setIsSharing(true);
        showNotification("Screen sharing started.");
      } else {
        showNotification("Could not start screen share.", "error");
      }
    }
  }

  function handleEndCall() {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    setIsLeaving(true);
    try { zegoInstanceRef.current?.hangUp?.(); zegoInstanceRef.current?.destroy?.(); } catch {}
    router.push("/");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      showNotification("Invite link copied to clipboard!");
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      showNotification("Failed to copy link.", "error");
    }
  }

  async function handleSendChat(e) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((msgs) => [
      ...msgs,
      { id: `${Date.now()}-${Math.random()}`, sender: `${userName} (You)`, text, isMine: true },
    ]);
    setChatInput("");
    try {
      await zegoInstanceRef.current?.sendInRoomCommand?.(JSON.stringify({ type: "chat", text }), []);
    } catch {}
  }

  async function handleMuteAll() {
    setLocalMediaEnabled("audio", false);
    setIsMicMuted(true);
    showNotification("All participants muted.");
    try { await zegoInstanceRef.current?.sendInRoomCommand?.(JSON.stringify({ type: "host-mute-all" }), []); } catch {}
  }

  function showReaction(emoji) {
    setReaction(emoji);
    setTimeout(() => setReaction(null), 1800);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PRE-JOIN SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (!hasJoined) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#1c1c1e]">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
          * { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; box-sizing: border-box; }
        `}</style>

        <div className="w-full max-w-[420px] rounded-2xl bg-[#2c2c2e] p-8 shadow-2xl ring-1 ring-white/10">
          {/* Zoom Logo */}
          <div className="mb-8 flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d8cff] shadow-lg shadow-[#2d8cff]/30">
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6a2 2 0 012-2h8a2 2 0 012 2v4.586l3.707-3.707A1 1 0 0121 7.586V16.414a1 1 0 01-1.707.707L16 13.414V18a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-[22px] font-bold text-white">Join Meeting</h1>
              <p className="mt-1 text-sm text-[#8e8e93]">
                Room: <span className="font-mono text-[#2d8cff]">{roomID}</span>
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); if (userName.trim()) setHasJoined(true); }}
            className="space-y-3"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8e8e93]">
                Your Display Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. John Smith"
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-[#3a3a3c] px-4 py-3 text-sm text-white placeholder-[#636366] outline-none transition-all focus:border-[#2d8cff] focus:ring-2 focus:ring-[#2d8cff]/20"
              />
            </div>

            <button
              type="submit"
              disabled={!userName.trim()}
              className="w-full rounded-xl bg-[#2d8cff] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2d8cff]/20 transition-all hover:bg-[#1a7fe8] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              Join Meeting
            </button>
          </form>

          <div className="mt-4 rounded-xl bg-[#3a3a3c] px-4 py-3">
            <p className="text-[11px] font-medium text-[#8e8e93]">INVITE LINK</p>
            <p className="mt-1 truncate font-mono text-xs text-[#2d8cff]">{inviteLink}</p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN ROOM
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#1c1c1e] text-white select-none">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; box-sizing: border-box; }

        /* ── Hide ALL of Zego's internal UI chrome absolutely ── */
        /* 
          The most reliable method: make the Zego container taller than its
          wrapper, and clip overflow. This pushes Zego's ~80px bottom toolbar
          completely out of view — no selector guessing needed.
        */
        .zego-clip-wrapper {
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 100%;
        }
        .zego-clip-wrapper > div {
          width: 100% !important;
          /* Extra height hides the Zego bottom bar */
          height: calc(100% + 90px) !important;
          overflow: hidden !important;
        }

        /* Belt-and-suspenders: also hide by class name */
        .zego-clip-wrapper [class*="MenuBar"],
        .zego-clip-wrapper [class*="BottomBar"],
        .zego-clip-wrapper [class*="Footer"],
        .zego-clip-wrapper [class*="footer"],
        .zego-clip-wrapper [class*="Toolbar"],
        .zego-clip-wrapper [class*="toolbar"],
        .zego-clip-wrapper [class*="Bottom"],
        .zego-clip-wrapper [class*="LeaveButton"],
        .zego-clip-wrapper [class*="HangUp"],
        .zego-clip-wrapper [class*="EndCall"] {
          position: fixed !important;
          bottom: -9999px !important;
          left: -9999px !important;
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
        }

        /* Keep screen share button accessible but invisible for click() */
        .zego-clip-wrapper [class*="ScreenShare"],
        .zego-clip-wrapper [class*="Sharing"] {
          position: fixed !important;
          top: -9999px !important;
          left: -9999px !important;
          pointer-events: auto !important;
          opacity: 0 !important;
        }

        .zego-clip-wrapper video {
          object-fit: contain !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="flex h-[52px] shrink-0 items-center justify-between bg-[#2c2c2e] px-5 ring-1 ring-white/5">
        {/* Left: Zoom logo + meeting info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2d8cff]">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6a2 2 0 012-2h8a2 2 0 012 2v4.586l3.707-3.707A1 1 0 0121 7.586V16.414a1 1 0 01-1.707.707L16 13.414V18a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-[10px] font-medium text-[#8e8e93]">zoom</p>
              <p className="text-[13px] font-bold text-white">Workplace</p>
            </div>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#636366] text-[10px] text-[#8e8e93]">i</span>
            <span className="text-[13px] font-medium text-[#e5e5ea]">{meetingTitle}</span>
            <span className="rounded bg-[#3a3a3c] px-2 py-0.5 font-mono text-[11px] text-[#8e8e93]">{roomID}</span>

            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                linkCopied ? "bg-green-500/20 text-green-400" : "bg-[#2d8cff]/15 text-[#2d8cff] hover:bg-[#2d8cff]/25"
              }`}
            >
              {linkCopied ? <CheckIcon /> : <LinkIcon />}
              {linkCopied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Right: timer + avatar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-[#3a3a3c] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[12px] font-medium text-[#e5e5ea]">{formatDuration(seconds)}</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2d8cff] text-[12px] font-bold text-white">
            {initials(userName)}
          </div>
        </div>
      </header>

      {/* ── SCREEN SHARE BANNER ─────────────────────────────────────────────── */}
      {isSharing && (
        <div className="flex items-center justify-between bg-[#2d8cff] px-5 py-1.5 text-sm font-medium text-white">
          <span>📺 You are sharing your screen</span>
          <button onClick={handleScreenShare} className="rounded-md bg-white/20 px-3 py-0.5 text-xs font-semibold hover:bg-white/30">
            Stop Sharing
          </button>
        </div>
      )}

      {/* ── VIDEO AREA + SIDE PANEL ─────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Video stage */}
        <section className="relative flex min-h-0 flex-1 flex-col bg-[#1c1c1e]">
          <div className="flex min-h-0 flex-1 items-center justify-center p-4">
            <div className="relative h-full w-full max-w-[calc((100vh-10rem)*1.78)] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/5">
              {status !== "ready" && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#1c1c1e]">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#2d8cff] border-t-transparent" />
                    <p className="text-sm font-medium text-[#8e8e93]">
                      {status === "error" ? errorMessage : "Connecting to meeting…"}
                    </p>
                  </div>
                </div>
              )}

              {/* THE CLIP WRAPPER — this hides Zego's internal toolbar */}
              <div className="zego-clip-wrapper">
                <div ref={myMeeting} className="h-full w-full bg-black" />
              </div>

              {/* Name tag */}
              <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {userName} (You)
              </div>

              {/* Reaction overlay */}
              {reaction && (
                <div className="pointer-events-none absolute bottom-16 left-1/2 z-30 -translate-x-1/2 animate-bounce text-5xl">
                  {reaction}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SIDE PANEL ──────────────────────────────────────────────────── */}
        {openPanel === "participants" && (
          <aside className="flex w-72 shrink-0 flex-col border-l border-white/5 bg-[#2c2c2e]">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
              <h2 className="text-sm font-semibold">Participants ({participants.length})</h2>
              <button onClick={() => setOpenPanel(null)} className="rounded-md p-1 text-[#8e8e93] hover:bg-white/10 hover:text-white">
                <CloseIcon />
              </button>
            </div>

            <div className="flex gap-2 px-4 py-3">
              <button onClick={handleMuteAll} className="flex-1 rounded-lg bg-[#3a3a3c] py-2 text-xs font-semibold hover:bg-[#48484a]">
                Mute All
              </button>
              <button onClick={handleCopyLink} className="flex-1 rounded-lg border border-white/10 py-2 text-xs font-semibold text-[#2d8cff] hover:bg-[#2d8cff]/10">
                Invite
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#3a3a3c]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2d8cff] text-xs font-bold">
                    {initials(p.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}{p.isYou && " (You)"}</p>
                    {p.isYou && (
                      <p className="text-[11px] text-[#8e8e93]">
                        {isMicMuted ? "Muted" : "Unmuted"} · {isVideoMuted ? "Camera off" : "Camera on"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MicIcon muted={p.isYou ? isMicMuted : false} />
                    <CameraIcon muted={p.isYou ? isVideoMuted : false} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {openPanel === "chat" && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-white/5 bg-[#2c2c2e]">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
              <h2 className="text-sm font-semibold">Meeting Chat</h2>
              <button onClick={() => setOpenPanel(null)} className="rounded-md p-1 text-[#8e8e93] hover:bg-white/10 hover:text-white">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {chatMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ChatIcon />
                  <p className="mt-2 text-sm text-[#8e8e93]">No messages yet.</p>
                  <p className="text-xs text-[#636366]">Be the first to say something!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {chatMessages.map((m) => (
                    <div key={m.id} className={`flex flex-col gap-0.5 ${m.isMine ? "items-end" : "items-start"}`}>
                      <span className="text-[11px] font-medium text-[#8e8e93]">{m.sender}</span>
                      <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${m.isMine ? "bg-[#2d8cff] text-white rounded-tr-sm" : "bg-[#3a3a3c] text-[#e5e5ea] rounded-tl-sm"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 border-t border-white/5 px-3 py-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send a message…"
                className="min-w-0 flex-1 rounded-xl bg-[#3a3a3c] px-3 py-2.5 text-sm text-white outline-none placeholder-[#636366] focus:ring-1 focus:ring-[#2d8cff]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-xl bg-[#2d8cff] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1a7fe8] disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* ── TOOLBAR ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-40 flex h-[68px] shrink-0 items-center justify-between bg-[#1c1c1e] px-5 ring-1 ring-white/5">
        {/* Left: Mic + Video */}
        <div className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <div className="flex items-end">
              <ToolbarButton label={isMicMuted ? "Unmute" : "Mute"} onClick={handleAudioToggle}>
                <MicIcon muted={isMicMuted} />
              </ToolbarButton>
              <CaretButton onClick={() => {}} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-end">
              <ToolbarButton label={isVideoMuted ? "Start Video" : "Stop Video"} onClick={handleVideoToggle}>
                <CameraIcon muted={isVideoMuted} />
              </ToolbarButton>
              <CaretButton onClick={() => {}} />
            </div>
          </div>
        </div>

        {/* Center: main controls */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            label="Participants"
            active={openPanel === "participants"}
            onClick={() => setOpenPanel((v) => (v === "participants" ? null : "participants"))}
          >
            <span className="relative">
              <ParticipantsIcon />
              {participants.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2d8cff] px-1 text-[9px] font-bold text-white">
                  {participants.length}
                </span>
              )}
            </span>
          </ToolbarButton>

          <ToolbarButton
            label="Chat"
            active={openPanel === "chat"}
            onClick={() => setOpenPanel((v) => (v === "chat" ? null : "chat"))}
          >
            <span className="relative">
              <ChatIcon />
              {unreadCount > 0 && openPanel !== "chat" && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </span>
          </ToolbarButton>

          <ToolbarButton
            label="React"
            active={openPanel === "reactions"}
            onClick={() => setOpenPanel((v) => (v === "reactions" ? null : "reactions"))}
          >
            <ReactIcon />
          </ToolbarButton>

          <ToolbarButton
            label={isSharing ? "Stop Share" : "Share Screen"}
            active={isSharing}
            onClick={handleScreenShare}
          >
            <ShareScreenIcon active={isSharing} />
          </ToolbarButton>

          <ToolbarButton
            label="Security"
            active={openPanel === "security"}
            onClick={() => setOpenPanel((v) => (v === "security" ? null : "security"))}
          >
            <ShieldIcon />
          </ToolbarButton>

          <ToolbarButton
            label="More"
            active={openPanel === "more"}
            onClick={() => setOpenPanel((v) => (v === "more" ? null : "more"))}
          >
            <MoreIcon />
          </ToolbarButton>
        </div>

        {/* Right: End */}
        <button
          onClick={() => setShowEndConfirm(true)}
          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600"
        >
          <EndCallIcon />
          End
        </button>
      </footer>

      {/* ── REACTIONS POPOVER ────────────────────────────────────────────────── */}
      {openPanel === "reactions" && (
        <div className="absolute bottom-[80px] left-1/2 z-50 flex -translate-x-1/2 gap-1.5 rounded-2xl border border-white/10 bg-[#2c2c2e] p-3 shadow-2xl">
          {["👍", "👏", "😂", "❤️", "🎉", "😮", "🙌", "🔥"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => { showReaction(emoji); setOpenPanel(null); }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl hover:bg-white/10 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* ── SECURITY / MORE POPOVER ──────────────────────────────────────────── */}
      {(openPanel === "security" || openPanel === "more") && (
        <div className="absolute bottom-[80px] left-1/2 z-50 w-60 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#2c2c2e] p-2 shadow-2xl">
          <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8e8e93]">
            {openPanel === "security" ? "Security" : "More"}
          </p>
          {openPanel === "security" ? (
            <>
              <button onClick={handleMuteAll} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10">
                <MicIcon muted /> Mute all participants
              </button>
              <button onClick={handleCopyLink} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10">
                <LinkIcon /> Copy invite link
              </button>
            </>
          ) : (
            ["Record Meeting", "Live Transcript", "Breakout Rooms", "Meeting Settings", "View Options"].map((item) => (
              <button key={item} className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10">
                {item}
              </button>
            ))
          )}
        </div>
      )}

      {/* ── END CALL CONFIRM DIALOG ─────────────────────────────────────────── */}
      {showEndConfirm && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-80 rounded-2xl border border-white/10 bg-[#2c2c2e] p-6 shadow-2xl">
            <h3 className="text-base font-bold">End Meeting</h3>
            <p className="mt-2 text-sm text-[#8e8e93]">
              Are you sure you want to end this meeting for everyone?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleEndCall}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
              >
                End for All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ──────────────────────────────────────────────── */}
      {notification && (
        <div
          className={`absolute bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-2xl backdrop-blur-sm transition-all ${
            notification.type === "error"
              ? "bg-red-500/90 text-white"
              : notification.type === "warning"
              ? "bg-yellow-500/90 text-black"
              : "bg-[#2c2c2e]/90 text-white ring-1 ring-white/10"
          }`}
        >
          {notification.msg}
        </div>
      )}
    </main>
  );
}
