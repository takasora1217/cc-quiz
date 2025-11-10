import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
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
  const [currentAnswers, setCurrentAnswers] = useState([]); // プレイヤーの回答データ
  const [questions, setQuestions] = useState([]); // Firebaseから取得した問題データ
  const [fetchedPool, setFetchedPool] = useState([]); // ローカルで取得した候補（ホストがこれを配信する）
  const [isLoading, setIsLoading] = useState(true); // 問題読み込み状態
  const [selectedSent, setSelectedSent] = useState(false); // ホストがselectedQuestionsを送信済みか
  const maxQuestions = 5;

  // Firebaseから問題をランダムに取得
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const questionsCollection = collection(db, "questions");
        const questionsSnapshot = await getDocs(questionsCollection);
        const allQuestions = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ランダムに maxQuestions 個の問題を選択
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, maxQuestions);

        // ローカル取得は一旦 fetchedPool に保存し、ホストがサーバへ配信するまで待つ
        setFetchedPool(selectedQuestions);
        console.log("ローカルで取得した問題候補:", selectedQuestions);
      } catch (error) {
        console.error("問題の取得に失敗しました:", error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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

    // サーバーから配信されたルーム問題を受け取る（ホスト以外のクライアントが使用）
    socket.on("roomQuestions", (roomQuestions) => {
      console.log("サーバーから受信したroomQuestions:", roomQuestions);
      if (Array.isArray(roomQuestions) && roomQuestions.length > 0) {
        setQuestions(roomQuestions);
        setIsLoading(false);
      }
    });

    // startQuizでサーバーが問題リストを送る場合の受信処理
    socket.on(
      "startQuiz",
      ({ keyword, mode, players, questions: srvQuestions }) => {
        if (Array.isArray(srvQuestions) && srvQuestions.length > 0) {
          console.log("startQuizで受け取ったquestions:", srvQuestions);
          setQuestions(srvQuestions);
          setIsLoading(false);
        }
      }
    );

    // 全員の回答が揃ったらTrueFalseを表示
    socket.on(
      "allAnswersReady",
      ({ questionNumber: qNum, answers, players }) => {
        console.log(`問題${qNum}の全員回答完了、TrueFalse表示:`, answers);
        setCurrentAnswers(answers); // プレイヤーの回答データを保存
        setShowTrueFalse(true);
      }
    );

    return () => {
      socket.off("roomUpdated");
      socket.off("allAnswersReady");
      socket.off("roomQuestions");
      socket.off("startQuiz");
    };
  }, []); // locationを依存配列から削除

  // ホストがローカルで取得した問題プールをサーバーへ送信して全員に同期させる
  useEffect(() => {
    // host判定: roomData.players の先頭がホスト
    const hostId = roomData?.players?.[0]?.id;
    const myId = socket.id;
    const keyword = location.state?.keyword || roomData?.keyword;

    if (
      !selectedSent &&
      fetchedPool &&
      fetchedPool.length > 0 &&
      hostId &&
      myId &&
      hostId === myId
    ) {
      // ホストが選択したquestionsをサーバーに送る
      socket.emit("selectedQuestions", { keyword, questions: fetchedPool });
      setSelectedSent(true);
      console.log("ホストがselectedQuestionsを送信しました:", fetchedPool);
    }
  }, [fetchedPool, roomData, selectedSent, location]);

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
    console.log(
      `現在の問題数: ${
        questionCount + 1
      }, 次の問題数: ${nextCount}, 最大問題数: ${maxQuestions}`
    );
    setQuestionCount(nextCount);

    if (nextCount >= maxQuestions) {
      // 最大問題数に達した場合は結果ページへ
      console.log("結果ページに遷移します");
      navigate("/result", { state: { results: newResults } });
    } else {
      // 次の問題へ（QuizDisplayに戻る）
      console.log("次の問題に進みます");
      setShowTrueFalse(false);
      setCurrentAnswers([]); // 回答データをリセット
    }
  };

  return (
    <div className="QuizPage">
      <AreYouReady /> {/* "Are you ready?" → "Start!" の表示 */}
      {/* 問題読み込み中の表示 */}
      {isLoading ? (
        <div>問題を読み込み中...</div>
      ) : /* QuizDisplay または TrueFalse を表示 */
      !showTrueFalse ? (
        <QuizDisplay
          onAnswerSubmit={handleAnswerSubmit}
          questionNumber={questionCount + 1}
          roomData={roomData}
          currentQuestion={questions[questionCount]}
        />
      ) : (
        <TrueFalse
          onNextQuestion={handleNextQuestion}
          questionNumber={questionCount + 1}
          isLastQuestion={questionCount + 1 === maxQuestions}
          roomData={roomData}
          answersData={currentAnswers}
          currentCount={questionCount}
          maxQuestions={maxQuestions}
          currentQuestion={questions[questionCount]}
        />
      )}
    </div>
  );
}
