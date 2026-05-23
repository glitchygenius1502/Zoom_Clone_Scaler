"use client";

import { use } from "react";
import dynamic from "next/dynamic";

const ZegoVideoRoom = dynamic(() => import("@/components/ZegoVideoRoom"), {
  ssr: false,
  loading: () => (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-black text-white">
      <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Meeting Room
      </p>
      <p className="mt-4 text-sm leading-6 text-zinc-400 animate-pulse">
        Loading WebRTC Media Containers...
      </p>
    </main>
  ),
});

export default function RoomPage({ params }) {
  // 1. Unwrap params safely
  const unwrappedParams = use(params);
  
  // 2. Decode the ID to strip out any hidden URL characters or spaces
  const rawId = unwrappedParams?.id || "";
  const roomID = decodeURIComponent(String(rawId).trim());

  // 3. Prevent rendering if the ID is missing or evaluates to "undefined"
  if (!roomID || roomID === "undefined") {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-black text-white">
        Validating secure meeting route...
      </main>
    );
  }

  return <ZegoVideoRoom roomID={roomID} />;
}