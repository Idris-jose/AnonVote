import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { useNavigate } from 'react-router-dom';

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [isClicked, setIsClicked] = useState(false);
  const [error, setError] = useState("");
  const [pollData, setPollData] = useState(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    // Fixed validation logic
    if (question.trim() === "" || options[0].trim() === "" || options[1].trim() === "") {
      setError("Please fill in the question and at least two options.");
      return;
    }
    
    // Filter out empty options and create the options array
    const filteredOptions = options.filter((opt) => opt.trim() !== "");
    const newPollData = {
      id: Date.now(), // Simple ID generation
      question: question.trim(),
      options: filteredOptions.map(option => ({
        text: option.trim(),
        votes: 0
      })),
      totalVotes: 0,
      createdAt: new Date().toISOString()
    };
    
    setPollData(newPollData);
    setIsClicked(true);
    console.log(newPollData);
    // You can add further logic here (e.g., send pollData to backend)
  };

  const navigate = useNavigate();

  const generatePollLink = () => {
    return `${window.location.origin}/poll/${pollData?.id}`;
  };

  const copyToClipboard = () => {
    const link = generatePollLink();
    navigator.clipboard.writeText(link).then(() => {
      // You could add a toast notification here
      alert("Link copied to clipboard!");
    });
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setIsClicked(false);
    setError("");
    setPollData(null);
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
              <label htmlFor="Question">Poll Question</label>
              <input
                type="text"
                className="rounded p-3 bg-gray-100 text-black"
                placeholder="Type your question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <h1 className="font-bold">Options</h1>
              <label htmlFor="Option1">Option 1</label>
              <input
                type="text"
                className="rounded p-3 bg-gray-100 text-black"
                placeholder="First Option"
                value={options[0]}
                onChange={(e) => handleOptionChange(0, e.target.value)}
              />

              <label htmlFor="Option2">Option 2</label>
              <input
                type="text"
                className="rounded p-3 bg-gray-100 text-black"
                placeholder="Second Option"
                value={options[1]}
                onChange={(e) => handleOptionChange(1, e.target.value)}
              />

              <label htmlFor="Option3">Option 3 (optional)</label>
              <input
                type="text"
                className="rounded p-3 bg-gray-100 text-black"
                placeholder="Third Option"
                value={options[2]}
                onChange={(e) => handleOptionChange(2, e.target.value)}
              />

              <label htmlFor="Option4">Option 4 (optional)</label>
              <input
                type="text"
                className="rounded p-3 bg-gray-100 text-black"
                placeholder="Fourth Option"
                value={options[3]}
                onChange={(e) => handleOptionChange(3, e.target.value)}
              />
              
              {error && <h1 className="text-red-500">{error}</h1>}
              
              <button
                type="submit"
                className="bg-gray-950 rounded px-4 py-1 mt-2 text-white hover:bg-gray-800 transition-colors"
              >
                Create Poll
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-medium mb-4">Poll created!</h1>
            <p className="font-light text-gray-600">
              Your poll is live, share the link below to start collecting votes.
            </p>

            <div className="flex flex-col gap-2 mt-5">
              <h1 className="font-medium mb-2">Poll Link</h1>
              <input 
                type="text" 
                className="rounded p-3 bg-gray-100 text-black" 
                value={generatePollLink()}
                readOnly
              />

              <div className="flex gap-3 mt-3">
                <button 
                  className="bg-gray-950 rounded px-4 py-1 mt-2 text-white hover:bg-gray-800 transition-colors"
                  onClick={copyToClipboard}
                >
                  Copy Link
                </button>
                <button 
                  className="bg-gray-100 rounded px-4 py-1 mt-2 text-black hover:bg-gray-200 transition-colors" 
                  onClick={() => navigate('/pollDetails', { state: { pollData } })}
                >
                  View Poll
                </button>
              </div>
              
              <p className="font-light text-gray-600 mt-3">Want to create another poll?</p>
              <button
                className="border-black w-fit border rounded px-4 py-1 mt-2 text-black hover:bg-gray-50 transition-colors"
                onClick={resetForm}
              >
                Create new poll
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}