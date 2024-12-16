export interface Bag {
  id: number;
  x: number;
  track: number; // 1 或 2，表示在哪個軌道上
}


export interface RewardType {
  id: number;
  track: number;
  delay: number;
}
