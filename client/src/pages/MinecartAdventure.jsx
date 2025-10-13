import MoveBox from "../components/MoveBox";

export default function MinecartAdventure() {
  const handleMove = (pos) => {
    console.log("Minecart moved to:", pos);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Minecart Adventure</h2>
      <MoveBox width={500} height={300} step={20} onMove={handleMove} />
    </div>
  );
}
