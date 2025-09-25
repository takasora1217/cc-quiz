const { v4: uuidv4 } = require("uuid");
const rooms = {};

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 接続:", socket.id);

    socket.on("createRoom", ({ nickname, keyword, mode }) => {
      const roomID = `room-${keyword}`;
      socket.join(roomID);

      // プレイヤー登録（新規作成時は1人だけ）
      rooms[roomID] = {
        mode,
        players: [{ id: socket.id, name: nickname }],
      };

      io.to(roomID).emit("updatePlayerList", rooms[roomID].players);
    });

    socket.on("joinRoom", ({ nickname, keyword }) => {
      const roomID = `room-${keyword}`;
      if (!rooms[roomID]) {
        socket.emit("joinError", {
          message: "その合言葉の部屋は存在しません。",
        });
        return;
      }
      // 4人以上なら入室拒否（players追加前に判定）
      if (rooms[roomID].players.length >= 4) {
        socket.emit("joinError", {
          message: "この部屋は満員です。",
        });
        return;
      }
      socket.join(roomID);

      // ここで追加
      if (!rooms[roomID].players.some((p) => p.id === socket.id)) {
        rooms[roomID].players = [
          ...rooms[roomID].players,
          { id: socket.id, name: nickname },
        ];
      }

      // 念のため3人までに制限
      rooms[roomID].players = rooms[roomID].players.slice(0,3);

      io.to(roomID).emit("updatePlayerList", rooms[roomID].players);
    });

    socket.on("startQuiz", ({ keyword, mode }) => {
      const roomID = `room-${keyword}`;
      if (!rooms[roomID]) return;
      // ルームのモードを更新
      rooms[roomID].mode = mode;
      // ルームの全員に通知
      io.to(roomID).emit("startQuiz", {
        keyword,
        mode,
        players: rooms[roomID].players,
      });
    });

    socket.on("disconnect", () => {
      for (const roomID in rooms) {
        const idx = rooms[roomID].players.findIndex((p) => p.id === socket.id);
        if (idx !== -1) {
          if (idx === 0) {
            io.to(roomID).emit("roomClosed");
            delete rooms[roomID];
          } else {
            rooms[roomID].players = [
              ...rooms[roomID].players.slice(0, idx),
              ...rooms[roomID].players.slice(idx + 1),
            ];
            io.to(roomID).emit("updatePlayerList", rooms[roomID].players);
          }
          break;
        }
      }
    });
  });
};
