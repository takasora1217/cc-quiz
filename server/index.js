const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

// rooms.jsを渡す
const rooms = require("./rooms");

// 🔗 socketイベントを読み込んで接続
require("./socket")(io, rooms, admin); // io, rooms, adminをsocket.jsに渡す

server.listen(3001, () => {
  console.log("🚀 サーバー起動 http://localhost:3001");
});
