import React, { useState, useEffect } from "react";
import "../QuizPage/QuizPage.css";

export default function QuizDisplay() {
  const [displayText, setDisplayText] = useState("");
  const [displayButton, setDisplayButton] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setDisplayButton(false);

    const timer3 = setTimeout(() => {
      setDisplayText("問題文");
      setDisplayButton(true);
    }, 4000);

    return () => {
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div>
      <h2 className="h2">{displayText}</h2>
      {displayButton && <button className="AnswerButton1">回答</button>}
    </div>
  );
}
