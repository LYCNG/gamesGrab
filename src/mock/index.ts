import { Gift } from "../types/gift";
import { Payment } from "../types/payment";
import { User } from "../pages/AdminPage/components/UserTable";
import { Product } from "../types/Product";

export const mockGifts: Gift[] = [
 {
   id: '1',
   name: 'iPhone 16 Pro 256 沙漠金',
   imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=eUdsd0dIb3VUOXdtWkY0VFUwVE8vbEdkZHNlSjBQRklnaFB2d3I5MW94NW9lRVVkRmJ5ZE03VysydEdnMXpSNEY3eHJKR1hDaEJCS2hmc2czazlldHlSTUMybCtXNXZpclhWeFpYZUcvRk80dEcwRGlZdHZNUlUyQVJ1QXFtSFFUeEZnNlNyc3llcmZiYmQ5TGppeHJ3&traceId=1',
   totalQuantity: 10,
   remainingQuantity: 7,
   claimedQuantity: 3,
 }, {
   id: '2',
   name: 'Air pod pro 2',
   imageUrl: 'https://img.pchome.com.tw/cs/items/DYAJCH1900GXV59/000001_1727076200.jpg',
   totalQuantity: 10,
   remainingQuantity: 7,
   claimedQuantity: 3,
 },
];


export const mockPayments: Payment[] = [
    {
        id: '1',
        userId: 'USER123',
        userName: 'John Doe',
        amount: 1000,
        createdAt: '2024-03-15T10:30:00Z',
        status: 'pending',
    }
];


export const mockData: User[] = [        
 {  
   id: '1',
   name: 'John Doe',
   email: 'johndoe@gmail.com',
   phone: '555-555-5555',
   status: 'active',
 },
 {
   id: '2',
   name: 'Jane Doe',
   email: 'janedoe@gmail.com',
   phone: '555-555-5555',
   status: 'inactive',
 },
];

export const mockProducts: Product[] = [
 {
   id: '1',
   name: 'Gaming Mouse',
   price: 1500,
   description: 'High performance gaming mouse with RGB lighting',
   imageUrl: '/images/mouse.jpg',
   stock: 50,
   status: 'active',
   createdAt: '2024-03-15T10:30:00Z',
   updatedAt: '2024-03-15T10:30:00Z',
 },
 // ... 更多模擬數據
];
