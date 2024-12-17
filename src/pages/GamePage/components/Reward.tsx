import { motion } from "framer-motion";
import React, {useEffect, useState, } from "react";

interface MovingObjectProps {
  id: number;
  onRemove: (id: number) => void;
  isPause: boolean;
  checkGrab: boolean;
  position: { x: number; y: number };
  onCatch: (id: number) => void;
}

const width = 70;
const height = 80;
const Reward: React.FC<MovingObjectProps> = ({
  id,
  onRemove,
  isPause,
  checkGrab,
  onCatch,
  position,
}) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemove(id);
    }, 5000); // 自動移除超出邊界的物件時間

    return () => clearTimeout(timeout);
  }, [id, onRemove]);

  const [lastX, setLastX] = useState(0);

  const [currentPosition, setCurrentPosition] = useState({x:0,y:0})

  useEffect(() => {

    if (checkGrab) {
      setLastX(currentPosition.x)
      if (position.x>currentPosition.x && position.x < currentPosition.x + width && position.y > currentPosition.y && position.y < currentPosition.y + height) {
       return onCatch(id)
      }
    }
  }, [checkGrab, position, id]);



  return (
    <motion.div
      className="lucky-bag"
      initial={{ x: -50, top: 172 }} // 物件生成位置高度設定在 300px
      animate={{ x: isPause ? lastX : 500 }} // 物件向右移動
      transition={{ duration: 6, ease: "linear" }}
      style={{ position: "absolute" }}
      onUpdate={(latest)=>setCurrentPosition({x:Number(latest.x),y:Number(latest.top)})}
    />
  );
};

export default Reward;
