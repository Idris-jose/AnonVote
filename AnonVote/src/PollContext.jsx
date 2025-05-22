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
    // Ensure totalVotes is calculated when saving
    const totalVotes = pollData.options ? 
      pollData.options.reduce((sum, option) => sum + (option.votes || 0), 0) : 0;
    
    const pollWithTotalVotes = {
      ...pollData,
      totalVotes: totalVotes
    };
    
    setCurrentPoll(pollWithTotalVotes);
    setPollHistory(prev => [pollWithTotalVotes, ...prev.slice(0, 9)]); 
  };

  const updatePoll = (updatedPollData) => {
    // Ensure totalVotes is recalculated when updating
    const totalVotes = updatedPollData.options ? 
      updatedPollData.options.reduce((sum, option) => sum + (option.votes || 0), 0) : 0;
    
    const pollWithUpdatedTotalVotes = {
      ...updatedPollData,
      totalVotes: totalVotes
    };
    
    setCurrentPoll(pollWithUpdatedTotalVotes);
    setPollHistory(prev => 
      prev.map(poll => 
        poll.id === pollWithUpdatedTotalVotes.id ? pollWithUpdatedTotalVotes : poll
      )
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