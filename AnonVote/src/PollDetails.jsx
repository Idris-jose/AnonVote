import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import { useLocation, useNavigate } from 'react-router-dom';
import { usePollContext } from './PollContext.jsx';

export default function PollDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPoll, updatePoll } = usePollContext();
  const [pollData, setPollData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get poll data from multiple sources
    let pollFromState = location.state?.pollData;
    let pollFromContext = currentPoll;
    
    if (pollFromState) {
      // Ensure totalVotes is properly calculated when setting from state
      const totalVotes = pollFromState.options ? 
        pollFromState.options.reduce((sum, option) => sum + (option.votes || 0), 0) : 0;
      
      const pollWithTotalVotes = {
        ...pollFromState,
        totalVotes: totalVotes
      };
      
      setPollData(pollWithTotalVotes);
      setLoading(false);
    } else if (pollFromContext) {
      setPollData(pollFromContext);
      setLoading(false);
    } else {
      // If no poll data found, redirect after showing message
      setTimeout(() => {
        navigate('/create');
      }, 2000);
    }
  }, [location.state, currentPoll, navigate]);

  const handleVote = (optionIndex) => {
    if (hasVoted || !pollData) return;

    const updatedPollData = { ...pollData };
    
    // Ensure the option has a votes property
    if (!updatedPollData.options[optionIndex].votes) {
      updatedPollData.options[optionIndex].votes = 0;
    }
    
    // Increment the vote for the selected option
    updatedPollData.options[optionIndex].votes += 1;
    
    // Recalculate total votes from all options
    updatedPollData.totalVotes = updatedPollData.options.reduce(
      (sum, option) => sum + (option.votes || 0), 0
    );

    setPollData(updatedPollData);
    updatePoll(updatedPollData); // Update context
    setSelectedOption(optionIndex);
    setHasVoted(true);

    // Here you would typically send the vote to your backend
    console.log('Vote submitted for option:', optionIndex, updatedPollData);
  };

  const getVotePercentage = (votes) => {
    if (!pollData || pollData.totalVotes === 0) return 0;
    return Math.round((votes / pollData.totalVotes) * 100);
  };

  const copyPollLink = async () => {
    try {
      const link = `${window.location.origin}/poll/${pollData?.id}`;
      await navigator.clipboard.writeText(link);
      alert("Poll link copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/poll/${pollData?.id}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("Poll link copied to clipboard!");
    }
  };

  if (loading || !pollData) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-xl font-medium mb-4">
              {loading ? "Loading poll..." : "No poll found"}
            </h1>
            <p className="text-gray-600">
              {loading ? "Please wait..." : "Redirecting to create a new poll..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <div className="flex flex-col gap-4 md:gap-6">
          <h1 className="font-bold text-2xl">Poll Overview</h1>
          <p className="font-light text-gray-600">
            Share your poll and track live results
          </p>

          {/* Poll Question */}
          <div className="bg-gray-100 flex flex-col rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2 text-black">
              {pollData.question}
            </h2>
            <p className="text-sm text-gray-600">
              Created on: {new Date(pollData.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Poll ID: {pollData.id}
            </p>
            <p className="text-sm text-gray-600">
              Total votes: {pollData.totalVotes || 0}
            </p>
          </div>
            
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {/* Poll Options */}
            <div className="space-y-4">
              {pollData.options.map((option, index) => (
                <div key={index} className="space-y-2">
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      hasVoted
                        ? selectedOption === index
                          ? 'bg-blue-100 border-blue-400'
                          : 'bg-gray-50 border-gray-200 cursor-default'
                        : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleVote(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-black">{option.text}</span>
                      {hasVoted && (
                        <span className="text-sm text-gray-600">
                          {option.votes || 0} votes ({getVotePercentage(option.votes || 0)}%)
                        </span>
                      )}
                    </div>
                    
                    {/* Progress bar (shown after voting) */}
                    {hasVoted && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            selectedOption === index ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${getVotePercentage(option.votes || 0)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Vote Summary */}
            {hasVoted && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Total votes: {pollData.totalVotes || 0}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  ✓ Your vote has been recorded
                </p>
              </div>
            )}

            {/* Voting Instructions */}
            {!hasVoted && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Click on an option to cast your vote
                </p>
              </div>
            )}
          </div>

          {/* Share Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Share this poll</h3>
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 rounded p-3 bg-white border text-black text-sm"
                value={`${window.location.origin}/poll/${pollData.id}`}
                readOnly
              />
              <button
                className="bg-gray-950 rounded px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                onClick={copyPollLink}
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              className="bg-gray-950 rounded px-4 py-2 text-white hover:bg-gray-800 transition-colors"
              onClick={() => navigate('/create')}
            >
              Create New Poll
            </button>
            <button
              className="bg-blue-600 rounded px-4 py-2 text-white hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/results', { state: { pollData } })}  
            >
              View Results
            </button>
            <button
              className="border border-gray-300 rounded px-4 py-2 text-black hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}