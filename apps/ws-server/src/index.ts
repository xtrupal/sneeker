import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { ClientToServerMessage, ServerToClientMessage } from "@repo/shared";

const app = express();
// Add cors as middleware
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || 3002;
const wss = new WebSocketServer({ server });

const rooms = new Map<string, Set<WebSocket>>();
const socketToRoom = new Map<WebSocket, string>();

function broadcastRoomState(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach((client) => {
    const peerCount = room.size - 1;
    client.send(
      JSON.stringify({
        type: "room-state",
        peerCount: peerCount,
      } satisfies ServerToClientMessage)
    );
  });
}

app.get("/", (req, res) => {
  const roomSummary = Array.from(rooms.entries()).map(([roomId, clients]) => ({
    roomId,
    numClients: clients.size,
    clients: Array.from(clients).map((client, i) => `socket#${i + 1}`),
  }));
  const socketToRoomEntries = Array.from(socketToRoom.entries()).map(
    ([socket, roomId], idx) => ({
      socket: `socket#${idx + 1}`,
      roomId,
    })
  );

  res.json({
    totalRooms: rooms.size,
    rooms: roomSummary,
    connectedSockets: socketToRoom.size,
    socketToRoom: socketToRoomEntries,
  });
});

wss.on("connection", (socket: WebSocket) => {
  console.log("New client connected");

  socket.on("message", (raw) => {
    try {
      const parsed = JSON.parse(raw.toString());

      if (!parsed?.type) return;

      const msg = parsed as ClientToServerMessage;

      if (msg.type === "join-room") {
        if (socketToRoom.has(socket)) {
          return;
        }

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

        // Broadcast room state to all clients in room
        broadcastRoomState(roomId);

        console.log(`Client joined room: ${roomId}`);
      }

      if (msg.type === "typing") {
        const roomId = socketToRoom.get(socket);
        if (!roomId) return;

        const room = rooms.get(roomId);
        if (!room) return;

        if (msg.text.length > 500) {
          msg.text = msg.text.slice(0, 500);
        }

        room.forEach((peer) => {
          if (peer !== socket) {
            peer.send(
              JSON.stringify({
                type: "peer-typing",
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

    // Broadcast room state to remaining clients
    broadcastRoomState(roomId);

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
