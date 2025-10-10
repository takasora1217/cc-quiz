import React from "react";
import { useLocation } from "react-router-dom";
import "../QuizPage/QuizPage.css";
import AreYouReady from "../QuizPage/AreYouReady";
import QuizDisplay from "../QuizPage/QuizDisplay";
import QuizBox from "../QuizPage/QuizBox";


export default function QuizPage() {
  const location = useLocation();
  const { keyword, mode, players } = location.state || {};

  return (
    <div className="QuizPage">
      <QuizBox />
      <AreYouReady />
      <QuizDisplay />
    </div>
  );
}
