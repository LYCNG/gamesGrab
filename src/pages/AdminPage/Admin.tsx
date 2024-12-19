import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Sidebar } from "./components/SideBar";

export const Admin = () => {
  const { user } = useAuth();

  // 如果不是管理員，導向遊戲頁面
  if (!user || user.role !== "admin") {
    return <Navigate to="/game" />;
  }

  return (
   <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div>
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
