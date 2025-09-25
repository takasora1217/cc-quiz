import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/CreateQuestionPage.css";
import { AiCheck } from "./AiCheck";

function CreateQuestionPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(["", "", ""]); // 3文字分の配列
  const [aiResult, setAiResult] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnswerChange = (index, value) => {
    if (value.length > 1) return; // 1文字制限
    const newAnswer = [...answer];
    newAnswer[index] = value;
    setAnswer(newAnswer);
  };

  const handleAiCheck = async () => {
    // バリデーション機能を追加
    if (!question.trim()) {
      alert("問題文を入力してください");
      return;
    }

    if (answer.some((char) => !char.trim())) {
      alert("答えを全て入力してください（3文字）");
      return;
    }

    setLoading(true);
    try {
      const result = await AiCheck({ question, answer: answer.join("") });
      setAiResult(result);
    } catch (error) {
      setAiResult("AIチェックでエラーが発生しました");
    }
    setLoading(false);
  };

  // Firebase保存処理の実装（try-catch含む）
  const handleSubmit = async () => {
    // バリデーション機能を追加
    if (!question.trim()) {
      alert("問題文を入力してください");
      return;
    }

    if (answer.some((char) => !char.trim())) {
      alert("答えを全て入力してください（3文字）");
      return;
    }

    try {
      await addDoc(collection(db, "questions"), {
        question: question.trim(),
        answer: answer.join(""),
        createdAt: new Date(),
      });

      // 保存成功時のフィードバック表示
      alert("問題が正常に保存されました！");
      console.log("問題が保存されました:", question);
      navigate("/"); // 投稿後にホーム画面へ遷移
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="CreateQuestionPage">
      <h2>☆ つくる ☆</h2>

      {/* 問題入力 */}
      <h3>問題文</h3>
      <input
        className="question-input"
        placeholder="問題文を入力"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* 答え入力 */}
      <h4>答え</h4>
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

        <button1 onClick={handleAiCheck} disabled={loading}>
        {loading ? "チェック中..." : "AIチェック"}
      </button1>

      {/* AIの結果を表示 */}
      <p>AIチェック結果：{aiResult}</p>
      <button2 onClick={handleSubmit}>投稿</button2>

    </div>
  );
}

export default CreateQuestionPage;
