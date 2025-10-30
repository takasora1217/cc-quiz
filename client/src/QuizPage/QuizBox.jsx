import React, { useState, useEffect } from "react";
import socket from "../socket/socket";

export default function QuizBox({ roomData }) {
  const [players, setPlayers] = useState(["太郎", "次太郎", "三"]);
  const [answers, setAnswers] = useState(["？", "？", "？"]);

  useEffect(() => {
    // ルームデータがある場合はプレイヤー情報を更新
    if (roomData && roomData.players) {
      const playerNames = roomData.players.map(
        (player) => player.name || player
      );
      setPlayers(playerNames);
    }

    // Socket.ioでプレイヤー情報の更新を監視
    socket.on("playersUpdated", (updatedPlayers) => {
      const playerNames = updatedPlayers.map((player) => player.name || player);
      setPlayers(playerNames);
    });

    // Socket.ioで解答情報の更新を監視
    socket.on("answersUpdated", (updatedAnswers) => {
      setAnswers(updatedAnswers);
    });

    return () => {
      socket.off("playersUpdated");
      socket.off("answersUpdated");
    };
  }, [roomData]);

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
