import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { ClientToServerMessage, ServerToClientMessage } from "@repo/shared";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3002;
const wss = new WebSocketServer({ server });

const rooms = new Map<string, Set<WebSocket>>();
const socketToRoom = new Map<WebSocket, string>();

app.get("/", (req, res) => {
  res.json({ rooms: rooms.size });
});

wss.on("connection", (socket: WebSocket) => {
  console.log("New client connected");

  socket.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString()) as ClientToServerMessage;

      if (msg.type === "join-room") {
        const { roomId } = msg;

        const room = rooms.get(roomId) ?? new Set<WebSocket>();

        if (room.size >= 2) {
          const res: ServerToClientMessage = { type: "room-full" };
          socket.send(JSON.stringify(res));
          return;
        }

        room.add(socket);
        rooms.set(roomId, room);
        socketToRoom.set(socket, roomId);

        socket.send(
          JSON.stringify({
            type: "room-joined",
            roomId,
          } satisfies ServerToClientMessage)
        );

        room.forEach((peer) => {
          if (peer !== socket) {
            peer.send(
              JSON.stringify({
                type: "peer-joined",
              } satisfies ServerToClientMessage)
            );
          }
        });

        console.log(`Client joined room: ${roomId}`);
      }

      if (msg.type === "typing") {
        const roomId = socketToRoom.get(socket);
        if (!roomId) return;

        const room = rooms.get(roomId);
        if (!room) return;

        room.forEach((peer) => {
          if (peer !== socket) {
            peer.send(
              JSON.stringify({
                type: "typing",
                text: msg.text,
              } satisfies ServerToClientMessage)
            );
          }
        });
      }
    } catch (err) {
      console.error("Invalid message received", err);
    }
  });

  socket.on("close", () => {
    const roomId = socketToRoom.get(socket);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;
    room.delete(socket);
    socketToRoom.delete(socket);

    room.forEach((peer) => {
      peer.send(
        JSON.stringify({
          type: "peer-left",
        } satisfies ServerToClientMessage)
      );
    });

    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} deleted as it became empty`);
    }

    console.log("Client disconnected");
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error.cause);
  });
});

server.listen(PORT, () => {
  console.log(
    `websocket and express server running on http://localhost:${PORT}`
  );
});
