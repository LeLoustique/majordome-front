import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Accueil from "./pages/Accueil";
import Chat from "./pages/Chat";
import Parametres from "./pages/Parametres";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="/" element={<Layout />}>
          <Route index element={<Accueil />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
