import { useState } from "react";
import { FaCoins, FaUser } from "react-icons/fa"; // 使用者圖示
import { FiLogOut } from "react-icons/fi"; // 登出圖示
import { RiMenu3Fill } from "react-icons/ri"; // 漢堡選單圖示
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

export const BurgerMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="absolute top-4 right-4 z-50 p-2 hover:bg-red-500 rounded-full transition-colors bg-gray-400 "
      >
        <RiMenu3Fill size={24} className="text-white" />
      </button>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg z-50 w-32 py-2">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 justify-center">
                <FaUser className="text-gray-500" />
                <p className="font-semibold text-sm">{user?.username}</p>
              </div>
            </div>
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 justify-between">
                <FaCoins className="text-yellow-500" />
                <p className="text-sm">{user?.point}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2 justify-between"
            >
              <FiLogOut />
              <span>登出</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};
