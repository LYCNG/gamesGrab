

import { Route, Routes } from "react-router-dom";
import Game from "./pages/GamePage/Game";



function App() {
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     
        <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/game" element={<Game />} />

        </Routes>
  
    </div>
  );
}

export default App;
