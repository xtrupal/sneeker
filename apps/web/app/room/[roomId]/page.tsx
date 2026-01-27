"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ClientToServerMessage, ServerToClientMessage } from "@repo/shared";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3002");
    wsRef.current = ws;

    ws.onopen = () => {
      const joinMsg: ClientToServerMessage = {
        type: "join-room",
        roomId,
      };

      ws.send(JSON.stringify(joinMsg));
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as ServerToClientMessage;
      console.log("Received message:", msg);
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  return <div style={{ color: "white" }}>Room: {roomId}</div>;
}
