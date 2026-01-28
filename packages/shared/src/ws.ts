// All possible WebSocket message types
export type WsMessageType =
  | "join-room"
  | "room-joined"
  | "room-state"
  | "room-full"
  | "typing"
  | "peer-typing";

export type JoinRoomMessage = {
  type: "join-room";
  roomId: string;
};

export type TypingMessage = {
  type: "typing";
  text: string;
};

export type RoomJoinedMessage = {
  type: "room-joined";
  roomId: string;
};

export type RoomStateMessage = {
  type: "room-state";
  peerCount: number; // 0 or 1 (excluding self)
};

export type RoomFullMessage = {
  type: "room-full";
};

export type PeerTypingMessage = {
  type: "peer-typing";
  text: string;
};

export type ClientToServerMessage = JoinRoomMessage | TypingMessage;

export type ServerToClientMessage =
  | RoomJoinedMessage
  | RoomStateMessage
  | RoomFullMessage
  | PeerTypingMessage;
