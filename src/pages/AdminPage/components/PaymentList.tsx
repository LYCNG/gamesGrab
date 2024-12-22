import React, { useState } from "react";
import { MdSearch } from "react-icons/md";

import { Payment } from "../../../types/payment";
import { PaymentTable } from "./PaymentTable";
import { mockPayments } from "../../../mock";


export const PaymentList: React.FC = () => {

  const [payments] = useState<Payment[]>(mockPayments);

  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredData = payments.filter(payment => 
   payment.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
   payment.userName?.toLowerCase().includes(searchQuery.toLowerCase())
 );
  return (
   <div className="space-y-6">
     {/* Header */}
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
       <h2 className="text-xl font-semibold">Payment Records</h2>
       <div className="relative w-full sm:w-64">
         <input
           type="text"
           placeholder="Search by user..."
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
         <MdSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
       </div>
     </div>
      {/* Table */}
     <PaymentTable
       data={filteredData}

     /> 
      {/* Pagination controls can be added here if needed */}
   </div>
 );
};