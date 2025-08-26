import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="HomePage">
      <img src="/img/リーーーグ.png" />
      <h1>みんなで作ってみんなで遊べるクイズゲーム</h1>
      <div className="buttons">
        <button onClick={() => navigate("/create-question")}>作る</button>
        <button onClick={() => navigate("/play")}>遊ぶ</button>
      </div>
    </div>
  );
}

export default HomePage;
