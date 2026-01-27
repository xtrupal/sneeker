"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  function createRoom() {
    const roomId = crypto.randomUUID();
    router.push(`/room/${roomId}`);
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={createRoom}
        style={{
          padding: "12px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Create Room
      </button>
    </div>
  );
}
