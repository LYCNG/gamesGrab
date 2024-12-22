import React, { useMemo, useState } from 'react';
import {
 createColumnHelper,
 flexRender,
 getCoreRowModel,
 useReactTable,
 getSortedRowModel,
 SortingState,
} from '@tanstack/react-table';
import { MdEdit, MdDelete } from "react-icons/md";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { Product } from '../../../types/Product';


const columnHelper = createColumnHelper<Product>();

interface ProductTableProps {
    data: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ data, onEdit, onDelete }) => {
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const isMobile = useMediaQuery("(max-width: 768px)");
     const columns = useMemo(
   () => [
     columnHelper.accessor('imageUrl', {
       header: 'Image',
       cell: (info) => (
         <div className="w-16 h-16">
           <img
             src={info.getValue()}
             alt=""
             className="w-full h-full object-cover rounded-lg"
           />
         </div>
       ),
     }),
     columnHelper.accessor('name', {
       header: 'Product Name',
       cell: (info) => (
         <div>
           <div className="font-medium text-gray-900">{info.getValue()}</div>
           <div className="text-sm text-gray-500 line-clamp-2">
             {info.row.original.description}
           </div>
         </div>
       ),
     }),
     columnHelper.accessor('price', {
       header: 'Price',
       cell: (info) => (
         <div className="font-medium text-blue-600">
           NT$ {info.getValue().toLocaleString()}
         </div>
       ),
     }),
     columnHelper.accessor('stock', {
       header: 'Stock',
       cell: (info) => (
         <div className={`font-medium ${
           info.getValue() > 0 ? 'text-green-600' : 'text-red-600'
         }`}>
           {info.getValue()}
         </div>
       ),
     }),
     columnHelper.accessor('status', {
       header: 'Status',
       cell: (info) => (
         <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
           info.getValue() === 'active'
             ? 'bg-green-100 text-green-800'
             : 'bg-gray-100 text-gray-800'
         }`}>
           {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
         </span>
       ),
     }),
     columnHelper.display({
       id: 'actions',
       header: 'Actions',
       cell: (info) => (
         <div className="flex space-x-2">
           <button
             onClick={() => onEdit(info.row.original)}
             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
             title="Edit"
           >
             <MdEdit className="w-5 h-5" />
           </button>
           <button
             onClick={() => onDelete(info.row.original)}
             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
             title="Delete"
           >
             <MdDelete className="w-5 h-5" />
           </button>
         </div>
       ),
     }),
   ],
   [onEdit, onDelete]
    );
    const table = useReactTable({
   data,
   columns,
   state: {
     sorting,
   },
   onSortingChange: setSorting,
   getCoreRowModel: getCoreRowModel(),
   getSortedRowModel: getSortedRowModel(),
    });
    
    if (isMobile) {
   return (
     <div className="space-y-4">
       {table.getRowModel().rows.map((row) => (
         <div key={row.id} className="bg-white p-4 rounded-lg shadow-sm">
           {/* Product Image and Name */}
           <div className="flex gap-4 mb-4">
             <img
               src={row.original.imageUrl}
               alt=""
               className="w-20 h-20 object-cover rounded-lg"
             />
             <div>
               <h3 className="font-medium text-gray-900">{row.original.name}</h3>
               <p className="text-sm text-gray-500 line-clamp-2">
                 {row.original.description}
               </p>
             </div>
           </div>
            {/* Product Details */}
           <div className="space-y-2">
             <div className="flex justify-between py-2 border-b">
               <span className="text-gray-500">Price</span>
               <span className="font-medium text-blue-600">
                 NT$ {row.original.price.toLocaleString()}
               </span>
             </div>
             <div className="flex justify-between py-2 border-b">
               <span className="text-gray-500">Stock</span>
               <span className={`font-medium ${
                 row.original.stock > 0 ? 'text-green-600' : 'text-red-600'
               }`}>
                 {row.original.stock}
               </span>
             </div>
             <div className="flex justify-between py-2 border-b">
               <span className="text-gray-500">Status</span>
               <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                 row.original.status === 'active'
                   ? 'bg-green-100 text-green-800'
                   : 'bg-gray-100 text-gray-800'
               }`}>
                 {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
               </span>
             </div>
           </div>
            {/* Actions */}
           <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
             <button
               onClick={() => onEdit(row.original)}
               className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
             >
               Edit
             </button>
             <button
               onClick={() => onDelete(row.original)}
               className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
             >
               Delete
             </button>
           </div>
         </div>
       ))}
     </div>
   );
    }
    return (
         <div className="overflow-x-auto border rounded-lg">
     <div className="inline-block min-w-full align-middle">
       <div className="overflow-hidden">
         <table className="min-w-full divide-y divide-gray-300">
           <thead className="bg-gray-50">
             {table.getHeaderGroups().map((headerGroup) => (
               <tr key={headerGroup.id}>
                 {headerGroup.headers.map((header) => (
                   <th
                     key={header.id}
                     scope="col"
                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                     onClick={header.column.getToggleSortingHandler()}
                   >
                     {flexRender(
                       header.column.columnDef.header,
                       header.getContext()
                     )}
                     <span className="ml-2">
                       {{
                         asc: '🔼',
                         desc: '🔽',
                       }[header.column.getIsSorted() as string] ?? null}
                     </span>
                   </th>
                 ))}
               </tr>
             ))}
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {table.getRowModel().rows.map((row) => (
               <tr key={row.id} className="hover:bg-gray-50">
                 {row.getVisibleCells().map((cell) => (
                   <td
                     key={cell.id}
                     className="px-6 py-4 whitespace-nowrap"
                   >
                     {flexRender(
                       cell.column.columnDef.cell,
                       cell.getContext()
                     )}
                   </td>
                 ))}
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
   </div>
    )
}
