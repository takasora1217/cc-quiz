import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../QuizPage/QuizPage.css";
import InputAnswer from "./InputAnswer";
import QuizBox from "./QuizBox";
import socket from "../socket/socket";

export default function QuizDisplay({
  onAnswerSubmit,
  questionNumber,
  roomData,
}) {
  const [display, setDisplay] = useState(false);
  const location = useLocation();

  //↓仮のデータ。ＤＢから問題を取得するように変更してください！！
  const text = `【問題${questionNumber}】近代文学の短編小説『檸檬』の作者は梶井〇〇〇。空欄を答えよ。`;

  // 現在のプレイヤー（自分）の名前を取得
  const getCurrentPlayerName = () => {
    // locationからニックネームを取得（MatchingPageと同様）
    const myName = location.state?.nickname;
    if (myName) return myName;

    // roomDataから現在のsocket.idに対応するプレイヤーを見つける
    if (roomData && roomData.players) {
      const currentPlayer = roomData.players.find(
        (player) => player.id === socket.id
      );
      return currentPlayer ? currentPlayer.name : "不明";
    }

    return "読み込み中...";
  };

  //問題文、解答欄、解答送信ボタンの表示制御
  useEffect(() => {
    setDisplay(false);

    if (questionNumber === 1) {
      const timer3 = setTimeout(() => {
        setDisplay(true);
      }, 4000);
      return () => {
        clearTimeout(timer3);
      };
    } else {
      setDisplay(true);
    }
  }, [questionNumber]);

  return (
    <>
      <QuizBox roomData={roomData} />
      <div className="DisplayText">
        {display && (
          <>
            <h2 className="h2">{text}</h2>
            <h5 className="h5"> {getCurrentPlayerName()}の回答 </h5>
            {/*↓ 解答欄、解答送信ボタン*/}
            <InputAnswer
              onAnswerSubmit={onAnswerSubmit}
              questionNumber={questionNumber}
            />
          </>
        )}
      </div>
    </>
  );
}
