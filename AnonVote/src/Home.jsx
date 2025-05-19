import { CirclePlus, ChartColumnBig, RotateCwSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const pollOptions = [
  {
    title: 'Create Poll',
    Icon: <CirclePlus />,
    description: 'Start a new anonymous poll for your group',
    button: 'New poll',
    route: '/create',
  },
  {
    title: 'Join Poll',
    Icon: <RotateCwSquare />,
    description: 'Enter a poll code to participate in an existing Poll',
    button: 'Join',
    route: '/join',
  },
  {
    title: 'Poll Results',
    Icon: <ChartColumnBig />,
    description: 'See results of polls you\'ve participated in.',
    button: 'View Results',
    route: '/results',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="font-bold text-2xl">Home</h1>
                <p className="font-light text-gray-600">
                    Welcome to AnonVote. Create or join polls and vote privately
                </p>
            {pollOptions.map((option) => (
              <div
                key={option.title}
                className="bg-gray-100 p-4 rounded-xl"
              >
                <div className="bg-gray-200 rounded-full p-1 w-fit mb-2">
                  {option.Icon}
                </div>
                <h1 className="font-medium">{option.title}</h1>
                <p className="font-light text-gray-600">{option.description}</p>
                <button
                  className="bg-gray-950 rounded px-4 py-1 mt-2 text-white"
                  onClick={() => navigate(option.route)}
                >
                  {option.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}