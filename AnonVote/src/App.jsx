import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import CreatePoll from "./CreatePoll.jsx";
import PollDetails from "./PollDetails.jsx";
import Results from "./Results.jsx";
import { PollProvider } from "./PollContext.jsx";

function App() {

  return (
    <PollProvider>
          <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/pollDetails" element={<PollDetails/>} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
    </PollProvider>
  
  );
}

export default App;
