
import { MdSearch } from "react-icons/md";
import { UserTable } from "./UserTable";

const UserList = () => {
  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">使用者管理</h1>
          <div className="flex items-center gap-2">
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
        <UserTable />
      </div>
    </div>
  );
};

export default UserList;
