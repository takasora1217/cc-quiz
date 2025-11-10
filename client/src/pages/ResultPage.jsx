import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/ResultPage.css";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // QuizPageから渡された結果データを取得、なければダミーデータを使用
  const questionResults = location.state?.results || [
    "正",
    "誤",
    "誤",
    "正",
    "誤",
  ];

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  const handlePlayAgain = () => {
    navigate("/quiz");
  };

  return (
    <div className="ResultPage">
      <div className="header-container">
        <h2>☆結果発表☆</h2>
      </div>
      <div className="results-centering-container">
        <div className="results-container">
          {questionResults.map((result, index) => (
            <div key={index} className="result-item-container">
              <p className="question-number">第{index + 1}問</p>
              <div
                className={`result-item ${result === "正" ? "true" : "false"}`}
              >
                {result === "正" ? "○" : "×"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="play-again-button" onClick={handlePlayAgain}>
        もう一度あそぶ
      </button>
      <button className="home-button" onClick={handleGoHome}>
        ホームにもどる
      </button>
    </div>
  );
}
