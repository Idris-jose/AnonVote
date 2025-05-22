import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { useNavigate } from 'react-router-dom';
import { usePollContext } from './PollContext.jsx';

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [isClicked, setIsClicked] = useState(false);
  const [error, setError] = useState("");
  const [pollData, setPollData] = useState(null);
  const navigate = useNavigate();
  const { savePoll } = usePollContext();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Clear error when user starts typing
    if (error) setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    // Validation
    if (!question.trim()) {
      setError("Please enter a poll question.");
      return;
    }
    
    const validOptions = options.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      setError("Please provide at least two options.");
      return;
    }
    
    // Create poll data
    const newPollData = {
      id: `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More unique ID
      question: question.trim(),
      options: validOptions.map(option => ({
        text: option.trim(),
        votes: 0
      })),
      totalVotes: 0,
      createdAt: new Date().toISOString()
    };
    
    setPollData(newPollData);
    savePoll(newPollData); // Save to context
    setIsClicked(true);
    console.log('Poll created:', newPollData);
  };

  const generatePollLink = () => {
    return `${window.location.origin}/poll/${pollData?.id}`;
  };

  const copyToClipboard = async () => {
    try {
      const link = generatePollLink();
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatePollLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("Link copied to clipboard!");
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setIsClicked(false);
    setError("");
    setPollData(null);
  };

  const navigateToPoll = () => {
    navigate('/pollDetails', { state: { pollData } });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        {!isClicked ? (
          <>
            <h1 className="font-bold text-2xl">New Poll</h1>
            <p className="font-light text-gray-600">
              Set your question and options. No sign-in required.
            </p>
            <form className="flex flex-col mt-4 gap-4" onSubmit={onSubmit}>
              <label htmlFor="question" className="font-medium">Poll Question *</label>
              <input
                id="question"
                type="text"
                className="rounded p-3 bg-gray-100 text-black border focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your question here"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (error) setError("");
                }}
              />

              <h2 className="font-bold mt-2">Options</h2>
              
              <label htmlFor="option1" className="font-medium">Option 1 *</label>
              <input
                id="option1"
                type="text"
                className="rounded p-3 bg-gray-100 text-black border focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First Option"
                value={options[0]}
                onChange={(e) => handleOptionChange(0, e.target.value)}
              />

              <label htmlFor="option2" className="font-medium">Option 2 *</label>
              <input
                id="option2"
                type="text"
                className="rounded p-3 bg-gray-100 text-black border focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Second Option"
                value={options[1]}
                onChange={(e) => handleOptionChange(1, e.target.value)}
              />

              <label htmlFor="option3" className="font-medium">Option 3 (optional)</label>
              <input
                id="option3"
                type="text"
                className="rounded p-3 bg-gray-100 text-black border focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Third Option"
                value={options[2]}
                onChange={(e) => handleOptionChange(2, e.target.value)}
              />

              <label htmlFor="option4" className="font-medium">Option 4 (optional)</label>
              <input
                id="option4"
                type="text"
                className="rounded p-3 bg-gray-100 text-black border focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Fourth Option"
                value={options[3]}
                onChange={(e) => handleOptionChange(3, e.target.value)}
              />
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="bg-gray-950 rounded px-4 py-3 mt-2 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                Create Poll
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-medium mb-4">Poll Created Successfully! 🎉</h1>
            <p className="font-light text-gray-600">
              Your poll is live and ready to collect votes. Share the link below to get started.
            </p>

            <div className="flex flex-col gap-4 mt-6">
              <div>
                <h2 className="font-medium mb-2">Poll Link</h2>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    className="flex-1 rounded p-3 bg-gray-100 text-black border" 
                    value={generatePollLink()}
                    readOnly
                  />
                  <button 
                    className="bg-gray-950 rounded px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                    onClick={copyToClipboard}
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  className="bg-blue-600 rounded px-4 py-2 text-white hover:bg-blue-700 transition-colors font-medium"
                  onClick={navigateToPoll}
                >
                  View Poll
                </button>
                <button 
                  className="bg-green-600 rounded px-4 py-2 text-white hover:bg-green-700 transition-colors font-medium"
                  onClick={() => navigate('/results', { state: { pollData } })}
                >
                  View Results
                </button>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <p className="font-light text-gray-600 mb-3">Want to create another poll?</p>
                <button
                  className="border border-gray-300 rounded px-4 py-2 text-black hover:bg-gray-50 transition-colors"
                  onClick={resetForm}
                >
                  Create New Poll
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}