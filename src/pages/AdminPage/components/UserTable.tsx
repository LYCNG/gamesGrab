import React, { useMemo } from 'react';
import {
 createColumnHelper,
 flexRender,
 getCoreRowModel,
 useReactTable,
 getSortedRowModel,
 SortingState,
} from '@tanstack/react-table';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { mockData } from '../mock';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
};

const columnHelper = createColumnHelper<User>();

export const UserTable: React.FC = () => {
   const isMobile = useMediaQuery('(max-width: 768px)');
 const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns = useMemo(
   () => [
     columnHelper.accessor('name', {
       header: 'NAME',
       cell: (info) => (
         <div className="font-medium text-gray-900">{info.getValue()}</div>
       ),
     }),
     columnHelper.accessor('email', {
       header: 'EMAIL',
       cell: (info) => <div className="text-gray-500">{info.getValue()}</div>,
     }),
     columnHelper.accessor('phone', {
       header: 'PHONE',
       cell: (info) => <div className="text-gray-500">{info.getValue()}</div>,
     }),
     columnHelper.accessor('status', {
       header: 'STATUS',
       cell: (info) => (
         <span
           className={`px-3 py-1 rounded-full text-xs font-medium ${
             info.getValue() === 'active'
               ? 'bg-green-100 text-green-800'
               : 'bg-red-100 text-red-800'
           }`}
         >
           {info.getValue()}
         </span>
       ),
     }),
   ],
   []
 );
  const table = useReactTable({
   data: mockData,
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
     <div className="space-y-4 h-[600px] overflow-y-auto">
       {table.getRowModel().rows.map((row) => (
         <div key={row.id} className="bg-white p-4 rounded-lg shadow-sm">
           {row.getVisibleCells().map((cell) => (
             <div key={cell.id} className="flex justify-between py-2 border-b last:border-0">
               <span className="font-medium text-gray-500">
                 {cell.column.columnDef.header as string}
               </span>
               <span>
                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
               </span>
             </div>
           ))}
         </div>
       ))}
     </div>
   );
 }
  return (
   <div className="overflow-x-auto border rounded-lg ">
   <div className="inline-block min-w-full align-middle">
     <div className="h-[400px] overflow-y-auto">
       <table className="min-w-full divide-y divide-gray-300">
         <thead className="bg-gray-50 sticky top-0 z-10">{table.getHeaderGroups().map((headerGroup) => (
           <tr key={headerGroup.id}>{headerGroup.headers.map((header) => (
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
           ))}</tr>
         ))}</thead>
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
 );
};