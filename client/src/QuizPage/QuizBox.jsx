export default function QuizBox() {
  const answer1 = "？"
  const answer2 = "？"
  const answer3 = "？"
return (
  <>
    <div className="QuizBox">
      <div className="quizboxs">
        <img src="/img/QuizBox.png" alt="Quiz Box" />
        <img src="/img/QuizBox.png" alt="Quiz Box" />
        <img src="/img/QuizBox.png" alt="Quiz Box" />
      </div>
      <div className="panels">
        <h3>{answer1}</h3>
        <h3>{answer2}</h3>
        <h3>{answer3}</h3>
      </div>
    </div>
  </>
);
}
