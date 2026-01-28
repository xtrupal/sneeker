"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ClientToServerMessage, ServerToClientMessage } from "@repo/shared";
import InputBox from "@repo/ui/inputBox";
import MsgBox from "@repo/ui/msgBox";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const [myText, setMyText] = useState("");
  const [peerText, setPeerText] = useState("");
  const [connected, setConnected] = useState(false);
  const [peerOnline, setPeerOnline] = useState(false);
  const [hadPeer, setHadPeer] = useState(false);

  function handleInputChange(value: string) {
    setMyText(value);

    if (!connected) return;

    const msg: ClientToServerMessage = {
      type: "typing",
      text: value,
    };

    wsRef.current?.send(JSON.stringify(msg));
  }

  function ClearMsgBox() {
    setMyText("");
    const msg: ClientToServerMessage = {
      type: "typing",
      text: "",
    };
    if (!connected) return;
    wsRef.current?.send(JSON.stringify(msg));
  }

  useEffect(() => {
    // Reset UI state when changing rooms / reconnecting
    setConnected(false);
    setPeerOnline(false);
    setPeerText("");

    const ws = new WebSocket("ws://localhost:3002");
    wsRef.current = ws;
    let active = true;

    ws.onopen = () => {
      if (!active) return;
      setConnected(true);
      const joinMsg: ClientToServerMessage = {
        type: "join-room",
        roomId,
      };

      ws.send(JSON.stringify(joinMsg));
    };

    ws.onmessage = (event) => {
      if (!active) return;
      const msg = JSON.parse(event.data) as ServerToClientMessage;

      if (msg.type === "room-state") {
        const online = msg.peerCount === 1;
        setPeerOnline(online);

        if (online) {
          setHadPeer(true);
        }

        if (!online) {
          setPeerText("");
        }
      }

      if (msg.type === "peer-typing") {
        setPeerText(msg.text);
      }

      if (msg.type === "room-full") {
        setPeerOnline(false);
        setPeerText("");
      }
    };

    ws.onclose = () => {
      if (!active) return;
      setConnected(false);
      setPeerOnline(false);
      console.log("Disconnected");
    };

    return () => {
      active = false;
      wsRef.current = null;
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
      {!connected ? (
        <span style={{ color: "gray" }}>Connecting...</span>
      ) : peerOnline ? (
        <span style={{ color: "green" }}>Peer is online</span>
      ) : hadPeer ? (
        <span style={{ color: "red" }}>
          Peer left — waiting for a new peer...
        </span>
      ) : (
        <span style={{ color: "orange" }}>Waiting for peer...</span>
      )}

      <div>
        <MsgBox data={peerText} />
      </div>
      <div>
        <InputBox
          value={myText}
          onChange={handleInputChange}
          placeholder={peerOnline ? "Type..." : "Waiting for peer..."}
          disabled={!connected || !peerOnline}
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
          onClick={() => ClearMsgBox()}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
