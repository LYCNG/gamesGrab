import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Sidebar } from "./components/SideBar";

export const Admin = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user || user.role !== "admin") {
    return <Navigate to="/game" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Mobile Menu Button - 只在手機/平板顯示 */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 lg:hidden"
      >
        <FiMenu size={24} />
      </button>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <div className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Hi, Welcome back 👋</h1>
          </div>

          {/* Content */}
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Dashboard Content</h2>
              <p>Your dashboard content goes here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
