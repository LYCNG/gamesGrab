import { useEffect, useRef, useState } from "react";

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

  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lineLength, setLineLength] = useState(0);
  const hookRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [collection, setCollection] = useState({
    checkGrab: false,
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    // 持續生成物件，每隔 1 秒生成一個
    if (playing) {
      const generateInterval = setInterval(() => {
        setBags((prev) => [...prev, { id: Date.now() }]);
      }, 500);

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
    const { x, width } = hookRef.current?.getBoundingClientRect() || {
      x: 0,
      wdith: 0,
    };
    const { x: boxX, width: boxWidth } =
      boxRef.current?.getBoundingClientRect() || {
        boxX: 0,
        boxWidth: 0,
      };
    if (width && boxWidth) {
      const line = 160;
      const radians = angle * (Math.PI / 180);
      const endX = Math.sin(radians) * line + 240;
      console.log(endX);
      const endY = 0 + Math.cos(radians) * line + 50;
      setCollection({ checkGrab: false, position: { x: endX, y: endY } });
    }
  };

  const handleGrab = () => {
    if (!isGrabbing && playing) {
      setIsGrabbing(true);

      // 延伸動畫
      const extendInterval = setInterval(() => {
        setLineLength((prev) => {
          if (prev >= 160) {
            // 最大延伸長度
            clearInterval(extendInterval);

            // 延遲後開始收回
            setTimeout(() => {
              const retractInterval = setInterval(() => {
                setLineLength((prev) => {
                  if (prev <= 0) {
                    checkCollision();
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
          return prev + 5;
        });
      }, 20);
    }
  };

  const handleRemove = (id: number) => {
    setBags((prev) => prev.filter((bag) => bag.id !== id));
  };

  return (
    <div className="game-container">
      <div className="title" />
      <div className="box" ref={boxRef}>
        <div
          style={{
            background: "black",
            position: "absolute",
            top: collection.position.y,
            left: collection.position.x,
            width: 10,
            height: 10,
            zIndex: 9999,
          }}
        ></div>
        <div
          ref={hookRef}
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
              onRemove={handleRemove}
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
          <button onClick={handleGrab} disabled={!playing || isGrabbing}>
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
