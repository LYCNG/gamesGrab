import { useState } from "react";

import { GameCanvas } from "./GameCanvas";
import "./admin.css";

function App() {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleGrab = () => {
    if (!isGrabbing) {
      setIsGrabbing(true);
    }
  };

  return (
    <div className="App">
      <h1>夾娃娃遊戲</h1>
      <GameCanvas
        isGrabbing={isGrabbing}
        setIsGrabbing={setIsGrabbing}
        playing={playing}
        setPlaying={setPlaying}
      />
      <button
        className="grab-button"
        onClick={handleGrab}
        disabled={isGrabbing}
      >
        抓取
      </button>
      <button onClick={() => setPlaying(true)}>開始遊戲</button>
    </div>
  );
}

export default App;
