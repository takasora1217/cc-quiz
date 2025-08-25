import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="HomePage">
      <h1>home</h1>
      <img src="/img/リーーーグ.png" />
      <div className="buttons">
        <button onClick={() => navigate("/play")}>遊ぶ</button>
        <button onClick={() => navigate("/create")}>作る</button>
      </div>
    </div>
  );
}

export default HomePage;
