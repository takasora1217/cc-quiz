import React, { useState } from "react";
import "./QuizPage.css";

export default function InputAnswer() {
    const [answer, setAnswer] = useState("");
        
      const handleSubmit = () => {
          if (answer.trim()) {
            console.log("解答:", answer);
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
        disabled={!answer.trim()}
      >
        回答送信
      </button>
    </>
  );
}