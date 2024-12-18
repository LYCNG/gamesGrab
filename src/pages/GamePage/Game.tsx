import { useState } from "react";
import { GameCanvas } from "./components/GameCanvas";
import "./game.css";
import PrizeList from "./components/PrizeList";



const Game = () => {
  
   const [isGrabbing, setIsGrabbing] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleGrab = () => {
    if (!isGrabbing) {
      setIsGrabbing(true);
    }
  };

  const winningCallback = () => { 
    setPlaying(false)
    setIsGrabbing(false)
  }
  return (
    <div className="App">
      <div className="game-title"></div>
      <GameCanvas
        isGrabbing={isGrabbing}
        setIsGrabbing={setIsGrabbing}
        playing={playing}
        setPlaying={setPlaying}
        winningCallback={winningCallback}
      />

       <div
        style={{
          border: "0px solid red",
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          bottom: "300px",
          left: "0",
          right: "0",
        }}
      >
        {!playing && (
          <button onClick={() => setPlaying(!playing)} className="start-button" />
        )}
        {playing && (
          <button
            className="grab-button"
            onClick={handleGrab}
            disabled={isGrabbing}
          >
            抓取
          </button>
        )}
      </div>
      <PrizeList />
    </div>
  );
};

export default Game;
