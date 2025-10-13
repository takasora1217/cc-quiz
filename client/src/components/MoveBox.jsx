import React, { useEffect, useState, useRef } from "react";

/**
 * MoveBox
 * - 方向キー / WASD で箱を移動します
 * - props:
 *    width, height: コンテナサイズ（px or %）。デフォルト 600x300 px
 *    step: 1回のキー押下で移動するピクセル数（デフォルト 10）
 *    onMove: (pos) => void 移動時コールバック
 */
export default function MoveBox({
  width = 600,
  height = 300,
  step = 10,
  onMove,
}) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const boxSize = 48;

  useEffect(() => {
    function handleKey(e) {
      const key = e.key;
      let dx = 0,
        dy = 0;
      if (key === "ArrowLeft" || key === "a" || key === "A") dx = -step;
      if (key === "ArrowRight" || key === "d" || key === "D") dx = step;
      if (key === "ArrowUp" || key === "w" || key === "W") dy = -step;
      if (key === "ArrowDown" || key === "s" || key === "S") dy = step;
      if (dx === 0 && dy === 0) return;

      e.preventDefault();

      setPos((prev) => {
        const container = containerRef.current;
        const maxW =
          container && container.clientWidth
            ? container.clientWidth - boxSize
            : width - boxSize;
        const maxH =
          container && container.clientHeight
            ? container.clientHeight - boxSize
            : height - boxSize;

        let nx = Math.min(Math.max(prev.x + dx, 0), maxW);
        let ny = Math.min(Math.max(prev.y + dy, 0), maxH);

        const next = { x: nx, y: ny };
        if (typeof onMove === "function") onMove(next);
        return next;
      });
    }

    // グローバルで受け取る（フォーカスがどこでも動くように）
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [step, width, height, onMove]);

  return (
    <div
      ref={containerRef}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        border: "2px dashed rgba(0,0,0,0.2)",
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        background: "linear-gradient(#fffae6,#ffd) ",
      }}
      aria-label="move-box-container"
    >
      <div
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width: boxSize,
          height: boxSize,
          background: "#1e88e5",
          borderRadius: 6,
          boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "700",
          userSelect: "none",
        }}
      >
        箱
      </div>

      <div
        style={{
          position: "absolute",
          right: 8,
          bottom: 8,
          fontSize: 12,
          color: "#222",
          background: "rgba(255,255,255,0.8)",
          padding: "4px 8px",
          borderRadius: 6,
        }}
      >
        ←/→/↑/↓ or WASD (step {step}px)
      </div>
    </div>
  );
}
