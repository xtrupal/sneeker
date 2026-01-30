"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ClientToServerMessage, ServerToClientMessage } from "@repo/shared";
import InputBox from "@repo/ui/inputBox";
import MsgBox from "@repo/ui/msgBox";
import Button from "@repo/ui/Button";

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

    if (!connected || !peerOnline) return;

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
        gap: "8px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "470px",
          alignItems: "center",
          height: "4px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: !connected
              ? "gray"
              : peerOnline
                ? "limegreen"
                : hadPeer
                  ? "crimson"
                  : "orange",
            marginRight: "0px",
          }}
        />
      </div>
      <div>
        <MsgBox data={peerText} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "470px",
          gap: "5px",
        }}
      >
        <InputBox
          value={myText}
          onChange={handleInputChange}
          placeholder={peerOnline ? "Type..." : "Waiting for peer..."}
          disabled={!connected || !peerOnline}
        />
        <Button onClick={() => ClearMsgBox()}>Clear</Button>
      </div>
    </div>
  );
}
