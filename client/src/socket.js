import { io } from "socket.io-client";

export const socket = io("https://kostebek-server-production.up.railway.app", {
  transports: ["websocket", "polling"],
});