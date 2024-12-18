import { Route, Routes } from "react-router-dom";
import Admin from "./pages/AdminPage/Admin";
import Game from "./pages/GamePage/Game";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",

        width: 400,
        height: 844,
        margin: "0 auto",
        border: "1px solid red",
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
