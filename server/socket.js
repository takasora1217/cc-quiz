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
      socket.join(roomID);

      // すでに同じIDのプレイヤーがいない場合のみ追加（スプレッド構文で新配列に）
      if (!rooms[roomID].players.some((p) => p.id === socket.id)) {
        rooms[roomID].players = [
          ...rooms[roomID].players,
          { id: socket.id, name: nickname },
        ];
      }
      io.to(roomID).emit("updatePlayerList", rooms[roomID].players);
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
