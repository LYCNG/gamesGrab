export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    stock: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}