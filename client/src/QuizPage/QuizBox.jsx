export default function QuizBox() {

  //仮のデータ。ＤＢから取得するように変更してください！！
  const answers = ["？", "？", "？"];
  const players = ["太郎", "次太郎", "三"];

  return (
    <>
      <div className="QuizBox">
        <div className="QuizBox2">

          {/* プレイヤーの名前、解答欄、解答の表示を３回繰り返す。*/}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="QuizBox3">
              <h3 className="players">{players[index]}</h3>
              <h4 className="answers">{answers[index]}</h4>
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
