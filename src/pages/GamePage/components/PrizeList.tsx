import { motion } from "framer-motion";
import "./PrizeList.css";

const prizes = [
  { id: 1, name: "獎品 A", color: "#FFDD57" },
  { id: 2, name: "獎品 B", color: "#FF884D" },
  { id: 3, name: "獎品 C", color: "#88CCEE" },
  { id: 4, name: "獎品 D", color: "#FF66AA" },
  { id: 5, name: "獎品 E", color: "#99DD77" },
  { id: 6, name: "獎品 F", color: "#44AA99" },
];

const PrizeList = () => {
  return (
    <div style={{ padding: "10px", paddingTop: "50px" }}>
      <div className="carousel-container">
        <motion.div
          className="carousel-track"
          animate={{ x: [0, -1000] }} // 讓輪播從起始點移動到終點
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          {prizes.concat(prizes).map(
            (
              prize // 複製獎品以製造無縫循環
            ) => (
              <div
                key={prize.id + Math.random()}
                className="carousel-item"
                style={{ backgroundColor: prize.color }}
              >
                {prize.name}
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PrizeList;
