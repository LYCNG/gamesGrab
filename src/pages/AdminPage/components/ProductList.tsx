import React, { useState } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import { ProductTable } from './ProductTable';
import { ProductFormModal } from './ProductFormModal';
import { Product } from '../../../types/Product';
import { mockProducts } from '../../../mock';


export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  const handleDelete = (product: Product) => {
    // 實現刪除邏輯
    setProducts(products.filter(p => p.id !== product.id));
  };
  const handleSubmit = (data: Partial<Product>) => {
    if (editingProduct) {
      // 更新現有商品
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...p, ...data } : p
      ));
    } else {
      // 添加新商品
      setProducts([...products, {
               ...data as Product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <MdAdd className="mr-2" />
          Add Product
        </button>
      </div>
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MdSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>
      {/* Table */}
      <ProductTable
        data={filteredProducts}

        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
  ;
}