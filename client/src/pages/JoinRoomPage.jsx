import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "../css/JoinRoomPage.css";

function JoinRoomPage() {
  const [nickname, setNickname] = useState("");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    socket.emit("joinRoom", { nickname, keyword });
    // 参加完了後にMatchingPageへ遷移
    navigate("/match", { state: { nickname, keyword } });
  };

  return (
    <div className="JoinRoomPage">
      <h2>☆ ルーム参加 ☆</h2>
      <input
        placeholder="名前を入力"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        placeholder="あいことばを入力"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleJoin}>参加</button>
    </div>
  );
}

export default JoinRoomPage;
