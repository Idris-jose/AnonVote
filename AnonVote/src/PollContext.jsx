import React, { createContext, useState, useContext } from "react";

const PollContext = createContext();

// Custom hook to use poll context
export const usePollContext = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePollContext must be used within a PollProvider');
  }
  return context;
};

// Poll Provider component
export function PollProvider({ children }) {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);

  const savePoll = (pollData) => {
    setCurrentPoll(pollData);
    setPollHistory(prev => [pollData, ...prev.slice(0, 9)]); // Keep last 10 polls
  };

  const updatePoll = (updatedPollData) => {
    setCurrentPoll(updatedPollData);
    setPollHistory(prev => 
      prev.map(poll => poll.id === updatedPollData.id ? updatedPollData : poll)
    );
  };

  const value = {
    currentPoll,
    pollHistory,
    savePoll,
    updatePoll,
    setCurrentPoll
  };

  return (
    <PollContext.Provider value={value}>
      {children}
    </PollContext.Provider>
  );
};