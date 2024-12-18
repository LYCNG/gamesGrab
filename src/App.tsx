import { Route, Routes } from "react-router-dom";

import Game from "./pages/GamePage/Game";
import { Admin } from "./pages/AdminPage/Admin";

function App() {
  return (
    <div
      className="w-full h-full bg-red-500 border-2 border-black"
      style={{
        display: "flex",
        justifyContent: "center",
        width: 400,
        height: 844,
        margin: "0 auto",
  
      }}
    >
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/game" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
