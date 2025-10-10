import React, { useState } from "react";
import "./QuizPage.css";

//モーダルの開閉状況、モーダルを閉じる機能、問題文をQuizDisplayから受け取る
export default function AnswerModal({ isOpen, onClose, questionText }) {
  const [answer, setAnswer] = useState("");

  //正直この辺はAIに作らせたのでよくわかってません。申し訳ないです。編集よろしくお願いします。
  const handleSubmit = () => {
    if (answer.trim()) {
      console.log("解答:", answer);
      setAnswer("");
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>解答入力</h3>
          <p className="question-text">{questionText}</p>
            <label htmlFor="answer-input">あなたの解答:</label>
            <input
              id="answer-input"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
               // ↓？？？
              onKeyPress={handleKeyPress}
              placeholder="答"
            />
        
          <button className="cancel-button" onClick={onClose}>
            戻る
          </button>
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={!answer.trim()}
          >
            送信
          </button>
          </div>
    </div>
  );
}