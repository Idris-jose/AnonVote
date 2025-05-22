import Sidebar from "./Sidebar.jsx"
export default function PollDetails({ pollData }) {
    return(
        <>
         <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="font-bold text-2xl">Poll Overview</h1>
                <p className="font-light text-gray-600">
                    Share your poll and track live results
                </p>
               {Array.isArray(pollData) && pollData.map((poll, idx) => (
                <div key={idx}>
                    <h1 className="text-black">{poll.question}</h1>
                </div>
                ))
               }
          </div>
        </div>
      </div>
        </>
    )
}