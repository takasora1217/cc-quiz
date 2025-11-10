import { useState, useEffect } from "react";
import "./QuizPage.css";

export default function TrueFalse({
  onNextQuestion,
  questionNumber,
  isLastQuestion,
  roomData,
  answersData,
  currentCount,
  maxQuestions,
  currentQuestion,
}) {
  const [players, setPlayers] = useState(["太郎", "次太郎", "三"]);
  const [answers, setAnswers] = useState(["？", "？", "？"]); // プレイヤーの実際の回答
  const [judge, setJudge] = useState(["", "", ""]);

  // 現在の問題データから正解と問題文を取得
  const getCorrectAnswers = () => {
    if (!currentQuestion || !currentQuestion.correctAnswers) {
      return ["基", "次", "郎"]; // デフォルト値
    }
    return currentQuestion.correctAnswers;
  };

  const getQuestionText = () => {
    if (!currentQuestion) {
      return "近代文学の短編小説『檸檬』の作者は梶井〇〇〇。空欄を答えよ。";
    }
    return currentQuestion.question;
  };

  // ルームデータからプレイヤー情報を更新
  useEffect(() => {
    if (roomData && roomData.players) {
      const playerNames = roomData.players.map(
        (player) => player.name || player
      );
      setPlayers(playerNames);
    }
  }, [roomData]);

  // プレイヤーの回答データを受け取って設定
  useEffect(() => {
    if (answersData && answersData.length > 0) {
      console.log("TrueFalseで受け取った回答データ:", answersData);
      setAnswers(answersData);
    }
  }, [answersData]);

  // T/F判定（answersが更新されたら再実行）
  useEffect(() => {
    const correctAnswers = getCorrectAnswers();
    const newJudge = correctAnswers.map((trueAnswer, index) => {
      return trueAnswer === answers[index] ? "T" : "F";
    });
    setJudge(newJudge);
  }, [answers, currentQuestion]);

  // judgeの結果から正誤を判定
  const getOverallResult = () => {
    return judge.every((j) => j === "T") ? "正" : "誤";
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
      console.log(
        `isLastQuestion: ${isLastQuestion}, currentCount: ${currentCount}, maxQuestions: ${maxQuestions}`
      );
      onNextQuestion(result);
    }
  };

  return (
    <>
      <h2 className="h2">{getQuestionText()}</h2>
      <div className="TFs">
        <h4 className="h4">答え：{getCorrectAnswers().join("")}</h4>
        <button className="AnswerButton1" onClick={handleNextClick}>
          {isLastQuestion ? "結果を見る" : "次の問題へ"}
        </button>
      </div>
      <div className="QuizBox">
        <div className="QuizBox2">
          {/* この辺はほとんどQuizBoxのコピペです*/}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="QuizBox3">
              <h3 className="players">{players[index]}</h3>
              <h4
                className="answers"
                style={{ backgroundColor: getAnswerColor(judge[index]) }}
              >
                {answers[index]}
              </h4>
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
