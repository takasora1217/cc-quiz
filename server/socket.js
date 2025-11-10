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
      // もし既にホストが問題を設定していれば、新しく入室したクライアントにも送信
      if (rooms[roomID].questions && rooms[roomID].questions.length > 0) {
        socket.emit("roomQuestions", rooms[roomID].questions);
      }
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
      rooms[roomID].players = rooms[roomID].players.slice(0, 3);

      io.to(roomID).emit("updatePlayerList", rooms[roomID].players);
    });

    socket.on("startQuiz", ({ keyword, mode }) => {
      const roomID = `room-${keyword}`;
      if (!rooms[roomID]) return;
      // ルームのモードを更新
      rooms[roomID].mode = mode;
      // 回答管理用のオブジェクトを初期化
      rooms[roomID].answers = {};
      // ルームの全員に通知。あらかじめ選択された問題があれば含める
      io.to(roomID).emit("startQuiz", {
        keyword,
        mode,
        players: rooms[roomID].players,
        questions: rooms[roomID].questions || [],
      });
    });

    // ホストが選択した問題リストを受け取り、ルームに保存して全員に配信する
    socket.on("selectedQuestions", ({ keyword, questions }) => {
      const roomID = `room-${keyword}`;
      if (!rooms[roomID]) return;
      // 受け取った問題配列を保存（質問オブジェクトの配列を想定）
      rooms[roomID].questions = questions;
      console.log(
        `部屋${roomID}に問題がセットされました:`,
        questions.map((q) => q.id || q)
      );
      // 全員に配信して各クライアントを同期させる
      io.to(roomID).emit("roomQuestions", rooms[roomID].questions);
    });

    // プレイヤーの回答を受信
    socket.on("answerSubmitted", ({ answer, keyword, questionNumber }) => {
      const roomID = `room-${keyword}`;
      if (!rooms[roomID]) return;

      // 回答を保存
      if (!rooms[roomID].answers[questionNumber]) {
        rooms[roomID].answers[questionNumber] = {};
      }
      rooms[roomID].answers[questionNumber][socket.id] = answer;

      console.log(`問題${questionNumber}の回答: ${answer} (${socket.id})`);

      // 全員の回答が揃ったかチェック
      const currentAnswers = rooms[roomID].answers[questionNumber];
      const totalPlayers = rooms[roomID].players.length;
      const submittedCount = Object.keys(currentAnswers).length;

      console.log(`回答数: ${submittedCount}/${totalPlayers}`);

      if (submittedCount === totalPlayers) {
        // 全員の回答が揃った場合、プレイヤー順序を保って配列にする
        const answersArray = rooms[roomID].players.map(
          (player) => currentAnswers[player.id] || "？"
        );

        console.log(`問題${questionNumber} 全員回答完了:`, answersArray);

        // 全員にTrueFalse表示を指示
        io.to(roomID).emit("allAnswersReady", {
          questionNumber,
          answers: answersArray,
          players: rooms[roomID].players,
        });
      }
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
