import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket/socket";
import "./QuizPage.css";

export default function InputAnswer({ onAnswerSubmit, questionNumber }) {
  const [answer, setAnswer] = useState("");
  const [buttonLabel, setButtonLabel] = useState("回答送信");
  const location = useLocation();

  const handleSubmit = () => {
    if (answer.trim()) {
      console.log("解答:", answer);
      setButtonLabel("お待ちください...");

      // サーバーに回答を送信
      const keyword = location.state?.keyword;
      socket.emit("answerSubmitted", {
        answer: answer.trim(),
        keyword,
        questionNumber,
      });

      // 親コンポーネントに回答を送信
      if (onAnswerSubmit) {
        onAnswerSubmit(answer);
      }

      setAnswer("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <input
        className="input"
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        // ↓？？？
        onKeyPress={handleKeyPress}
        placeholder="答"
      />
      <button
        className="AnswerButton1"
        onClick={handleSubmit}
        disabled={!answer.trim() || buttonLabel === "お待ちください"}
      >
        {buttonLabel}
      </button>
    </>
  );
}
