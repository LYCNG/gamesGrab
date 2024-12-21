export interface Payment {
 id: string;
 userId: string;
 amount: number;
 createdAt: string;
 status: 'pending' | 'approved' | 'rejected';
    userName?: string; // 可選的用戶名稱
}