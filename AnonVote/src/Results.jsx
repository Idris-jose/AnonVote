import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { usePollContext } from './PollContext.jsx';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPoll, updatePoll } = usePollContext();
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get poll data from multiple sources
    let pollFromState = location.state?.pollData;
    let pollFromContext = currentPoll;
    
    if (pollFromState) {
      setPollData(pollFromState);
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
              {loading ? "Loading results..." : "No poll data found"}
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
          <h1 className="font-bold text-2xl">Poll Results</h1>
          <p className="font-light text-gray-600">
            Live results for your poll
          </p>

          {/* Poll Question */}
          <div className="bg-gray-100 flex flex-col rounded-2xl p-3 mb-4">
            <h2 className="text-xl font-semibold mb-2 text-black">
              {pollData.question}
            </h2>
            <p className="text-sm text-gray-600">
              Created on: {new Date(pollData.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Total votes: {pollData.totalVotes}
            </p>
          </div>

          {/* Results Display */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-4">Results Breakdown</h3>
            
            {pollData.totalVotes === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No votes yet</p>
                <p className="text-sm text-gray-400">Share your poll to start collecting votes!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pollData.options
                  .sort((a, b) => b.votes - a.votes) // Sort by vote count (highest first)
                  .map((option, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">{option.text}</span>
                        <span className="text-sm text-gray-600">
                          {option.votes} votes ({getVotePercentage(option.votes)}%)
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${getVotePercentage(option.votes)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
          <div className="flex gap-3">
            <button
              className="bg-gray-950 rounded px-4 py-2 text-white hover:bg-gray-800 transition-colors"
              onClick={() => navigate('/pollDetails', { state: { pollData } })}
            >
              Back to Poll
            </button>
            <button
              className="bg-gray-950 rounded px-4 py-2 text-white hover:bg-gray-800 transition-colors"
              onClick={() => navigate('/create')}
            >
              Create New Poll
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