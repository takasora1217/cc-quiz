const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
// 必要なら特定オリジンを許可。開発中は ["http://localhost:5173","https://cc-quiz-ra32.onrender.com"]
app.use(cors());

app.get("/", (req, res) => res.send("cc-quiz server running"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://cc-quiz-ra32.onrender.com"],
    methods: ["GET", "POST"],
  },
});

require("./socket")(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 サーバー起動 ポート: ${PORT}`);
});
