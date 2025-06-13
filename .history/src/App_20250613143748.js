import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
// import Accueil from "./pages/Accueil";
import Chat from "./pages/Chat";
// import Parametres from "./pages/Parametres";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route index element={<Accueil />} /> */}
        <Route path="chat" element={<Chat />} />
        {/* <Route path="parametres" element={<Parametres />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
