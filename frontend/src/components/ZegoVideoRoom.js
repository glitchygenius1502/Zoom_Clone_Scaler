"use client";

import { use, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function ZegoVideoRoom({ roomID }) {
  const router = useRouter();

  const zegoInstanceRef = useRef(null);
  const mountedElementRef = useRef(null);
  const userIDRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const myMeeting = useCallback(
    async (element) => {
      if (!element) {
        zegoInstanceRef.current?.destroy();
        zegoInstanceRef.current = null;
        mountedElementRef.current = null;
        return;
      }

      if (mountedElementRef.current === element) {
        return;
      }

      mountedElementRef.current = element;
      setStatus("loading");
      setErrorMessage("");

      try {
        const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

        if (!appID || !serverSecret) {
          throw new Error(
            "Missing NEXT_PUBLIC_ZEGO_APP_ID or NEXT_PUBLIC_ZEGO_SERVER_SECRET.",
          );
        }

        if (!userIDRef.current) {
          userIDRef.current = `user_${Math.floor(Math.random() * 10000)}`;
        }

        const userID = userIDRef.current;
        const userName = "Participant";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          userName,
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;

        zp.joinRoom({
          container: element,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          sharedLinks: [
            {
              name: "Join this meeting",
              url: `${window.location.origin}/room/${roomID}`,
            },
          ],
          layout: "Grid",
          showScreenSharingButton: true,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showRoomTimer: true,
          showPreJoinView: false,
          showLeaveRoomConfirmDialog: false,
          onJoinRoom: () => {
            setStatus("ready");
          },
          onLeaveRoom: () => {
            router.push("/");
          },
        });
      } catch (error) {
        console.error(error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to initialize the video meeting.",
        );
      }
    },
    [roomID, router],
  );

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-black">
      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="max-w-md px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Meeting Room
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-normal text-white">
              {roomID}
            </h1>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {status === "error"
                ? errorMessage
                : "Preparing your secure video session..."}
            </p>
          </div>
        </div>
      )}

      <div ref={myMeeting} className="h-full w-full bg-black" />
    </main>
  );
}