import React, { useEffect, useState } from "react";

import "./game.css";
import {  RewardType } from "../../types";
import Reward from "./components/Reward";

const maxAngle = 25;
const minAngle = -25;

const Game = () => {
  const [bags, setBags] = useState<RewardType[]>([]);

  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState(1);

  const [isGrabbing, setIsGrabbing] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [lineLength, setLineLength] = useState(0);


  useEffect(() => { 
    if (playing) {
      const bags = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        track: index % 2 + 1,
        delay: index*1.7 || 0.7,
      }));
      setBags(bags);
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
        {bags.length > 0 && bags.map((bag) => (
          <Reward
            key={bag.id}
            id={bag.id}
            track={bag.track}
            delay={bag.delay}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: "550px",
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
          <button onClick={() => setPlaying(!playing)}>start</button>
        )}
      </div>
      <div className="list"></div>
    </div>
  );
};

export default Game;
