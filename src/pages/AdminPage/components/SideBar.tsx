import { FaGift, FaMoneyBill, FaShoppingBag, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItem = [
    {
      name: "使用者管理",
      id: "user",
      icon:<FaUser />
    },
    {
      name: "禮包管理",
      id: "gift",
      icon:<FaGift />
    },
    {
      name: "付款紀錄",
      id: "payment",
      icon:<FaMoneyBill />
    },
    {
      name: "商品管理",
      id: "product",
      icon:<FaShoppingBag />
    },
  ];

  return (
    <>
      {/* Mobile Backdrop - 只在手機/平板顯示 */}
      <div
        onClick={() => setIsCollapsed(true)}
        className={`
          fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 h-screen
          lg:hidden
          ${isCollapsed ? "hidden" : "block"}
        `}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white flex flex-col shadow-lg
          transition-all duration-300 
          z-50
          lg:relative lg:translate-x-0 lg:w-64
          ${isCollapsed ? "-translate-x-full" : "translate-x-0 w-[280px]"}
        `}
      >
        {/* Toggle Button - Desktop Only */}

        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 ">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            <span className={`text-xl font-bold `}>Admin </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          {menuItem.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.id)}
              style={{backgroundColor: activeTab === item.id ? "#f0f0f0" : ""}}
              className={`w-full px-4 py-3 flex items-center hover:bg-gray-100 transition-colors 
              gap-4
            `}
            >
              <div className="text-gray-500 text-xl">
                {item.icon}
              </div>
          
              <span>{item.name}</span>
            </button>
          ))}

          {/* Add more menu items here */}
        </div>

        {/* User Info and Logout */}
        <div className="border-t border-gray-200">
          {/* User Info */}
          <div className={`px-4 py-3 flex items-center gap-4`}>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <FaUser className="text-gray-500" />
            </div>
            <div className={`flex-1 `}>
              <p className="text-sm font-medium text-gray-900">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">管理員</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full px-4 py-3 text-red-600 hover:bg-gray-100 flex items-center transition-colors
            gap-6
            `}
          >
            <FiLogOut className="text-lg" />
            <span>登出系統</span>
          </button>
        </div>
      </div>
    </>
  );
};
