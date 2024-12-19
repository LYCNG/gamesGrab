import { Route, Routes } from "react-router-dom";

import { Admin } from "./pages/AdminPage/Admin";
import Game from "./pages/GamePage/Game";
import { UserLogin } from "./pages/UserLoginPage/UserLogin";

function App() {
  return (
    <div className="fixed inset-0 flex justify-center items-center w-screen h-screen bg-black">
      <div
        className="relative w-full h-full max-w-[400px] max-h-[844px] overflow-hidden"
        style={{
          aspectRatio: "400/844",
        }}
      >
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/game" element={<Game />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
