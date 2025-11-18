import { io } from "socket.io-client";
// HTTPS を明示、必要なら transports を指定
const socket = io("https://cc-quiz-ra32.onrender.com", {
  transports: ["websocket", "polling"],
});
export default socket;
