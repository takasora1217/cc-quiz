import React from "react";
import { useLocation } from "react-router-dom";

export default function QuizPage() {
  const location = useLocation();
  const { keyword, mode, players } = location.state || {};

  return (
    <div>
      <h2>Quiz Page</h2>
      <div>合言葉: {keyword}</div>
      <div>モード: {mode}</div>
      <div>
        参加者:
        <ul>{players && players.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
      </div>
    </div>
  );
}
