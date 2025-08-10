import React, { useEffect } from "react";
import socket from "../socket/socket";

export default function MatchingPage() {
  useEffect(() => {
    socket.emit("ping", "ping from client");
    socket.on("pong", (msg) => alert(msg));

    // gameStartAtのリスナーを関数として定義
    const onGameStartAt = ({ startAt }) => {
      const delay = startAt - Date.now();
      setTimeout(() => alert("🎮 ゲームスタート！"), delay);
    };
    socket.on("gameStartAt", onGameStartAt);

    // クリーンアップ
    return () => {
      socket.off("pong");
      socket.off("gameStartAt", onGameStartAt);
    };
  }, []);

  return <div>Matching Page</div>;
}
// こんちは ここはマッチングページです