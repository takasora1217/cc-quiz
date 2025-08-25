import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreateQuestionPage.css";

function CreateQuestionPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(["", "", ""]); // 3文字分の配列
  const navigate = useNavigate();

  const handleAnswerChange = (index, value) => {
    if (value.length > 1) return; // 1文字制限
    const newAnswer = [...answer];
    newAnswer[index] = value;
    setAnswer(newAnswer);
  };

  const handleSubmit = () => {
    console.log("問題:", question);
    console.log("答え:", answer.join(""));
    // socket.emit("createQuestion", { question, answer: answer.join("") });

    navigate("/"); // 投稿後にホーム画面へ遷移
  };

  return (
    <div className="CreateQuestionPage">
      <h2>☆ つくる ☆</h2>

      {/* 問題入力 */}
      <input className="question-input"
        placeholder="問題文を入力"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* 答え入力 */}
      <h3>答え</h3>
      <div className="answer-boxes">
        {answer.map((char, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            placeholder={index + 1} // 入力欄内に表示
            value={char}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        ))}
      </div>

      <button onClick={handleSubmit}>投稿</button>
    </div>
  );
}

export default CreateQuestionPage;
