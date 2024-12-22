import React, { useState } from 'react'
import {  MdAdd } from 'react-icons/md';
import { GiftFormModal } from './GiftFromModal';
import { Gift } from '../../../types/gift';
import { GiftCard } from './GiftCard';
import { mockGifts } from '../../../mock';



export const GiftList: React.FC = () => {
 const [gifts] = useState<Gift[]>(mockGifts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
      const handleEdit = (gift: Gift) => {
   console.log('Edit gift:', gift);
   // 處理編輯邏輯
 };
  const handleDelete = (gift: Gift) => {
   console.log('Delete gift:', gift);
   // 處理刪除邏輯
 };
  return (
   <div className="space-y-4">
     {/* Header */}
     <div className="flex justify-between items-center">
       <h2 className="text-xl font-semibold">禮包管理</h2>
       <button 
         onClick={() => setIsModalOpen(true)}
         className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
       >
         <MdAdd className="mr-2" />
         新增禮物
       </button>
     </div>
      {/* Gift Grid */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {gifts.map((gift) => (
         <GiftCard
           key={gift.id}
           gift={gift}
           onEdit={handleEdit}
           onDelete={handleDelete}
         />
       ))}
     </div>
      {/* Add/Edit Modal */}
     {isModalOpen && (
       <GiftFormModal 
         onClose={() => setIsModalOpen(false)}
         onSubmit={(data) => {
           console.log(data);
           setIsModalOpen(false);
         }}
       />
     )}
   </div>
 );
};