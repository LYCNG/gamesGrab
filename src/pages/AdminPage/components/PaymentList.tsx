import React, { useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { MdCheckCircle, MdCancel, MdAccessTime } from 'react-icons/md';
import { Payment } from '../../../types/payment';
import { mockPayments } from '../mock';




const columnHelper = createColumnHelper<Payment>();



const PaymentList = () => {

 const [sorting, setSorting] = useState<SortingState>([]);
  const columns = [
   columnHelper.accessor('userId', {
     header: 'User ID',
     cell: (info) => (
       <div className="flex items-center">
         <span className="font-medium">{info.getValue()}</span>
         {info.row.original.userName && (
           <span className="ml-2 text-gray-500">({info.row.original.userName})</span>
         )}
       </div>
     ),
   }),
   columnHelper.accessor('amount', {
     header: 'Amount',
     cell: (info) => (
       <div className="font-medium text-blue-600">
         {info.getValue().toLocaleString()} Points
       </div>
     ),
   }),
   columnHelper.accessor('createdAt', {
     header: 'Purchase Date',
     cell: (info) => (
       <div className="text-gray-600">
         {new Date(info.getValue()).toLocaleDateString('zh-TW', {
           year: 'numeric',
           month: '2-digit',
           day: '2-digit',
           hour: '2-digit',
           minute: '2-digit',
         })}
       </div>
     ),
   }),
   columnHelper.accessor('status', {
     header: 'Status',
     cell: (info) => {
       const status = info.getValue();
       return (
         <div className="flex items-center">
           {status === 'approved' && (
             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
               <MdCheckCircle className="w-4 h-4 mr-1" />
               Approved
             </span>
           )}
           {status === 'rejected' && (
             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
               <MdCancel className="w-4 h-4 mr-1" />
               Rejected
             </span>
           )}
           {status === 'pending' && (
             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
               <MdAccessTime className="w-4 h-4 mr-1" />
               Pending
             </span>
           )}
         </div>
       );
     },
   }),
   columnHelper.accessor('id', {
     header: 'Actions',
     cell: (info) => (
       <div className="flex space-x-2">
         {info.row.original.status === 'pending' && (
           <>
             <button
               onClick={() => handleApprove(info.getValue())}
               className="px-3 py-1 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
             >
               Approve
             </button>
             <button
               onClick={() => handleReject(info.getValue())}
               className="px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
             >
               Reject
             </button>
           </>
         )}
       </div>
     ),
   }),
 ];
     const handleApprove = (id: string) => {
   console.log('Approve payment:', id);
   // 處理核准邏輯
 };
  const handleReject = (id: string) => {
   console.log('Reject payment:', id);
   // 處理拒絕邏輯
 };
  const table = useReactTable({
   data: mockPayments,
   columns,
   state: {
     sorting,
   },
   onSortingChange: setSorting,
   getCoreRowModel: getCoreRowModel(),
   getSortedRowModel: getSortedRowModel(),
   getPaginationRowModel: getPaginationRowModel(),
  });
    
  return (
    <div className="space-y-4">
     <h2 className="text-xl font-semibold mb-4">Payment Records</h2>
      {/* Table */}
     <div className="overflow-x-auto">
       <div className="inline-block min-w-full align-middle">
         <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
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
                       className="px-6 py-4 whitespace-nowrap text-sm"
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
      {/* Pagination */}
     <div className="flex items-center justify-between">
       <div className="flex items-center gap-2">
         <button
           className="px-3 py-1 border rounded hover:bg-gray-50"
           onClick={() => table.setPageIndex(0)}
           disabled={!table.getCanPreviousPage()}
         >
           {'<<'}
         </button>
         <button
           className="px-3 py-1 border rounded hover:bg-gray-50"
           onClick={() => table.previousPage()}
           disabled={!table.getCanPreviousPage()}
         >
           {'<'}
         </button>
         <button
           className="px-3 py-1 border rounded hover:bg-gray-50"
           onClick={() => table.nextPage()}
           disabled={!table.getCanNextPage()}
         >
           {'>'}
         </button>
         <button
           className="px-3 py-1 border rounded hover:bg-gray-50"
           onClick={() => table.setPageIndex(table.getPageCount() - 1)}
           disabled={!table.getCanNextPage()}
         >
           {'>>'}
         </button>
         <span className="flex items-center gap-1">
           <div>Page</div>
           <strong>
             {table.getState().pagination.pageIndex + 1} of{' '}
             {table.getPageCount()}
           </strong>
         </span>
       </div>
     </div>
   </div>
  )
}

export default PaymentList