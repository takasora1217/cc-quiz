import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "../css/JoinRoomPage.css";

function JoinRoomPage() {
  const [nickname, setNickname] = useState("");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // サーバーからjoinErrorを受け取ったらエラー表示
    socket.on("joinError", (data) => {
      setError(data.message);
    });
    return () => {
      socket.off("joinError");
    };
  }, []);

  const handleJoin = () => {
    setError(""); // 前回のエラーをクリア
    socket.emit("joinRoom", { nickname, keyword });

    // サーバーからjoinErrorが来なければ、updatePlayerListが来るはず
    // ここでは遷移せず、updatePlayerListをMatchingPageで受け取る
    socket.once("updatePlayerList", () => {
      navigate("/match", { state: { nickname, keyword } });
      setKeyword("");
      setNickname("");
    });
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
      {error && (
        <div
          style={{
            color: "#000000ff",
            fontSize: "3vh",
            marginTop: "2vh",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default JoinRoomPage;
