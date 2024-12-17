import { useCallback, useEffect, useState } from "react";

import "./game.css";

import PrizeList from "./components/PrizeList";
import Reward from "./components/Reward";

const maxAngle = 25;
const minAngle = -25;

interface RewardType {
  id: number;
}

const Game = () => {
  const [bags, setBags] = useState<RewardType[]>([]);

  const [angle, setAngle] = useState(0); //搖擺角度
  const [direction, setDirection] = useState(1); //搖擺方向 1:向右，-1:向左

  const [isGrabbing, setIsGrabbing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lineLength, setLineLength] = useState(0);
  const [collection, setCollection] = useState({
    checkGrab: false,
    position: { x: 0, y: 0 },
  });

  const [winning, setWinning] = useState(false);

  useEffect(() => {
    // 持續生成物件，每隔 1 秒生成一個
    if (playing) {
      const generateInterval = setInterval(() => {
        setBags((prev) => [...prev, { id: prev.length + 1 }]);
      }, 1500);

      return () => clearInterval(generateInterval);
    }
  }, [playing]);

  useEffect(() => {
    if (playing && !isGrabbing) {
      const interval = setInterval(() => {
        setAngle((prevAngle) => {
          if (prevAngle > maxAngle) setDirection(-1);
          if (prevAngle < minAngle) setDirection(1);
          return prevAngle + direction;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [direction, playing, isGrabbing]);

  const checkCollision = () => {
    const radians = -angle * (Math.PI / 180);
    const endX = Math.sin(radians) * 380 + 200;
    setCollection({ checkGrab: true, position: { x: endX, y: 220 } });
  };

  const onGrabCallback = useCallback(() => {
    if (!isGrabbing && playing) {
      setIsGrabbing(true);
      // 延伸動畫
      const extendInterval = setInterval(() => {
        setLineLength((prev) => {
          if (prev >= 160) {
            // 最大延伸長度
            checkCollision();
            clearInterval(extendInterval);
            // 延遲後開始收回
            setTimeout(() => {
              const retractInterval = setInterval(() => {
                if (winning) {
                  // 如果抓到了，停止收回動畫並保留當前位置
                  clearInterval(retractInterval);
                  return; // 退出該動畫過程
                }
                setLineLength((prev) => {
                  if (prev <= 0) {
                    clearInterval(retractInterval);
                    setIsGrabbing(false);
                    return 0;
                  }
                  return prev - 5;
                });
              }, 20);
            }, 500); // 延伸到最長後等待500ms
            return prev;
          }
          return prev + 10;
        });
      }, 20);
    }
  }, [ isGrabbing, playing, winning]);

  const handleRemove = (id: number) => {
    setBags((prev) => prev.filter((bag) => bag.id !== id));
  };

  const handleCatch = (id: number) => {
    console.log("catch", id);
    setWinning(true);
    setIsGrabbing(false);
    setCollection({ ...collection, checkGrab: false });
  };

  useEffect(() => {
    if (winning) {
      setIsGrabbing(false);
      setPlaying(false);

    }
  }, [winning]);

  return (
    <div className="game-container">
      <div className="title" />
      <div className="box">
        <div
          id="hook"
          style={{
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        >
          <div
            className="line"
            style={{ height: `${180 + lineLength}px` }}
          ></div>
          <div className="left"></div>
          <div className="right"></div>
        </div>

        <div className="track1" />
        <div className="track2" />
        {bags.length > 0 &&
          bags.map((bag) => (
            <Reward
              key={bag.id}
              id={bag.id}
              isPause={!playing}
              onRemove={handleRemove}
              onCatch={handleCatch}
              {...collection}
            />
          ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: "510px",
          zIndex: 100,
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {playing ? (
          <button onClick={onGrabCallback } disabled={isGrabbing} className="grab-btn">
            Grab
          </button>
        ) : (
          <button onClick={() => setPlaying(!playing)} className="play-btn" />
        )}
      </div>
      <div className="list">
        <PrizeList />
      </div>
    </div>
  );
};

export default Game;
