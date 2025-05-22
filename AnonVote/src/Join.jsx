import Sidebar from "./Sidebar.jsx"
export default function Join() {
    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
                    <div className="flex flex-col gap-4 md:gap-2">
                        <h1 className="font-bold text-2xl">Join a Poll</h1>
                        <p className="font-light text-gray-600">
                           Join an existing poll by entering the poll ID. No sign-in required.
                        </p>
                        <form className="flex flex-col mt-4 gap-4">
                            <label htmlFor="pollId" className="font-medium">Poll ID *</label>
                            <input
                                id="pollId"
                                type="text"
                                className="rounded p-3 bg-gray-100 text-black border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Poll ID here"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white rounded p-3 hover:bg-blue-600 transition duration-200"
                            >
                                Join Poll
                            </button>
                        </form>
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">
                                Enter the poll ID you received from the poll creator to join the poll.
                            </p>
                            <p className="text-sm text-gray-500">
                                If you don't have a poll ID, please contact the poll creator.
                            </p>    
                            </div>
                    </div>
                </div>
            </div>
        </>
    );
}