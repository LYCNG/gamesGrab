import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { BurgerMenu } from "./components/BurgerMenu";
import { GAME_CONFIG, GameCanvas } from "./components/GameCanvas";
import PrizeList from "./components/PrizeList";
import "./game.css";

const Game = () => {
  const { user } = useAuth();
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleGrab = () => {
    if (!isGrabbing) {
      setIsGrabbing(true);
    }
  };

  const winningCallback = () => {
    setPlaying(false);
    setIsGrabbing(false);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="game-page">
      <BurgerMenu />
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
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          top: GAME_CONFIG.CANVAS_HEIGHT - 40,
          left: "0",
          right: "0",
        }}
      >
        {!playing && (
          <button
            onClick={() => setPlaying(!playing)}
            className="start-button"
          />
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
      <div className="absolute bottom-20 left-0 right-0 p-6">
        <PrizeList />
      </div>

      <div>{user.point}</div>
    </div>
  );
};

export default Game;
