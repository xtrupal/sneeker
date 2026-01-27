// All possible WebSocket message types
export type WsMessageType =
  | "join-room"
  | "room-joined"
  | "room-full"
  | "peer-joined"
  | "peer-left"
  | "typing";

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

export type RoomFullMessage = {
  type: "room-full";
};

export type PeerJoinedMessage = {
  type: "peer-joined";
};

export type PeerLeftMessage = {
  type: "peer-left";
};

export type PeerTypingMessage = {
  type: "typing";
  text: string;
};

export type ClientToServerMessage = JoinRoomMessage | TypingMessage;

export type ServerToClientMessage =
  | RoomJoinedMessage
  | RoomFullMessage
  | PeerJoinedMessage
  | PeerLeftMessage
  | PeerTypingMessage;
