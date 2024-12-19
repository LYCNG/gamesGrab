import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export const Admin = () => {
  const { user } = useAuth();

  // 如果不是管理員，導向遊戲頁面
  if (!user || user.role !== "admin") {
    return <Navigate to="/game" />;
  }

  return (
    <div>
      <h1>Admin</h1>
    </div>
  );
};
