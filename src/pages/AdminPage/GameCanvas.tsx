import React, { useEffect, useRef } from "react";

// 可控參數區域 - 可以根據需求調整這些值
const GAME_CONFIG = {
  // Canvas 尺寸
  CANVAS_WIDTH: 375,
  CANVAS_HEIGHT: 500,

  // 爪子配置
  CLAW: {
    WIDTH: 100, // 爪子寬度
    LENGTH: 200, // 爪子長度
    HEAD_WIDTH: 40, // 爪子頭部寬度
    HEAD_HEIGHT: 20, // 爪子頭部高度
    SPEED: 5, // 爪子移動速度
    SWING_SPEED: 1, // 擺動速度
    SWING_ANGLE_MIN: -115, // 最小擺動角度
    SWING_ANGLE_MAX: -65, // 最大擺動角度
    INITIAL_ANGLE: -90, // 初始角度
    EXTEND_LIMIT: 180,
  },

  // 禮物配置
  PRIZE: {
    SIZE: 50, // 禮物大小
    SPEED: 1.5, // 移動速度
    BASE_HEIGHT: 50, // 禮物離底部的基礎高度
    SPAWN_INTERVAL: 1200, // 生成間隔（毫秒）
  },

  // 區域高度配置
  HEADER_HEIGHT: 80, // 頂部高度
  FOOTER_HEIGHT: 100, // 底部高度
};

// 圖片路徑配置
const IMAGES = {
  CLAW: "/image/grab.png",
  PRIZE: "/image/big-bag.png",
  BACKGROUND: "/image/box.png",
};

interface Prize {
  x: number;
  y: number;
  caught?: boolean;
}

interface GameCanvasProps {
  isGrabbing: boolean;
  setIsGrabbing: (isGrabbing: boolean) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  isGrabbing,
  setIsGrabbing,
  playing,
  setPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>();
  const loadedImages = useRef<{ [key: string]: HTMLImageElement }>({});

  const gameState = useRef({
    clawX: GAME_CONFIG.CANVAS_WIDTH / 2,
    clawY: 0,
    clawSwingAngle: GAME_CONFIG.CLAW.INITIAL_ANGLE,
    swingDirection: 1,
    prizes: [] as Prize[],
    clawExtending: false,
    clawRetracting: false,
  });

