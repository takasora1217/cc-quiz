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
       <div>自分の名前: {myName}</div>
       <div>合言葉: {keyword}</div>
       <div>参加者リスト:</div>
       <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.name} {p.name === myName && "👈あなた"}
          </li>
        ))}
       </ul>
      </div>
    </div>
  );
}
// filepath: c:\Projects\MyWebApp\cc-quiz\client\src\pages\MatchingPage.jsx
