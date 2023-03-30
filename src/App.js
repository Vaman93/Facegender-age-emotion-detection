import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Documentation from "./Page/Documentation";
import Home from "./Page/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
