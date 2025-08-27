import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "../css/CreateRoomPage.css";

function ModeSelection() {
  const [nickname, setNickname] = useState("");
  const [keyword, setKeyword] = useState("");

  const [mode, setMode] = useState("nep");

  const navigate = useNavigate();

  const handleCreate = () => {
    socket.emit("createRoom", { nickname, keyword, mode });

    // 作成後、MatchingPageへ遷移
    navigate("/create-question", { state: { nickname, keyword } });
  };

  return (
    <div className="CreateRoomPage">
      <h2>☆ モード選択 ☆</h2>

      <select onChange={(e) => setMode(e.target.value)}>
        <option value="">モードを選択</option>
        <option value="ファイブリーグ（３人用）">
          ファイブリーグ（３人用）
        </option>
      </select>

      <button onClick={handleCreate}>選択</button>
    </div>
  );
}

export default ModeSelection;
