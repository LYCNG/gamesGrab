import { Route, Routes } from "react-router-dom";

import { Admin } from "./pages/AdminPage/Admin";
import Game from "./pages/GamePage/Game";
import { UserLogin } from "./pages/UserLoginPage/UserLogin";



function App() {

  return (
    <div className="inset-0 flex justify-center items-center w-screen h-screen ">
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/game" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
