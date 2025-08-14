import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  autoConnect: false,        // Connect manually
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
