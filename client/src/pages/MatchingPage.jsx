import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket/socket";
import "../css/MatchingPage.css";

export default function MatchingPage() {
  const [players, setPlayers] = useState([]);
  const location = useLocation();
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
    </div>
  );
}
// filepath: c:\Projects\MyWebApp\cc-quiz\client\src\pages\MatchingPage.jsx
