import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomID, nickname } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [playerOrder, setPlayerOrder] = useState([]);
  const [players, setPlayers] = useState([]);
  const [stage, setStage] = useState(1);
  const [showStage, setShowStage] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [submitted, setSubmitted] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [usedIds, setUsedIds] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [gameEnd, setGameEnd] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    console.log("QuizPage useEffect roomID:", roomID);
    if (!roomID) {
      setError("ルーム情報がありません");
      return;
    }
    // ルーム情報取得
    socket.emit("getQuestions", { roomID });
    socket.emit("decidePlayerOrder", { roomID });

    socket.on("questionsList", (q) => {
      console.log("questionsList受信", q);
      setQuestions(q);
      if (q.length < 7) {
        setError("問題が足りません。ホームに戻ります。");
      } else {
        // 最初の問題をランダムで選択
        const unused = q;
        const randIdx = Math.floor(Math.random() * unused.length);
        console.log("currentQuestion候補", unused[randIdx]);
        setCurrentQuestion(unused[randIdx]);
      }
    });
    // ゲームスタートイベント受信
    socket.on("gameStarted", () => {
      setGameStarted(true);
    });
    socket.on("questionsError", (e) => setError(e.message));
    socket.on("playerOrder", (order) => setPlayerOrder(order));
    socket.on("updatePlayerList", (list) => setPlayers(list));
    socket.on("allAnswers", (ans) => setAllAnswers(ans));
    socket.on("judgeResult", (res) => {
      setResult(res);
      if (res.correct) {
        setCorrectCount((c) => c + 1);
      } else {
        setIncorrectCount((c) => c + 1);
      }
    });

    return () => {
      socket.off("questionsList");
      socket.off("questionsError");
      socket.off("playerOrder");
      socket.off("updatePlayerList");
      socket.off("allAnswers");
      socket.off("judgeResult");
    };
  }, [roomID]);

  // ステージ表示の自動非表示
  useEffect(() => {
    if (showStage) {
      const timer = setTimeout(() => setShowStage(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showStage, stage]);

  // ゲーム終了判定
  useEffect(() => {
    if (correctCount >= 5) {
      setGameEnd("クリア！！！");
    } else if (incorrectCount >= 2) {
      setGameEnd("GAME OVER");
    }
  }, [correctCount, incorrectCount]);

  if (error) {
    return (
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        {/* プレイヤー名は常に表示 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            marginBottom: "20px",
          }}
        >
          {(playerOrder.length > 0 ? playerOrder : players).map((p, i) => (
            <div
              key={p.id || p.name}
              style={{ fontWeight: "bold", fontSize: "1.2em", color: "red" }}
            >
              {p.name}
            </div>
          ))}
        </div>
        {/* デバッグ表示: playerOrder, playersの中身 */}
        <div style={{ fontSize: "0.8em", color: "#888", marginBottom: "10px" }}>
          <div>playerOrder: {JSON.stringify(playerOrder)}</div>
          <div>players: {JSON.stringify(players)}</div>
        </div>
        {/* エラー内容とボタンを1つのdivで囲む */}
        <div style={{ color: "red", textAlign: "center" }}>
          {error}
          <br />
          <button onClick={() => navigate("/")}>ホームに戻る</button>
        </div>
      </div>
    );
  }

  if (gameEnd) {
    return (
      <div
        style={{
          background: "#fff",
          minHeight: "100vh",
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        {/* プレイヤー名は常に表示 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            marginBottom: "20px",
          }}
        >
          {(playerOrder.length > 0 ? playerOrder : players).map((p, i) => (
            <div
              key={p.id || p.name}
              style={{ fontWeight: "bold", fontSize: "1.2em", color: "red" }}
            >
              {p.name}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: "2em" }}>{gameEnd}</div>
          <br />
          <button onClick={() => navigate("/")}>ホームに戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="QuizPage"
      style={{ background: "#fff", minHeight: "100vh" }}
    >
      {/* ステージ表示 */}
      {showStage && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "2em",
            fontWeight: "bold",
            background: "#fff8",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          ステージ{stage}
        </div>
      )}

      {/* プレイヤー名は常に表示 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginBottom: "20px",
        }}
      >
        {players.map((p, i) => (
          <div
            key={p.id || p.name}
            style={{ fontWeight: "bold", fontSize: "1.2em", color: "red" }}
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* 問題表示（ゲーム開始後は必ず表示） */}
      {gameStarted && currentQuestion && (
        <>
          {console.log("表示直前 currentQuestion:", currentQuestion)}
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>問題</div>
            <div style={{ fontSize: "1.3em", margin: "10px 0" }}>
              {currentQuestion.question}
            </div>
          </div>
        </>
      )}

      {/* 回答入力 */}
      {!submitted && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setSubmitted(true)}
            style={{ fontSize: "1.1em", marginBottom: "10px" }}
          >
            回答する
          </button>
          {submitted && (
            <div
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              {answers.map((char, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => {
                    const arr = [...answers];
                    arr[idx] = e.target.value.slice(0, 1);
                    setAnswers(arr);
                  }}
                  style={{
                    width: "40px",
                    fontSize: "1.2em",
                    textAlign: "center",
                  }}
                />
              ))}
              <button
                onClick={() => {
                  socket.emit("submitAnswer", {
                    roomID,
                    answer: answers,
                    nickname,
                  });
                  setSubmitted(true);
                }}
                style={{ marginLeft: "10px" }}
              >
                送信
              </button>
            </div>
          )}
        </div>
      )}

      {/* 回答表示 */}
      {allAnswers.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            margin: "30px 0",
          }}
        >
          {allAnswers.map((ans, idx) => (
            <div
              key={idx}
              style={{
                background: "#eef",
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "1.3em",
              }}
            >
              {ans.join("")}
            </div>
          ))}
        </div>
      )}

      {/* 判定表示 */}
      {result && (
        <div
          style={{
            textAlign: "center",
            fontSize: "1.5em",
            color: result.correct ? "red" : "blue",
            marginBottom: "20px",
          }}
        >
          {result.correct ? "⭕ 正解！" : "❌ 不正解"}
        </div>
      )}

      {/* 正解・不正解カウント表示 */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <span style={{ color: "red", fontWeight: "bold" }}>
          正解: {correctCount}
        </span>
        <span style={{ margin: "0 20px" }}></span>
        <span style={{ color: "blue", fontWeight: "bold" }}>
          不正解: {incorrectCount}
        </span>
      </div>
      {/* 次ステージ進行ボタン（判定後） */}
      {result && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => {
              setUsedIds((ids) => {
                const newIds = [...ids, currentQuestion.id];
                // 未使用問題から次を選択
                const unused = questions.filter((q) => !newIds.includes(q.id));
                if (unused.length === 0) {
                  setError("残り問題がありません。ホームに戻ります。");
                  return newIds;
                }
                const randIdx = Math.floor(Math.random() * unused.length);
                setCurrentQuestion(unused[randIdx]);
                setStage((s) => s + 1);
                setShowStage(true);
                setAnswers(["", "", ""]);
                setSubmitted(false);
                setAllAnswers([]);
                setResult(null);
                return newIds;
              });
            }}
            style={{ marginTop: "10px" }}
          >
            次のステージへ
          </button>
        </div>
      )}
    </div>
  );
}
