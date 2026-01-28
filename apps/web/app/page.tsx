"use client";

import { useState } from "react";

export default function HomePage() {
  const [roomId, setRoomId] = useState<string | null>(null);

  function createRoom() {
    const newRoomId = crypto.randomUUID();
    setRoomId(newRoomId);
  }

  function goToRoom() {
    if (roomId) {
      window.open(`/room/${roomId}`, "_blank");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px",
      }}
    >
      {!roomId ? (
        <button
          onClick={createRoom}
          style={{
            padding: "12px 20px",
            fontSize: "18px",
            borderRadius: "8px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create Room
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div>
            <span style={{ fontSize: "30px", fontWeight: "bold" }}>
              Your room Id has been generated!
            </span>
          </div>
          <div>
            <span style={{ color: "blue" }}>localhost:3000/room/{roomId}</span>
          </div>
          <button
            onClick={goToRoom}
            style={{
              padding: "8px 16px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Start Chatting:{" "}
            <span
              style={{
                marginLeft: 6,
                color: "orange",
                textDecoration: "underline",
              }}
            >{`/room/${roomId}`}</span>
          </button>
        </div>
      )}
    </div>
  );
}
