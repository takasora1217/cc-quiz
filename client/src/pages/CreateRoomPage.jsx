import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "../css/CreateRoomPage.css";

function CreateRoomPage() {
  const [nickname, setNickname] = useState("");
  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    socket.emit("createRoom", { nickname, keyword, mode });

    // ファイブリーグモードのときだけ CreateQuestionPage へ遷移
    if (mode === "ファイブリーグ（３人用）") {
      navigate("/create-question");
    }
  };

  return (
    <div className="CreateRoomPage">
      <h2>☆ ルーム作成 ☆</h2>

      <input
        placeholder="名前を入力"
        onChange={(e) => setNickname(e.target.value)}
      />

      <input
        placeholder="あいことばを入力"
        onChange={(e) => setKeyword(e.target.value)}
      />

      <select onChange={(e) => setMode(e.target.value)}>
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
