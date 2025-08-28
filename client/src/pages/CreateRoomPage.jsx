import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "../css/CreateRoomPage.css";

function CreateRoomPage() {
  const [nickname, setNickname] = useState("");
  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState("nep");

  const navigate = useNavigate();

  const handleCreate = () => {
    // ★ バリデーション：あいことば必須
    if (!keyword.trim()) {
      alert("あいことばを入力してください！");
      return;
    }

    socket.emit("createRoom", { nickname, keyword, mode });

    // 作成後、MatchingPageへ遷移
    navigate("/match", { state: { nickname, keyword } });
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

      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="">モードを選択</option>
        <option value="ファイブリーグ（３人用）">
          ファイブリーグ（３人用）
        </option>
      </select>

      <button onClick={handleCreate}>作成</button>
    </div>
  );
}

export default CreateRoomPage;
