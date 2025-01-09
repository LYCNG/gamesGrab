
import { MdSearch } from "react-icons/md";
import { User, UserTable } from "./UserTable";
import { UserCreateModal } from "./UserCreateModal";
import {  useState } from "react";
import { api } from "../../../api";
import { useQuery } from "@tanstack/react-query";



const getAllUserAsync = async() => { 
  return await api.get('user/all').then(res=>res.data);
};

const UserList = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data,isFetched} = useQuery({
    queryKey: ['users'],
    queryFn:getAllUserAsync
  })

  const handleDelete = (user:User) => { 
    console.log(user)
  };
  const handleEdit = (user:User) => { 
  console.log(user)
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-col gap-4 md:flex-row">
          <h1 className="text-2xl font-semibold">使用者管理</h1>
          <div className="flex items-center gap-2">
            <button className="bg-emerald-500 
                hover:bg-emerald-600 
                text-white 
                px-2 
                py-1 
                rounded-lg 
                transform 
                active:scale-95 
                transition-all 
                duration-75" onClick={()=>setIsModalOpen(true)}>
              Create User
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-1 border rounded-lg w-64 h-8 focus:outline-none focus:border-blue-500"
              />
              <MdSearch className="absolute left-3 top-2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
        {/* Search Bar */}

        {/* Table */}
        {data && isFetched && data.data && (
          <UserTable userList={data.data} onDelete={handleDelete} onEdit={handleEdit} />
        )}
      </div>
        {isModalOpen && (
        <UserCreateModal
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UserList;
