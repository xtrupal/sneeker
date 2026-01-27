// WebSocket types
// Note: we use the `.js` extension in the specifier so consumers using `moduleResolution: NodeNext`
// can resolve the generated `.d.ts` files correctly.
export type {
  ClientToServerMessage,
  ServerToClientMessage,
  WsMessageType,
  JoinRoomMessage,
  TypingMessage,
  RoomJoinedMessage,
  RoomFullMessage,
  PeerJoinedMessage,
  PeerLeftMessage,
  PeerTypingMessage,
} from "./ws.js";
