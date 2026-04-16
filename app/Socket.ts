import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 20,
});
