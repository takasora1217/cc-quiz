import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket/socket";

export default function MatchingPage() {
  const [players, setPlayers] = useState([]);
  const location = useLocation();
  const myName = location.state?.nickname;

  useEffect(() => {
    socket.on("updatePlayerList", setPlayers);

    return () => {
      socket.off("updatePlayerList", setPlayers);
    };
  }, []);

  return (
    <div>
      <h2>Matching Page</h2>
      <div>自分の名前: {myName}</div>
      <div>参加者リスト:</div>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.name} {p.name === myName && "👈あなた"}
          </li>
        ))}
      </ul>
    </div>
  );
}
