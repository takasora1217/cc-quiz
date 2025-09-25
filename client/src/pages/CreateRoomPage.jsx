import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "../css/CreateRoomPage.css";

function CreateRoomPage() {
  const [nickname, setNickname] = useState("");
  const [keyword, setKeyword] = useState("");



  const navigate = useNavigate();

  const handleCreate = () => {

    socket.emit("createRoom", { nickname, keyword });
    // 作成後、MatchingPageへ遷移（フラグ付き）
    navigate("/match", { state: { nickname, keyword, fromCreateRoom: true } });

    // ★ バリデーション：あいことば必須
    if (!keyword.trim()) {
      alert("あいことばを入力してください！");
      return;
    }
  };

  return (
    <div className="CreateRoomPage">
      <h2>☆ ルーム作成 ☆</h2>

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


      <button onClick={handleCreate}>作成</button>
    </div>
  );
}

export default CreateRoomPage;
