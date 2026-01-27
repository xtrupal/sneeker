"use client";

import { useParams } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { ClientToServerMessage, ServerToClientMessage } from "@repo/shared";
import InputBox from "@repo/ui/inputBox";
import MsgBox from "@repo/ui/msgBox";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const [myText, setMyText] = useState("");
  const [peerText, setPeerText] = useState("");

  function handleInputChange(value: string) {
    setMyText(value);

    const msg: ClientToServerMessage = {
      type: "typing",
      text: value,
    };

    wsRef.current?.send(JSON.stringify(msg));
  }

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

      if (msg.type === "peer-typing") {
        setPeerText(msg.text);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <MsgBox data={peerText} />
      </div>
      <div>
        <InputBox
          value={myText}
          onChange={handleInputChange}
          placeholder="yooo..."
        />
        <button
          style={{
            color: "white",
            padding: "14px",
            backgroundColor: "blue",
            marginLeft: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setMyText("")}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
