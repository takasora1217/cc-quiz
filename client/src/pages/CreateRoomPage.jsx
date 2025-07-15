import React, { useState } from "react";
import socket from "../socket/socket";

function CreateRoomPage() {
  const [nickname, setNickname] = useState("");
  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState("nep");

  const handleCreate = () => {
    socket.emit("createRoom", { nickname, keyword, mode });
  };

  return (
    <div>
      <h2>ルーム作成</h2>
      <input placeholder="名前" onChange={(e) => setNickname(e.target.value)} />
      <input
        placeholder="あいことば"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleCreate}>作成</button>
    </div>
  );
}

export default CreateRoomPage;
// This file is identical in both locations, so no changes are needed.