import React, { useState, useEffect } from "react";
import "../QuizPage/QuizPage.css";
import InputAnswer from "./InputAnswer";
import QuizBox from "./QuizBox";

export default function QuizDisplay({ onAnswerSubmit, questionNumber }) {
    const [display, setDisplay] = useState(false);

                //↓仮のデータ。ＤＢから問題を取得するように変更してください！！
  const text = `【問題${questionNumber}】近代文学の短編小説『檸檬』の作者は梶井〇〇〇。空欄を答えよ。`;
    
    //問題文、解答欄、解答送信ボタンを４秒後に表示
  useEffect(() => {
    setDisplay(false);
      const timer3 = setTimeout(() => {
        setDisplay(true);
      }, 4000);
      return () => {
      clearTimeout(timer3);
    };
  }, [questionNumber]); // questionNumberが変わったら再実行

    
  return (
    <>
    <QuizBox />
    <div className="DisplayText">
          {display &&
            <>
              <h2 className="h2">{text}</h2>
              {/*↓ 解答欄、解答送信ボタン*/}
              <InputAnswer onAnswerSubmit={onAnswerSubmit} />
            </>
          }
      </div>
    </>
  );
}
