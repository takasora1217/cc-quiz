import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../QuizPage/QuizPage.css";
import AreYouReady from "../QuizPage/AreYouReady";
import QuizDisplay from "../QuizPage/QuizDisplay";
import TrueFalse from "../QuizPage/TrueFalse";
import socket from "../socket/socket";

export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTrueFalse, setShowTrueFalse] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [results, setResults] = useState([]); // 結果を保存する配列
  const [roomData, setRoomData] = useState(null); // ルーム情報
  const maxQuestions = 5;

  // ルーム情報を取得
  useEffect(() => {
    // locationからルーム情報を取得（他のページから遷移してきた場合）
    if (location.state) {
      setRoomData(location.state);
    }

    // Socket.ioでルーム情報の更新を監視
    socket.on("roomUpdated", (updatedRoomData) => {
      setRoomData(updatedRoomData);
    });

    // 全員の回答が揃ったらTrueFalseを表示
    socket.on(
      "allAnswersReady",
      ({ questionNumber: qNum, answers, players }) => {
        console.log(`問題${qNum}の全員回答完了、TrueFalse表示:`, answers);
        setShowTrueFalse(true);
      }
    );

    return () => {
      socket.off("roomUpdated");
      socket.off("allAnswersReady");
    };
  }, [location]);

  // InputAnswerからの回答送信→ 待機状態（TrueFalseはサーバーからの通知で表示）
  const handleAnswerSubmit = (answer) => {
    console.log("回答が送信されました:", answer);
    // setShowTrueFalse(true); // これはサーバーからの通知で実行される
  };

  // TrueFalseからの次へボタンクリック→ 問題数更新、TrueFalseを非表示
  const handleNextQuestion = (judgeResult) => {
    // judgeの結果を配列に保存
    const newResults = [...results, judgeResult];
    setResults(newResults);
    console.log("結果が保存されました:", newResults);

    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);

    if (nextCount >= maxQuestions) {
      // 最大問題数に達した場合は結果ページへ
      navigate("/result", { state: { results: newResults } });
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
          roomData={roomData}
        />
      ) : (
        <TrueFalse
          onNextQuestion={handleNextQuestion}
          questionNumber={questionCount + 1}
          isLastQuestion={questionCount + 1 === maxQuestions}
          roomData={roomData}
        />
      )}
    </div>
  );
}
