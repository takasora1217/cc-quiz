const { v4: uuidv4 } = require("uuid");

module.exports = function (io, roomsModule, admin) {
  const { rooms, getAllQuestions } = roomsModule;
  io.on("connection", (socket) => {
    console.log("🟢 接続:", socket.id);

    socket.on("createRoom", async ({ nickname, keyword, mode }) => {
      const roomID = `room-${keyword}`;
      socket.join(roomID);

      // プレイヤー登録（新規作成時は1人だけ）
      rooms[roomID] = {
        mode,
        players: [{ id: socket.id, name: nickname }],
        usedQuestions: [], // 使用済み問題ID
        stage: 1,
        correctCount: 0,
        incorrectCount: 0,
        playerOrder: [],
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

      // すでに同じIDのプレイヤーがいない場合のみ追加
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

    // 問題取得・管理API（フェーズ3用）
    socket.on("getQuestions", async ({ roomID }) => {
      console.log("getQuestions受信 roomID:", roomID);
      try {
        const questions = await getAllQuestions(admin);
        console.log("Firestoreから取得したquestions:", questions);
        if (!rooms[roomID]) return;
        rooms[roomID].questions = questions;
        rooms[roomID].usedQuestions = [];
        rooms[roomID].stage = 1;
        rooms[roomID].correctCount = 0;
        rooms[roomID].incorrectCount = 0;
        // 最初の問題をランダムで選択
        const unused = questions;
        const randIdx = Math.floor(Math.random() * unused.length);
        rooms[roomID].currentQuestion = unused[randIdx];
        console.log("questionsList送信:", questions);
        io.to(roomID).emit("questionsList", questions);
      } catch (e) {
        console.log("getQuestionsエラー", e);
        io.to(roomID).emit("questionsError", { message: "問題取得失敗" });
      }
    });

    // プレイヤー順序ランダム決定（フェーズ5）
    socket.on("decidePlayerOrder", ({ roomID }) => {
      if (!rooms[roomID]) return;
      const order = [...rooms[roomID].players].sort(() => Math.random() - 0.5);
      rooms[roomID].playerOrder = order;
      io.to(roomID).emit("playerOrder", order);
    });

    // ゲームスタート同期イベント
    socket.on("startGame", ({ roomID }) => {
      if (!rooms[roomID]) return;
      io.to(roomID).emit("gameStarted");
    });

    // 回答受信・判定（フェーズ8～10）
    socket.on("submitAnswer", ({ roomID, answer, nickname }) => {
      if (!rooms[roomID]) return;
      if (!rooms[roomID].answers) rooms[roomID].answers = [];
      rooms[roomID].answers.push(answer);

      // 全員分揃ったら判定
      if (rooms[roomID].answers.length === 3) {
        io.to(roomID).emit("allAnswers", rooms[roomID].answers);
        // 3人分の回答を左から順に合体
        const combined = rooms[roomID].answers.map(a => a.join("")).join("");
        let correct = false;
        if (rooms[roomID].currentQuestion && rooms[roomID].currentQuestion.answer) {
          correct = combined === rooms[roomID].currentQuestion.answer;
        }
        // カウント更新
        if (correct) {
          rooms[roomID].correctCount = (rooms[roomID].correctCount || 0) + 1;
        } else {
          rooms[roomID].incorrectCount = (rooms[roomID].incorrectCount || 0) + 1;
        }
        io.to(roomID).emit("judgeResult", { correct });

        // ゲーム終了判定
        if (rooms[roomID].correctCount >= 5 || rooms[roomID].incorrectCount >= 2) {
          // ゲーム終了（部屋削除）
          setTimeout(() => { delete rooms[roomID]; }, 5000);
        } else {
          // 次ステージ準備
          rooms[roomID].usedQuestions.push(rooms[roomID].currentQuestion.id);
          const unused = rooms[roomID].questions.filter(q => !rooms[roomID].usedQuestions.includes(q.id));
          if (unused.length > 0) {
            const randIdx = Math.floor(Math.random() * unused.length);
            rooms[roomID].currentQuestion = unused[randIdx];
            rooms[roomID].stage = (rooms[roomID].stage || 1) + 1;
          }
        }
        rooms[roomID].answers = [];
      }
    });
  });
};
