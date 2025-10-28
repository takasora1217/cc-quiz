import { useState, useEffect } from "react";
import "./QuizPage.css";

export default function TrueFalse({ onNextQuestion, questionNumber, isLastQuestion }) { 
    const players = ["太郎", "次太郎", "三"];
    const text = "近代文学の短編小説『檸檬』の作者は梶井〇〇〇。空欄を答えよ。";
    const trues = ["基", "次", "郎"];
    const answers = ["鬼", "太", "郎"];
    
    const [judge, setJudge] = useState(["", "", ""]);

    // T/F判定
    useEffect(() => {
        const newJudge = trues.map((trueAnswer, index) => {
            return trueAnswer === answers[index] ? "T" : "F";
        });
        setJudge(newJudge);
    }, []);

    // judgeの結果から正誤を判定
    const getOverallResult = () => {
        return judge.every(j => j === "T") ? "正" : "誤";
    };


    // 背景色の決定
    const getAnswerColor = (judgement) => {
        return judgement === "T" ? "red" : "blue";
    };

    // 次の問題ボタンクリック処理
    const handleNextClick = () => {
        if (onNextQuestion) {
            const result = getOverallResult();
            console.log(`問題${questionNumber}の結果:`, result);
            onNextQuestion(result);
        }
    };

    return (
        <>
            <h2 className="h2">{text}</h2>
            <div className="TFs">
                <h4 className="h4">答え：{trues.join("")}</h4>
                <button 
                    className="AnswerButton1" 
                    onClick={handleNextClick}
                >
                    {isLastQuestion ? "結果を見る" : "次の問題へ"}
                </button>
            </div>
      <div className="QuizBox">
        <div className="QuizBox2">
          {/* この辺はほとんどQuizBoxのコピペです*/}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="QuizBox3">
              <h3 className="players">{players[index]}</h3>
              <h4 className="answers" style={{ backgroundColor: getAnswerColor(judge[index]) }}>{answers[index]}</h4>
              <img
                className="quizbox"
                src="/img/QuizBox.png"
                alt={`Quiz Box ${index + 1}`}
              />
            </div>
          ))}
        </div>
            </div>
            </>
    );
}