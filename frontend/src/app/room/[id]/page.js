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
  const { id } = use(params);
  const roomID = String(id);

  return <ZegoVideoRoom roomID={roomID} />;
}