const { v4: uuidv4 } = require('uuid');
const rooms = {};

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 接続:", socket.id);

    // 通信確認用のテストイベント
    socket.on("ping", (msg) => {
      console.log("📥 ping受信:", msg);
      socket.emit("pong", "pong from server");
    });

    socket.on("createRoom", ({ nickname, keyword, mode }) => {
      console.log("📥 createRoom 受信:", { nickname, keyword, mode });

      const roomID = `room-${keyword}`;
      socket.join(roomID);

      // プレイヤー登録（必要に応じて rooms に保存）
      rooms[roomID] = {
        mode,
        players: [{ id: socket.id, name: nickname }],
      };

      // マッチング情報をクライアントへ送信
      io.to(roomID).emit("updatePlayerList", rooms[roomID].players);
    });
    socket.on("startGame", ({ roomID }) => {
      const startTime = Date.now() + 5000; // 今から5秒後
      io.to(roomID).emit("gameStartAt", { startAt: startTime }); // ルーム内のクライアントに同期通知
    });
  });
};
