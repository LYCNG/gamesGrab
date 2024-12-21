import React, { useState } from 'react';
import { MdClose, MdCloudUpload } from 'react-icons/md';
import { Gift } from '../../../types/gift';

interface GiftFormModalProps {
    onClose: () => void;
    onSubmit: (data: unknown) => void;
    initialData?: Gift;
};
export const GiftFormModal: React.FC<GiftFormModalProps> = ({
 onClose,
 onSubmit,
 initialData
}) => {
 const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (file) {
     const reader = new FileReader();
     reader.onloadend = () => {
       setImagePreview(reader.result as string);
     };
     reader.readAsDataURL(file);
   }
 };
  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
     <div className="bg-white rounded-lg max-w-md w-full p-6">
       <div className="flex justify-between items-center mb-4">
         <h3 className="text-lg font-semibold">
           {initialData ? 'Edit Gift' : 'Add New Gift'}
         </h3>
         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
           <MdClose className="w-6 h-6" />
         </button>
       </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          return onSubmit(e)
         // 處理表單提交
       }}>
         {/* Image Upload */}
         <div className="mb-4">
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Gift Image
           </label>
           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
             {imagePreview ? (
               <div className="relative aspect-w-16 aspect-h-9">
                 <img
                   src={imagePreview}
                   alt="Preview"
                   className="object-cover rounded-lg"
                 />
                 <button
                   type="button"
                   onClick={() => setImagePreview(null)}
                   className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                 >
                   <MdClose className="w-4 h-4" />
                 </button>
               </div>
             ) : (
               <label className="flex flex-col items-center cursor-pointer">
                 <MdCloudUpload className="w-12 h-12 text-gray-400" />
                 <span className="mt-2 text-sm text-gray-500">Click to upload image</span>
                 <input
                   type="file"
                   className="hidden"
                   accept="image/*"
                   onChange={handleImageChange}
                 />
               </label>
             )}
           </div>
         </div>
          {/* Name Input */}
         <div className="mb-4">
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Gift Name
           </label>
           <input
             type="text"
             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             defaultValue={initialData?.name}
           />
         </div>
          {/* Quantity Inputs */}
         <div className="mb-4">
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Total Quantity
           </label>
           <input
             type="number"
             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             defaultValue={initialData?.totalQuantity}
             min="1"
           />
         </div>
          {/* Submit Button */}
         <div className="flex justify-end space-x-2">
           <button
             type="button"
             onClick={onClose}
             className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
           >
             Cancel
           </button>
           <button
             type="submit"
             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
           >
             {initialData ? 'Save Changes' : 'Add Gift'}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};
