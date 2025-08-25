const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

// 🔗 socketイベントを読み込んで接続
require("./socket")(io); // ioをsocket.jsに渡す

server.listen(3001, () => {
  console.log("🚀 サーバー起動 http://localhost:3001");
});
