import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="HomePage">
      <h1>☆ ホーム画面 ☆</h1>
      <button onClick={() => navigate("/play")}>遊ぶ</button>
      <button onClick={() => navigate("/create")}>作る</button>
    </div>
  );
}

export default HomePage;
