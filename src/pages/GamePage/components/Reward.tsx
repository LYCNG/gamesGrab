import { motion } from "framer-motion";
import React, { useEffect } from "react";

interface MovingObjectProps {
  id: number;
  onRemove: (id: number) => void;
  checkGrab: boolean;
  position: { x: number; y: number };
}

const Reward: React.FC<MovingObjectProps> = ({
  id,
  onRemove,
  checkGrab,
  position,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemove(id);
    }, 5000); // 自動移除超出邊界的物件時間

    return () => clearTimeout(timeout);
  }, [id, onRemove]);

  useEffect(() => {
    if (checkGrab) {
      console.log("checkGrab", position);
    }
  }, [checkGrab]);
  return (
    <motion.div
      className="lucky-bag"
      initial={{ x: -50, top: 172 }} // 物件生成位置高度設定在 300px
      animate={{ x: window.innerWidth }} // 物件向右移動
      transition={{ duration: 6, ease: "linear" }}
      style={{ position: "absolute" }}
    />
  );
};

export default Reward;
