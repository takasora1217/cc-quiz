import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../QuizPage/QuizPage.css";
import AreYouReady from "../QuizPage/AreYouReady";
import QuizDisplay from "../QuizPage/QuizDisplay";
import TrueFalse from "../QuizPage/TrueFalse";

export default function QuizPage() {
  const navigate = useNavigate();
  const [showTrueFalse, setShowTrueFalse] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 5;

  // InputAnswerからの回答送信→ TrueFalseを表示
  const handleAnswerSubmit = (answer) => {
    console.log("回答が送信されました:", answer);
    setShowTrueFalse(true);
  };

  // TrueFalseからの次へボタンクリック→ 問題数更新、TrueFalseを非表示
  const handleNextQuestion = () => {
    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);
    
    if (nextCount >= maxQuestions) {
      // 最大問題数に達した場合は結果ページへ
      navigate("/result");
    } else {
      // 次の問題へ（QuizDisplayに戻る）
      setShowTrueFalse(false);
    }
  };
  
  
  return (
    <div className="QuizPage">
      <AreYouReady /> {/* "Are you ready?" → "Start!" の表示 */}
      
      {/* QuizDisplay または TrueFalse を表示 */}
      {!showTrueFalse ? (
        <QuizDisplay 
          onAnswerSubmit={handleAnswerSubmit} 
          questionNumber={questionCount + 1}
        />
      ) : (
        <TrueFalse 
          onNextQuestion={handleNextQuestion}
          questionNumber={questionCount + 1}
          isLastQuestion={questionCount + 1 === maxQuestions}
        />
      )}
    </div>
  );
}
