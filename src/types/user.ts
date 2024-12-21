export type RoleType = "admin" | "user";

export interface User {
  userId: string;
  username: string;
  point: number;
  role: RoleType;
}

