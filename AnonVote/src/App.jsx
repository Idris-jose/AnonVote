import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import CreatePoll from "./CreatePoll.jsx";
import PollDetails from "./PollDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/pollDetails" element={<PollDetails/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
