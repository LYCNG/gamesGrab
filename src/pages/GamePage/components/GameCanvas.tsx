import React, { useEffect, useRef } from "react";

// 可控參數區域 - 可以根據需求調整這些值
const GAME_CONFIG = {
  // Canvas 尺寸
  CANVAS_WIDTH: 375,
  CANVAS_HEIGHT: 500,

  // 爪子配置
  CLAW: {
    WIDTH: 100,
    LENGTH: 200,
    HEAD_WIDTH: 15,
    HEAD_HEIGHT: 15,
    SPEED: 5,
    SWING_SPEED: 1,
    SWING_ANGLE_MIN: -115,
    SWING_ANGLE_MAX: -65,
    INITIAL_ANGLE: -90,
    OFFSET_Y: 30,  // 添加垂直偏移量
  },

  // 禮物配置
  PRIZE: {
    COLLISION: {
      WIDTH: 40,
      HEIGHT: 40,
    },
    DISPLAY: {
      WIDTH: 50,
      HEIGHT: 50,
    },
    SPEED: 1.5,
    BASE_HEIGHT: 50,
    SPAWN_INTERVAL: 1200,
  },

  // 區域高度配置
  HEADER_HEIGHT: 80,
  FOOTER_HEIGHT: 100,
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
  winningCallback:()=>void
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
  winningCallback
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>();
  const loadedImages = useRef<{ [key: string]: HTMLImageElement }>({});
  const EXTEND_LIMIT = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.CLAW.LENGTH - GAME_CONFIG.PRIZE.BASE_HEIGHT - 90;

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

    let prizeInterval: NodeJS.Timeout | null = null;
    let lastTime = 0;

    const generatePrize = () => {
      const offsetX = (GAME_CONFIG.PRIZE.DISPLAY.WIDTH - GAME_CONFIG.PRIZE.COLLISION.WIDTH) / 2;
      const offsetY = (GAME_CONFIG.PRIZE.DISPLAY.HEIGHT - GAME_CONFIG.PRIZE.COLLISION.HEIGHT) / 2;
      
      gameState.current.prizes.push({
        x: -GAME_CONFIG.PRIZE.DISPLAY.WIDTH + offsetX+50,
        y:
          GAME_CONFIG.CANVAS_HEIGHT -
          GAME_CONFIG.FOOTER_HEIGHT -
          GAME_CONFIG.PRIZE.DISPLAY.HEIGHT -
          GAME_CONFIG.PRIZE.BASE_HEIGHT +
          offsetY,
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
        const offsetX = (GAME_CONFIG.PRIZE.DISPLAY.WIDTH - GAME_CONFIG.PRIZE.COLLISION.WIDTH) / 2;
        const offsetY = (GAME_CONFIG.PRIZE.DISPLAY.HEIGHT - GAME_CONFIG.PRIZE.COLLISION.HEIGHT) / 2;
        
        // 繪製獎品圖片
        ctx.drawImage(
          loadedImages.current.prize,
          prize.x - offsetX,
          prize.y - offsetY,
          GAME_CONFIG.PRIZE.DISPLAY.WIDTH,
          GAME_CONFIG.PRIZE.DISPLAY.HEIGHT
        );

        // 繪製碰撞區域（調試用）
   
      });

      gameState.current.prizes = gameState.current.prizes.filter(
        (prize) => prize.x <= GAME_CONFIG.CANVAS_WIDTH || prize.caught
      );
    };

    const checkCollision = () => {
      const state = gameState.current;
      const adjustedAngle = ((state.clawSwingAngle - 180) * Math.PI) / 180;

      // 計算爪子實際位置，加入垂直偏移
      const clawTipX = 
        state.clawX + 
        (GAME_CONFIG.CLAW.LENGTH - GAME_CONFIG.CLAW.OFFSET_Y) * Math.cos(adjustedAngle);
      const clawTipY = 
        state.clawY + 
        (GAME_CONFIG.CLAW.LENGTH - GAME_CONFIG.CLAW.OFFSET_Y) * Math.sin(adjustedAngle);

      if (state.clawY >= EXTEND_LIMIT - GAME_CONFIG.CLAW.OFFSET_Y) {
        // 計算爪子碰撞箱
 
   

        let caught = false;
        gameState.current.prizes = gameState.current.prizes.filter((prize) => {
          if (prize.caught) {
            // 調整抓取後的位置
            prize.x = clawTipX - GAME_CONFIG.PRIZE.COLLISION.WIDTH / 2;
            prize.y = clawTipY - GAME_CONFIG.PRIZE.COLLISION.HEIGHT;
            return true;
          }

          // 計算禮物中心點
          const prizeCenterX = prize.x + GAME_CONFIG.PRIZE.COLLISION.WIDTH / 2;
          const prizeCenterY = prize.y + GAME_CONFIG.PRIZE.COLLISION.HEIGHT / 2;

          // 計算爪子和禮物中心點之間的距離
          const dx = clawTipX - prizeCenterX;
          const dy = clawTipY - prizeCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // 使用更精確的距離判斷，調整判定範圍
          const minDistance = (GAME_CONFIG.CLAW.HEAD_WIDTH + GAME_CONFIG.PRIZE.COLLISION.WIDTH) / 3;
          const collision = distance < minDistance;

          // 繪製禮物碰撞區域（調試用）
         
          if (collision && !caught && state.clawExtending) {
            caught = true;
            prize.caught = true;
            return true;
          }

          return !collision;
        });

        if (caught) {
          winningCallback()
          state.clawExtending = false;
          state.clawRetracting = true;
          alert("恭喜中獎！");
          setPlaying(false);
          resetGame();
        } else if (state.clawY >= EXTEND_LIMIT) {
          state.clawExtending = false;
          state.clawRetracting = true;
        }
      }
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

    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = (timestamp - lastTime) / 16.67; // 標準化為 ~60fps
      lastTime = timestamp;

      const state = gameState.current;

      ctx.clearRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
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
            GAME_CONFIG.CLAW.SWING_SPEED * state.swingDirection * deltaTime;
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
            Math.cos((adjustedAngle * Math.PI) / 180) *
            deltaTime;
          state.clawY +=
            GAME_CONFIG.CLAW.SPEED *
            Math.sin((adjustedAngle * Math.PI) / 180) *
            deltaTime;

          if (state.clawY >= EXTEND_LIMIT) {
            checkCollision();
          }
        } else if (state.clawRetracting) {
          const adjustedAngle = state.clawSwingAngle - 180;
          state.clawX -=
            GAME_CONFIG.CLAW.SPEED *
            Math.cos((adjustedAngle * Math.PI) / 180) *
            deltaTime;
          state.clawY -=
            GAME_CONFIG.CLAW.SPEED *
            Math.sin((adjustedAngle * Math.PI) / 180) *
            deltaTime;
          if (state.clawY <= 0) {
            resetClaw();
          }
        }

        gameState.current.prizes.forEach((prize) => {
          if (!prize.caught) {
            prize.x += GAME_CONFIG.PRIZE.SPEED * deltaTime;
          }
        });
      }

      drawClaw();
      if (playing) {
        drawPrizes();
      }

      requestIdRef.current = requestAnimationFrame(gameLoop);
    };

    const startGame = async () => {
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

        // 清理之前的動畫循環
        if (requestIdRef.current) {
          cancelAnimationFrame(requestIdRef.current);
        }

        // 清理之前的獎品生成間隔
        if (prizeInterval) {
          clearInterval(prizeInterval);
        }

        // 重置時間追蹤
        lastTime = 0;

        if (playing) {
          prizeInterval = setInterval(
            generatePrize,
            GAME_CONFIG.PRIZE.SPAWN_INTERVAL
          );
        }

        requestIdRef.current = requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    startGame();

    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
      if (prizeInterval) {
        clearInterval(prizeInterval);
      }
    };
  }, [setIsGrabbing, playing, setPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.CANVAS_WIDTH}
      height={GAME_CONFIG.CANVAS_HEIGHT}
        style={{ background: 'transparent' }}  // 添加這行
    />
  );
};