  useEffect(() => {
    if (
      isGrabbing &&
      !gameState.current.clawExtending &&
      !gameState.current.clawRetracting
    ) {
      gameState.current.clawExtending = true;
    }
  }, [isGrabbing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loadAllImages = async () => {
      try {
        const [prizeImg, clawImg, backgroundImg] = await Promise.all([
          loadImage(IMAGES.PRIZE),
          loadImage(IMAGES.CLAW),
          loadImage(IMAGES.BACKGROUND),
        ]);

        loadedImages.current = {
          prize: prizeImg,
          claw: clawImg,
          background: backgroundImg,
        };

        startGame();
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    const generatePrize = () => {
      gameState.current.prizes.push({
        x: -GAME_CONFIG.PRIZE.SIZE,
        y:
          GAME_CONFIG.CANVAS_HEIGHT -
          GAME_CONFIG.FOOTER_HEIGHT -
          GAME_CONFIG.PRIZE.SIZE -
          GAME_CONFIG.PRIZE.BASE_HEIGHT,
      });
    };

    const drawClaw = () => {
      const { clawX, clawY, clawSwingAngle } = gameState.current;

      ctx.save();
      ctx.translate(clawX, clawY);
      ctx.rotate(((clawSwingAngle + 90) * Math.PI) / 180);

      ctx.drawImage(
        loadedImages.current.claw,
        -GAME_CONFIG.CLAW.WIDTH / 2,
        0,
        GAME_CONFIG.CLAW.WIDTH,
        GAME_CONFIG.CLAW.LENGTH
      );

      ctx.restore();
    };

    const drawPrizes = () => {
      gameState.current.prizes.forEach((prize) => {
        ctx.drawImage(
          loadedImages.current.prize,
          prize.x,
          prize.y,
          GAME_CONFIG.PRIZE.SIZE,
          GAME_CONFIG.PRIZE.SIZE
        );
        if (!prize.caught) {
          prize.x += GAME_CONFIG.PRIZE.SPEED;
        }
      });

      gameState.current.prizes = gameState.current.prizes.filter(
        (prize) => prize.x <= GAME_CONFIG.CANVAS_WIDTH || prize.caught
      );
    };

    const checkCollision = () => {
      const state = gameState.current;

      // 計算爪子實際角度（轉換為弧度）
      const adjustedAngle = ((state.clawSwingAngle - 180) * Math.PI) / 180;

      // 計算爪子延伸後的位置
      // 從初始位置 (state.clawX, 0) 延伸到 EXTEND_LIMIT
      const totalExtendDistance =
        GAME_CONFIG.CLAW.EXTEND_LIMIT +
        GAME_CONFIG.CLAW.LENGTH -
        GAME_CONFIG.CLAW.HEAD_HEIGHT -
        20;

      // 計算延伸後的連結點(a點)位置
      const clawAX =
        GAME_CONFIG.CANVAS_WIDTH / 2 +
        totalExtendDistance * Math.cos(adjustedAngle);

      const clawAY = totalExtendDistance * Math.sin(adjustedAngle);

      // 計算延伸後的爪子頭部(b點)位置
      const clawEndX =
        clawAX + GAME_CONFIG.CLAW.HEAD_HEIGHT * Math.cos(adjustedAngle);
      const clawEndY =
        clawAY + GAME_CONFIG.CLAW.HEAD_HEIGHT * Math.sin(adjustedAngle);

      // 只在爪子接近底部時進行碰撞檢測
      if (state.clawY >= GAME_CONFIG.CLAW.EXTEND_LIMIT - 5) {
        // 定義碰撞區域（在爪子頭部b點的矩形區域）
        const collisionBox = {
          left: clawEndX - GAME_CONFIG.CLAW.HEAD_WIDTH / 2,
          right: clawEndX + GAME_CONFIG.CLAW.HEAD_WIDTH / 2,
          top: clawEndY - GAME_CONFIG.CLAW.HEAD_HEIGHT,
          bottom: clawEndY,
        };

        // 用於調試：繪製碰撞區域
        ctx.strokeStyle = "red";
        ctx.strokeRect(
          collisionBox.left,
          collisionBox.top,
          GAME_CONFIG.CLAW.HEAD_WIDTH,
          GAME_CONFIG.CLAW.HEAD_HEIGHT
        );

        // 用於調試：標記 a 點和 b 點
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(clawAX, clawAY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(clawEndX, clawEndY, 3, 0, Math.PI * 2);
        ctx.fill();

        let caught = false;
        gameState.current.prizes = gameState.current.prizes.filter((prize) => {
          if (prize.caught) {
            // 抓住後，獎品位置跟隨爪子頭部(b點)
            prize.x = clawEndX - GAME_CONFIG.PRIZE.SIZE / 2;
            prize.y = clawEndY - GAME_CONFIG.PRIZE.SIZE;
            return true;
          }

          // 檢查獎品是否在碰撞區域內
          const prizeBox = {
            left: prize.x,
            right: prize.x + GAME_CONFIG.PRIZE.SIZE,
            top: prize.y,
            bottom: prize.y + GAME_CONFIG.PRIZE.SIZE,
          };

          const collision = !(
            collisionBox.left > prizeBox.right ||
            collisionBox.right < prizeBox.left ||
            collisionBox.top > prizeBox.bottom ||
            collisionBox.bottom < prizeBox.top
          );

          if (collision && !caught && state.clawExtending) {
            caught = true;
            prize.caught = true;
            return true;
          }

          return !collision;
        });

        if (caught) {
          state.clawExtending = false;
          state.clawRetracting = true;
          alert("恭喜中獎！");
          setPlaying(false);
          resetGame();
        } else if (state.clawY >= GAME_CONFIG.CLAW.EXTEND_LIMIT) {
          state.clawExtending = false;
          state.clawRetracting = true;
        }
      }
    };

    const isPointInPolygon = (
      point: { x: number; y: number },
      polygon: { x: number; y: number }[]
    ) => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;

        const intersect =
          yi > point.y !== yj > point.y &&
          point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

        if (intersect) inside = !inside;
      }
      return inside;
    };

    const resetClaw = () => {
      const state = gameState.current;
      state.clawY = 0;
      state.clawX = GAME_CONFIG.CANVAS_WIDTH / 2;
      state.clawSwingAngle = GAME_CONFIG.CLAW.INITIAL_ANGLE;
      state.clawExtending = false;
      state.clawRetracting = false;
      setIsGrabbing(false);
    };

    const resetGame = () => {
      const state = gameState.current;
      state.clawY = 0;
      state.clawX = GAME_CONFIG.CANVAS_WIDTH / 2;
      state.clawSwingAngle = GAME_CONFIG.CLAW.INITIAL_ANGLE;
      state.clawExtending = false;
      state.clawRetracting = false;
      state.prizes = [];
      setIsGrabbing(false);
    };

    const startGame = () => {
      let prizeInterval: NodeJS.Timeout | null = null;

      if (playing) {
        prizeInterval = setInterval(
          generatePrize,
          GAME_CONFIG.PRIZE.SPAWN_INTERVAL
        );
      }

      const gameLoop = () => {
        const state = gameState.current;

        ctx.clearRect(
          0,
          0,
          GAME_CONFIG.CANVAS_WIDTH,
          GAME_CONFIG.CANVAS_HEIGHT
        );
        ctx.drawImage(
          loadedImages.current.background,
          0,
          0,
          GAME_CONFIG.CANVAS_WIDTH,
          GAME_CONFIG.CANVAS_HEIGHT
        );

        if (playing) {
          if (!state.clawExtending && !state.clawRetracting) {
            state.clawSwingAngle +=
              GAME_CONFIG.CLAW.SWING_SPEED * state.swingDirection;
            if (
              state.clawSwingAngle > GAME_CONFIG.CLAW.SWING_ANGLE_MAX ||
              state.clawSwingAngle < GAME_CONFIG.CLAW.SWING_ANGLE_MIN
            ) {
              state.swingDirection *= -1;
            }
          } else if (state.clawExtending) {
            const adjustedAngle = state.clawSwingAngle - 180;
            state.clawX +=
              GAME_CONFIG.CLAW.SPEED *
              Math.cos((adjustedAngle * Math.PI) / 180);
            state.clawY +=
              GAME_CONFIG.CLAW.SPEED *
              Math.sin((adjustedAngle * Math.PI) / 180);

            if (state.clawY >= GAME_CONFIG.CLAW.EXTEND_LIMIT) {
              state.clawExtending = false;
              state.clawRetracting = true;
              checkCollision();
            }
          } else if (state.clawRetracting) {
            const adjustedAngle = state.clawSwingAngle - 180;
            state.clawX -=
              GAME_CONFIG.CLAW.SPEED *
              Math.cos((adjustedAngle * Math.PI) / 180);
            state.clawY -=
              GAME_CONFIG.CLAW.SPEED *
              Math.sin((adjustedAngle * Math.PI) / 180);
            if (state.clawY <= 0) {
              resetClaw();
            }
          }
        }

        drawClaw();
        if (playing) {
          drawPrizes();
        }
        requestIdRef.current = requestAnimationFrame(gameLoop);
      };

      gameLoop();

      return () => {
        if (requestIdRef.current) {
          cancelAnimationFrame(requestIdRef.current);
        }
        if (prizeInterval) {
          clearInterval(prizeInterval);
        }
      };
    };

    loadAllImages();
  }, [setIsGrabbing, playing, setPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.CANVAS_WIDTH}
      height={GAME_CONFIG.CANVAS_HEIGHT}
    />
  );
};
