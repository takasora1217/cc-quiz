import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import setupSocket from "./socket.js";

// .envファイルを読み込む
dotenv.config();

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

// 🔗 socketイベントを読み込んで接続
setupSocket(io); // ioをsocket.jsに渡す

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 サーバー起動 http://localhost:${PORT}`);
  console.log(
    `環境変数確認: GEMINI_API_KEY=${
      process.env.GEMINI_API_KEY ? "設定済み" : "未設定"
    }`
  );
});
