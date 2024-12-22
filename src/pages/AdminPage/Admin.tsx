import { useCallback, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Sidebar } from "./components/SideBar";
import UserList from "./components/UserList";
import { GiftList } from "./components/GiftList";
import { PaymentList } from "./components/PaymentList";
import { ProductList } from "./components/ProductList";

export const Admin = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("user");



    const renderContent = useCallback(() => {
    switch (activeTab) {
      case "user":
        return <UserList />;
      case "gift":
        return <GiftList />;
      case "payment":
        return <PaymentList />;
      case "product":
        return <ProductList />;
      default:
          return <UserList />;
    }
    }, [activeTab]);
  
  if (!user || user.role !== "admin") {
    return <Navigate to="/game" />;
  }



  return (
    <div className="max-h-screen bg-gray-50 w-full">
      {/* Mobile Menu Button - 只在手機/平板顯示 */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 lg:hidden"
      >
        <FiMenu size={24} />
      </button>

      <div className="flex">
        {/* Sidebar */}
     
              <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} setActiveTab={setActiveTab} activeTab={activeTab}/>
   

        {/* Main Content */}
        <div className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8 overflow:auto">
    

          {/* Content */}
          <div className="grid gap-6 max-h-[92vh] overflow-y-auto scrollbar-thin">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Dashboard Content</h2>
              <p>Your dashboard content goes here</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm h-[800px]">
              {renderContent()}
            </div>
    
          </div>
        </div>
      </div>
    </div>
  );
};
