import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "../css/MatchingPage.css";

export default function MatchingPage() {
  const [players, setPlayers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const myName = location.state?.nickname;
  const keyword = location.state?.keyword;

  useEffect(() => {
    // 参加者側でページ遷移時にjoinRoomをemit
    if (myName && keyword) {
      socket.emit("joinRoom", { nickname: myName, keyword });
    }

    socket.on("updatePlayerList", setPlayers);

    return () => {
      socket.off("updatePlayerList", setPlayers);
    };
  }, [myName, keyword]);

  useEffect(() => {
    // サーバーからゲーム開始イベントを受信したら全員QuizPageへ遷移
    socket.on("gameStarted", () => {
      navigate("/quiz", { state: { roomID: `room-${keyword}`, nickname: myName } });
    });
    return () => socket.off("gameStarted");
  }, [navigate, keyword, myName]);

  return (
    <div className="MatchingPage">
      <h2>待機中...</h2>
      <div className="info-box">
        <div>あなたの名前: {myName}</div>
        <div>　あいことば: {keyword}</div>
      </div>
      <div className="player-list">
        <div>参加者リスト:</div>
        <ul>
          {players.map((p) => (
            <li key={p.id} style={{ color: "blue" }}>
              {p.name} {p.name === myName && <span style={{ color: "black" }}> ←あなた</span>}
            </li>
          ))}
        </ul>
      </div>
      {/* 3人揃ったらスタートボタン表示 */}
      {players.length === 3 && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            style={{ fontSize: "1.3em", padding: "15px 40px", background: "#ff0", borderRadius: "20px" }}
            onClick={() => socket.emit("startGame", { roomID: `room-${keyword}` })}
          >ゲームスタート</button>
        </div>
      )}
    </div>
  );
}
// filepath: c:\Projects\MyWebApp\cc-quiz\client\src\pages\MatchingPage.jsx
