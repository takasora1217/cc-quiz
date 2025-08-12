import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/PlaySetupPage.css";

function PlaySetupPage() {
  const navigate = useNavigate();

  return (
    <div className="PlaySetupPage">
      <h2>☆ あそぶ ☆</h2>
      <button onClick={() => navigate("/create")}>ルーム作成</button>
      <button onClick={() => navigate("/join")}>ルーム参加</button>
    </div>
  );
}

export default PlaySetupPage;
