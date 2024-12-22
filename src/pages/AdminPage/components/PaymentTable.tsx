import React, { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { MdCheckCircle, MdCancel, MdAccessTime } from "react-icons/md";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import type { Payment } from "../../../types/payment";
const columnHelper = createColumnHelper<Payment>();

interface PaymentTableProps {
  data: Payment[];
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  data,

}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
     const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns = useMemo(
    () => [
      columnHelper.accessor("userId", {
        header: "User Info",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{info.getValue()}</span>
            {info.row.original.userName && (
              <span className="text-sm text-gray-500">
                {info.row.original.userName}
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Points",
        cell: (info) => (
          <div className="font-medium text-blue-600">
            {info.getValue().toLocaleString()} pts
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Purchase Date",
        cell: (info) => (
          <div className="text-sm text-gray-600">
            {new Date(info.getValue()).toLocaleDateString("zh-TW", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const statusConfig = {
            approved: {
              icon: MdCheckCircle,
              text: "Approved",
              className: "bg-green-100 text-green-800",
            },
            rejected: {
              icon: MdCancel,
              text: "Rejected",
              className: "bg-red-100 text-red-800",
            },
            pending: {
              icon: MdAccessTime,
              text: "Pending",
              className: "bg-yellow-100 text-yellow-800",
            },
          }[status];
          const Icon = statusConfig.icon;
          return (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.className}`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {statusConfig.text}
            </span>
          );
        },
      }),
    ],
    []
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
    getPaginationRowModel: getPaginationRowModel(),
  });
  if (isMobile) {
    return (
      <div className="space-y-4">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="bg-white p-4 rounded-lg shadow-sm">
            {row.getVisibleCells().map((cell) => (
              <div
                key={cell.id}
                className="flex justify-between py-2 border-b last:border-0"
              >
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
                          asc: "🔼",
                          desc: "🔽",
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
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
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
