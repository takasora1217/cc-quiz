import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "../css/MatchingPage.css";

export default function MatchingPage() {
  const [players, setPlayers] = useState([]);
  const [mode, setMode] = useState(""); // 追加: モード選択
  const location = useLocation();
  const navigate = useNavigate();
  const myName = location.state?.nickname;
  const keyword = location.state?.keyword;

  useEffect(() => {
    // CreateRoomから来た場合は既に部屋に参加済みなので joinRoom を送信しない
    // JoinRoomから来た場合のみ joinRoom を送信
    const fromCreateRoom = location.state?.fromCreateRoom;

    if (myName && keyword && !fromCreateRoom) {
      socket.emit("joinRoom", { nickname: myName, keyword });
    }

    socket.on("updatePlayerList", setPlayers);

    socket.on("joinError", ({ message }) => {
      alert(message);
      navigate("/");
    });

    socket.on("startQuiz", ({ keyword, mode, players }) => {
      navigate("/quiz", { state: { keyword, mode, players } });
    });

    return () => {
      socket.off("updatePlayerList", setPlayers);
      socket.off("joinError");
      socket.off("startQuiz");
    };
  }, [myName, keyword, navigate, location.state]);

  // ゲームスタートボタン押下時
  const handleStartQuiz = () => {
    if (!mode) return;
    socket.emit("startQuiz", { keyword, mode });
  };

  return (
    <div className="MatchingPage">
      <h2>待機中...</h2>
      <div className="info-box">
        <div>あなたの名前: {myName}</div>
        <div>あいことば: {keyword}</div>
      </div>
      <div className="player-list">
        <div>参加者リスト:</div>
        <ul>
          {players.map((p) => (
            <li key={p.id} style={{ color: "blue" }}>
              {p.name}{" "}
              {p.name === myName && (
                <span style={{ color: "black" }}> ←あなた</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mode-select">
        <label>モード選択：</label>
        <select
          className="MatchingPage-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="">選択してください</option>
          <option value="five-league">ファイブリーグ（3人用）</option>
          <option value="other-mode">その他モード</option>
        </select>
      </div>
      <button
        className="MatchingPage-button"
        onClick={handleStartQuiz}
        disabled={!mode}
      >
        ゲームスタート
      </button>
    </div>
  );
}
// filepath: c:\Projects\MyWebApp\cc-quiz\client\src\pages\MatchingPage.jsx
