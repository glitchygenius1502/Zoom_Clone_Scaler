"use client";

import { useEffect, useRef, useState } from "react";

function MicIcon() {
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

function MutedSlash({ show }) {
  if (!show) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-0.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-red-500 shadow-[0_0_0_1px_rgba(255,255,255,0.75)]"
    />
  );
}

function stopStream(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

export default function MeetingPreviewModal({
  isOpen,
  meetingId,
  meetingTitle,
  participantName,
  onClose,
  onStart,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [cameraState, setCameraState] = useState("loading");
  const [copyLabel, setCopyLabel] = useState("Copy invite");

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !isVideoOn) {
      stopStream(streamRef.current);
      streamRef.current = null;
      return undefined;
    }

    let isCancelled = false;

    async function startPreview() {
      try {
        await Promise.resolve();

        if (isCancelled) {
          return;
        }

        setCameraState("loading");

        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraState("blocked");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (isCancelled) {
          stopStream(stream);
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }

        setCameraState("ready");
      } catch (error) {
        console.error(error);
        setCameraState("blocked");
      }
    }

    startPreview();

    return () => {
      isCancelled = true;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, [isOpen, isVideoOn]);

  if (!isOpen) {
    return null;
  }

  const displayName = participantName || "Participant";
  const inviteLink =
    meetingId && typeof window !== "undefined"
      ? `${window.location.origin}/room/${meetingId}`
      : "";

  async function handleCopyInvite(event) {
    event.stopPropagation();
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy invite"), 1400);
    } catch {
      window.prompt("Copy invite link", inviteLink);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/25 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex h-9 items-center justify-between border-b border-slate-200 bg-slate-100 px-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
              zm
            </span>
            <span className="truncate text-sm font-medium text-slate-950">
              {meetingTitle || `${displayName}'s Zoom Meeting`}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-2xl font-light leading-none text-slate-900 hover:bg-slate-200"
            aria-label="Close meeting preview"
          >
            x
          </button>
        </header>

        <div className="p-5">
          <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
            {isVideoOn && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`h-full w-full object-cover ${
                  cameraState === "ready" ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            {(!isVideoOn || cameraState !== "ready") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-950 text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-semibold">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
                <p className="mt-3 text-sm text-slate-200">
                  {!isVideoOn
                    ? "Video is off"
                    : cameraState === "blocked"
                      ? "Camera preview is unavailable"
                      : "Starting camera preview..."}
                </p>
              </div>
            )}

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 overflow-hidden rounded-xl bg-black/75 text-white">
              <button
                type="button"
                onClick={() => setIsAudioOn((value) => !value)}
                className="flex w-24 flex-col items-center gap-1 px-3 py-2.5 hover:bg-white/10"
              >
                <span className="relative">
                  <MicIcon />
                  <MutedSlash show={!isAudioOn} />
                </span>
                <span className="text-sm">{isAudioOn ? "Audio" : "Muted"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVideoOn((value) => !value)}
                className="flex w-24 flex-col items-center gap-1 px-3 py-2.5 hover:bg-white/10"
              >
                <span className="relative">
                  <VideoIcon />
                  <MutedSlash show={!isVideoOn} />
                </span>
                <span className="text-sm">{isVideoOn ? "Video" : "Video off"}</span>
              </button>
            </div>

            <button
              type="button"
              className="absolute bottom-4 right-4 rounded-xl bg-black/75 px-4 py-2.5 text-sm font-medium text-white hover:bg-black/85"
            >
              Backgrounds
            </button>
          </div>

          <div className="grid gap-3 bg-slate-100 p-3 md:grid-cols-2">
            <button
              type="button"
              className="flex h-11 items-center justify-between rounded-xl border border-indigo-200 bg-white px-4 text-left text-sm text-slate-600"
            >
              <span>Custom combination</span>
              <span>v</span>
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-between rounded-xl border border-indigo-200 bg-white px-4 text-left text-sm text-slate-600"
            >
              <span>Default camera</span>
              <span>v</span>
            </button>
          </div>

          <div className="mt-7 flex items-center justify-between gap-5">
            <label className="flex items-center gap-3 text-base text-slate-950">
              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Always show this preview when joining</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 text-xs text-slate-500">
                i
              </span>
            </label>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={handleCopyInvite}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                {copyLabel}
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onStart();
                }}
                className="min-w-44 rounded-xl bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
