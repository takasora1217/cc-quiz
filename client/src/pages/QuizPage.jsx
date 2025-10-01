import React from "react";
import { useLocation } from "react-router-dom";
import "../QuizPage/QuizPage.css";
import AreYouReady from "../QuizPage/AreYouReady";


export default function QuizPage() {
  const location = useLocation();
  const { keyword, mode, players } = location.state || {};

  return (
    <div className="QuizPage">
      <AreYouReady />
    </div>
  );
}
